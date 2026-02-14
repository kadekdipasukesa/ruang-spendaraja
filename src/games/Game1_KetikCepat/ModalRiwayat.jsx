import React from 'react';
import { X, Calendar, Zap, Target } from 'lucide-react';

export default function ModalRiwayat({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex justify-center items-center p-4">
      <div className="bg-[#1e293b] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50 rounded-t-3xl">
          <div>
            <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Riwayat Skor</h3>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Aktivitas Terakhir Anda</p>
          </div>
          <button 
            onClick={onClose} 
            className="bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 p-2 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {data.length > 0 ? (
            data.map((h, i) => (
              <div 
                key={i} 
                className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 flex justify-between items-center hover:border-blue-500/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${h.status === 'VALID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">
                      {new Date(h.created_at).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'short', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    <p className={`text-[10px] font-black tracking-widest ${h.status === 'VALID' ? 'text-emerald-500' : 'text-red-400'}`}>
                      {h.status}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="flex items-center gap-1 text-[9px] text-slate-500 font-bold justify-end uppercase"><Zap size={10}/> WPM</span>
                    <span className="text-white font-black text-lg group-hover:text-blue-400 transition-colors">{h.wpm}</span>
                  </div>
                  <div className="text-right w-12 border-l border-white/5 pl-4">
                    <span className="flex items-center gap-1 text-[9px] text-slate-500 font-bold justify-end uppercase"><Target size={10}/> ACC</span>
                    <span className="text-white font-bold">{h.accuracy}%</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-slate-600" size={30} />
              </div>
              <p className="text-slate-500 italic text-sm">Belum ada riwayat bermain.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/30 border-t border-white/5 text-center">
          <p className="text-[9px] text-slate-600 uppercase font-bold tracking-[0.2em]">Ruang Spenda Typing Game</p>
        </div>
      </div>
    </div>
  );
}