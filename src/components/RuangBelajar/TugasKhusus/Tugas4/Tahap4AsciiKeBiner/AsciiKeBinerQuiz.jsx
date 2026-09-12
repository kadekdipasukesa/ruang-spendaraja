import { useState } from 'react';
import {
  FileCode,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  HelpCircle,
  Search
} from 'lucide-react';
import { BIT_WEIGHTS_8, ASCII_MAP_BY_CHAR } from '../binerAsciiData';

export default function AsciiKeBinerQuiz({
  questions,
  onAnswerQuestion,
  onSubmitTask,
  submitting,
  earnedScore,
  totalScore
}) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [inputValues, setInputValues] = useState({});
  const [showAsciiHint, setShowAsciiHint] = useState(false);

  const currentQ = questions[activeQuestionIndex] || questions[0];
  const allAnswered = questions.length > 0 && questions.every((q) => q.isCorrect);

  const handleInputChange = (qId, val) => {
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
      {/* Header Tahap 4 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                Tahap 4
              </span>
              <h2 className="text-base font-black text-white">Tantangan: Karakter ASCII ke Biner</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cari kode biner untuk karakter simbol atau huruf teks berikut.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-2xl border border-slate-800 text-xs font-bold text-slate-300">
          <span>Skor Tahap 4:</span>
          <strong className="text-purple-400 font-mono text-sm">{earnedScore} / 20 Poin</strong>
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
                  ? 'bg-purple-500 text-white border-purple-400 shadow-md shadow-purple-500/20'
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
            <div className="flex items-center gap-4">
              {/* Karakter ASCII Terpampang Besar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-purple-950/80 to-indigo-950/80 border-2 border-purple-500/50 text-purple-300 font-mono font-black text-4xl sm:text-5xl flex items-center justify-center shadow-xl shadow-purple-500/10">
                {currentQ.char}
              </div>
              <div className="space-y-1 text-left">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Karakter Teks ASCII:
                </span>
                <h3 className="text-2xl font-black text-white">
                  Karakter &lsquo;{currentQ.char}&rsquo;
                </h3>
                <span className="text-[11px] text-slate-500 block">
                  Kategori: <strong>{currentQ.category || 'Karakter Cetak'}</strong>
                </span>
              </div>
            </div>

            {/* Kotak Petunjuk Nilai Desimal & Poin */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center min-w-[120px]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Poin Soal Ini</span>
                <div className="text-2xl font-black text-purple-400 font-mono mt-0.5">
                  {currentQ.earnedPoints} <span className="text-xs text-slate-500">/ 4 pt</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Percobaan: {currentQ.attempts || 0}x
                </span>
              </div>

              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center min-w-[120px]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nilai Desimal</span>
                <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">
                  {currentQ.desimal}
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Nomor ASCII
                </span>
              </div>
            </div>
          </div>

          {/* Form Pengisian Biner */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor={`input-ascii-${currentQ.id}`} className="text-xs font-bold text-slate-300 block">
                Ketikkan Biner 8-Bit untuk Karakter &lsquo;{currentQ.char}&rsquo; (Desimal {currentQ.desimal}):
              </label>
              <div className="flex items-center gap-3">
                <input
                  id={`input-ascii-${currentQ.id}`}
                  type="text"
                  maxLength={8}
                  placeholder="contoh: 01001011"
                  value={inputValues[currentQ.id] !== undefined ? inputValues[currentQ.id] : currentQ.userAnswer}
                  onChange={(e) => handleInputChange(currentQ.id, e.target.value)}
                  disabled={currentQ.isCorrect}
                  className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-lg font-mono font-bold text-purple-300 tracking-widest focus:outline-hidden focus:border-purple-500 placeholder:text-slate-600 disabled:opacity-60"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={currentQ.isCorrect || !(inputValues[currentQ.id] || currentQ.userAnswer)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-purple-500/20 transition active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {currentQ.isCorrect ? 'Sudah Benar' : 'Cek Jawaban'}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                *Ubah angka desimal <strong>{currentQ.desimal}</strong> ke format biner 8-bit (kombinasi 0 dan 1).
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
        </div>
      )}

      {/* Bagian Bawah: Tombol Kumpulkan Tugas */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-300 block">
            Total Perolehan Nilai: <strong className="text-amber-400 font-mono text-sm">{totalScore} / 50 Poin</strong>
          </span>
          <p className="text-[11px] text-slate-400">
            {allAnswered
              ? '🎉 Semua soal telah berhasil dijawab! Klik tombol kumpulkan untuk menyimpan nilaimu.'
              : 'Kamu bisa mengumpulkan tugas kapan saja, nilai tertinggi selalu tersimpan otomatis.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onSubmitTask}
          disabled={submitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>{submitting ? 'Menyimpan ke Cloud...' : 'Kumpulkan Tugas 4 (Simpan Nilai)'}</span>
        </button>
      </div>
    </div>
  );
}
