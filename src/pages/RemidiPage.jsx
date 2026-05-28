import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { SOAL_POOL, shuffleSoal, hitungNilaiSiswa, shuffleOpsi } from '../utils/soalUlanganPool';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import PinInput from '../components/Ulangan/PinInput';
import QuestionCard from '../components/Ulangan/QuestionCard';
import RemidiHeader from '../components/Remidi/RemidiHeader';
import { useAntiCheatRemidi } from '../hooks/Remidi/useAntiCheatRemidi';

export default function RemidiPage() {
    const navigate = useNavigate();
    const [sesi, setSesi] = useState(null);
    const [peserta, setPeserta] = useState(null);
    const [pinInput, setPinInput] = useState('');
    const [soalUjian, setSoalUjian] = useState([]);
    const [jawabanSiswa, setJawabanSiswa] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    useAntiCheatRemidi(
        sesi && !isFinished,
        peserta,
        (updatedPeserta) => {
            setPeserta(updatedPeserta);
            if (updatedPeserta.status_ujian === 'blocked') {
                setIsFinished(true);
            }
        }
    );

    const handleJoinRemidi = async () => {
        try {
            const savedData = localStorage.getItem('user_siswa');
            if (!savedData) return alert("Silakan login kembali!");
            const user = JSON.parse(savedData);

            // 1. Ambil & Validasi Sesi Remidi
            const { data: sesiData, error: sesiError } = await supabase
                .from('remidi_sesi')
                .select('*')
                .eq('pin_remidi', pinInput.toUpperCase())
                .eq('status', 'active')
                .single();

            if (sesiError || !sesiData) return alert("PIN Remidi tidak ditemukan atau sudah tidak aktif!");

            // 2. Cek Validitas Waktu Akses
            const sekarang = new Date();
            if (sekarang < new Date(sesiData.waktu_mulai)) return alert("Remidi belum dibuka!");
            if (sekarang > new Date(sesiData.waktu_selesai)) return alert("Masa pelaksanaan remidi sudah berakhir!");

            // 3. Ambil Log Logistik Peserta
            const { data: existingPeserta } = await supabase
                .from('remidi_peserta')
                .select('*')
                .eq('sesi_id', sesiData.id)
                .eq('siswa_id', user.id)
                .maybeSingle();

            if (existingPeserta) {
                // ⚡ JIKA STATUSNYA SUDAH SUBMITTED
                if (existingPeserta.status_ujian === 'submitted') {
                    setPeserta(existingPeserta);
                    setIsFinished(true); // Langsung lempar ke layar finish
                    setSesi(sesiData);

                    // Ambil data jawaban lama dari DB untuk keperluan kalkulasi tampilan skor di layar finish
                    const { data: backupData } = await supabase
                        .from('remidi_jawaban')
                        .select('jawaban_map')
                        .eq('peserta_id', existingPeserta.id)
                        .maybeSingle();

                    if (backupData) setJawabanSiswa(backupData.jawaban_map || {});

                    alert(`Kamu sudah mengerjakan remidi ini sebelumnya! Menampilkan hasil nilaimu.`);
                    return;
                }

                // ⚡ JIKA STATUSNYA BLOCKED (KARENA CHEAT)
                if (existingPeserta.status_ujian === 'blocked') {
                    setPeserta(existingPeserta);
                    setIsFinished(true);
                    setSesi(sesiData);
                    alert("Akses ditolak! Kamu sudah diblokir dari remidi ini karena indikasi kecurangan.");
                    return;
                }

                // ⚡ KONDISI RESUME (MASUK KEMBALI & STATUS MASIH 'WORKING')
                setSesi(sesiData);
                setPeserta(existingPeserta);

                const { data: backupData } = await supabase
                    .from('remidi_jawaban')
                    .select('jawaban_map, soal_order')
                    .eq('peserta_id', existingPeserta.id)
                    .maybeSingle();

                if (backupData && backupData.soal_order) {
                    setJawabanSiswa(backupData.jawaban_map || {});

                    const urutanLama = backupData.soal_order;
                    const soalDiurutkan = urutanLama.map(id => SOAL_POOL.find(s => s.id === id)).filter(Boolean);
                    setSoalUjian(soalDiurutkan);

                    const indexBelumDijawab = soalDiurutkan.findIndex(s => !backupData.jawaban_map[s.id]);
                    if (indexBelumDijawab !== -1) {
                        setCurrentIndex(indexBelumDijawab);
                    } else {
                        setCurrentIndex(soalDiurutkan.length - 1);
                    }
                }
                return;
            }

            // ⚡ KONDISI PENGERJAAN PERTAMA KALI (BARU MASUK)
            const { data: newPeserta, error: insError } = await supabase
                .from('remidi_peserta')
                .insert([{
                    sesi_id: sesiData.id,
                    siswa_id: user.id,
                    status_ujian: 'working',
                    waktu_mulai_kerja: new Date()
                }])
                .select().single();

            if (insError) throw insError;

            // 1. Acak soal hanya sekali saja di sini
            const shuffledSoal = shuffleSoal(SOAL_POOL);
            const soalFinal = shuffledSoal.map(soal => ({
                ...soal,
                opsi: shuffleOpsi(soal.opsi)
            }));

            // 2. Ambil list ID urutan soal untuk disimpan ke DB
            const listIdSoal = soalFinal.map(s => s.id);

            // 3. Simpan data inisialisasi awal ke remidi_jawaban secara utuh
            await supabase.from('remidi_jawaban').insert([{
                peserta_id: newPeserta.id,
                jawaban_map: {},
                soal_order: listIdSoal
            }]);

            // Set ke state UI
            setSesi(sesiData);
            setPeserta(newPeserta);
            setSoalUjian(soalFinal);
            setJawabanSiswa({});
            setCurrentIndex(0);

        } catch (err) {
            console.error("Detail Error:", err);
            alert("Gagal memuat sesi remidi.");
        }
    };

    const handlePilih = async (soalId, opsi) => {
        if (peserta?.status_ujian === 'blocked') return;
        const newJawab = { ...jawabanSiswa, [soalId]: opsi };
        setJawabanSiswa(newJawab);

        // Update jawaban yang dipilih secara realtime ke server
        await supabase.from('remidi_jawaban').update({
            jawaban_map: newJawab,
            updated_at: new Date()
        }).eq('peserta_id', peserta.id);
    };

    const submitRemidi = async (isAuto = false) => {
        if (!isAuto && !window.confirm("Kirim hasil remidi kamu sekarang?")) return;

        const skor = hitungNilaiSiswa(jawabanSiswa, SOAL_POOL);
        const finalStatus = peserta?.status_ujian === 'blocked' ? 'blocked' : 'submitted';

        await supabase
            .from('remidi_peserta')
            .update({ status_ujian: finalStatus, nilai_akhir: skor })
            .eq('id', peserta.id);

        setIsFinished(true);
    };

    // Fungsi untuk menghitung berapa banyak jawaban siswa yang benar
    const hitungJawabanBenar = () => {
        let benar = 0;
        SOAL_POOL.forEach(soal => {
            if (jawabanSiswa[soal.id] === soal.kunci) {
                benar++;
            }
        });
        return benar;
    };

    if (isFinished) {
        const totalBenar = hitungJawabanBenar();
        // Menghitung skor final: jawaban benar dikali 2
        const skorFinal = totalBenar * 2;

        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 text-white font-sans">
                <div className="bg-slate-900 p-10 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl max-w-md w-full text-center relative overflow-hidden">

                    {/* Efek hiasan background ring lingkaran */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />

                    <h1 className="text-2xl font-black mb-2 tracking-tight">
                        {peserta?.status_ujian === 'blocked' ? '⚠️ AKSES DIBLOKIR!' : '🎉 REMIDI SELESAI!'}
                    </h1>
                    <p className="text-slate-400 mb-8 text-xs px-4">
                        {peserta?.status_ujian === 'blocked'
                            ? 'Kamu keluar dari aplikasi melebihi batas toleransi kecurangan.'
                            : 'Data pengerjaan remidi kamu berhasil disimpan secara permanen di server.'}
                    </p>

                    {/* ============================================================
                        📊 BOX SKOR NILAI AKHIR SISWA
                       ============================================================ */}
                    <div className="bg-slate-950/60 border border-white/5 rounded-3xl p-6 mb-8 backdrop-blur-sm">
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 block mb-1">
                            Skor Hasil Remidi
                        </span>

                        {/* Angka Skor Besar */}
                        <div className="text-5xl font-black text-amber-400 font-mono tracking-tighter my-2 animate-bounce">
                            {skorFinal}
                        </div>

                        {/* Detail Perhitungan Ringkas */}
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-around text-center">
                            <div>
                                <span className="text-[9px] text-slate-500 block uppercase font-bold">Benar</span>
                                <span className="text-sm font-black text-emerald-400 font-mono">{totalBenar} <span className="text-xs text-slate-600">Soal</span></span>
                            </div>
                            <div className="w-px bg-white/5" />
                            <div>
                                <span className="text-[9px] text-slate-500 block uppercase font-bold">Kalkulasi</span>
                                <span className="text-sm font-black text-slate-300 font-mono">{totalBenar} × 2</span>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Aksi Selesai */}
                    <button
                        onClick={() => navigate('/ruang-belajar')}
                        className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white py-4 rounded-2xl font-black w-full transition-all text-sm tracking-wide shadow-lg shadow-blue-600/20"
                    >
                        KEMBALI KE KELAS
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            <AnimatePresence>
                {!sesi && (
                    <PinInput value={pinInput} onChange={setPinInput} onJoin={handleJoinRemidi} />
                )}

                {sesi && peserta?.status_ujian === 'working' && (
                    <div className="p-4 pt-24 pb-20 max-w-4xl mx-auto">
                        <RemidiHeader
                            cheatCount={peserta?.cheat_count || 0}
                            currentIndex={currentIndex}
                            totalSoal={soalUjian.length}
                            waktuMulaiKerja={peserta?.waktu_mulai_kerja}
                            durasiMenit={sesi?.durasi_menit || 45}
                            onTimeUp={() => {
                                alert("Waktu remidi berdurasi individu telah habis!");
                                submitRemidi(true);
                            }}
                        />

                        {soalUjian.length > 0 && (
                            <QuestionCard
                                soal={soalUjian[currentIndex]}
                                selectedJawab={jawabanSiswa[soalUjian[currentIndex]?.id]}
                                onPilih={handlePilih}
                                isBlocked={peserta?.status_ujian === 'blocked'}
                            />
                        )}

                        <div className="mt-8 flex justify-between items-center bg-slate-900/50 p-4 rounded-3xl border border-white/5">
                            <button
                                onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
                                className="px-6 py-3 font-bold text-slate-500 disabled:opacity-10"
                                disabled={currentIndex === 0}
                            >
                                KEMBALI
                            </button>

                            {currentIndex === soalUjian.length - 1 ? (
                                <button onClick={() => submitRemidi(false)} className="bg-emerald-600 px-8 py-3 rounded-xl font-black">KIRIM</button>
                            ) : (
                                <button onClick={() => setCurrentIndex(c => c + 1)} className="bg-white text-black px-8 py-3 rounded-xl font-black">LANJUT</button>
                            )}
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}