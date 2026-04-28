import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { SOAL_POOL, shuffleSoal, hitungNilaiSiswa, shuffleOpsi } from '../utils/soalUlanganPool';

import { AnimatePresence, motion } from 'framer-motion';

// Import Hooks (Logika Terpisah)
import { useExamRealtime } from '../hooks/useExamRealtime';
import { useAudioQuiz } from '../hooks/useAudioQuiz';
import { useAntiCheat } from '../hooks/useAntiCheat';

import { useNavigate } from 'react-router-dom';

// Import Komponen UI
import PinInput from '../components/Ulangan/PinInput';
import WaitingRoom from '../components/Ulangan/WaitingRoom';
import ExamHeader from '../components/Ulangan/ExamHeader';
import QuestionCard from '../components/Ulangan/QuestionCard';

// ... import tetap sama

export default function UlanganPage() {
    const navigate = useNavigate();
    // --- STATE MANAGEMENT ---
    const [user, setUser] = useState(null);
    const [sesi, setSesi] = useState(null);
    const [peserta, setPeserta] = useState(null);
    const [pinInput, setPinInput] = useState('');

    const [soalUjian, setSoalUjian] = useState([]);
    const [jawabanSiswa, setJawabanSiswa] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [countdown, setCountdown] = useState(null);
    const [isFinished, setIsFinished] = useState(false);

    const { playBeep } = useAudioQuiz();

    // --- LOGIKA PENGAMBILAN SOAL (Hanya dirapikan agar tidak double) ---
    useEffect(() => {
        if (sesi?.status === 'ongoing' && soalUjian.length === 0) {
            console.log("Mengambil soal dari Pool dan mengacak urutan/opsi...");

            // 1. Ambil seluruh pool (yang sudah berisi 50 soal fix dengan ID BK01, dst)
            // 2. Acak urutan soalnya agar nomor 1 setiap siswa berbeda
            const shuffledSoal = shuffleSoal(SOAL_POOL);

            // 3. Acak urutan opsi jawaban (A, B, C, D) di setiap soal
            const soalFinal = shuffledSoal.map(soal => ({
                ...soal,
                opsi: shuffleOpsi(soal.opsi)
            }));

            setSoalUjian(soalFinal);
        }
    }, [sesi?.status]);

    // --- 1. INITIAL LOAD & REALTIME CHANNEL ---
    useEffect(() => {
        if (!sesi?.id) return;

        const channel = supabase
            .channel(`sesi_${sesi.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'ujian_sesi',
                    filter: `id=eq.${sesi.id}`,
                },
                (payload) => {
                    console.log('Update Sesi:', payload);
                    const newStatus = payload.new.status;

                    if (newStatus === 'starting') {
                        setCountdown(5);
                    } else if (newStatus === 'ongoing') {
                        setSesi(payload.new);
                        setCountdown(null);
                    } else if (newStatus === 'finished') {
                        alert("Ujian telah diakhiri oleh Guru.");
                        navigate('/ruang-belajar');
                    }
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [sesi?.id, navigate]);

    // --- 2. INTEGRASI CUSTOM HOOKS ---
    useExamRealtime(sesi?.id, peserta?.id, {
        onStarting: () => startSequence(),
        onSesiUpdate: setSesi,
        onPesertaUpdate: setPeserta
    });

    useAntiCheat(
        sesi?.status === 'ongoing' && !isFinished, // Hanya aktif saat ujian jalan & belum selesai
        peserta, // Data peserta (termasuk id dan cheat_count)
        (updatedPeserta) => {
            setPeserta(updatedPeserta); // Update state lokal agar Header & Card berubah

            // Jika sudah 3 kali, pastikan kita update status lokal juga
            if (updatedPeserta.cheat_count >= 3) {
                setPeserta(prev => ({ ...prev, status_ujian: 'blocked' }));
            }
        }
    );

    // --- 3. LOGIC HANDLERS ---
    const handleJoin = async () => {
        try {
            const savedData = localStorage.getItem('user_siswa');
            if (!savedData) return alert("Silakan login kembali!");
            const user = JSON.parse(savedData);

            const { data: sesiData, error: sesiError } = await supabase
                .from('ujian_sesi')
                .select('*')
                .eq('pin_ujian', pinInput)
                .single();

            if (sesiError || !sesiData) return alert("PIN Ujian Salah!");

            const { data: existingPeserta } = await supabase
                .from('ujian_peserta')
                .select('*')
                .eq('sesi_id', sesiData.id)
                .eq('siswa_id', user.id)
                .maybeSingle();

            if (existingPeserta) {
                setSesi(sesiData);
                setPeserta(existingPeserta);
                return;
            }

            const { data: newPeserta, error: insError } = await supabase
                .from('ujian_peserta')
                .insert([{
                    sesi_id: sesiData.id,
                    siswa_id: user.id,
                    status_ujian: 'ready'
                }])
                .select()
                .single();

            if (insError) throw insError;
            setSesi(sesiData);
            setPeserta(newPeserta);
        } catch (err) {
            console.error("Error join:", err);
            alert("Gagal masuk ke sesi ujian.");
        }
    };

    const startSequence = () => {
        let count = 3;
        setCountdown(count);
        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                setCountdown(count);
                playBeep(440, 0.1);
            } else {
                setCountdown("GO!");
                playBeep(880, 0.4);
                clearInterval(interval);
                setTimeout(() => setCountdown(null), 1000);
            }
        }, 1000);
    };

    const handlePilih = async (soalId, opsi) => {
        const newJawab = { ...jawabanSiswa, [soalId]: opsi };
        setJawabanSiswa(newJawab);

        await supabase.from('ujian_jawaban').upsert({
            peserta_id: peserta.id,
            jawaban_map: newJawab,
            updated_at: new Date()
        }, { onConflict: 'peserta_id' });
    };

    const submitUjian = async (isAuto = false) => {
        // Jika manual (klik tombol), tanya dulu. Jika otomatis (waktu habis), langsung gas.
        if (!isAuto && !window.confirm("Kirim jawaban sekarang?")) return;

        // Pastikan SOAL_POOL adalah array 50 soal yang baru kita buat
        const skor = hitungNilaiSiswa(jawabanSiswa, SOAL_POOL);

        const { error } = await supabase
            .from('ujian_peserta')
            .update({
                status_ujian: 'submitted',
                nilai_akhir: skor
            })
            .eq('id', peserta.id);

        if (error) {
            console.error("Gagal mengirim:", error);
            alert("Koneksi bermasalah, mencoba mengirim ulang...");
        } else {
            setIsFinished(true);
        }
    };

    // --- 4. RENDERER ---
    if (isFinished) return <FinishedState />;

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            <AnimatePresence>
                {!sesi && (
                    <PinInput value={pinInput} onChange={setPinInput} onJoin={handleJoin} />
                )}

                {sesi?.status === 'waiting' && <WaitingRoom />}

                {countdown && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-blue-600 flex items-center justify-center"
                    >
                        <motion.h1 key={countdown} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-9xl font-black italic">{countdown}</motion.h1>
                    </motion.div>
                )}

                {sesi?.status === 'ongoing' && (
                    <div className="p-4 pt-24 pb-20 max-w-4xl mx-auto">
                        <ExamHeader
                            cheatCount={peserta?.cheat_count || 0}
                            currentIndex={currentIndex}
                            totalSoal={soalUjian.length}
                            // Ganti .durasi menjadi .durasi_menit sesuai kolom di tabel ujian_sesi
                            durasiMenit={sesi?.durasi_menit || 45}
                            onTimeUp={() => {
                                alert("Waktu habis! Jawaban akan dikirim otomatis.");
                                submitUjian(true); // Gunakan parameter true agar tidak muncul konfirmasi lagi
                            }}
                        />

                        <QuestionCard
                            soal={soalUjian[currentIndex]}
                            selectedJawab={jawabanSiswa[soalUjian[currentIndex]?.id]}
                            onPilih={handlePilih}
                            isBlocked={peserta?.status_ujian === 'blocked'}
                        />

                        <div className="mt-8 flex justify-between items-center bg-slate-900/50 p-4 rounded-3xl border border-white/5">
                            <button
                                onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
                                className="px-6 py-3 font-bold text-slate-500 disabled:opacity-10"
                                disabled={currentIndex === 0}
                            >
                                KEMBALI
                            </button>

                            {currentIndex === soalUjian.length - 1 ? (
                                <button onClick={submitUjian} className="bg-emerald-600 px-8 py-3 rounded-xl font-black">KIRIM</button>
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

function FinishedState() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center">
            <div className="bg-slate-900 p-12 rounded-[3rem] border border-white/10 shadow-2xl">
                <h1 className="text-4xl font-black mb-4">UJIAN SELESAI!</h1>
                <p className="text-slate-400 mb-8">Jawaban kamu sudah aman di server. Kamu boleh meninggalkan ruangan.</p>
                <button onClick={() => window.location.href = '/'} className="bg-blue-600 px-8 py-4 rounded-2xl font-black">KELUAR</button>
            </div>
        </div>
    );
}