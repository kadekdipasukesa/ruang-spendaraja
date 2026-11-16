import React from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Play, ShieldAlert, Sparkles, User, Settings } from 'lucide-react';

export default function TugasUlanganPinInput({
  value,
  onChange,
  onJoin,
  loading = false,
  siswa,
  isAdmin = false,
  onOpenAdminPanel,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value && value.trim().length > 0) {
      onJoin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 sm:p-6 text-white font-sans">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
      >
        {/* Glow ambient background */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon */}
        <div className="text-center mb-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
            <KeyRound className="text-white" size={32} />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-2">
            <Sparkles size={12} /> Tugas 7 • Ulangan Harian
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ruang Tunggu CBT
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Persiapan Tes Sumatif Ganjil — Paket Latihan Paralel
          </p>
        </div>

        {/* Siswa Card Ringkas */}
        {siswa && (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 mb-5 flex items-center gap-3 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-sm shrink-0">
              {siswa.No_Absen || <User size={18} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-slate-400">Login sebagai Siswa</p>
              <p className="font-bold text-sm text-white truncate">{siswa.NAMA}</p>
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-1 bg-slate-700 text-slate-300 rounded-lg">
              Kelas {siswa.Kelas || '7'}
            </span>
          </div>
        )}

        {/* Form Input PIN */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
              Masukkan Token / PIN Ujian
            </label>
            <input
              type="text"
              maxLength={8}
              value={value}
              onChange={(e) => onChange(e.target.value.toUpperCase().replace(/\s/g, ''))}
              placeholder="CONTOH: 7CUEO"
              className="w-full bg-slate-950/80 border-2 border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-2xl px-4 py-3.5 text-center text-2xl sm:text-3xl font-mono font-black text-blue-400 placeholder:text-slate-600 tracking-[0.3em] outline-none transition-all shadow-inner uppercase"
              autoFocus
            />
            <p className="text-[11px] text-slate-500 text-center mt-2">
              Minta kode token 5 karakter kepada Guru Pengawas di kelas.
            </p>
          </div>

          <button
            type="submit"
            disabled={!value || value.trim().length === 0 || loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2 text-sm">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                MEMERIKSA PIN...
              </span>
            ) : (
              <>
                <Play size={18} fill="currentColor" />
                <span>MASUK RUANG UJIAN</span>
              </>
            )}
          </button>
        </form>

        {/* Tombol Khusus Admin */}
        {isAdmin && (
          <div className="mt-5 pt-4 border-t border-slate-800 text-center relative z-10">
            <button
              type="button"
              onClick={onOpenAdminPanel}
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
            >
              <Settings size={14} />
              Buka Panel Pengawas / Admin Ujian
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

