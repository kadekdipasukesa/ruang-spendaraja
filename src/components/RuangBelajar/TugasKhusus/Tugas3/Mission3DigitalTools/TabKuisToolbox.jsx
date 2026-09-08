import {
  HelpCircle,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { QUIZ_QUESTIONS } from './toolboxData';

export default function TabKuisToolbox({
  quizAnswers,
  onSelectAnswer,
  quizChecked,
  quizScore,
  quizCorrectCount,
  onEvaluateQuiz,
  onResetQuiz,
  totalM3Score,
  onNextMission,
  onComplete
}) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            Kuis Perkakas Digital & Lisensi Software (5 Soal • 10 Poin)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Pilih satu opsi paling tepat. Nilai kuis dievaluasi sekaligus setelah seluruh soal dijawab.
          </p>
        </div>
        <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-3 py-1 rounded-xl">
          Skor Kuis: {quizScore} / 10 Poin
        </span>
      </div>

      <div className="space-y-3">
        {QUIZ_QUESTIONS.map((q, idx) => {
          const selectedOpt = quizAnswers[q.id];

          return (
            <div
              key={q.id}
              className={`bg-slate-950 border rounded-2xl p-4 transition-all ${
                selectedOpt ? 'border-slate-700 bg-slate-900/40' : 'border-slate-800/80'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="space-y-2.5 flex-1">
                  <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                    {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt) => {
                      const isOptionSelected = selectedOpt === opt.id;

                      let btnStyle = 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700';
                      if (isOptionSelected) {
                        btnStyle = 'border-amber-500 bg-amber-500/20 text-amber-200 ring-2 ring-amber-500/40 font-bold';
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={quizChecked}
                          onClick={() => onSelectAnswer(q.id, opt.id)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-2 ${btnStyle} ${quizChecked ? 'cursor-not-allowed opacity-90' : ''}`}
                        >
                          <span className="uppercase font-extrabold text-[11px] opacity-70 mt-0.5">
                            {opt.id}.
                          </span>
                          <span className="flex-1 leading-snug">{opt.text}</span>
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

      {/* Evaluation Banner / Buttons */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs">
          {quizChecked ? (
            <div className="space-y-1">
              <p className="font-extrabold text-emerald-400 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Hasil Kuis: Kamu menjawab {quizCorrectCount} dari 5 soal benar ({quizScore}/10 Poin).</span>
              </p>
              <p className="text-slate-400 text-[11px]">
                Ingin memperbaiki nilai? Klik tombol Ulangi Kuis di samping untuk mereset dan mencoba lagi dari awal.
              </p>
            </div>
          ) : (
            <span className="text-slate-400">
              Terjawab: {Object.keys(quizAnswers).length} / 5 Soal
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {quizChecked ? (
            <button
              onClick={onResetQuiz}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Ulangi Kuis dari Awal</span>
            </button>
          ) : (
            <button
              onClick={onEvaluateQuiz}
              disabled={Object.keys(quizAnswers).length < 5}
              className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg transition active:scale-95 ${
                Object.keys(quizAnswers).length === 5
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Kumpulkan & Cek Nilai Kuis</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Total Poin Misi 3 yang Didapat: {totalM3Score} / 30 Poin</span>
        </div>
        {onNextMission && (
          <button
            type="button"
            onClick={() => {
              if (onComplete && totalM3Score > 0) {
                onComplete('m3', totalM3Score);
              }
              onNextMission();
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition"
          >
            <span>Lanjut ke Misi 4 (Dampak & Etika TIK)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
