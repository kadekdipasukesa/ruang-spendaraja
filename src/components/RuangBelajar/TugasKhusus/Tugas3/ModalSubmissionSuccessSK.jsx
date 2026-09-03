import { CheckCircle2, Award, ArrowRight, RotateCcw, ShieldCheck, Sparkles, X, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModalSubmissionSuccessSK({
  isOpen,
  onClose,
  totalScore = 0,
  scores = { m1: 0, m2: 0, m3: 0, m4: 0 },
  submissionMeta = {},
  student,
  onGoToRuangBelajar
}) {
  if (!isOpen) return null;

  const savedScore = submissionMeta?.savedScore ?? totalScore;
  const attemptScore = submissionMeta?.attemptScore ?? totalScore;
  const previousScore = submissionMeta?.previousScore ?? 0;
  const isRetained = submissionMeta?.isRetained;
  const isImproved = submissionMeta?.isImproved;
  const skippedDbSave = submissionMeta?.skippedDbSave;
  const isPerfect = savedScore >= 100;

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
                {skippedDbSave ? 'Proteksi Nilai Database' : 'Pengumpulan Berhasil'}
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
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-amber-500/30 rounded-2xl p-4 mb-4 text-center space-y-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                {isRetained ? 'Nilai Resmi Tercatat (Skor Tertinggi)' : 'Nilai Resmi Tercatat'}
              </p>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 my-1">
                {savedScore} <span className="text-lg font-bold text-slate-400">/ 100 Poin</span>
              </div>
            </div>

            {/* Score Comparison Note */}
            {isImproved && (
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 bg-emerald-950/60 border border-emerald-800/80 py-1.5 px-3 rounded-xl text-left">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {previousScore > 0
                    ? `Hebat! Nilai kamu meningkat dari ${previousScore}p menjadi ${savedScore}p.`
                    : `Selamat! Percobaan pertama berhasil meraih ${savedScore} Poin.`}
                </span>
              </div>
            )}

            {isRetained && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-amber-300 flex items-start gap-2.5 bg-amber-950/70 border border-amber-500/50 p-3 rounded-2xl text-left shadow-lg shadow-amber-950/40">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed space-y-1">
                    <p className="font-bold text-amber-200">
                      Pemberitahuan Proteksi Nilai Database:
                    </p>
                    <p className="text-amber-100/90">
                      Nilai di database sebelumnya (<strong className="text-amber-300 font-bold">{previousScore} Poin</strong>) lebih tinggi dari pengerjaan saat ini (<strong className="text-white font-bold">{attemptScore} Poin</strong>). Nilai di database <strong className="text-amber-300">TIDAK DI-REPLACE / DITIMPA</strong> dengan nilai yang lebih kecil. Nilai resmi terbaikmu ({previousScore} Poin) tetap aman!
                    </p>
                    <p className="text-[10px] text-amber-300/80 pt-0.5">
                      ✓ Posisi letak komponen & progres tugas tetap disimpan ke database agar dapat dilanjutkan kapan pun di perangkat lain.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Breakdown per Mission (Attempt Terkini) */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5 px-0.5">
              <span>Rincian Percobaan Saat Ini:</span>
              <span className="text-amber-400 font-bold">{attemptScore}/100 Poin</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-950/60 border border-slate-800 p-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block truncate">M1: Hardware</span>
                <span className="font-bold text-amber-400 text-xs">{scores.m1 || 0}/35p</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block truncate">M2: Data & App</span>
                <span className="font-bold text-amber-400 text-xs">{scores.m2 || 0}/20p</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block truncate">M3: Software</span>
                <span className="font-bold text-amber-400 text-xs">{scores.m3 || 0}/30p</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block truncate">M4: Etika TIK</span>
                <span className="font-bold text-amber-400 text-xs">{scores.m4 || 0}/15p</span>
              </div>
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
