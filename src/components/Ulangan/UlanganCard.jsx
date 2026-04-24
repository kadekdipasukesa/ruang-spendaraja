import React from 'react';
import { PencilLine, Clock, ArrowRight } from 'lucide-react';

const UlanganCard = ({ title, subject, time, status, onPress }) => {
  return (
    <div 
      onClick={onPress} // Pindahkan ke sini agar seluruh kartu bisa diklik
      className="group relative overflow-hidden bg-slate-900/50 border border-white/10 p-5 rounded-3xl hover:border-amber-500/50 transition-all duration-300 shadow-xl cursor-pointer active:scale-95 select-none"
    >
      {/* Glow Effect saat Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-900 transition-all duration-300">
          <PencilLine size={24} />
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          status === 'Aktif' ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' : 'bg-slate-800 text-slate-500'
        }`}>
          {status}
        </span>
      </div>
      
      <div className="relative z-10">
        <h4 className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">{subject}</h4>
        <h3 className="text-xl font-black text-white italic mb-4 group-hover:text-amber-400 transition-colors">{title}</h3>
      </div>
      
      <div className="flex items-center justify-between border-t border-white/5 pt-4 relative z-10">
        <div className="flex items-center gap-2 text-slate-400">
          <Clock size={14} />
          <span className="text-xs font-medium">{time} Menit</span>
        </div>
        
        {/* Tombol diganti menjadi Div karena onClick sudah dihandle oleh Parent Div */}
        <div className="flex items-center gap-2 text-amber-500 font-bold text-xs group-hover:gap-3 transition-all">
          MULAI <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
};

export default UlanganCard;