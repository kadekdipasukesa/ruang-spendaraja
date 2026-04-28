import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

export default function ExamHeader({ cheatCount, currentIndex, totalSoal, durasiMenit = 45, onTimeUp }) {
  // 1. Inisialisasi detik (menit * 60)
  const [timeLeft, setTimeLeft] = useState(durasiMenit * 60);

  useEffect(() => {
    // 2. Jika waktu habis, panggil fungsi onTimeUp (misal: otomatis submit)
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    // 3. Set interval untuk mengurangi 1 detik
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // 4. Bersihkan interval saat komponen tidak lagi muncul
    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  // 5. Helper untuk format detik ke MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Warna waktu berubah jadi merah kalau di bawah 5 menit
  const isUrgent = timeLeft < 300; 

  return (
    <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center bg-slate-900/80 backdrop-blur-md p-4 rounded-3xl border border-white/5 sticky top-4 z-30">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${cheatCount > 0 ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-500'}`}>
          <AlertTriangle size={18} />
        </div>
        <div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Pelanggaran</p>
          <p className={`font-black text-sm ${cheatCount > 1 ? 'text-red-500' : 'text-white'}`}>{cheatCount} / 3</p>
        </div>
      </div>

      <div className={`bg-black/30 px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-3 ${isUrgent ? 'animate-pulse border-red-500/50' : ''}`}>
        <Clock size={16} className={isUrgent ? 'text-red-500' : 'text-blue-400'} />
        <span className={`font-mono font-black ${isUrgent ? 'text-red-500' : 'text-blue-400'}`}>
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="text-right">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Progress</p>
        <p className="font-black text-sm text-white">{currentIndex + 1} <span className="text-slate-600">/ {totalSoal}</span></p>
      </div>
    </div>
  );
}