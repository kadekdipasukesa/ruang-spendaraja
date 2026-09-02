import { ArrowLeft, ArrowRight, BookOpen, Check } from 'lucide-react';

export default function SKFooterNav({ activeMission, setActiveMission }) {
  const isFirst = activeMission === 1;
  const isLast = activeMission === 4;

  return (
    <footer className="bg-slate-900/80 border border-slate-800 rounded-3xl p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs">
      <button
        onClick={() => setActiveMission((prev) => Math.max(1, prev - 1))}
        disabled={isFirst}
        className={`px-4 py-2 rounded-2xl font-bold flex items-center gap-2 border transition-all ${
          isFirst
            ? 'opacity-40 border-slate-800 text-slate-500 cursor-not-allowed'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:text-white active:scale-95'
        }`}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Misi Sebelumnya</span>
      </button>

      <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[11px]">
        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
        <span>Langkah {activeMission} dari 4 Misi Terpadu</span>
      </div>

      <button
        onClick={() => setActiveMission((prev) => Math.min(4, prev + 1))}
        disabled={isLast}
        className={`px-4 py-2 rounded-2xl font-bold flex items-center gap-2 border transition-all ${
          isLast
            ? 'opacity-40 border-slate-800 text-slate-500 cursor-not-allowed'
            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 font-extrabold shadow-md shadow-amber-500/20 active:scale-95'
        }`}
      >
        <span>Misi Selanjutnya</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </footer>
  );
}
