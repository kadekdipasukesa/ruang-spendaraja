import React, { useState, useEffect } from 'react';
import { Sparkles, X, CheckCircle2, AlertTriangle } from 'lucide-react';

// Cukup ganti tanggal ini kalau mau notif muncul lagi di masa depan
const CURRENT_UPDATE_ID = "2025-02-17-reset-data & update kata";

const UpdateNotifier = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasSeenUpdate = localStorage.getItem('last_seen_update');
        if (hasSeenUpdate !== CURRENT_UPDATE_ID) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    // Fungsi klik "SAYA MENGERTI" (Simpan permanen)
    const handleDismiss = () => {
        localStorage.setItem('last_seen_update', CURRENT_UPDATE_ID);
        setIsVisible(false);
    };

    // Fungsi klik "X" (Hanya tutup sementara)
    const handleCloseOnly = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;


    return (
        /* Gunakan fixed inset-0 dan z-[99999] agar benar-benar menutup Navigasi Bar.
           Ditambah h-screen & overflow-hidden agar layar tidak bisa digeser.
        */
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 h-screen w-full overflow-hidden">

            {/* Latar belakang Blur & Gelap - Dibuat lebih pekat agar navigasi di bawah tidak tembus */}
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500"></div>

            {/* Box Modal Tengah */}
            <div className="relative bg-slate-900 border border-blue-500/30 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-5 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white">
                        <Sparkles size={18} className="text-yellow-300 fill-yellow-300" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                            Pemberitahuan Penting
                        </span>
                    </div>
                    {/* Close Button */}
                    <button onClick={handleCloseOnly} className="bg-black/20 hover:bg-black/40 p-2 rounded-full text-white transition-all active:scale-90">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 text-center">
                    {/* Icon Alert */}
                    <div className="w-20 h-20 bg-blue-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                        <AlertTriangle size={40} className="text-blue-400" />
                    </div>

                    <h4 className="text-white font-black text-2xl mb-2 tracking-tight">Update 17-2-2025 🙏</h4>
                    <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6 px-4 py-1 bg-blue-500/10 inline-block rounded-full">
                        Informasi Pembersihan Skor
                    </p>

                    <p className="text-slate-300 text-sm leading-relaxed mb-8 text-justify md:text-center">
                        Bapak minta maaf ya, data skor ketik cepat yang kemarin terpaksa Bapak **reset (hapus)** karena masalah akurasi waktu. Sekarang sistem sudah bapak perbaiki agar lebih adil untuk semua siswa. 😔
                    </p>

                    {/* Feature List */}
                    <div className="bg-white/5 border border-white/5 rounded-[2rem] p-5 mb-8 text-left">
                        <h5 className="text-blue-400 font-black text-[10px] uppercase mb-4 flex items-center gap-2 tracking-wider">
                            <CheckCircle2 size={14} /> Apa yang baru di versi ini?
                        </h5>
                        <ul className="space-y-3 text-xs text-slate-400 font-medium">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500">•</span>
                                <span>Sistem anti-lag lebih stabil & ringan</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500">•</span>
                                <span>Akurasi timer sinkron dengan waktu asli</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500">•</span>
                                <span>Rekor Top 3 otomatis tayang di beranda</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleDismiss}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-xl shadow-blue-900/20 active:scale-[0.97] uppercase tracking-widest text-sm"
                        >
                            SIAP PAK, SAYA MENGERTI! 🚀
                        </button>
                        <div className="flex items-center justify-center gap-2">
                            <span className="h-[1px] w-8 bg-slate-800"></span>
                            <p className="text-[9px] text-slate-600 font-mono tracking-tighter uppercase">
                                Build ID: {CURRENT_UPDATE_ID}
                            </p>
                            <span className="h-[1px] w-8 bg-slate-800"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateNotifier;