import React from 'react';
import { Mail, Users, FileText, CheckCircle2 } from 'lucide-react';
import { TAHAPAN_TUGAS_6 } from '../../../../data/tugas6SurelData';

const ICONS = {
  1: Mail,
  2: Users,
  3: FileText,
};

export default function SurelStepTabs({
  activeStage,
  setActiveStage,
  quizAnswers,
  uploadedScreenshots,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
      {TAHAPAN_TUGAS_6.map((t) => {
        const Icon = ICONS[t.id] || Mail;
        const isActive = activeStage === t.id;
        const hasQuiz = Boolean(quizAnswers[t.id]);
        const hasSS = Boolean(uploadedScreenshots[t.id]?.secureUrl);
        const isComplete = hasQuiz && hasSS;

        return (
          <button
            key={t.id}
            onClick={() => setActiveStage(t.id)}
            className={`flex items-center gap-3 p-3.5 rounded-2xl text-left border transition-all ${
              isActive
                ? 'bg-slate-900 border-rose-500/60 shadow-lg shadow-rose-950/30 ring-1 ring-rose-500/30'
                : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm transition-all ${
                isComplete
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : isActive
                  ? 'bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-md shadow-rose-900/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700/60'
              }`}
            >
              {isComplete ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Icon className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tahap {t.id}
                </span>
                <span className="text-[10px] font-extrabold text-amber-400">
                  {t.bobotPoin} Poin
                </span>
              </div>
              <h3 className={`text-xs sm:text-sm font-bold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                {t.title}
              </h3>
            </div>
          </button>
        );
      })}
    </div>
  );
}
