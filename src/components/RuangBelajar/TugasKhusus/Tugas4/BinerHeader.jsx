import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, User, RefreshCw, Send, CheckCircle2, Sparkles, LogIn } from 'lucide-react';

export default function BinerHeader({
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
  const studentName = user?.NAMA || user?.nama || 'Tamu Belajar';
  const studentClass = user?.KELAS || user?.Kelas || user?.kelas || '-';
  const prevScore = previousSubmission ? (previousSubmission.nilai_akhir ?? previousSubmission.skor ?? 0) : 0;

  return (
    <header className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Sisi Kiri: Tombol Kembali & Info Tugas */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/ruang-belajar')}
            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition border border-slate-700/60 flex items-center justify-center shrink-0"
            title="Kembali ke Ruang Belajar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Tugas #4 • Representasi Data
              </span>
              {submitted && (
                <span className="text-[10px] sm:text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Tersimpan di Cloud
                </span>
              )}
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>Bilangan Biner & Kode ASCII</span>
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            </h1>
          </div>
        </div>

        {/* Sisi Kanan: Profil Siswa, Skor, & Tombol Aksi */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full md:w-auto justify-between md:justify-end">
          {/* Chip Profil */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-2xl border border-slate-700/60 text-xs text-slate-300">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                {studentName.charAt(0)}
              </div>
              <span className="font-semibold truncate max-w-[100px] sm:max-w-[140px] text-white">
                {studentName}
              </span>
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                {studentClass}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-2xl border border-amber-500/30 text-xs font-semibold transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login Siswa</span>
            </button>
          )}

          {/* Badge Skor */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-1.5 rounded-2xl border border-amber-500/30 text-amber-400 shadow-inner">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-slate-400 font-medium leading-none">Skor Tugas</span>
              <div className="text-sm font-black leading-none mt-0.5">
                <span>{totalScore}</span>
                <span className="text-slate-500 font-normal text-xs"> / 50</span>
              </div>
            </div>
            {prevScore > 0 && prevScore !== totalScore && (
              <span className="text-[9px] text-slate-400 ml-1 pl-1 border-l border-slate-800">
                Terbaik: {prevScore}
              </span>
            )}
          </div>

          {/* Tombol Reset Soal */}
          <button
            type="button"
            onClick={onResetAll}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition border border-slate-700/60"
            title="Ulangi latihan dengan 15 paket soal baru"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Tombol Kumpulkan */}
          <button
            type="button"
            onClick={onSubmitAll}
            disabled={submitting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition active:scale-95 disabled:opacity-50 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Menyimpan...' : 'Kumpulkan'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
