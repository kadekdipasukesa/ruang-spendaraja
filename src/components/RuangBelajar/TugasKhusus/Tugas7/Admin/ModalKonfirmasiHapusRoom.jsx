import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ModalKonfirmasiHapusRoom({
  isOpen,
  onClose,
  onConfirm,
  room,
  pesertaCount = 0,
  loading = false,
}) {
  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-red-500/40 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative text-white">
        
        {/* Tombol Tutup X */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Hapus Room Ulangan?</h3>
            <p className="text-xs text-red-300 font-semibold">Tindakan ini tidak dapat dibatalkan!</p>
          </div>
        </div>

        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs text-slate-300 mb-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-slate-500">Kode Token PIN:</span>
            <span className="font-mono font-black text-amber-400 text-sm">{room.pin_ujian}</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-slate-500">Nama Room:</span>
            <span className="font-bold text-white truncate max-w-[200px]">{room.judul || 'Ulangan Harian'}</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-slate-500">Data Peserta:</span>
            <span className="font-bold text-red-400">{pesertaCount} Siswa terdaftar</span>
          </div>
          <p className="text-[11px] text-red-200/80 pt-1 leading-relaxed">
            Menghapus room ini akan <strong>menghapus bersih seluruh data peserta dan riwayat jawaban</strong> siswa yang terhubung di room ini dari database server.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-red-700/30 cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            <span>Hapus Permanen Room</span>
          </button>
        </div>
      </div>
    </div>
  );
}

