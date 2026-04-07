import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Calendar, ChevronDown, ChevronRight, UserCheck } from 'lucide-react';

export default function LogPelanggaran({ data }) {
  const [expandedDates, setExpandedDates] = useState({});

  const grouped = data.reduce((acc, curr) => {
    if (!curr.tanggal) return acc;
    const date = curr.tanggal.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(curr);
    return acc;
  }, {});

  const toggleDate = (date) => {
    setExpandedDates(prev => ({ ...prev, [date]: !prev[date] }));
  };

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl">
      {/* Header Tanpa Tombol Mata */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3 text-blue-400">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <History size={20} />
          </div>
          <h3 className="text-white font-black text-sm italic uppercase tracking-widest">
            Riwayat Pelanggaran
          </h3>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="space-y-4"
      >
        {sortedDates.length > 0 ? sortedDates.map(date => (
          <div key={date} className="bg-slate-900/40 border border-white/5 rounded-[1.5rem] overflow-hidden">
            <button 
              onClick={() => toggleDate(date)} 
              className={`w-full p-4 flex items-center justify-between transition-all text-left ${expandedDates[date] ? 'bg-blue-600/10' : 'hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3">
                <Calendar className={expandedDates[date] ? "text-blue-400" : "text-slate-500"} size={18} />
                <span className={`font-black text-xs uppercase tracking-tighter ${expandedDates[date] ? 'text-blue-400' : 'text-slate-300'}`}>
                  {new Date(date).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md font-bold">
                  {grouped[date].length} Data
                </span>
                {expandedDates[date] ? <ChevronDown size={18} className="text-blue-400"/> : <ChevronRight size={18} className="text-slate-600"/>}
              </div>
            </button>

            <AnimatePresence>
              {expandedDates[date] && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }} 
                  className="px-4 pb-4 space-y-3 overflow-hidden"
                >
                  <div className="pt-2 space-y-3">
                    {grouped[date].map((log, i) => (
                      <div key={i} className="group bg-slate-800/50 p-4 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-blue-400 font-black text-[11px] uppercase tracking-wider mb-0.5">
                              {log.master_siswa?.NAMA || 'Siswa tidak dikenal'}
                            </p>
                            <p className="text-slate-500 text-[10px] font-bold uppercase">
                              Kelas: {log.master_siswa?.Kelas || '-'}
                            </p>
                          </div>
                          <span className="bg-red-500 text-white text-[10px] px-2.5 py-1 rounded-lg font-black shadow-lg shadow-red-900/20">
                            +{log.poin_pelanggaran} POIN
                          </span>
                        </div>
                        
                        <div className="mt-3 p-3 bg-slate-900/50 rounded-xl border-l-2 border-red-500">
                          <p className="text-slate-300 text-[11px] leading-relaxed italic font-medium">
                            "{log.jenis_pelanggaran} - {log.catatan || 'Tanpa catatan'}"
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[9px] text-slate-500 uppercase font-bold tracking-widest">
                            <UserCheck size={12} className="text-emerald-500" />
                            <span>Dicatat oleh: <span className="text-slate-300">{log.pelapor?.NAMA || 'Sistem'}</span></span>
                          </div>
                          <span className="text-[9px] text-slate-600 font-mono">
                            {new Date(log.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WITA
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )) : (
          <div className="py-20 text-center flex flex-col items-center opacity-50">
            <History size={40} className="text-slate-700 mb-2" />
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest italic">Belum ada riwayat</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}