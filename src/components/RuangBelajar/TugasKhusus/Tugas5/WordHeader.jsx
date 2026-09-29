import { ArrowLeft, Award, Sparkles, CheckCircle2, User, Send, Clock, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WordHeader({
  user,
  totalScore = 0,
  maxPoints = 100,
  submitting = false,
  submitted = false,
  hasUploadedFile = false,
  isFullyComplete = false,
  onSubmitAll,
  onOpenLogin,
}) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (!user) {
      if (onOpenLogin) {
        onOpenLogin();
      } else {
        window.dispatchEvent(new CustomEvent('open-login-modal'));
      }
      return;
    }
    if (onSubmitAll) {
      onSubmitAll();
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-950/90 via-slate-900 to-indigo-950/90 border border-blue-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/ruang-belajar')}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Kembali ke Ruang Belajar"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Ruang Belajar</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Tugas 5 • Pengolah Kata
              </span>
              <span className="text-[10px] font-semibold text-slate-400 hidden md:inline">
                Aktivitas VII-LD-28-U & VII-LD-29-P
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-black text-white leading-snug">
              Pengalaman Belajar di SMPN 2 Singaraja (Ms. Word)
            </h1>
          </div>
        </div>

        {/* Right: Student Info, Score Badge & Submit */}
        <div className="flex items-center gap-3 ml-auto flex-wrap">
          {/* User Info */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                {user.NAMA ? user.NAMA.charAt(0) : 'S'}
              </div>
              <div className="text-left leading-tight">
                <span className="font-bold text-slate-200 block truncate max-w-[120px]">
                  {user.NAMA || user.nama}
                </span>
                <span className="text-[10px] text-slate-400">
                  Kelas {user.Kelas || user.kelas || '7'} • #{user['No Absen'] || user.no_absen || '-'}
                </span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-3 py-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Masuk Siswa</span>
            </button>
          )}

          {/* Total Points Live Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/40 text-blue-200 shadow-sm">
            <Award className="w-4 h-4 text-amber-400" />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block -mb-0.5">Total Skor</span>
              <span className="text-xs sm:text-sm font-black text-amber-300">
                {totalScore} <span className="text-slate-400 font-normal text-[10px]">/ {maxPoints} pt</span>
              </span>
            </div>
          </div>

          {/* Submit / Simpan Progres Button */}
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={submitting}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition shadow-md select-none cursor-pointer ${
              submitting
                ? 'bg-slate-700 text-slate-300 cursor-wait'
                : (isFullyComplete || hasUploadedFile)
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/40 animate-pulse'
                : submitted
                ? 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-emerald-700/30'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-600/30'
            }`}
            title="Klik untuk menyimpan progres jawaban dan skor ke database Supabase agar bisa dilanjutkan kapan saja"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan ke Database...</span>
              </>
            ) : (isFullyComplete || hasUploadedFile) ? (
              <>
                <Send className="w-3.5 h-3.5 text-white" />
                <span>Kirim Tugas Akhir</span>
              </>
            ) : submitted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                <span>Simpan Pembaruan</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-white" />
                <span>Simpan Progres Tugas</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
