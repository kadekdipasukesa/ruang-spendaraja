import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, ShieldCheck, Sparkles, AlertCircle, Settings, Play } from 'lucide-react';

export default function TugasUlanganWaitingRoom({
  sesi,
  pesertaCount = 0,
  daftarPeserta = [],
  siswa,
  isAdmin = false,
  onOpenAdminPanel,
  onStartByAdmin,
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 text-center"
      >
        {/* Animated Icon */}
        <div className="relative mb-6 mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl animate-pulse" />
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Users size={36} className="text-white" />
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          Terhubung ke Server Ujian
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
          {sesi?.judul || 'Ulangan Harian Informatika'}
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-md mx-auto">
          Harap tenang dan jangan keluar dari halaman ini. Ujian akan dimulai serentak oleh Guru Pengawas.
        </p>

        {/* Info Box: PIN, Durasi, Siswa */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 my-6 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Token PIN</span>
            <span className="text-xl sm:text-2xl font-mono font-black text-blue-400 tracking-wider">
              {sesi?.pin_ujian || '—'}
            </span>
          </div>
          <div className="text-center border-x border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Durasi</span>
            <span className="text-base sm:text-lg font-black text-slate-200 flex items-center justify-center gap-1 mt-1">
              <Clock size={14} className="text-amber-400" /> {sesi?.durasi_menit || 90} Mnt
            </span>
          </div>
          <div className="text-center">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Peserta Online</span>
            <span className="text-xl sm:text-2xl font-mono font-black text-emerald-400">
              {pesertaCount}
            </span>
          </div>
        </div>

        {/* Aturan & Anti-Cheat Info */}
        <div className="text-left bg-blue-950/30 border border-blue-900/50 rounded-2xl p-4 mb-6 space-y-2 text-xs text-slate-300">
          <p className="font-bold text-blue-300 flex items-center gap-1.5">
            <ShieldCheck size={16} /> Ketentuan Keamanan Ulangan:
          </p>
          <ul className="space-y-1.5 pl-5 list-disc text-slate-400">
            <li>Saat ujian dimulai, tampilan akan otomatis beralih ke <strong>Mode Layar Penuh (Fullscreen)</strong>.</li>
            <li>Dilarang membuka tab lain, berpindah aplikasi, atau keluar dari fullscreen.</li>
            <li>Sistem mencatat maksimal <strong>3 kali toleransi pelanggaran</strong> sebelum ujian terkunci otomatis.</li>
            <li>Di setiap soal disediakan <strong>Panel Asisten Materi</strong> untuk membantu pemahaman konsep.</li>
          </ul>
        </div>

        {/* Live Status Animation */}
        <div className="flex items-center justify-center gap-3 py-2 text-slate-400 text-xs font-semibold">
          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" />
          <span>Menunggu aba-aba Guru Pengawas...</span>
        </div>

        {/* Tombol Aksi Khusus Admin */}
        {isAdmin && (
          <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onStartByAdmin}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-emerald-700/30"
            >
              <Play size={16} fill="currentColor" /> Mulai Ujian Sekarang (Admin)
            </button>
            <button
              type="button"
              onClick={onOpenAdminPanel}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold rounded-xl transition flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <Settings size={15} /> Panel Pengawas
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

