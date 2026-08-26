import { Sparkles } from 'lucide-react';

export default function BKFooterNav({ activeMission, setActiveMission }) {
  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 text-xs text-slate-600 shadow-2xs">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
        <span>
          Tugas tidak harus benar 100% untuk dikumpulkan. Anda dapat mengumpulkan sekarang dan <strong className="text-indigo-600">memperbaikinya kapan saja</strong> agar mencapai 100 Poin maksimal!
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setActiveMission((prev) => Math.max(1, prev - 1))}
          disabled={activeMission === 1}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition font-semibold text-slate-700 cursor-pointer"
        >
          &larr; Misi Sebelumnya
        </button>
        <button
          onClick={() => setActiveMission((prev) => Math.min(4, prev + 1))}
          disabled={activeMission === 4}
          className="px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 disabled:opacity-30 disabled:cursor-not-allowed transition font-bold cursor-pointer"
        >
          Misi Selanjutnya &rarr;
        </button>
      </div>
    </div>
  );
}
