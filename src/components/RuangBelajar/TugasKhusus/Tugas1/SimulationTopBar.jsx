import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Loader2,
  LogIn,
  AlertCircle,
  Award,
  Target
} from 'lucide-react';

export default function SimulationTopBar({
  student,
  handleOpenLogin,
  previousSubmission,
  handleResetSimulation,
  handleSubmitSimulation,
  isSubmitting,
  evalResult,
  onOpenMissions
}) {
  const navigate = useNavigate();
  const passedCount = evalResult?.passedCount ?? 0;
  const totalCount = evalResult?.totalCount ?? 25;
  const totalScore = evalResult?.totalScore ?? 0;

  return (
    <div className="space-y-3">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Back & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/ruang-belajar')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition shadow-2xs flex-shrink-0"
            id="btn-back-ruang-belajar"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                Tugas 1 • Praktik Lab
              </span>
              {student ? (
                <span className="text-[11px] font-semibold text-slate-600">
                  Siswa: <strong className="text-slate-900">{student.NAMA || student.nama}</strong> ({student.Kelas || '7.1'})
                </span>
              ) : (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Mode Tamu (Latihan Mandiri)
                </span>
              )}
            </div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-800 line-clamp-1 mt-0.5">
              Simulasi Manajemen File & Struktur Direktori
            </h1>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-end">
          {/* Quick Mission Drawer Opener */}
          <button
            type="button"
            onClick={onOpenMissions}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100/90 border border-indigo-200/80 rounded-xl transition shadow-2xs select-none"
            id="btn-open-missions-topbar"
          >
            <Target className="w-3.5 h-3.5 text-indigo-600" />
            <span>Target Misi ({passedCount}/{totalCount})</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-indigo-600 text-white rounded font-extrabold ml-0.5">
              {totalScore}p
            </span>
          </button>

          {!student && (
            <button
              type="button"
              onClick={handleOpenLogin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs transition"
              id="btn-login-topbar"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk Akun</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleResetSimulation}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            title="Reset simulasi ke kondisi awal"
            id="btn-reset-topbar"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Awal</span>
          </button>

          <button
            type="button"
            onClick={handleSubmitSimulation}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
            id="btn-submit-topbar"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>{isSubmitting ? 'Menilai...' : 'Cek & Kumpulkan'}</span>
          </button>
        </div>
      </div>

      {/* Guest Mode Warning Banner */}
      {!student && (
        <div className="bg-amber-50 rounded-2xl border border-amber-200/90 p-3.5 flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Perhatian:</strong> Anda sedang dalam mode tamu. Anda bebas berlatih menyelesaikan 25 misi, namun nilai <strong>tidak akan tercatat di database</strong> sebelum Anda login.
            </span>
          </div>
          <button
            type="button"
            onClick={handleOpenLogin}
            className="font-bold text-indigo-700 hover:text-indigo-900 underline whitespace-nowrap"
          >
            Masuk Siswa &rarr;
          </button>
        </div>
      )}

      {/* Previous Submission Status if exists */}
      {previousSubmission && (
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-3.5 flex items-center justify-between gap-3 text-xs text-emerald-900">
          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Tugas ini sudah tersimpan di akun Anda dengan skor <strong>{previousSubmission.skor ?? 100} / 100 Poin</strong>. Anda dapat mengumpulkan ulang untuk memperbaiki skor kapan saja.
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-800 font-bold text-[10px]">
            Tuntas
          </span>
        </div>
      )}
    </div>
  );
}
