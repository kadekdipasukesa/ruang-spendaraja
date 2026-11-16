import React from 'react';
import { Play, RefreshCw, Zap, Clock } from 'lucide-react';

export default function SesiCard({ sesi, pesertaCount, loading, onStart }) {
  return (
    <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Zap size={80} />
      </div>
      
      <p className="text-slate-500 font-bold text-xs uppercase mb-2">PIN Aktif</p>
      <h2 className="text-6xl font-black text-blue-500 mb-6 font-mono">{sesi.pin_ujian}</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between text-sm border-b border-white/5 pb-2">
          <span className="text-slate-400">Status</span>
          <span className="text-emerald-400 font-bold uppercase">{sesi.status}</span>
        </div>
        <div className="flex justify-between text-sm border-b border-white/5 pb-2">
          <span className="text-slate-400">Durasi</span>
          <span className="text-white font-bold flex items-center gap-1">
            <Clock size={14}/> {sesi.durasi_menit || 0} Menit
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Terhubung</span>
          <span className="text-white font-bold">{pesertaCount} Siswa</span>
        </div>
      </div>

      <button 
        disabled={sesi.status !== 'waiting' || loading}
        onClick={onStart}
        className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white p-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
      >
        {loading ? <RefreshCw className="animate-spin" /> : <Play fill="currentColor" />}
        MULAI UJIAN
      </button>
    </div>
  );
}