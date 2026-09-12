import { useState } from 'react';
import {
  Binary,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Calculator,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { BIT_WEIGHTS_8 } from '../binerAsciiData';

export default function DesimalKeBinerQuiz({
  questions,
  onAnswerQuestion,
  onNextStage,
  earnedScore
}) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [inputValues, setInputValues] = useState({});
  const [showHelper, setShowHelper] = useState(false);
  const [helperBits, setHelperBits] = useState([0, 0, 0, 0, 0, 0, 0, 0]);

  const currentQ = questions[activeQuestionIndex] || questions[0];
  const allAnswered = questions.length > 0 && questions.every((q) => q.isCorrect);

  const toggleHelperBit = (idx) => {
    setHelperBits((prev) => {
      const next = [...prev];
      next[idx] = next[idx] === 1 ? 0 : 1;
      return next;
    });
  };

  const helperSum = helperBits.reduce((acc, bit, idx) => {
    return acc + (bit === 1 ? BIT_WEIGHTS_8[idx] : 0);
  }, 0);

  const handleInputChange = (qId, val) => {
    // Hanya perbolehkan karakter 0 dan 1
    const clean = val.replace(/[^01]/g, '');
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
      {/* Header Tahap */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Binary className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Tahap 2
              </span>
              <h2 className="text-base font-black text-white">Tantangan: Desimal ke Biner</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ubah angka desimal menjadi kode biner 8-bit (hanya ketik 0 dan 1).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-2xl border border-slate-800 text-xs font-bold text-slate-300">
          <span>Skor Tahap 2:</span>
          <strong className="text-amber-400 font-mono text-sm">{earnedScore} / 15 Poin</strong>
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
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80">
            <div className="text-center md:text-left space-y-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Konversikan Angka Desimal Berikut:
              </span>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-5xl sm:text-6xl font-black font-mono text-amber-400 tracking-tight">
                  {currentQ.desimal}
                </span>
                <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800 font-mono">
                  (Karakter ASCII &apos;{currentQ.char}&apos;)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cari kombinasi bobot bit 8-bit yang jika dijumlahkan bernilai <strong>{currentQ.desimal}</strong>.
              </p>
            </div>

            {/* Status Poin Per Soal */}
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center min-w-[130px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Poin Soal Ini</span>
              <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
                {currentQ.earnedPoints} <span className="text-xs text-slate-500">/ 3 pt</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Percobaan: {currentQ.attempts || 0}x
              </span>
            </div>
          </div>

          {/* Form Pengisian Biner */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor={`input-${currentQ.id}`} className="text-xs font-bold text-slate-300 block">
                Ketikkan Jawaban Bilangan Biner:
              </label>
              <div className="flex items-center gap-3">
                <input
                  id={`input-${currentQ.id}`}
                  type="text"
                  maxLength={8}
                  placeholder="contoh: 01100001"
                  value={inputValues[currentQ.id] !== undefined ? inputValues[currentQ.id] : currentQ.userAnswer}
                  onChange={(e) => handleInputChange(currentQ.id, e.target.value)}
                  disabled={currentQ.isCorrect}
                  className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-lg font-mono font-bold text-cyan-400 tracking-widest focus:outline-hidden focus:border-amber-500 placeholder:text-slate-600 disabled:opacity-60"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={currentQ.isCorrect || !(inputValues[currentQ.id] || currentQ.userAnswer)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-500/20 transition active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {currentQ.isCorrect ? 'Sudah Benar' : 'Cek Jawaban'}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                *Hanya bisa mengetik angka <strong>0</strong> dan <strong>1</strong>. Boleh 8 bit (misal: 01100001) atau tanpa awalan nol.
              </p>
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

          {/* Kotak Bantuan Orek-Orek Bobot Bit (Collapsible Scratchpad) */}
          <div className="border-t border-slate-800/80 pt-4">
            <button
              type="button"
              onClick={() => setShowHelper(!showHelper)}
              className="text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center gap-2 transition"
            >
              <Calculator className="w-4 h-4" />
              <span>Buka Kotak Orek-Orek Saklar 8-Bit</span>
              {showHelper ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showHelper && (
              <div className="mt-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Klik saklar untuk mencoba kombinasi bit:
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {helperBits.map((bit, idx) => {
                    const weight = BIT_WEIGHTS_8[idx];
                    const isOn = bit === 1;
                    return (
                      <button
                        key={weight}
                        type="button"
                        onClick={() => toggleHelperBit(idx)}
                        className={`p-2 rounded-xl border text-center transition ${
                          isOn
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        <div className="text-[9px] font-mono">{weight}</div>
                        <div className="text-lg font-black font-mono">{bit}</div>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Hasil Jumlah Saklar: <strong className="text-amber-400 font-mono">{helperSum}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      const str = helperBits.join('');
                      handleInputChange(currentQ.id, str);
                    }}
                    className="text-[11px] text-cyan-400 hover:underline font-bold"
                  >
                    Salin ke Jawaban ➔
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tombol Lanjut ke Tahap 3 */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNextStage}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition border border-slate-700 cursor-pointer"
        >
          <span>Lanjut ke Tahap 3 (Biner ke Desimal)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
