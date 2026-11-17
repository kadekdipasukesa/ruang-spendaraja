import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, ShieldCheck, Sparkles } from 'lucide-react';

export default function ModalPromptFullscreen({
  isOpen,
  onEnterFullscreen,
  namaSiswa = '',
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[95] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-lg bg-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl relative space-y-6"
        >
          {/* Animated Glow Halo */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-500 mx-auto flex items-center justify-center shadow-xl shadow-blue-500/30">
            <Maximize2 size={40} className="text-white animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <ShieldCheck size={13} />
              Sistem Pengawasan CBT Aktif
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Aktifkan Mode Layar Penuh
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              Halo {namaSiswa || 'Siswa'}, ulangan resmi telah dimulai! Demi ketertiban dan pencegahan kecurangan, ulangan wajib dikerjakan dalam mode <strong className="text-blue-300">Layar Penuh (Fullscreen)</strong>.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl text-left text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Aturan Selama Ulangan Berlangsung:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-400">
              <li>Dilarang keluar dari layar penuh atau menekan tombol ESC / Windows.</li>
              <li>Dilarang berpindah tab browser atau membuka aplikasi lain.</li>
              <li>Pelanggaran maksimal 3 kali akan mengunci ujian secara permanen.</li>
            </ul>
          </div>

          {/* Tombol Utama Interaksi Langsung (User Gesture untuk Chrome) */}
          <button
            type="button"
            onClick={onEnterFullscreen}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 border border-blue-400/40 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-blue-600/30 active:scale-98 cursor-pointer"
          >
            <Maximize2 size={18} />
            <span>Masuk Layar Penuh & Mulai Ujian</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

