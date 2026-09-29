import { Clock, CheckCircle2, BookOpen, AlertCircle } from 'lucide-react';

export default function ReadingTimerIndicator({
  currentSeconds = 0,
  threshold = 60,
  isCompleted = false,
}) {
  const isReached = isCompleted || currentSeconds >= threshold;
  const remainingSeconds = Math.max(0, threshold - currentSeconds);
  const progressPercent = Math.min(100, Math.round((currentSeconds / threshold) * 100));

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 ${
        isReached
          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
          : 'bg-slate-800/80 border-blue-500/30 text-slate-200'
      }`}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Status Text */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isReached
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/40 animate-pulse'
            }`}
          >
            {isReached ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Clock className="w-4 h-4 text-blue-400" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold block text-white">
                {isReached ? 'Waktu Literasi Terpenuhi (60 Detik)' : 'Membaca Mendalam & Fokus'}
              </span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  isReached
                    ? 'bg-emerald-900/60 text-emerald-300 border-emerald-600'
                    : 'bg-blue-900/60 text-blue-300 border-blue-600'
                }`}
              >
                {isReached ? 'Checkpoint Terbuka' : `Sisa ${remainingSeconds} Detik`}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isReached
                ? 'Kamu telah membaca materi topik ini secara saksama. Silakan buktikan pemahamanmu pada soal di bawah!'
                : 'Bacalah setiap paragraf dengan cermat. Tombol checkpoint soal akan terbuka otomatis setelah 60 detik.'}
            </p>
          </div>
        </div>

        {/* Counter Number */}
        <div className="text-right ml-auto">
          <span className="text-xs font-mono font-black text-white">
            {Math.min(threshold, currentSeconds)} <span className="text-slate-400 text-[10px]">/ {threshold}s</span>
          </span>
          <span className="text-[10px] text-slate-400 block">
            {isReached ? '100% Selesai' : `${progressPercent}% Waktu`}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900/80 rounded-full h-2 overflow-hidden mt-3 border border-slate-700/60">
        <div
          className={`h-full transition-all duration-1000 ease-linear rounded-full ${
            isReached
              ? 'bg-emerald-500'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
          }`}
          style={{ width: `${isReached ? 100 : progressPercent}%` }}
        />
      </div>
    </div>
  );
}
