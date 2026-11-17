import React, { useState } from 'react';
import { PlusCircle, Clock, X, KeyRound } from 'lucide-react';

export default function ModalBuatRoomBaru({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [judulRoom, setJudulRoom] = useState('');
  const [durasiMenit, setDurasiMenit] = useState(80);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!judulRoom.trim()) {
      alert('Silakan masukkan nama room / skenario ulangan!');
      return;
    }
    const durasi = parseInt(durasiMenit, 10) || 80;
    onSubmit(judulRoom.trim(), durasi);
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative text-white">
        
        {/* Tombol Tutup X */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
            <PlusCircle size={22} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Buat Ruang Ulangan Baru</h3>
            <p className="text-xs text-slate-400">Sistem akan meng-generate Token PIN 5 digit acak.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          {/* Input Nama Room */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Nama Room / Kelas:
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Ulangan Informatika - Kelas 7.1"
              value={judulRoom}
              onChange={(e) => setJudulRoom(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition"
              autoFocus
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Nama ini akan muncul di Waiting Room siswa dan panel admin.
            </span>
          </div>

          {/* Input Durasi Menit */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Durasi Ujian:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={10}
                max={240}
                required
                value={durasiMenit}
                onChange={(e) => setDurasiMenit(e.target.value)}
                className="w-24 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-center text-sm font-bold text-amber-300 outline-none focus:border-amber-400"
              />
              <span className="text-xs text-slate-300 font-semibold">Menit (Default: 80 Mnt)</span>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <KeyRound size={14} />
              )}
              <span>Buat &amp; Buka Ruang Tunggu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

