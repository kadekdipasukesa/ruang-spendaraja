import React, { useState, useEffect } from 'react';
import { Sparkles, X, CheckCircle2, AlertTriangle } from 'lucide-react';

// Cukup ganti tanggal ini kalau mau notif muncul lagi di masa depan
const CURRENT_UPDATE_ID = "2025-02-17-reset-data"; 

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
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Latar belakang Blur & Gelap */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-500"></div>
            
            {/* Box Modal Tengah */}
            <div className="relative bg-slate-900 border border-blue-500/30 rounded-[2rem] shadow-[0_0_50px_rgba(30,58,138,0.5)] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white">
                        <Sparkles size={18} className="text-yellow-300 fill-yellow-300" />
                        <span className="text-xs font-black uppercase tracking-widest">
                            Pemberitahuan Penting
                        </span>
                    </div>
                    {/* Klik X di sini TIDAK menyimpan ke localStorage */}
                    <button onClick={handleCloseOnly} className="bg-black/20 hover:bg-black/40 p-1.5 rounded-full text-white transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle size={32} className="text-blue-400" />
                    </div>

                    <h4 className="text-white font-bold text-2xl mb-4">Update 17-2-2025 🙏</h4>
                    
                    <p className="text-slate-300 text-sm leading-relaxed mb-6 text-justify md:text-center">
                        Bapak minta maaf ya, data skor ketik cepat yang kemarin terpaksa Bapak **reset (hapus)** karena masalah akurasi waktu pada game  (tidak pas 1 menit kadang lebih kalau laptop lambat) BAPAK SENDIRI DAPAT 80 WPM saat laptop lambat, tapi masalah ini sudah bapak perbaiki. 😔
                    </p>

                    <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4 mb-8 text-left">
                        <h5 className="text-blue-400 font-bold text-xs uppercase mb-3 flex items-center gap-2">
                            <CheckCircle2 size={14} /> Update Sekarang Sudah Lebih Baik:
                        </h5>
                        <ul className="space-y-2 text-xs text-slate-400">
                            <li>• Sistem anti-lag lebih stabil (tidak berat)</li>
                            <li>• Akurasi timer sinkron dengan waktu asli</li>
                            <li>• Rekor Top 3 otomatis tayang di beranda</li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleDismiss}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/40 active:scale-95"
                        >
                            SIAP PAK, SAYA MENGERTI! 🚀
                        </button>
                        <p className="text-[10px] text-slate-600 font-mono italic">
                            ID: {CURRENT_UPDATE_ID}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateNotifier;