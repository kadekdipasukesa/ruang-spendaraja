import { Award, CheckCircle2, RotateCcw, Send, User, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SKHeader({
  user,
  totalScore,
  submitted,
  submitting,
  previousSubmission,
  onOpenLogin,
  onResetAll,
  onSubmitAll
}) {
  const navigate = useNavigate();

  const prevBestScore = previousSubmission ? (Number(previousSubmission.nilai_akhir ?? previousSubmission.skor) || 0) : null;
  const isScoreImproved = prevBestScore !== null && totalScore > prevBestScore;
  const isScoreRetained = prevBestScore !== null && totalScore < prevBestScore;

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-amber-500/5 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Brand & Title */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => navigate('/ruang-belajar')}
            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-all hover:scale-105 active:scale-95"
            title="Kembali ke Ruang Belajar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black text-xl shrink-0">
            💻
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Tugas 3 Praktik Terpadu
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Sistem Komputer & TIK
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight mt-0.5">
              Petualangan Sistem Komputer & Perkakas Digital
            </h1>
          </div>
        </div>

        {/* Center/Right: Score Badge & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 justify-between lg:justify-end">
          {/* User Profile Pill */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/70 px-3 py-1.5 rounded-2xl text-xs text-slate-200 shadow-inner">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-[11px]">
                {user.NAMA ? user.NAMA[0].toUpperCase() : 'S'}
              </div>
              <div className="text-left">
                <p className="font-bold leading-none truncate max-w-[120px]">{user.NAMA || user.nama}</p>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {user.Kelas || user.KELAS} • No {user['No Absen'] || user.no_absen || '-'}
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login Siswa</span>
            </button>
          )}

          {/* Current Score Counter */}
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3.5 py-1.5 rounded-2xl shadow-inner">
            <Award className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-slate-400 leading-none">Skor Misi</div>
              <div className="text-sm font-black text-amber-400 leading-tight">
                {totalScore} <span className="text-[10px] font-bold text-slate-500">/ 100 Poin</span>
              </div>
            </div>
          </div>

          {/* Reset / Ulangi Button */}
          <button
            onClick={onResetAll}
            title="Reset Jawaban Form & Mulai Ulang"
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Submit / Perbaiki Nilai Button */}
          <button
            onClick={onSubmitAll}
            disabled={submitting}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
              submitted
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/30'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20'
            } ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Menyimpan...</span>
              </>
            ) : submitted ? (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{prevBestScore !== null ? `Perbaiki Nilai (${prevBestScore}p)` : 'Kumpulkan Ulang'}</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Kumpulkan Tugas</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Status Pengerjaan & Skor Tertinggi */}
      {submitted && prevBestScore !== null && (
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Tugas sudah tersimpan di database. Skor resmi tersimpan: <strong className="text-white underline">{prevBestScore} Poin</strong></span>
          </div>

          <div className="text-slate-400 text-[11px]">
            {isScoreImproved ? (
              <span className="text-emerald-400 font-bold">✨ Skor baru ({totalScore}p) lebih tinggi! Klik Perbaiki Nilai untuk memperbarui.</span>
            ) : isScoreRetained ? (
              <span className="text-amber-400">🛡️ Sistem otomatis mempertahankan nilai tertinggi ({prevBestScore}p).</span>
            ) : (
              <span>Siap diperbaiki kapan saja hingga mencapai 100 poin penuh.</span>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
