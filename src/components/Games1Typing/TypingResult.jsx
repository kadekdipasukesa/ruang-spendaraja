import React from 'react';
import { Trophy, RotateCcw } from 'lucide-react';

const TypingResult = ({ wpm, accuracy, onRetry }) => (
  <div className="text-center py-6 animate-in zoom-in-95">
    <Trophy className={accuracy >= 90 ? "mx-auto text-yellow-500 mb-4" : "mx-auto text-slate-500 mb-4"} size={60} />
    <h2 className="text-3xl font-black text-white mb-1">
      {accuracy >= 90 ? "SKOR VALID!" : "GUGUR!"}
    </h2>
    <div className="grid grid-cols-2 gap-4 my-8">
      <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">WPM</p>
        <p className="text-3xl font-black text-blue-400">{wpm}</p>
      </div>
      <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">AKURASI</p>
        <p className={`text-3xl font-black ${accuracy >= 90 ? 'text-green-400' : 'text-red-500'}`}>{accuracy}%</p>
      </div>
    </div>
    <button onClick={onRetry} className="flex items-center gap-2 mx-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg">
      <RotateCcw size={18} /> Coba Lagi
    </button>
  </div>
);

export default TypingResult;