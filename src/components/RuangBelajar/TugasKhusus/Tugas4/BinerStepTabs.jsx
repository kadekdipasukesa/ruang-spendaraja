import { BookOpen, Cpu, Binary, FileCode, CheckCircle2 } from 'lucide-react';

export default function BinerStepTabs({
  activeStage,
  setActiveStage,
  stage1Completed,
  scores,
  stage2Questions,
  stage3Questions,
  stage4Questions
}) {
  const s2Done = stage2Questions.length > 0 && stage2Questions.every((q) => q.isCorrect);
  const s3Done = stage3Questions.length > 0 && stage3Questions.every((q) => q.isCorrect);
  const s4Done = stage4Questions.length > 0 && stage4Questions.every((q) => q.isCorrect);

  const tabs = [
    {
      id: 1,
      title: 'Materi & Visualizer',
      subtitle: 'Konsep & Saklar 8-Bit',
      icon: BookOpen,
      isCompleted: stage1Completed,
      badge: stage1Completed ? 'Selesai' : 'Wajib Baca'
    },
    {
      id: 2,
      title: 'Desimal ke Biner',
      subtitle: '5 Soal (15 Poin)',
      icon: Binary,
      isCompleted: s2Done,
      badge: `${scores.stage2}/15 Poin`
    },
    {
      id: 3,
      title: 'Biner ke Desimal',
      subtitle: '5 Soal (15 Poin)',
      icon: Cpu,
      isCompleted: s3Done,
      badge: `${scores.stage3}/15 Poin`
    },
    {
      id: 4,
      title: 'ASCII ke Biner',
      subtitle: '5 Soal (20 Poin)',
      icon: FileCode,
      isCompleted: s4Done,
      badge: `${scores.stage4}/20 Poin`
    }
  ];

  return (
    <nav className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3" aria-label="Tahapan Tugas">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeStage === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveStage(tab.id)}
            className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
              isActive
                ? 'bg-slate-900 border-amber-500 shadow-md shadow-amber-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700 text-slate-400'
            }`}
          >
            {/* Indikator Aktif */}
            {isActive && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
            )}

            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition ${
                isActive
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : tab.isCompleted
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {tab.isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Tahap {tab.id}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    tab.isCompleted
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </div>
              <p
                className={`text-xs font-bold truncate mt-0.5 ${
                  isActive ? 'text-white' : 'text-slate-300'
                }`}
              >
                {tab.title}
              </p>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
