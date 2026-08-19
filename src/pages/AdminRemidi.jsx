import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Plus, Clock, Users, ShieldAlert } from 'lucide-react';
import StatistikSiswa from '../components/Ulangan/StatistikSiswa';
import DownloadCsvRemidi from '../components/Remidi/DownloadCsvRemidi';

export default function AdminRemidi() {
    const [listSesi, setListSesi] = useState([]);
    const [selectedSesi, setSelectedSesi] = useState(null);
    const [peserta, setPeserta] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user_siswa'));
        if (!user || user.role !== 'admin') {
            navigate('/');
        } else {
            setIsAuthorized(true);
            fetchDaftarSesiRemidi();
        }
    }, [navigate]);

    useEffect(() => {
        if (!selectedSesi?.id) return;
        const channelId = `admin_remidi_monitor_${selectedSesi.id}_${Math.random().toString(36).substring(2, 7)}`;
        const channel = supabase
            .channel(channelId)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'remidi_peserta',
                filter: `sesi_id=eq.${selectedSesi.id}`
            }, () => fetchPesertaRemidi(selectedSesi.id))
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [selectedSesi?.id]);

    const fetchDaftarSesiRemidi = async () => {
        const { data } = await supabase
            .from('remidi_sesi')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) {
            setListSesi(data);
            if (data.length > 0 && !selectedSesi) {
                setSelectedSesi(data[0]);
                fetchPesertaRemidi(data[0].id);
            }
        }
    };

    const fetchPesertaRemidi = async (sesiId) => {
        const { data } = await supabase
            .from('remidi_peserta')
            .select('*, master_siswa(NAMA)')
            .eq('sesi_id', sesiId);
        if (data) setPeserta(data);
    };

    const handleBuatSesiRemidi = async () => {
        const judul = prompt("Masukkan Judul Remidi:", "Remidi Informatika Bab 3");
        if (!judul) return;
        const durasi = prompt("Masukkan durasi pengerjaan individu (menit):", "45");
        if (!durasi) return;

        const pin = Math.random().toString(36).substring(2, 7).toUpperCase();

        // Atur tenggat waktu otomatis valid sampai 2 hari kedepan
        const waktuMulai = new Date();
        const waktuSelesai = new Date();
        waktuSelesai.setDate(waktuMulai.getDate() + 2);

        const { data, error } = await supabase
            .from('remidi_sesi')
            .insert([{
                pin_remidi: pin,
                judul: judul,
                durasi_menit: parseInt(durasi),
                waktu_mulai: waktuMulai,
                waktu_selesai: waktuSelesai,
                status: 'active'
            }])
            .select().single();

        if (!error && data) {
            alert(`Sesi Remidi Berhasil Dibuat!\nPIN: ${pin}\nBerlaku sampai: ${waktuSelesai.toLocaleDateString()}`);
            fetchDaftarSesiRemidi();
            setSelectedSesi(data);
            setPeserta([]);
        }
    };

    const handleArsipkanSesi = async (id) => {
        if (!window.confirm("Arsipkan sesi remidi ini? Siswa tidak akan bisa lagi mengakses pengerjaan.")) return;
        await supabase.from('remidi_sesi').update({ status: 'archived' }).eq('id', id);
        alert("Sesi berhasil diarsipkan.");
        fetchDaftarSesiRemidi();
        setSelectedSesi(null);
        setPeserta([]);
    };

    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen bg-black text-slate-200 p-6 pt-24">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-white">DASHBOARD CONTROL REMIDI</h1>
                        <p className="text-slate-500">Manajemen Akses Ujian Fleksibel (Asinkronus 2 Hari)</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-900 px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-3">
                            <Clock size={20} className="text-emerald-400" />
                            <span className="font-mono text-xl font-black text-white">
                                {currentTime.toLocaleTimeString('id-ID')}
                            </span>
                        </div>
                        <button onClick={handleBuatSesiRemidi} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold transition-all">
                            <Plus size={20} /> Buka Remidi Baru (2 Hari)
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* PANEL KIRI: DAFTAR PIN REMIDI AKTIF */}
                    <div className="space-y-4 lg:col-span-1">
                        <h3 className="text-xs uppercase font-black tracking-wider text-slate-400 mb-2">Sesi Remidi Terbuka</h3>
                        {listSesi.map((s) => (
                            <div
                                key={s.id}
                                onClick={() => { setSelectedSesi(s); fetchPesertaRemidi(s.id); }}
                                className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedSesi?.id === s.id ? 'bg-slate-900 border-emerald-500/40 shadow-lg' : 'bg-slate-900/40 border-white/5 hover:border-white/10'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-black text-white text-sm line-clamp-1">{s.judul}</h4>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${s.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'}`}>{s.status.toUpperCase()}</span>
                                </div>
                                <div className="font-mono text-2xl font-black text-emerald-400 tracking-wider mb-3">{s.pin_remidi}</div>
                                <p className="text-[10px] text-slate-500">Tenggat Akhir: {new Date(s.waktu_selesai).toLocaleString('id-ID')}</p>
                                {s.status === 'active' && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleArsipkanSesi(s.id); }}
                                        className="mt-4 text-[10px] text-red-400/70 hover:text-red-400 font-bold block"
                                    >
                                        TUTUP & ARSIPKAN AKSES
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* PANEL KANAN: LIVE MONITORING STATISTIK MANDIRI */}
                    <div className="lg:col-span-2">
                        {selectedSesi ? (
                            <div className="space-y-6">
                                <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 flex flex-wrap gap-6 justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-black text-white">{selectedSesi.judul}</h2>
                                        <p className="text-xs text-slate-400">Durasi Per Siswa: <span className="text-white font-bold">{selectedSesi.durasi_menit} Menit</span></p>
                                    </div>

                                    {/* 🛠️ MODIFIKASI DISINI: BARIS JUMPlAH PESERTA & TOMBOL EKSPOR CSV */}
                                    <div className="flex items-center gap-4">
                                        <div className="text-center bg-slate-800/50 px-4 py-2 rounded-xl min-w-[70px]">
                                            <span className="text-[10px] text-slate-500 block uppercase font-bold">Peserta</span>
                                            <span className="text-lg font-black text-white">{peserta.length}</span>
                                        </div>

                                        {/* 🚀 PEMICU KOMPONEN DOWNLOAD CSV & PREVIEW MODAL */}
                                        <DownloadCsvRemidi
                                            sesiId={selectedSesi.id}
                                            judulSesi={selectedSesi.judul}
                                        />
                                    </div>
                                </div>

                                {/* Gunakan komponen statistik lama */}
                                <StatistikSiswa peserta={peserta} statusSesi="finished" />
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-slate-900/20 rounded-[3rem] border border-dashed border-white/5 text-slate-500 text-sm">
                                Silakan pilih atau buat sesi remidi di panel kiri untuk memantau nilai.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}