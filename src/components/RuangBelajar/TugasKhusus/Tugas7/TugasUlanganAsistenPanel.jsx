import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, X, Lightbulb, Info } from 'lucide-react';

export default function TugasUlanganAsistenPanel({
  soal,
  currentIndex = 0,
  isOpen = true,
  onClose,
}) {
  if (!isOpen) return null;

  const bahanBacaan = soal?.bahan_bacaan || {
    judul: 'Konsep Dasar Informatika',
    konten: 'Bacalah soal dengan cermat dan gunakan logika berpikir komputasional secara terstruktur.'
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
      className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 text-white shadow-xl flex flex-col h-full relative"
    >
      {/* Header Panel Asisten */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="font-black text-xs sm:text-sm text-slate-100 flex items-center gap-1.5">
              <span>Asisten Materi Belajar</span>
            </h4>
            <p className="text-[10px] text-slate-400">
              Konsep Teori Soal No. {currentIndex + 1}
            </p>
          </div>
        </div>

        {/* Tombol Tutup Panel (Mobile friendly) */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            title="Tutup Panel Asisten"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Konten Materi Bacaan */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
        {/* Judul Topik */}
        <div className="bg-blue-950/40 border border-blue-900/60 rounded-2xl p-3.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block mb-1">
            Topik Pembelajaran
          </span>
          <h5 className="font-bold text-sm text-slate-100 leading-snug">
            {bahanBacaan.judul}
          </h5>
        </div>

        {/* Paragraf Bacaan Pendamping */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs leading-relaxed text-slate-300">
          <p className="whitespace-pre-line text-slate-300">
            {bahanBacaan.konten}
          </p>
        </div>

        {/* Catatan Edukatif */}
        <div className="bg-amber-950/20 border border-amber-900/40 rounded-2xl p-3 flex items-start gap-2.5 text-[11px] text-amber-200/90">
          <Lightbulb size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <p>
            Gunakan bahan bacaan ini untuk memahami konsep atau alur perhitungan tanpa membocorkan langsung jawaban soal.
          </p>
        </div>
      </div>
    </motion.aside>
  );
}

