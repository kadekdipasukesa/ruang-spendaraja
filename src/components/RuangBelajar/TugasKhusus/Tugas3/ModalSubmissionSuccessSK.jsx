import { CheckCircle2, Award, ArrowRight, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModalSubmissionSuccessSK({
  isOpen,
  onClose,
  totalScore,
  scores,
  submissionMeta,
  student,
  onGoToRuangBelajar
}) {
  if (!isOpen) return null;

  const { savedScore, attemptScore, previousScore, isRetained, isImproved } = submissionMeta || {};

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl shadow-amber-500/10 text-slate-100 relative overflow-hidden"
        >
          {/* Top Decorative Glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>

          {/* Icon Header */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                Pengumpulan Berhasil
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">Tugas 3 Tersimpan Resmi</h2>
            </div>
          </div>

          {/* Student Info Box */}
          <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-3.5 mb-4 text-xs">
            <div className="flex justify-between items-center text-slate-400 mb-1">
              <span>Nama Siswa</span>
              <span className="font-bold text-white">{student?.NAMA || student?.nama || 'Siswa Spendaraja'}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 mb-1">
              <span>Kelas & No Absen</span>
              <span className="font-semibold text-slate-300">
                {student?.Kelas || student?.KELAS || '-'} • No {student?.['No Absen'] || student?.no_absen || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>NISN</span>
              <span className="font-mono text-slate-400">{student?.NISN || student?.nisn || '-'}</span>
            </div>
          </div>

          {/* Score Summary Box */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-amber-500/30 rounded-2xl p-4 mb-4 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Nilai Resmi Tercatat</p>
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 my-1">
              {savedScore ?? totalScore} <span className="text-lg font-bold text-slate-400">/ 100</span>
            </div>

            {/* Score Comparison Note */}
            {isImproved && (
              <div className="mt-2 text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 bg-emerald-950/50 border border-emerald-800/60 py-1 px-2.5 rounded-xl">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hebat! Nilai kamu meningkat dari {previousScore}p menjadi {savedScore}p.</span>
              </div>
            )}

            {isRetained && (
              <div className="mt-2 text-xs font-semibold text-amber-300 flex items-center justify-center gap-1.5 bg-amber-950/50 border border-amber-800/60 py-1 px-2.5 rounded-xl">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Skor tertinggi kamu ({savedScore}p) tetap dipertahankan aman!</span>
              </div>
            )}
          </div>

          {/* Breakdown per Mission */}
          <div className="grid grid-cols-2 gap-2 mb-5 text-xs">
            <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl flex justify-between items-center">
              <span className="text-slate-400 truncate">M1: Hardware</span>
              <span className="font-bold text-amber-400">{scores.m1 || 0}/35p</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl flex justify-between items-center">
              <span className="text-slate-400 truncate">M2: Data & App</span>
              <span className="font-bold text-amber-400">{scores.m2 || 0}/20p</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl flex justify-between items-center">
              <span className="text-slate-400 truncate">M3: Software</span>
              <span className="font-bold text-amber-400">{scores.m3 || 0}/30p</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl flex justify-between items-center">
              <span className="text-slate-400 truncate">M4: Etika TIK</span>
              <span className="font-bold text-amber-400">{scores.m4 || 0}/15p</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={onClose}
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Lanjut Belajar / Perbaiki</span>
            </button>

            <button
              onClick={onGoToRuangBelajar}
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
            >
              <span>Buka Ruang Belajar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
