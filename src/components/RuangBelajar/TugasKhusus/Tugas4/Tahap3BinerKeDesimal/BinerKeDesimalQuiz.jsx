import { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { BIT_WEIGHTS_8 } from '../binerAsciiData';

export default function BinerKeDesimalQuiz({
  questions,
  onAnswerQuestion,
  onNextStage,
  earnedScore
}) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [inputValues, setInputValues] = useState({});

  const currentQ = questions[activeQuestionIndex] || questions[0];

  const handleInputChange = (qId, val) => {
    // Hanya perbolehkan karakter angka (0-9)
    const clean = val.replace(/[^0-9]/g, '');
    setInputValues((prev) => ({ ...prev, [qId]: clean }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!currentQ) return;
    const answer = inputValues[currentQ.id] || '';
    if (!answer.trim()) return;
    onAnswerQuestion(activeQuestionIndex, answer.trim());
  };

  return (
    <div className="space-y-5">
      {/* Header Tahap 3 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Tahap 3
              </span>
              <h2 className="text-base font-black text-white">Tantangan: Biner ke Desimal</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Hitung nilai desimal dari deretan bilangan biner 8-bit berikut.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-2xl border border-slate-800 text-xs font-bold text-slate-300">
          <span>Skor Tahap 3:</span>
          <strong className="text-cyan-400 font-mono text-sm">{earnedScore} / 15 Poin</strong>
        </div>
      </div>

      {/* Navigasi Nomor Soal (1 - 5) */}
      <div className="flex items-center gap-2 flex-wrap">
        {questions.map((q, idx) => {
          const isActive = idx === activeQuestionIndex;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setActiveQuestionIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                  : q.isCorrect
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>Soal #{q.questionNumber}</span>
              {q.isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Kotak Soal Aktif */}
      {currentQ && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6">
          {/* Tampilan Visual Bit & Bobot Pangkat 2 */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Deretan Bit Biner 8-Bit:
              </span>
              <div className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800 font-mono">
                Poin Soal: <strong className="text-cyan-400">{currentQ.earnedPoints} / 3 pt</strong>
              </div>
            </div>

            {/* Kartu 8 Bit dengan Bobot di Atasnya */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {currentQ.givenBiner.split('').map((bit, idx) => {
                const weight = BIT_WEIGHTS_8[idx];
                const isOn = bit === '1';

                return (
                  <div
                    key={weight}
                    className={`p-3 rounded-2xl border text-center transition ${
                      isOn
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 ring-1 ring-cyan-500/30'
                        : 'bg-slate-900/50 border-slate-800/80 text-slate-600'
                    }`}
                  >
                    <span className={`text-[10px] font-mono block ${isOn ? 'text-cyan-400 font-bold' : 'text-slate-600'}`}>
                      {weight}
                    </span>
                    <span className="text-3xl font-black font-mono leading-none my-1 block">
                      {bit}
                    </span>
                    <span className={`text-[9px] uppercase font-bold block ${isOn ? 'text-emerald-400' : 'text-slate-600'}`}>
                      {isOn ? `+${weight}` : '0'}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-slate-400 text-center">
              Petunjuk: Jumlahkan angka pada kartu yang memiliki bit bernilai <strong>1</strong> (warna menyala).
            </p>
          </div>

          {/* Form Pengisian Desimal */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor={`input-desimal-${currentQ.id}`} className="text-xs font-bold text-slate-300 block">
                Ketikkan Hasil Perhitungan Angka Desimal:
              </label>
              <div className="flex items-center gap-3">
                <input
                  id={`input-desimal-${currentQ.id}`}
                  type="text"
                  placeholder="contoh: 97"
                  value={inputValues[currentQ.id] !== undefined ? inputValues[currentQ.id] : currentQ.userAnswer}
                  onChange={(e) => handleInputChange(currentQ.id, e.target.value)}
                  disabled={currentQ.isCorrect}
                  className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-xl font-mono font-bold text-amber-400 tracking-wider focus:outline-hidden focus:border-cyan-500 placeholder:text-slate-600 disabled:opacity-60"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={currentQ.isCorrect || !(inputValues[currentQ.id] || currentQ.userAnswer)}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-cyan-500/20 transition active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {currentQ.isCorrect ? 'Sudah Benar' : 'Cek Jawaban'}
                </button>
              </div>
            </div>

            {/* Pesan Feedback */}
            {currentQ.feedback && (
              <div
                className={`p-3 rounded-2xl border flex items-center gap-2.5 text-xs font-medium ${
                  currentQ.isCorrect
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                }`}
              >
                {currentQ.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{currentQ.feedback}</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Tombol Lanjut ke Tahap 4 */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNextStage}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition border border-slate-700 cursor-pointer"
        >
          <span>Lanjut ke Tahap 4 (Karakter ASCII ke Biner)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
