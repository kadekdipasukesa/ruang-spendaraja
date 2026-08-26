import { Award, CheckCircle2, Sparkles, ArrowRight, Zap, Target, X, ShieldCheck, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModalSubmissionSuccessBK({
  isOpen,
  onClose,
  totalScore = 0,
  scores = { m1: 0, m2: 0, m3: 0, m4: 0 },
  submissionMeta = {},
  student,
  onGoToRuangBelajar,
}) {
  if (!isOpen) return null;

  const savedScore = submissionMeta?.savedScore ?? totalScore;
  const attemptScore = submissionMeta?.attemptScore ?? totalScore;
  const previousScore = submissionMeta?.previousScore ?? 0;
  const isRetained = submissionMeta?.isRetained;
  const isImproved = submissionMeta?.isImproved;
  const isPerfect = savedScore >= 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl shadow-amber-500/10 text-slate-100 overflow-hidden"
        >
          {/* Glowing Ambient Backdrop */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-400 p-0.5 shadow-xl shadow-amber-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-amber-400">
                <Award className="w-8 h-8 animate-bounce" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" /> Tugas 2 Berhasil Tersimpan & Masuk Log
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {isPerfect
                  ? 'Sempurna! 100 Poin Penuh'
                  : isRetained
                  ? 'Nilai Terbaik Tetap Dipertahankan!'
                  : isImproved
                  ? 'Rekor Skor Baru Tersimpan!'
                  : 'Nilai Berhasil Tersimpan!'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Nilai dan audit trail log poin telah disinkronkan langsung ke profilmu dan Log Skor Ruang Belajar.
              </p>
            </div>

            {/* Score Big Display Card */}
            <div className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 block text-left">Skor Resmi Tersimpan</span>
                  {isRetained && (
                    <span className="text-[10px] text-amber-400 font-semibold block text-left">
                      (Nilai tertinggi dari percobaanmu)
                    </span>
                  )}
                </div>
                <span className="text-2xl font-black text-amber-400 tracking-tight">
                  {savedScore} <span className="text-sm font-normal text-slate-500">/ 100 Poin</span>
                </span>
              </div>

              {/* Notice jika percobaan ke-2 lebih kecil */}
              {isRetained && (
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-left text-xs text-indigo-200 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    Skor percobaan saat ini adalah <strong>{attemptScore} Poin</strong>. Karena kamu pernah meraih <strong>{previousScore} Poin</strong> sebelumnya, maka sistem otomatis menjaga nilai terbesarmu!
                  </span>
                </div>
              )}

              {/* Notice jika skor meningkat */}
              {isImproved && previousScore > 0 && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-left text-xs text-emerald-200 flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Hebat! Skormu berhasil naik dari <strong>{previousScore} Poin</strong> menjadi <strong>{savedScore} Poin</strong>!
                  </span>
                </div>
              )}

              {/* Breakdown 4 Misi */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-slate-400">M1: Algoritma</div>
                  <div className="font-bold text-amber-400">{scores.m1 || 0}/50p</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-slate-400">M2: Jadwal</div>
                  <div className="font-bold text-amber-400">{scores.m2 || 0}/10p</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-slate-400">M3: Struktur</div>
                  <div className="font-bold text-amber-400">{scores.m3 || 0}/20p</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-slate-400">M4: Biner/Logika</div>
                  <div className="font-bold text-amber-400">{scores.m4 || 0}/20p</div>
                </div>
              </div>
            </div>

            {/* Notice: Bisa diperbaiki kapan saja */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left text-xs text-amber-200 w-full flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Catatan Fleksibel:</strong> Jawabanmu otomatis tersimpan. Kamu bisa lanjut berlatih atau memperbaiki bagian yang belum sempurna kapan saja untuk mencapai 100 Poin!
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                Lanjut Latihan
              </button>
              <button
                type="button"
                onClick={onGoToRuangBelajar}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Lihat Log Skor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

