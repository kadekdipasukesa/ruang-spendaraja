import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

export default function RemidiHeader({ cheatCount, totalSoal, currentIndex, waktuMulaiKerja, durasiMenit, onTimeUp }) {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!waktuMulaiKerja) return;

        const hitungSisaWaktu = () => {
            const mulai = new Date(waktuMulaiKerja).getTime();
            const selesai = mulai + durasiMenit * 60 * 1000;
            const sekarang = new Date().getTime();
            const selisih = selesai - sekarang;

            if (selisih <= 0) {
                setTimeLeft('00:00');
                clearInterval(timer);
                onTimeUp();
                return;
            }

            const menit = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
            const detik = Math.floor((selisih % (1000 * 60)) / 1000);

            setTimeLeft(
                `${menit.toString().padStart(2, '0')}:${detik.toString().padStart(2, '0')}`
            );
        };

        hitungSisaWaktu();
        const timer = setInterval(hitungSisaWaktu, 1000);
        return () => clearInterval(timer);
    }, [waktuMulaiKerja, durasiMenit, onTimeUp]);

    return (
        
<div className="relative w-full max-w-4xl bg-slate-900/90 border border-white/10 px-6 py-4 flex justify-between items-center rounded-[2rem] shadow-xl">
    <div className="flex items-center gap-4">
        {/* Indikator Nomor Soal */}
        <div className="bg-slate-800 px-4 py-2 rounded-xl border border-white/5">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Soal</span>
            <span className="font-black text-white text-sm">{currentIndex + 1} / <span className="text-slate-500">{totalSoal}</span></span>
        </div>
        
        {/* Anti-Cheat Badge */}
        {cheatCount > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl flex items-center gap-2 animate-pulse text-xs font-bold">
                <AlertTriangle size={14} /> Keluar: {cheatCount}/3
            </div>
        )}
    </div>

    {/* Timer / Sisa Waktu */}
    <div className="bg-slate-800 px-5 py-2.5 rounded-xl border border-white/5 flex items-center gap-2.5">
        <Clock size={16} className={timeLeft.startsWith('00:') ? "text-red-500 animate-spin" : "text-amber-400"} />
        <span className="font-mono text-base font-black text-white">{timeLeft}</span>
    </div>
</div>
    );
}