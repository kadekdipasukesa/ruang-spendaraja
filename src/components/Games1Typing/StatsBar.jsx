import React from 'react';
import { Timer, Zap } from 'lucide-react';

const StatsBar = ({ timeLeft, wpm }) => (
  <div className="flex justify-between gap-4 mb-6">
    <div className="flex-1 bg-slate-900/80 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
      <Timer className="text-blue-400" size={20} />
      <p className="text-xl font-black text-white">{timeLeft}s</p>
    </div>
    <div className="flex-1 bg-slate-900/80 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
      <Zap className="text-yellow-400" size={20} />
      <p className="text-xl font-black text-white">{wpm}</p>
    </div>
  </div>
);

export default StatsBar;