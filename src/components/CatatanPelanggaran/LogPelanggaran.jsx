import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Calendar, ChevronDown, ChevronRight, UserCheck, Trash2, Users } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function LogPelanggaran({ data, onRefresh }) {
  const [expandedDates, setExpandedDates] = useState({});
  const [expandedClasses, setExpandedClasses] = useState({}); // State baru untuk group kelas
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user_siswa');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Hapus catatan ini? Poin siswa akan dikalibrasi ulang.')) {
      const { error } = await supabase.from('log_pelanggaran_siswa').delete().eq('id', id);
      if (!error && onRefresh) onRefresh();
    }
  };

  // --- LOGIKA GROUPING DOUBLE (Tanggal -> Kelas) ---
  const grouped = data.reduce((acc, curr) => {
    if (!curr.tanggal) return acc;

    const date = new Date(curr.tanggal)
      .toLocaleDateString('en-CA', {
        timeZone: 'Asia/Makassar'
      }); // hasil: YYYY-MM-DD

    const kelas = curr.master_siswa?.Kelas || 'Tanpa Kelas';

    if (!acc[date]) acc[date] = {};
    if (!acc[date][kelas]) acc[date][kelas] = [];

    acc[date][kelas].push(curr);

    return acc;
  }, {});

  const toggleDate = (date) => {
    setExpandedDates(prev => ({ ...prev, [date]: !prev[date] }));
  };

  const toggleClass = (date, kelas) => {
    const key = `${date}-${kelas}`;
    setExpandedClasses(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl">
      <div className="flex items-center gap-3 text-blue-400 mb-6 px-2">
        <div className="p-2 bg-blue-500/10 rounded-lg"><History size={20} /></div>
        <h3 className="text-white font-black text-sm italic uppercase tracking-widest">Riwayat Pelanggaran</h3>
      </div>

      <div className="space-y-4">
        {sortedDates.length > 0 ? sortedDates.map(date => (
          <div key={date} className="bg-slate-900/40 border border-white/5 rounded-[1.5rem] overflow-hidden">
            {/* LEVEL 1: TANGGAL */}
            <button
              onClick={() => toggleDate(date)}
              className={`w-full p-4 flex items-center justify-between transition-all ${expandedDates[date] ? 'bg-blue-600/10' : 'hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3">
                <Calendar className={expandedDates[date] ? "text-blue-400" : "text-slate-500"} size={18} />
                <span className={`font-black text-xs uppercase ${expandedDates[date] ? 'text-blue-400' : 'text-slate-300'}`}>
                  {new Date(date + 'T00:00:00')
                    .toLocaleDateString('id-ID', { dateStyle: 'full' })}
                </span>
              </div>
              {expandedDates[date] ? <ChevronDown size={18} className="text-blue-400" /> : <ChevronRight size={18} className="text-slate-600" />}
            </button>

            <AnimatePresence>
              {expandedDates[date] && (
                <motion.div
                  initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                  className="px-4 pb-4 space-y-2 overflow-hidden bg-black/20"
                >
                  {Object.keys(grouped[date]).sort().map(kelas => {
                    const classKey = `${date}-${kelas}`;
                    return (
                      <div key={kelas} className="mt-2 border border-white/5 rounded-xl overflow-hidden">
                        {/* LEVEL 2: KELAS */}
                        <button
                          onClick={() => toggleClass(date, kelas)}
                          className="w-full p-3 flex items-center justify-between bg-slate-800/40 hover:bg-slate-700/40 transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-emerald-400" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Kelas: {kelas}</span>
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">
                              {grouped[date][kelas].length} Data
                            </span>
                          </div>
                          {expandedClasses[classKey] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>

                        <AnimatePresence>
                          {expandedClasses[classKey] && (
                            <motion.div
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              className="p-3 space-y-3"
                            >
                              {grouped[date][kelas].map((log, i) => (
                                <div key={i} className="group bg-slate-800/80 p-4 rounded-xl border border-white/5 shadow-sm">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <p className="text-blue-400 font-black text-[11px] uppercase tracking-wider">{log.master_siswa?.NAMA}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {(currentUser?.role === 'admin' || (currentUser?.id === log.pelapor_id)) && (
                                        <button onClick={() => handleDelete(log.id)} className="p-2 text-slate-500 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                                      )}
                                      <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-lg font-black">+{log.poin_pelanggaran} POIN</span>
                                    </div>
                                  </div>
                                  <div className="mt-2 p-2 bg-black/30 rounded-lg border-l-2 border-red-500">
                                    <p className="text-slate-300 text-[10px] italic">"{log.jenis_pelanggaran} - {log.catatan || 'Tanpa catatan'}"</p>
                                  </div>
                                  <div className="mt-3 flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase">
                                    <span>Dicatat oleh: <span className="text-slate-300">{log.pelapor?.NAMA || 'Sistem'}</span></span>
                                    <span>{new Date(log.tanggal).toLocaleTimeString('id-ID', {
                                      timeZone: 'Asia/Makassar',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )) : (
          <div className="py-20 text-center opacity-50 flex flex-col items-center">
            <History size={40} className="mb-2" />
            <p className="text-xs font-black uppercase tracking-widest">Belum ada riwayat</p>
          </div>
        )}
      </div>
    </div>
  );
}