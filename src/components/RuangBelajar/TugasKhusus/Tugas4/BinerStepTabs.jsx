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
      title: 'Materi & Konsep',
      subtitle: 'Alur & Saklar 8-Bit',
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
            className={`flex items-center gap-2.5 p-3 rounded-2xl border-2 text-left transition-all relative overflow-hidden cursor-pointer ${
              isActive
                ? 'bg-gradient-to-b from-[#102a54] to-[#0a1931] border-[#fbbf24] shadow-lg shadow-[#fbbf24]/10 ring-1 ring-[#fbbf24]/30'
                : 'bg-[#0a1931]/80 border-[#1a365d] hover:bg-[#0f2549] hover:border-[#254e85] text-slate-400'
            }`}
          >
            {/* Indikator Garis Aktif */}
            {isActive && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#fbbf24] via-[#38bdf8] to-[#818cf8]" />
            )}

            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition ${
                isActive
                  ? 'bg-[#fbbf24]/20 text-[#fbbf24] border border-[#fbbf24]/40'
                  : tab.isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-[#142d55] text-slate-300 border border-[#254b85]'
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
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                  Tahap {tab.id}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${
                    tab.isCompleted
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-bold'
                      : isActive
                      ? 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/40 font-black'
                      : 'bg-[#142d55] text-slate-400 border-[#254b85]'
                  }`}
                >
                  {tab.badge}
                </span>
              </div>
              <p
                className={`text-xs font-bold truncate mt-0.5 ${
                  isActive ? 'text-white' : 'text-slate-200'
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
