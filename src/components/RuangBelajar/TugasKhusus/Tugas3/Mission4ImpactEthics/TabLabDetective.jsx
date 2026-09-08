import {
  Eye,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { ETHICS_CASES } from './ethicsData';

export default function TabLabDetective({
  caseAnswers,
  onSelectAction,
  onSelectImpact,
  casesChecked,
  labScore,
  onCheckCases,
  onNextTab
}) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            Detektif Etika: Selesaikan 5 Studi Kasus Dunia Nyata
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Baca skenario di bawah ini, pilih tindakan paling bijak dan kenali dampak konsekuensinya.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCheckCases}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Cek Hasil ({labScore}/10p)</span>
          </button>
        </div>
      </div>

      {/* 5 Cards */}
      <div className="space-y-4">
        {ETHICS_CASES.map((cs, idx) => {
          const currentAns = caseAnswers[cs.id] || {};
          const isActionCorrect = currentAns.action === cs.correctAction;
          const isImpactCorrect = currentAns.impact === cs.correctImpact;
          const isCaseSolved = isActionCorrect && isImpactCorrect;

          return (
            <div
              key={cs.id}
              className={`bg-slate-950 border rounded-3xl p-5 space-y-4 transition-all ${
                casesChecked
                  ? isCaseSolved
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : 'border-amber-500/40 bg-amber-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-white">{cs.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                      {cs.scenario}
                    </p>
                  </div>
                </div>

                {casesChecked && (
                  <span
                    className={`text-[11px] font-black px-2.5 py-1 rounded-full border shrink-0 ${
                      isCaseSolved
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : 'bg-rose-950 text-rose-300 border-rose-700'
                    }`}
                  >
                    {isCaseSolved ? '✅ 2/2p' : 'Perlu Diperbaiki'}
                  </span>
                )}
              </div>

              {/* Actions & Impact Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                {/* Action Choices */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-amber-400 flex items-center justify-between">
                    <span>Pilihan Tindakan Terbaik:</span>
                    {casesChecked && (isActionCorrect ? '✅ Tepat' : '❌ Kurang Bijak')}
                  </label>
                  <div className="space-y-1.5">
                    {cs.actions.map((act) => {
                      const isSelected = currentAns.action === act.id;
                      return (
                        <button
                          key={act.id}
                          onClick={() => onSelectAction(cs.id, act.id)}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                            isSelected
                              ? 'border-amber-400 bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/30'
                              : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {act.text}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Impact Choices */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-blue-400 flex items-center justify-between">
                    <span>Analisis Dampak Konsekuensi:</span>
                    {casesChecked && (isImpactCorrect ? '✅ Tepat' : '❌ Kurang Tepat')}
                  </label>
                  <div className="space-y-1.5">
                    {cs.impacts.map((imp) => {
                      const isSelected = currentAns.impact === imp.id;
                      return (
                        <button
                          key={imp.id}
                          onClick={() => onSelectImpact(cs.id, imp.id)}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                            isSelected
                              ? 'border-blue-400 bg-blue-500/20 text-blue-200 ring-1 ring-blue-400/30'
                              : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {imp.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onNextTab}
          className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
        >
          <span>Lanjut ke Kuis Pemahaman Etika</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
