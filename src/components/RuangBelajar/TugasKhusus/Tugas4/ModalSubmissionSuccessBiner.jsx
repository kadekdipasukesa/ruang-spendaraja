import { CheckCircle2, Award, ArrowRight, ShieldCheck, Sparkles, X, Binary, Cpu, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModalSubmissionSuccessBiner({
  isOpen,
  onClose,
  totalScore = 0,
  scores = { stage2: 0, stage3: 0, stage4: 0 },
  student,
  onGoToRuangBelajar
}) {
  if (!isOpen) return null;

  const isPerfect = totalScore >= 50;

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
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon Header */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                Pengumpulan Berhasil
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">Tugas 4 Tersimpan Resmi</h2>
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
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-amber-500/30 rounded-2xl p-4 mb-4 text-center space-y-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Nilai Resmi Tercatat di Database
              </p>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 my-1">
                {totalScore} <span className="text-lg font-bold text-slate-400">/ 50 Poin</span>
              </div>
            </div>

            {isPerfect ? (
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 bg-emerald-950/60 border border-emerald-800/80 py-1.5 px-3 rounded-xl">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sempurna! Semua tantangan biner & kode ASCII dituntaskan dengan gemilang.</span>
              </div>
            ) : (
              <div className="text-xs text-slate-300 bg-slate-900/80 border border-slate-800 py-1.5 px-3 rounded-xl">
                Nilai berhasil diamankan di cloud. Kamu tetap bisa mengulang latihan tanpa takut nilai terbaikmu turun.
              </div>
            )}
          </div>

          {/* Breakdown per Tahap */}
          <div className="space-y-2 mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Rincian Skor Tahapan:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl text-center">
                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold mb-1">
                  <Binary className="w-3 h-3 text-amber-400" />
                  <span>Tahap 2</span>
                </div>
                <div className="text-sm font-black text-white font-mono">{scores.stage2} / 15</div>
                <span className="text-[9px] text-slate-500">Desimal ke Biner</span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl text-center">
                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold mb-1">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  <span>Tahap 3</span>
                </div>
                <div className="text-sm font-black text-white font-mono">{scores.stage3} / 15</div>
                <span className="text-[9px] text-slate-500">Biner ke Desimal</span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl text-center">
                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold mb-1">
                  <FileCode className="w-3 h-3 text-purple-400" />
                  <span>Tahap 4</span>
                </div>
                <div className="text-sm font-black text-white font-mono">{scores.stage4} / 20</div>
                <span className="text-[9px] text-slate-500">ASCII ke Biner</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
            >
              Tetap di Sini
            </button>
            <button
              type="button"
              onClick={onGoToRuangBelajar}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Ke Ruang Belajar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
