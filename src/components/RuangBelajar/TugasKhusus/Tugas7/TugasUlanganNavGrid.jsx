import React from 'react';
import { ChevronLeft, ChevronRight, Send, CheckCircle2, AlertCircle, Circle } from 'lucide-react';

export default function TugasUlanganNavGrid({
  totalSoal = 50,
  currentIndex = 0,
  onSelectIndex,
  jawabanMap = {},
  raguMap = {},
  soalList = [],
  onPrev,
  onNext,
  onSubmit,
  isSubmitting = false,
}) {
  // Hitung statistik progres
  const totalTerjawab = Object.keys(jawabanMap).filter((k) => Boolean(jawabanMap[k])).length;
  const totalRagu = Object.keys(raguMap).filter((k) => Boolean(raguMap[k])).length;
  const totalBelum = Math.max(0, totalSoal - totalTerjawab);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 text-white shadow-xl space-y-5">
      {/* Tombol Sebelumnya & Selanjutnya */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-98"
        >
          <ChevronLeft size={16} />
          <span>Sebelumnya</span>
        </button>

        {currentIndex < totalSoal - 1 ? (
          <button
            type="button"
            onClick={onNext}
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 border border-blue-400 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-98 shadow-md shadow-blue-600/30"
          >
            <span>Selanjutnya</span>
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 border border-emerald-400 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-98 shadow-md shadow-emerald-600/30 text-white"
          >
            <Send size={15} />
            <span>Kirim Jawaban</span>
          </button>
        )}
      </div>

      {/* Grid Navigasi Kotak 1-50 */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold text-slate-300 uppercase tracking-wider">
            Navigasi Nomor Soal
          </span>
          <span className="text-slate-400 text-[11px]">
            {totalTerjawab} / {totalSoal} Selesai
          </span>
        </div>

        {/* 10 kolom per baris di tablet/desktop, 5 di mobile */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-64 sm:max-h-72 overflow-y-auto p-1 pr-1.5 custom-scrollbar">
          {Array.from({ length: totalSoal }).map((_, idx) => {
            const soalItem = soalList[idx];
            const soalId = soalItem ? soalItem.id : `SOAL_${idx + 1}`;
            const isAnswered = Boolean(jawabanMap[soalId]);
            const isRagu = Boolean(raguMap[soalId]);
            const isActive = currentIndex === idx;

            // Logika Warna:
            // - Active: Ring biru tebal
            // - Ragu: Kuning amber
            // - Answered: Hijau emerald
            // - Unanswered: Abu-abu slate
            let colorClass = 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700';

            if (isRagu) {
              colorClass = 'bg-amber-500 border-amber-400 text-slate-950 font-black shadow-sm shadow-amber-500/20';
            } else if (isAnswered) {
              colorClass = 'bg-emerald-600 border-emerald-400 text-white font-black shadow-sm shadow-emerald-600/20';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectIndex(idx)}
                className={`h-10 sm:h-9 rounded-xl border text-xs font-black transition-all flex items-center justify-center cursor-pointer ${colorClass} ${
                  isActive ? 'ring-2 ring-sky-400 scale-105 z-10' : ''
                }`}
                title={`Soal No. ${idx + 1} (${isRagu ? 'Ragu-ragu' : isAnswered ? 'Terjawab' : 'Belum dijawab'})`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend / Keterangan Warna */}
      <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-600 border border-emerald-400" />
          <span>Sudah ({totalTerjawab})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-500 border border-amber-400" />
          <span>Ragu ({totalRagu})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700" />
          <span>Belum ({totalBelum})</span>
        </div>
      </div>

      {/* Tombol Selesai & Kirim Utama (Di Bawah) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-black rounded-2xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition cursor-pointer active:scale-98"
        >
          <Send size={15} />
          <span>Selesaikan Ujian Sekarang</span>
        </button>
      </div>
    </div>
  );
}

