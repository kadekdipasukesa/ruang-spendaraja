import { CheckCircle2, XCircle, HelpCircle, Sparkles, Award } from 'lucide-react';

export default function StationeryQuiz({ questions, answers, onAnswerQuiz, score }) {
  const totalAnswered = Object.keys(answers).length;
  const isAllAnswered = totalAnswered === questions.length;

  return (
    <div className="space-y-5 w-full max-w-2xl mx-auto">
      <div className="text-center space-y-1">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
          <HelpCircle className="w-4 h-4" /> Kuis Studi Kasus Kehidupan Siswa
        </span>
        <p className="text-[11px] text-slate-400">
          Jawab 3 studi kasus di bawah ini untuk membuktikan pemahamanmu tentang <strong>Stack</strong>, <strong>Queue</strong>, dan <strong>Linked List</strong>!
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const studentAns = answers[q.id];
          const hasAnswered = Boolean(studentAns);

          return (
            <div
              key={q.id}
              className={`p-4 rounded-2xl border transition-all ${
                hasAnswered
                  ? studentAns.isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-rose-500/10 border-rose-500/30'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              {/* Cerita Kasus */}
              <div className="flex items-start gap-2.5 mb-2.5">
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-mono font-bold shrink-0">
                  Soal #{qIdx + 1}
                </span>
                <div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
                    &ldquo;{q.scenario}&rdquo;
                  </p>
                  <p className="text-xs font-bold text-white mt-1.5">
                    {q.question}
                  </p>
                </div>
              </div>

              {/* Opsi Pilihan */}
              <div className="space-y-2 mt-3 pl-8">
                {q.options.map((opt, optIdx) => {
                  const isSelected = hasAnswered && studentAns.optionIndex === optIdx;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => onAnswerQuiz(q.id, optIdx)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                        isSelected
                          ? opt.correct
                            ? 'bg-emerald-600 text-white border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                            : 'bg-rose-600 text-white border-rose-400 font-bold'
                          : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] opacity-75">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span>{opt.text}</span>
                      </div>

                      {isSelected && (
                        <span>
                          {opt.correct ? (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          ) : (
                            <XCircle className="w-4 h-4 text-white" />
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Penjelasan Edukatif */}
              {hasAnswered && (
                <div
                  className={`mt-3 p-2.5 rounded-xl text-[11px] ${
                    studentAns.isCorrect
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-200 border border-rose-500/30'
                  }`}
                >
                  <strong className="block mb-0.5">
                    {studentAns.isCorrect ? '✅ Penjelasan Konsep:' : '❌ Belum tepat, coba lagi:'}
                  </strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isAllAnswered && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-amber-400" />
            <div>
              <div className="text-xs font-bold text-white">Hasil Kuis Studi Kasus</div>
              <div className="text-[11px] text-amber-300">
                Skor Benar: <strong>{score} dari {questions.length} Soal</strong>
              </div>
            </div>
          </div>
          {score >= 2 && (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Misi Dikuasai!
            </span>
          )}
        </div>
      )}
    </div>
  );
}
