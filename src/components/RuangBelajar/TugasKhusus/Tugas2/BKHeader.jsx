import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Loader2,
  LogIn,
  AlertCircle,
  Award,
  Target,
  Sparkles,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BKHeader({
  user,
  totalScore = 0,
  submitted,
  submitting,
  previousSubmission,
  onOpenLogin,
  onResetAll,
  onSubmitAll,
}) {
  const navigate = useNavigate();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const percentage = Math.min(100, Math.max(0, totalScore));

  const onConfirmReset = () => {
    if (onResetAll) onResetAll();
    setShowConfirmReset(false);
  };

  return (
    <div className="space-y-3">
      {/* Top Header Card (Sama seperti SimulationTopBar Tugas 1) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 md:p-6 shadow-2xs space-y-4">
        {/* Top Line: Navigation & Badges */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => navigate('/ruang-belajar')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition shadow-2xs flex-shrink-0"
              id="btn-back-ruang-belajar-bk"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>

            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              Tugas 2 • Berpikir Komputasional
            </span>

            {user ? (
              <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                Siswa: <strong className="text-slate-900">{user.NAMA || user.nama}</strong> ({user.Kelas || user.kelas || '7A'})
              </span>
            ) : (
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                Mode Tamu (Latihan Mandiri)
              </span>
            )}
          </div>

          {!user && (
            <button
              type="button"
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs transition"
              id="btn-login-header-bk"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk Akun</span>
            </button>
          )}
        </div>

        {/* Middle Line: Title & Action Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          {/* Title Area */}
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-xl md:text-2xl font-extrabold text-slate-900 leading-snug">
              Petualangan Berpikir Komputasional
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed hidden sm:block">
              Algoritma (50%), Penjadwalan (10%), Struktur Data (20%), dan Representasi Data (20%).
            </p>
          </div>

          {/* Action Buttons Group */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Total Skor Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-2xl shadow-2xs select-none">
              <Target className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <div className="text-left">
                <div className="text-[10px] text-amber-700 font-medium leading-none">Skor Saat Ini</div>
                <div className="text-xs font-extrabold leading-tight text-amber-900">
                  {totalScore} <span className="text-amber-600 font-normal">/ 100 Poin</span>
                </div>
              </div>
            </div>

            {/* Reset Awal Button */}
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/90 rounded-2xl transition shadow-2xs select-none"
              title="Reset simulasi ke kondisi awal"
              id="btn-reset-bk-header"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              <span className="text-xs font-bold">Reset Awal</span>
            </button>

            {/* Cek & Kumpulkan Button (Fleksibel, bisa dikumpulkan kapan saja & diperbaiki kapan saja) */}
            <button
              type="button"
              onClick={onSubmitAll}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-sm shadow-emerald-600/20 transition disabled:opacity-50 flex-1 sm:flex-none cursor-pointer"
              id="btn-submit-bk-header"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>{submitting ? 'Menilai...' : 'Cek & Kumpulkan'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Line: Real-time Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              Progres Evaluasi Skor
            </span>
            <span className="font-extrabold text-slate-800">
              {percentage}% ({totalScore} / 100 Poin)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 sm:h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                totalScore === 100
                  ? 'bg-emerald-500'
                  : totalScore >= 50
                  ? 'bg-amber-500'
                  : 'bg-indigo-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Guest Mode Warning Banner */}
      {!user && (
        <div className="bg-amber-50 rounded-2xl border border-amber-200/90 p-3.5 flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Perhatian:</strong> Anda sedang dalam mode tamu. Anda bebas berlatih menyelesaikan 4 misi, namun nilai <strong>tidak akan tercatat di database</strong> sebelum Anda login.
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenLogin}
            className="font-bold text-indigo-700 hover:text-indigo-900 underline whitespace-nowrap"
          >
            Masuk Siswa &rarr;
          </button>
        </div>
      )}

      {/* Previous Submission Status Banner (Bisa diperbaiki kapan saja biar jadi 100%) */}
      {previousSubmission && (
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-3.5 flex items-center justify-between gap-3 text-xs text-emerald-900">
          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Tugas ini sudah tersimpan di akun Anda dengan skor <strong>{previousSubmission.nilai_akhir ?? previousSubmission.skor ?? 100} / 100 Poin</strong>. Anda dapat mengumpulkan ulang untuk memperbaiki skor kapan saja.
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-800 font-bold text-[10px]">
            Tersimpan
          </span>
        </div>
      )}

      {/* Confirmation Modal for Reset */}
      <AnimatePresence>
        {showConfirmReset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <RotateCcw className="w-6 h-6" />
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Reset Semua Misi?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Semua jawaban, langkah robot, dan jadwal yang telah Anda susun akan dikembalikan ke kondisi awal. Anda dapat mengerjakan kembali dari awal.
              </p>

              <div className="mt-6 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={onConfirmReset}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition"
                  id="btn-confirm-reset-bk"
                >
                  Ya, Reset Sekarang
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
