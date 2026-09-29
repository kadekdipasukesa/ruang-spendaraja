import { useState } from 'react';
import { FileEdit, CheckCircle2, XCircle, Sparkles, ArrowRight, Award, HelpCircle } from 'lucide-react';
import { KUIS_MS_WORD_QUESTIONS, TUGAS_5_CONFIG } from '../../../../../data/tugas5WordData';

export default function KuisMsWord({
  quizAnswers = {},
  quizSubmitted = false,
  onAnswerQuiz,
  onSubmitQuiz,
  onGoToProject,
  scoreTahap2 = 0,
}) {
  const answeredCount = Object.keys(quizAnswers).length;
  const isAllAnswered = answeredCount === KUIS_MS_WORD_QUESTIONS.length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between gap-4 flex-wrap relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Tahap 2 • Uji Fitur & Menu Ms. Word
              </span>
              <span className="text-xs text-slate-300">
                5 Soal Aplikatif Desain Brosur
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white mt-1">
              Kuis Evaluasi Fitur Microsoft Word
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Jawab pertanyaan seputar fitur tata letak, pembagian kolom, pengaturan gambar (Wrap Text),
              pembentukan teks, dan penyimpanan berkas dokumen.
            </p>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Skor Kuis</span>
              <span className="text-sm sm:text-base font-black text-indigo-300">
                {scoreTahap2} / {TUGAS_5_CONFIG.poin_tahap2_kuis} Poin
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-black text-sm">
              <Award className="w-6 h-6 text-indigo-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-5">
        {KUIS_MS_WORD_QUESTIONS.map((q, idx) => {
          const userAnswer = quizAnswers[q.id];
          const isCorrect = userAnswer === q.jawabanBenar;

          return (
            <div
              key={q.id}
              className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                quizSubmitted
                  ? isCorrect
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-rose-950/20 border-rose-500/40'
                  : userAnswer
                  ? 'bg-slate-900/90 border-indigo-500/40'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-slate-800 text-indigo-300 border border-indigo-500/20">
                    Soal {idx + 1}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Bobot: {q.poin} Poin
                  </span>
                </div>

                {quizSubmitted && (
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      isCorrect
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/60'
                        : 'bg-rose-950/60 text-rose-300 border-rose-500/60'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Jawaban Benar (+{q.poin} pt)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Kurang Tepat (Kunci: {q.jawabanBenar})</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Pertanyaan */}
              <h3 className="text-sm sm:text-base font-bold text-white mb-4 leading-snug">
                {q.pertanyaan}
              </h3>

              {/* Opsi Jawaban */}
              <div className="grid grid-cols-1 gap-2.5">
                {q.opsi.map((opt) => {
                  const isSelected = userAnswer === opt.id;
                  const isThisCorrect = opt.id === q.jawabanBenar;

                  let optStyle = 'bg-slate-800/40 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600';
                  let badgeStyle = 'bg-slate-800 text-slate-400 border-slate-700';

                  if (quizSubmitted) {
                    if (isThisCorrect) {
                      optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                      badgeStyle = 'bg-emerald-500 text-slate-950 border-emerald-400 font-black';
                    } else if (isSelected && !isThisCorrect) {
                      optStyle = 'bg-rose-950/60 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                      badgeStyle = 'bg-rose-500 text-white border-rose-400 font-black';
                    } else {
                      optStyle = 'bg-slate-900/30 border-slate-800/60 text-slate-500';
                    }
                  } else if (isSelected) {
                    optStyle = 'bg-indigo-950/70 border-indigo-500 text-white ring-1 ring-indigo-500';
                    badgeStyle = 'bg-indigo-500 text-white border-indigo-400 font-black';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={quizSubmitted}
                      onClick={() => onAnswerQuiz(q.id, opt.id)}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition ${optStyle}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 mt-0.5 border ${badgeStyle}`}
                      >
                        {opt.id}
                      </span>
                      <span className="text-xs sm:text-sm font-medium leading-relaxed">
                        {opt.teks}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Penjelasan jika sudah submitted */}
              {quizSubmitted && q.penjelasan && (
                <div className="mt-4 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300">
                  <span className="font-bold text-indigo-300 block mb-1">
                    💡 Pembahasan & Penguatan Fitur:
                  </span>
                  <p className="leading-relaxed">{q.penjelasan}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Submit / Navigation */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="text-xs text-slate-400 block">
            {quizSubmitted
              ? `Hasil Kuis: ${scoreTahap2} dari 30 Poin Berhasil Diraih`
              : `${answeredCount} dari ${KUIS_MS_WORD_QUESTIONS.length} Soal Terjawab`}
          </span>
          <span className="text-sm font-bold text-white">
            {quizSubmitted
              ? 'Lanjutkan ke Tahap 3 untuk merancang dan mengunggah berkas brosur!'
              : isAllAnswered
              ? 'Seluruh soal telah dijawab. Silakan kunci jawabanmu sekarang.'
              : 'Jawab seluruh pertanyaan di atas untuk mengunci poin.'}
          </span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {!quizSubmitted ? (
            <button
              type="button"
              onClick={onSubmitQuiz}
              disabled={answeredCount === 0}
              className={`px-6 py-3 rounded-xl text-xs font-black transition shadow-md flex items-center gap-2 ${
                answeredCount > 0
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Kunci & Evaluasi Kuis</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onGoToProject}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-xl text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Lanjut ke Tahap 3: Proyek & Unggah Brosur</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
