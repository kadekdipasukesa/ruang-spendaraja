import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Maximize2, ShieldAlert } from 'lucide-react';

export default function TugasUlanganPauseDialog({
  isOpen = false,
  cheatCount = 1,
  maxCheat = 3,
  reason = 'umum',
  onResumeFullscreen,
}) {
  if (!isOpen) return null;

  const getReasonDetail = () => {
    switch (reason) {
      case 'split_screen':
        return {
          title: 'Layar Belah (Split Screen) Terdeteksi!',
          badge: 'Pelanggaran: Layar Belah',
          desc: 'Sistem mendeteksi mode Layar Belah (Split Screen) aktif di HP Anda. Harap tutup aplikasi lain dan gunakan satu layar penuh untuk melanjutkan ujian.',
        };
      case 'window_blur':
        return {
          title: 'Fokus Jendela Ujian Terputus!',
          badge: 'Pelanggaran: Buka Jendela Lain',
          desc: 'Sistem mendeteksi kursor atau aktivitas berpindah ke aplikasi/jendela lain di Windows (lebih dari 1 detik). Harap tetap berada di dalam jendela ujian.',
        };
      case 'tab_hidden':
        return {
          title: 'Pindah Tab Browser Terdeteksi!',
          badge: 'Pelanggaran: Pindah Tab',
          desc: 'Sistem mendeteksi Anda beralih ke tab browser lain. Dilarang membuka tab lain selama ujian berlangsung.',
        };
      case 'fullscreen_exit':
        return {
          title: 'Keluar Dari Layar Penuh!',
          badge: 'Pelanggaran: Keluar Fullscreen',
          desc: 'Sistem mendeteksi Anda keluar dari mode layar penuh (Fullscreen). Harap kembali ke mode layar penuh untuk melanjutkan.',
        };
      default:
        return {
          title: 'Ujian Dijeda Sementara!',
          badge: `Pelanggaran Ke-${cheatCount} dari ${maxCheat}`,
          desc: 'Sistem mendeteksi Anda keluar dari mode layar penuh (Fullscreen) atau beralih ke jendela/tab lain. Timer ujian tetap berjalan.',
        };
    }
  };

  const reasonInfo = getReasonDetail();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-lg bg-slate-900 border-2 border-red-500 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden text-white"
        >
          {/* Top warning ribbon */}
          <div className="absolute top-0 inset-x-0 bg-red-600 py-1.5 text-center text-[11px] font-black uppercase tracking-widest text-white">
            Peringatan Keamanan Sistem CBT
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mt-4 mb-4 border border-red-500/30 animate-pulse">
            <ShieldAlert size={40} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-black uppercase tracking-wider">
              Pelanggaran Ke-{cheatCount} dari {maxCheat}
            </span>
            {reason !== 'umum' && (
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                {reasonInfo.badge}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {reasonInfo.title}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm my-4 leading-relaxed max-w-md mx-auto">
            {reasonInfo.desc}
            <span className="block mt-2 text-slate-400 text-[11px]">
              Timer ujian tetap berjalan. Jika pelanggaran mencapai <strong>{maxCheat} kali</strong>, akun Anda akan <strong>terkunci otomatis</strong>.
            </span>
          </p>

          <div className="bg-red-950/40 border border-red-800/60 rounded-2xl p-3.5 mb-6 text-xs text-red-200 text-left space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle size={14} className="shrink-0" /> Ketentuan Pengawasan:
            </p>
            <p className="text-red-300/80">
              Setiap aktivitas keluar jendela dicatat langsung secara realtime di layar Guru Pengawas.
            </p>
          </div>

          <button
            type="button"
            onClick={onResumeFullscreen}
            className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-red-900/40 flex items-center justify-center gap-2.5 text-sm sm:text-base cursor-pointer active:scale-98"
          >
            <Maximize2 size={18} />
            <span>KEMBALI KE FULLSCREEN &amp; LANJUTKAN</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

