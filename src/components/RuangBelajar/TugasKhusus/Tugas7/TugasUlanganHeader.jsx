import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AlertTriangle, Clock, BookOpen, Shield, ShieldAlert, Award, ExternalLink, RotateCcw } from 'lucide-react';

export default function TugasUlanganHeader({
  siswa,
  cheatCount = 0,
  attemptCount = 1,
  currentIndex = 0,
  totalSoal = 50,
  answeredCount = 0,
  durasiMenit = 80,
  sesiStartTime,
  sesiId,
  onTimeUp,
  showAsisten,
  onToggleAsisten,
  isAdmin = false,
  onOpenAdminPanel,
}) {
  // Hitung waktu awal mulai resmi dari SESI DATABASE (Bukan joined_at atau localStorage)
  // Menjamin seluruh murid dan pengawas tersinkronisasi detik yang sama persis
  const startTime = useMemo(() => {
    if (sesiStartTime) {
      const parsed = new Date(sesiStartTime).getTime();
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return Date.now();
  }, [sesiStartTime]);

  // Fungsi hitung sisa waktu tersinkronisasi detik ini
  const calculateRemaining = useCallback(() => {
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
    const totalSeconds = (parseInt(durasiMenit, 10) || 80) * 60;
    return Math.max(0, totalSeconds - elapsedSeconds);
  }, [startTime, durasiMenit]);

  const [timeLeft, setTimeLeft] = useState(calculateRemaining);

  // Sinkronisasi instan saat durasiMenit atau waktu sesi diubah admin dari server
  useEffect(() => {
    setTimeLeft(calculateRemaining());
  }, [durasiMenit, sesiStartTime, calculateRemaining]);

  // Interval hitung mundur per detik
  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, calculateRemaining, onTimeUp]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isUrgent = timeLeft < 300; // < 5 menit

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Sisi Kiri: Identitas Siswa & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-sm shadow-md shadow-blue-500/20 shrink-0">
            {siswa?.No_Absen || '07'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                Tugas 7 • Ulangan Informatika
              </span>
              <span className="text-[10px] text-slate-400 font-semibold hidden md:inline">
                SMPN 2 Singaraja
              </span>
            </div>
            <p className="font-bold text-xs sm:text-sm text-slate-100 truncate max-w-[150px] sm:max-w-xs">
              {siswa?.NAMA || 'Siswa Spendaraja'}
            </p>
          </div>
        </div>

        {/* Sisi Tengah: Timer & Status Anti-Cheat */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Timer Realtime */}
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs sm:text-sm font-mono font-black transition-all ${
              isUrgent
                ? 'bg-red-500/15 border-red-500 text-red-400 animate-pulse'
                : 'bg-slate-800/80 border-slate-700 text-sky-300'
            }`}
            title="Sisa Waktu Pengerjaan"
          >
            <Clock size={15} className={isUrgent ? 'text-red-400' : 'text-sky-400'} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Indikator Pelanggaran Anti-Cheat */}
          <div
            className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold ${
              cheatCount >= 2
                ? 'bg-red-500/20 border-red-500 text-red-400'
                : cheatCount === 1
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-800/80 border-slate-700 text-emerald-400'
            }`}
            title="Deteksi Keluar Layar / Pindah Tab (Maks 3x)"
          >
            {cheatCount > 0 ? (
              <ShieldAlert size={14} className="text-red-400 animate-bounce" />
            ) : (
              <Shield size={14} className="text-emerald-400" />
            )}
            <span className="hidden sm:inline text-[11px] font-medium text-slate-400">Pelanggaran:</span>
            <span className="font-black">{cheatCount}/3</span>
          </div>

          {/* Indikator Jumlah Percobaan Ujian */}
          <div
            className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
              attemptCount > 5
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm shadow-amber-500/20'
                : 'bg-slate-800/80 border-slate-700 text-sky-300'
            }`}
            title={
              attemptCount > 5
                ? `Percobaan ke-${attemptCount} (Lebih dari 5 percobaan: Skor maksimal 75 pt)`
                : `Percobaan ke-${attemptCount} (Maksimal skor 100 pt)`
            }
          >
            <RotateCcw size={13} className={attemptCount > 5 ? 'text-amber-400' : 'text-sky-400'} />
            <span className="hidden sm:inline text-[11px] font-medium text-slate-400">Percobaan:</span>
            <span className="font-black">#{attemptCount}</span>
            {attemptCount > 5 && (
              <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/30 px-1.5 py-0.5 rounded border border-amber-500/40 hidden md:inline ml-0.5">
                Maks 75
              </span>
            )}
          </div>
        </div>

        {/* Sisi Kanan: Toggle Asisten, Progress & Tombol Admin */}
        <div className="flex items-center gap-2">
          {/* Tombol Toggle Asisten Materi */}
          <button
            type="button"
            onClick={onToggleAsisten}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              showAsisten
                ? 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title="Tampilkan / Sembunyikan Panel Bahan Bacaan Asisten"
          >
            <BookOpen size={14} />
            <span className="hidden md:inline">Asisten Materi</span>
          </button>

          {/* Tombol Admin Panel (Hanya Role Admin) */}
          {isAdmin && (
            <button
              type="button"
              onClick={onOpenAdminPanel}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              title="Panel Proctoring Guru / Admin"
            >
              <ExternalLink size={14} />
              <span className="hidden lg:inline">Admin Panel</span>
            </button>
          )}

          {/* Status Terjawab & Posisi Soal */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-800">
            {/* Status Berapa Soal yang Sudah Terjawab */}
            <div className="text-right">
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 block">
                Terjawab
              </span>
              <span className="text-xs sm:text-sm font-black text-emerald-300">
                {answeredCount} <span className="text-slate-500 font-medium text-[10px]">/ {totalSoal}</span>
              </span>
            </div>

            {/* Posisi Soal yang Sedang Dibuka */}
            <div className="hidden sm:block text-right pl-2 sm:pl-2.5 border-l border-slate-800/80">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                Soal Dibuka
              </span>
              <span className="text-xs sm:text-sm font-black text-white">
                No. {currentIndex + 1}
              </span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}

