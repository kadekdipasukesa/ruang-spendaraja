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
    <header className="bg-gradient-to-r from-[#0a1931] via-[#0e2448] to-[#0a1931] border-2 border-[#1e3e70] rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Background Subtle Binary Glow */}
      <div className="absolute -top-6 right-20 text-[#38bdf8]/10 font-mono text-4xl font-black select-none pointer-events-none tracking-widest hidden sm:block">
        01001101 01110000
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        {/* Sisi Kiri: Tombol Kembali & Info Tugas */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/ruang-belajar')}
            className="p-2.5 rounded-2xl bg-[#142d55] hover:bg-[#1a3a6d] text-slate-200 hover:text-white transition border border-[#254b85] flex items-center justify-center shrink-0 cursor-pointer shadow-md"
            title="Kembali ke Ruang Belajar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#fbbf24] bg-[#fbbf24]/15 px-2.5 py-0.5 rounded-full border border-[#fbbf24]/30">
                Informatika – Kelas 7
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[#38bdf8] bg-[#38bdf8]/15 px-2.5 py-0.5 rounded-full border border-[#38bdf8]/30">
                Representasi Data
              </span>
              {submitted && (
                <span className="text-[10px] sm:text-xs font-semibold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Tersimpan di Cloud
                </span>
              )}
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2 tracking-tight">
              <span>Bilangan</span>
              <span className="text-[#fbbf24]">Biner</span>
              <span className="text-slate-400 text-sm font-semibold sm:inline hidden">&amp; Kode ASCII</span>
              <Sparkles className="w-4 h-4 text-[#38bdf8] shrink-0" />
            </h1>
          </div>
        </div>

        {/* Sisi Kanan: Profil Siswa, Skor, & Tombol Aksi */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full md:w-auto justify-between md:justify-end">
          {/* Chip Profil */}
          {user ? (
            <div className="flex items-center gap-2 bg-[#122749]/90 px-3 py-1.5 rounded-2xl border border-[#254b85] text-xs text-slate-200 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-[#4f46e5]/30 text-[#818cf8] border border-[#4f46e5]/40 flex items-center justify-center font-bold text-[10px]">
                {studentName.charAt(0)}
              </div>
              <span className="font-semibold truncate max-w-[100px] sm:max-w-[140px] text-white">
                {studentName}
              </span>
              <span className="text-[10px] text-[#fbbf24] bg-[#fbbf24]/15 px-1.5 py-0.5 rounded-lg border border-[#fbbf24]/30 font-bold">
                {studentClass}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 bg-[#fbbf24]/15 hover:bg-[#fbbf24]/25 text-[#fbbf24] px-3.5 py-1.5 rounded-2xl border border-[#fbbf24]/40 text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login Siswa</span>
            </button>
          )}

          {/* Badge Skor */}
          <div className="flex items-center gap-2.5 bg-[#071326] px-3.5 py-1.5 rounded-2xl border border-[#fbbf24]/40 text-[#fbbf24] shadow-inner">
            <Award className="w-4 h-4 text-[#fbbf24] shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-slate-400 font-bold leading-none">Skor Tugas</span>
              <div className="text-sm font-black leading-none mt-0.5">
                <span className="text-white">{totalScore}</span>
                <span className="text-slate-400 font-normal text-xs"> / 50</span>
              </div>
            </div>
            {prevScore > 0 && prevScore !== totalScore && (
              <span className="text-[9px] text-slate-400 ml-1 pl-1 border-l border-slate-700">
                Terbaik: {prevScore}
              </span>
            )}
          </div>

          {/* Tombol Reset Soal */}
          <button
            type="button"
            onClick={onResetAll}
            className="p-2.5 rounded-2xl bg-[#142d55] hover:bg-[#1a3a6d] text-slate-300 hover:text-white transition border border-[#254b85] cursor-pointer shadow-sm"
            title="Ulangi latihan dengan 15 paket soal baru"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Tombol Kumpulkan */}
          <button
            type="button"
            onClick={onSubmitAll}
            disabled={submitting}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#d97706] text-slate-950 font-black text-xs shadow-lg shadow-[#fbbf24]/20 transition active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Menyimpan...' : 'Kumpulkan'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
