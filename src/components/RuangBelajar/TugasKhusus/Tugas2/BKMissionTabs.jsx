import { Brain, Clock, Layers, Zap, CheckCircle2 } from 'lucide-react';

export const MISSION_LIST = [
  { id: 1, key: 'm1', title: '1. Algoritma', maxScore: 50, icon: Brain, desc: 'Instruksi robot ke bendera (50 Poin)' },
  { id: 2, key: 'm2', title: '2. Penjadwalan', maxScore: 10, icon: Clock, desc: 'Optimasi jadwal kegiatan (10 Poin)' },
  { id: 3, key: 'm3', title: '3. Struktur Data', maxScore: 20, icon: Layers, desc: 'Daftar (List) & Kata Rahasia (20 Poin)' },
  { id: 4, key: 'm4', title: '4. Representasi Data', maxScore: 20, icon: Zap, desc: 'Logika 2 kemungkinan Ya/Tidak (20 Poin)' },
];

export default function BKMissionTabs({ activeMission, setActiveMission, scores, completed }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {MISSION_LIST.map((m) => {
        const Icon = m.icon;
        const isDone = completed[m.key] || scores[m.key] > 0;
        const isActive = activeMission === m.id;
        const currentMScore = scores[m.key] || 0;

        return (
          <button
            key={m.id}
            onClick={() => setActiveMission(m.id)}
            className={`relative p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
              isActive
                ? 'bg-slate-800/90 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                : isDone
                ? 'bg-slate-900/80 border-emerald-500/40 hover:bg-slate-800/50'
                : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div
                className={`p-2 rounded-xl ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              {isDone ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {currentMScore} / {m.maxScore}p
                </span>
              ) : (
                <span className="text-[11px] font-medium text-slate-500">Maks {m.maxScore} Poin</span>
              )}
            </div>
            <div>
              <h3
                className={`text-xs sm:text-sm font-bold ${
                  isActive ? 'text-amber-400' : isDone ? 'text-slate-200' : 'text-slate-400'
                }`}
              >
                {m.title}
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{m.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
