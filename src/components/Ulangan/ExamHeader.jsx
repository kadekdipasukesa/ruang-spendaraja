import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

export default function ExamHeader({ cheatCount, currentIndex, totalSoal }) {
  return (
    <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center bg-slate-900/80 backdrop-blur-md p-4 rounded-3xl border border-white/5 sticky top-4 z-30">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${cheatCount > 0 ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-500'}`}>
          <AlertTriangle size={18} />
        </div>
        <div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Pelanggaran</p>
          <p className={`font-black text-sm ${cheatCount > 1 ? 'text-red-500' : 'text-white'}`}>{cheatCount} / 3</p>
        </div>
      </div>
      <div className="bg-black/30 px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-3">
        <Clock size={16} className="text-blue-400" />
        <span className="font-mono font-black text-blue-400">45:00</span>
      </div>
      <div className="text-right">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Progress</p>
        <p className="font-black text-sm text-white">{currentIndex + 1} <span className="text-slate-600">/ {totalSoal}</span></p>
      </div>
    </div>
  );
}