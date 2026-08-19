import { useNavigate } from 'react-router-dom';
import { Award, CheckCircle2, AlertCircle, LogIn, X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ModalSubmissionSuccess({
  isOpen,
  onClose,
  evalResult,
  student,
  handleOpenLogin
}) {
  const navigate = useNavigate();

  if (!isOpen || !evalResult) return null;

  const { totalScore, passedCount, totalCount, percentage } = evalResult;

  let gradeLabel = 'Perlu Latihan';
  let gradeColor = 'bg-amber-100 text-amber-800 border-amber-200';
  if (totalScore >= 90) {
    gradeLabel = 'Sempurna (A+)';
    gradeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  } else if (totalScore >= 75) {
    gradeLabel = 'Sangat Baik (A)';
    gradeColor = 'bg-indigo-100 text-indigo-800 border-indigo-200';
  } else if (totalScore >= 60) {
    gradeLabel = 'Cukup Baik (B)';
    gradeColor = 'bg-blue-100 text-blue-800 border-blue-200';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl text-center space-y-4"
      >
        {/* Award Icon */}
        <div
          className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
            student?.id ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
          }`}
        >
          <Award className="w-8 h-8" />
        </div>

        <div>
          <span
            className={`px-3 py-0.5 rounded-full text-xs font-bold inline-block mb-2 border ${gradeColor}`}
          >
            {student?.id ? `Evaluasi Nilai: ${gradeLabel}` : 'Latihan Mandiri (Mode Tamu)'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            Skor Anda: <span className="text-indigo-600">{totalScore}</span> / 100 Poin
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Menuntaskan <strong>{passedCount}</strong> dari {totalCount} Target Misi ({percentage}%).
          </p>
        </div>

        {/* Database Sync Status */}
        {student?.id ? (
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 text-left flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Hasil Berhasil Disimpan ke Akun!</strong>
              <span>
                Nilai telah tercatat di basis data <strong>tugas_pengumpulan</strong> dan disinkronkan ke akumulasi poin serta papan peringkat kelas Anda.
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 text-left">
            <div className="flex items-start gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <strong className="font-bold">Skor Belum Tersimpan ke Database:</strong>
            </div>
            <p className="text-slate-600 text-[11px] pl-6">
              Karena Anda belum masuk akun siswa resmi, skor ini tidak dicatat di sistem sekolah. Masuk sekarang agar pencapaian Anda tercatat secara resmi.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2.5 pt-2 flex-wrap">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            Lanjut Simulasi
          </button>

          {student?.id ? (
            <button
              type="button"
              onClick={() => navigate('/ruang-belajar')}
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs transition"
            >
              Lihat di Timeline Belajar
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                handleOpenLogin();
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk Akun Siswa</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
