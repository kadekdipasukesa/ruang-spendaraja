import React from 'react';
import { Users } from 'lucide-react';

export default function WaitingRoom() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
        <Users size={80} className="text-blue-500 relative" />
      </div>
      <h1 className="text-white font-black text-3xl uppercase mb-2 tracking-tighter">Terhubung</h1>
      <p className="text-slate-500 mb-8 max-w-xs">Harap tenang dan jangan tinggalkan halaman ini sampai ujian dimulai.</p>
      <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-full flex items-center gap-3">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
        <span className="text-emerald-400 font-bold text-xs tracking-widest uppercase">Menunggu Guru Memulai...</span>
      </div>
    </div>
  );
}