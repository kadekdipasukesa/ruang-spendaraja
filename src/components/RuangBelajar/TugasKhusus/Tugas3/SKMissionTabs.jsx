import { CheckCircle2, Cpu, Database, LayoutGrid, ShieldCheck } from 'lucide-react';

const MISSIONS = [
  {
    id: 1,
    title: 'Misi 1: Komponen Komputer',
    subtitle: 'Hardware, CPU, Memori & Storage',
    icon: Cpu,
    maxScore: 35,
    key: 'm1',
  },
  {
    id: 2,
    title: 'Misi 2: Data & Aplikasi',
    subtitle: 'Input Data → Proses → Informasi',
    icon: Database,
    maxScore: 20,
    key: 'm2',
  },
  {
    id: 3,
    title: 'Misi 3: Perkakas Digital',
    subtitle: 'Software Produktif & Rekreatif',
    icon: LayoutGrid,
    maxScore: 30,
    key: 'm3',
  },
  {
    id: 4,
    title: 'Misi 4: Dampak & Etika TIK',
    subtitle: 'Manfaat, Keamanan & Netiket',
    icon: ShieldCheck,
    maxScore: 15,
    key: 'm4',
  },
];

export default function SKMissionTabs({
  activeMission,
  setActiveMission,
  scores,
  completed
}) {
  return (
    <nav aria-label="Navigasi Misi" className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
      {MISSIONS.map((m) => {
        const Icon = m.icon;
        const isActive = activeMission === m.id;
        const isDone = completed[m.key];
        const currentScore = scores[m.key] || 0;

        return (
          <button
            key={m.id}
            onClick={() => setActiveMission(m.id)}
            className={`text-left p-3 sm:p-3.5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between group ${
              isActive
                ? 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/10 text-white ring-2 ring-amber-500/30'
                : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {/* Top Row: Icon & Status */}
            <div className="flex items-center justify-between mb-2">
              <div
                className={`p-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'bg-slate-800 text-slate-400 group-hover:text-amber-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {isDone ? (
                <div className="flex items-center gap-1 text-[11px] font-black text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{currentScore}/{m.maxScore}p</span>
                </div>
              ) : (
                <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
                  Maks {m.maxScore}p
                </span>
              )}
            </div>

            {/* Bottom Row: Text */}
            <div>
              <p className={`text-xs sm:text-sm font-black tracking-tight ${isActive ? 'text-amber-300' : 'text-slate-100'}`}>
                {m.title}
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-0.5">
                {m.subtitle}
              </p>
            </div>

            {/* Active Bottom Glow Accent */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-b-2xl"></div>
            )}
          </button>
        );
      })}
    </nav>
  );
}
