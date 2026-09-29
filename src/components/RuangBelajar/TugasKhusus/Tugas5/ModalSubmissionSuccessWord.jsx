import { Award, CheckCircle2, ArrowRight, X, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ModalSubmissionSuccessWord({
  isOpen = false,
  onClose,
  totalScore = 0,
  maxPoints = 100,
  scoreTahap1 = 0,
  scoreTahap2 = 0,
  scoreTahap3 = 0,
  fileUrl = '',
  scoreProtectionNotice = null,
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 text-center relative overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon Badge */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Pengumpulan Berhasil Terverifikasi
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
            Luar Biasa, Karyamu Tersimpan!
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Data pengerjaan panduan 7 langkah, kuis, dan berkas naskah dokumenmu telah resmi tersimpan di database Supabase.
          </p>
        </div>

        {/* Score Breakdown Card */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 text-left space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Tahap 1: Panduan Praktik (7 Langkah)</span>
            <span className="font-bold text-white">{scoreTahap1} / 14 pt</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Tahap 2: Kuis Fitur Ms. Word (5 Soal)</span>
            <span className="font-bold text-white">{scoreTahap2} / 26 pt</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Tahap 3: Proyek Praktik Dokumen .docx</span>
            <span className="font-bold text-white">{scoreTahap3} / 60 pt</span>
          </div>

          <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">Total Skor Akhir:</span>
            <span className="text-base font-black text-amber-300">
              {totalScore} <span className="text-xs font-normal text-slate-400">/ {maxPoints} Poin</span>
            </span>
          </div>
        </div>

        {/* Score Protection Notice (jika ada nilai lama yang lebih tinggi) */}
        {scoreProtectionNotice && (
          <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/40 text-left text-xs text-blue-200 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Proteksi Nilai Tertinggi Aktif:</span>
              <span>
                Nilai resmi di database tetap mempertahankan skor terbaikmu (<strong>{scoreProtectionNotice.savedScore} pt</strong>)
                karena lebih tinggi dari percobaan saat ini ({scoreProtectionNotice.currentScore} pt).
              </span>
            </div>
          </div>
        )}

        {/* File Link */}
        {fileUrl && (
          <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <span>Tersimpan di Cloudinary:</span>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-bold underline inline-flex items-center gap-1"
            >
              <span>Buka Dokumen</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition border border-slate-700"
          >
            Tutup Dialog
          </button>
          <button
            type="button"
            onClick={() => navigate('/ruang-belajar')}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black transition shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5"
          >
            <span>Lihat Peringkat Kelas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
