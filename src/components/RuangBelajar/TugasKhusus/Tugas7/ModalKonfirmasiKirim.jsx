import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2, HelpCircle, Send, X, ArrowLeft, Loader2 } from 'lucide-react';

export default function ModalKonfirmasiKirim({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
  totalSoal = 50,
  answeredCount = 0,
  raguCount = 0,
  siswa = null,
}) {
  if (!isOpen) return null;

  const belumDijawab = Math.max(0, totalSoal - answeredCount);
  const isAllAnswered = belumDijawab === 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative text-white space-y-5 my-auto"
        >
          {/* Tombol Tutup X */}
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/80 transition cursor-pointer disabled:opacity-50"
            title="Batal dan tutup"
          >
            <X size={18} />
          </button>

          {/* Header Ikon Status */}
          <div className="text-center pt-2">
            <div
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-xl ${
                isAllAnswered
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-emerald-500/20'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-amber-500/20'
              }`}
            >
              {isAllAnswered ? (
                <CheckCircle2 size={36} className="animate-pulse" />
              ) : (
                <AlertTriangle size={36} className="animate-bounce" />
              )}
            </div>

            <h3 className="text-xl font-black text-white tracking-tight">
              {isAllAnswered ? 'Kumpulkan Jawaban Ujian?' : 'Masih Ada Soal Belum Terjawab!'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              {isAllAnswered
                ? 'Semua butir soal telah kamu isi. Pastikan kamu sudah yakin sebelum mengirimkannya ke sistem penilaian.'
                : `Masih terdapat ${belumDijawab} butir soal yang masih kosong. Soal yang tidak diisi akan memperoleh skor 0 poin.`}
            </p>
          </div>

          {/* Kartu Ringkasan Pengerjaan */}
          <div className="grid grid-cols-3 gap-2.5 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/90 text-center">
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                Terjawab
              </span>
              <span className="text-xl font-black text-emerald-300 font-mono">
                {answeredCount}
              </span>
              <span className="text-[10px] text-slate-500 block">/ {totalSoal}</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${
                  belumDijawab > 0 ? 'text-amber-400' : 'text-slate-400'
                }`}
              >
                Kosong
              </span>
              <span
                className={`text-xl font-black font-mono ${
                  belumDijawab > 0 ? 'text-amber-400' : 'text-slate-400'
                }`}
              >
                {belumDijawab}
              </span>
              <span className="text-[10px] text-slate-500 block">butir</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${
                  raguCount > 0 ? 'text-yellow-400' : 'text-slate-400'
                }`}
              >
                Ragu-ragu
              </span>
              <span
                className={`text-xl font-black font-mono ${
                  raguCount > 0 ? 'text-yellow-300' : 'text-slate-400'
                }`}
              >
                {raguCount}
              </span>
              <span className="text-[10px] text-slate-500 block">butir</span>
            </div>
          </div>

          {/* Info Peringatan Tambahan */}
          <div className="bg-blue-950/30 border border-blue-900/40 rounded-2xl p-3 flex items-start gap-2.5 text-left text-xs text-blue-200">
            <HelpCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Setelah dikirim, jawaban Anda akan <strong className="text-white">langsung dievaluasi otomatis</strong> dan skor resmi tersimpan di buku nilai. Ujian tidak dapat diulang kembali.
            </p>
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 hover:text-white rounded-2xl font-bold text-xs sm:text-sm border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft size={16} />
              <span>Periksa Lagi</span>
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-lg disabled:opacity-60 text-white ${
                isAllAnswered
                  ? 'bg-emerald-600 hover:bg-emerald-500 border border-emerald-400 shadow-emerald-600/30'
                  : 'bg-amber-600 hover:bg-amber-500 border border-amber-400 shadow-amber-600/30'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>{isAllAnswered ? 'Ya, Kirim Sekarang' : 'Tetap Kirimkan'}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

