import { HelpCircle, CheckCircle2, RotateCcw, Sparkles, Award } from 'lucide-react';

export default function StructureQuizPanel({
  questions,
  answers,
  submitted,
  scoreResult,
  onSelectOption,
  onSubmitQuiz,
  onResetQuiz,
}) {
  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === questions.length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center space-y-1">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
          <HelpCircle className="w-4 h-4" /> Uji Pemahaman: Struktur Data Daftar (List)
        </span>
        <p className="text-[11px] text-slate-400">
          Pilihlah salah satu opsi jawaban yang paling tepat. Pilihan jawaban telah disusun dengan panjang seimbang dan teracak.
        </p>
      </div>

      {/* Daftar Soal A-B-C-D-E */}
      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const selectedOptionId = answers[q.id];

          return (
            <div
              key={q.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                selectedOptionId
                  ? 'bg-slate-900/90 border-indigo-500/40 shadow-xs'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-start gap-2.5 mb-3">
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold shrink-0 mt-0.5">
                  #{qIdx + 1}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-200 leading-relaxed">
                  {q.question}
                </h4>
              </div>

              {/* Opsi Pilihan A-B-C-D-E */}
              <div className="space-y-2 pl-0 sm:pl-7">
                {q.options.map((opt, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isSelected = selectedOptionId === opt.id;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => onSelectOption(q.id, opt.id)}
                      disabled={submitted}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-400 font-bold shadow-md shadow-indigo-600/20'
                          : 'bg-slate-900 hover:bg-slate-800/90 border-slate-800 text-slate-300 hover:border-slate-700'
                      } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-lg flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-white text-indigo-700 font-bold'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="leading-relaxed">{opt.text}</span>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tombol Kumpulkan & Hasil Skor Akhir (Tanpa Kunci Jawaban Bocor) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 block">Status Pengerjaan Kuis:</span>
          <span className="text-xs font-bold text-white font-mono">
            {answeredCount} dari {questions.length} Soal Dijawab
          </span>
        </div>

        {!submitted ? (
          <button
            onClick={onSubmitQuiz}
            disabled={!isAllAnswered}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Kumpulkan & Lihat Hasil Nilai
          </button>
        ) : (
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="px-4 py-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center gap-2.5">
              <Award className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <div className="text-[10px] text-indigo-400 uppercase font-bold">Hasil Skor Kuis</div>
                <div className="text-xs font-mono font-bold text-white">
                  {scoreResult} dari {questions.length} Soal Benar ({scoreResult * 4} / 20 Poin)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
