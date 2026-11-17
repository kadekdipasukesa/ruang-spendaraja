import React from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function AdminTopBar({
  loading,
  onRefresh,
  onClose,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-3xl shadow-xl">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          title="Kembali ke Layar Ujian"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
            PROCTORING CBT • GURU &amp; PENGAWAS
          </span>
          <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span>Panel Kontrol &amp; Live Monitoring Ujian</span>
            {loading && (
              <span className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            )}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Segarkan</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-blue-600/30"
        >
          Tutup Panel
        </button>
      </div>
    </div>
  );
}

