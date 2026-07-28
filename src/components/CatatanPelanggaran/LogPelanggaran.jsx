import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Calendar, ChevronDown, ChevronRight, Trash2, Users, BarChart3, Layers, TrendingUp, Download } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import ModalDownloadCsv from './ModalDownloadCsv'; // 📥 IMPOR KOMPONEN BARU DI SINI

export default function LogPelanggaran({ data, onRefresh }) {
  const [expandedMonths, setExpandedMonths] = useState({});
  const [expandedDates, setExpandedDates] = useState({});
  const [expandedClasses, setExpandedClasses] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  
  const [showChart, setShowChart] = useState(false); // Default HIDE

  // State pemicu modal CSV
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // --- 🛠️ STRUCTURAL GROUPING ---
  const groupedData = (data || []).reduce((acc, curr) => {
    if (!curr.tanggal) return acc;

    const dateObj = new Date(curr.tanggal);
    const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
    const dateKey = dateObj.toLocaleDateString('en-CA', { timeZone: 'Asia/Makassar' });
    const kelasKey = curr.master_siswa?.Kelas || 'Tanpa Kelas';

    if (!acc[monthKey]) acc[monthKey] = { namaBulan: '', dataTanggal: {}, totalPelanggaranBulan: 0 };
    if (!acc[monthKey].dataTanggal[dateKey]) acc[monthKey].dataTanggal[dateKey] = {};
    if (!acc[monthKey].dataTanggal[dateKey][kelasKey]) acc[monthKey].dataTanggal[dateKey][kelasKey] = [];

    if (!acc[monthKey].namaBulan) {
      acc[monthKey].namaBulan = dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    }

    acc[monthKey].dataTanggal[dateKey][kelasKey].push(curr);
    if (curr.poin_pelanggaran > 0) {
      acc[monthKey].totalPelanggaranBulan += 1;
    }
    return acc;
  }, {});

  const dapatkanDataTrenBulanan = () => {
    const trenData = Object.entries(groupedData).map(([key, info]) => ({
      key,
      namaBulan: info.namaBulan,
      total: info.totalPelanggaranBulan
    }));
    trenData.sort((a, b) => a.key.localeCompare(b.key));
    const maxGlobal = trenData.length > 0 ? Math.max(...trenData.map(t => t.total)) : 1;
    return { trenData, maxGlobal };
  };

  const { trenData, maxGlobal } = dapatkanDataTrenBulanan();

  const hitungGrafikBulan = (monthKey) => {
    const totalPerKelas = {};
    const tanggalDiBulanIni = groupedData[monthKey]?.dataTanggal || {};

    Object.values(tanggalDiBulanIni).forEach(listKelas => {
      Object.entries(listKelas).forEach(([kelas, logs]) => {
        const jumlahSiswaMelanggar = logs.filter(l => l.poin_pelanggaran > 0).length;
        if (jumlahSiswaMelanggar > 0) {
          totalPerKelas[kelas] = (totalPerKelas[kelas] || 0) + jumlahSiswaMelanggar;
        }
      });
    });

    const chartData = Object.entries(totalPerKelas).map(([name, value]) => ({ name, value }));
    chartData.sort((a, b) => b.value - a.value);
    const nilaiTertinggi = chartData.length > 0 ? chartData[0].value : 1;
    return { chartData, nilaiTertinggi };
  };

  const toggleMonth = (month) => {
    setExpandedMonths(prev => ({ ...prev, [month]: !prev[month] }));
  };

  const toggleDate = (date) => {
    setExpandedDates(prev => ({ ...prev, [date]: !prev[date] }));
  };

  const toggleClass = (date, kelas) => {
    const key = `${date}-${kelas}`;
    setExpandedClasses(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sortedMonths = Object.keys(groupedData).sort((a, b) => b.localeCompare(a));

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative">
      
      {/* HEADER UTAMA DENGAN TOMBOL EXPORT DI SEBELAHNYA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-2">
        <div className="flex items-center gap-3 text-blue-400">
          <div className="p-2 bg-blue-500/10 rounded-lg"><History size={20} /></div>
          <h3 className="text-white font-black text-sm italic uppercase tracking-widest">Riwayat Berkas Pelanggaran</h3>
        </div>
        
        {/* Tombol pemicu modal download */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* 🔥 GRAFIK GARIS TREN GLOBAL */}
      {trenData.length > 0 && (() => {
        const bulanUrut = [...trenData].sort((a, b) => a.key.localeCompare(b.key));
        const maxGlobalKasus = Math.max(...bulanUrut.map(b => b.total)) || 1;
        const widthSVG = 500;
        const heightSVG = 180;
        const paddingLeft = 40;
        const paddingRight = 20;
        const paddingTop = 25;
        const paddingBottom = 30;
        const chartWidth = widthSVG - paddingLeft - paddingRight;
        const chartHeight = heightSVG - paddingTop - paddingBottom;
        const points = bulanUrut.map((b, idx) => {
          const x = paddingLeft + (idx / (bulanUrut.length - 1 || 1)) * chartWidth;
          const y = paddingTop + chartHeight * (1 - (b.total / maxGlobalKasus));
          return `${x},${y}`;
        });
        const pathDefinition = `M ${points.join(' L ')}`;

        return (
          <div className="mb-8 mx-2 p-5 bg-slate-950/60 border border-white/10 rounded-3xl bg-gradient-to-r from-slate-950/80 to-slate-900/40 shadow-inner">
            <div className="flex items-center gap-2 text-slate-400 mb-6">
              <TrendingUp size={16} className="text-indigo-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                Grafik Tren Total Kasus Pelanggaran Sekolah Per Bulan
              </span>
            </div>
            <div className="w-full h-auto aspect-[5/1.8] relative min-h-[160px]">
              <svg viewBox={`0 0 ${widthSVG} ${heightSVG}`} className="w-full h-full overflow-visible">
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                  const yPos = paddingTop + chartHeight * (1 - ratio);
                  const valueLabel = Math.round(maxGlobalKasus * ratio);
                  return (
                    <g key={index} className="opacity-40">
                      <line x1={paddingLeft} y1={yPos} x2={widthSVG - paddingRight} y2={yPos} stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
                      <text x={paddingLeft - 8} y={yPos + 3} fill="#64748b" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="end">{valueLabel}</text>
                    </g>
                  );
                })}
                {bulanUrut.map((b, idx) => {
                  const xPos = paddingLeft + (idx / (bulanUrut.length - 1 || 1)) * chartWidth;
                  return (
                    <text key={idx} x={xPos} y={heightSVG - paddingBottom + 16} fill="#64748b" fontSize="9" fontWeight="900" textAnchor="middle" className="uppercase tracking-wider">
                      {b.namaBulan.split(' ')[0].substring(0, 3)}
                    </text>
                  );
                })}
                <g className="group">
                  <motion.path d={pathDefinition} fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} className="opacity-30 blur-[3px]" />
                  <motion.path d={pathDefinition} fill="none" stroke="url(#gradientGarisLogMain)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
                  <defs>
                    <linearGradient id="gradientGarisLogMain" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                  {bulanUrut.map((b, idx) => {
                    const x = paddingLeft + (idx / (bulanUrut.length - 1 || 1)) * chartWidth;
                    const y = paddingTop + chartHeight * (1 - (b.total / maxGlobalKasus));
                    return (
                      <g key={idx}>
                        <circle cx={x} cy={y} r="4" fill="#0f172a" stroke="#a855f7" strokeWidth="2.5" />
                        <text x={x} y={y - 10} fill="#f472b6" fontSize="9" fontWeight="black" fontFamily="monospace" textAnchor="middle">{b.total}</text>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>
        );
      })()}

      {/* LIST REKAP CONTAINER DATA */}
      <div className="space-y-4">
        {sortedMonths.length > 0 ? sortedMonths.map(monthKey => {
          const { chartData, nilaiTertinggi } = hitungGrafikBulan(monthKey);
          const isMonthExpanded = expandedMonths[monthKey];

          return (
            <div key={monthKey} className="bg-slate-900/60 border border-white/10 rounded-[2rem] overflow-hidden p-1 bg-gradient-to-b from-slate-900/80 to-slate-950/60 shadow-lg">
              <button
                onClick={() => toggleMonth(monthKey)}
                className={`w-full p-5 flex items-center justify-between transition-all rounded-[1.8rem] ${isMonthExpanded ? 'bg-blue-600/10 border border-blue-500/10' : 'hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-3">
                  <Layers className={isMonthExpanded ? "text-blue-400" : "text-slate-500"} size={20} />
                  <span className={`font-black text-xs uppercase tracking-wider ${isMonthExpanded ? 'text-blue-400' : 'text-slate-200'}`}>
                    BULAN {groupedData[monthKey].namaBulan}
                  </span>
                </div>
                {isMonthExpanded ? <ChevronDown size={20} className="text-blue-400" /> : <ChevronRight size={20} className="text-slate-500" />}
              </button>

              <AnimatePresence>
                {isMonthExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-4 pb-5 pt-2 space-y-5">
                    <div className="bg-slate-950/50 border border-white/5 rounded-2xl overflow-hidden">
  {/* --- HEADER (TOMBOL TOGGLE SHOW/HIDE) --- */}
  <button
    type="button"
    onClick={() => setShowChart(!showChart)}
    className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors text-left"
  >
    <div className="flex items-center gap-2 text-slate-400 px-1">
      <BarChart3 size={14} className="text-blue-400" />
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
        Grafik Kasus Per Kelas ({groupedData[monthKey].namaBulan})
      </span>
    </div>

    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
      <span className="text-[9px] uppercase tracking-wider text-slate-500">
        {showChart ? 'Tutup' : 'Lihat'}
      </span>
      <motion.div
        animate={{ rotate: showChart ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown size={14} />
      </motion.div>
    </div>
  </button>

  {/* --- ISI GRAFIK (DEFAULT HIDE) --- */}
  <AnimatePresence>
    {showChart && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <div className="px-4 pb-4 pt-1 border-t border-white/5">
          {chartData.length > 0 ? (
            <div className="space-y-2.5">
              {chartData.map((item, idx) => {
                const persentaseBar = (item.value / nilaiTertinggi) * 100;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-tight px-1">
                      <span className="text-slate-300">Kelas {item.name}</span>
                      <span className="text-blue-400 font-mono font-black">
                        {item.value} Pelanggaran
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/[0.02]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${persentaseBar}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[10px] text-slate-600 italic text-center py-2">
              Tidak ada data statistik.
            </p>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

                    {/* DAFTAR TANGGAL & KELAS */}
                    <div className="space-y-3">
                      {Object.keys(groupedData[monthKey].dataTanggal).sort((a, b) => new Date(b) - new Date(a)).map(dateKey => {
                        const isDateExpanded = expandedDates[dateKey];
                        return (
                          <div key={dateKey} className="bg-slate-950/20 border border-white/5 rounded-xl overflow-hidden">
                            <button onClick={() => toggleDate(dateKey)} className={`w-full p-3.5 flex items-center justify-between transition-all ${isDateExpanded ? 'bg-slate-900/80' : 'hover:bg-slate-900/40'}`}>
                              <div className="flex items-center gap-2.5">
                                <Calendar className={isDateExpanded ? "text-cyan-400" : "text-slate-600"} size={16} />
                                <span className={`font-black text-[10px] uppercase tracking-wide ${isDateExpanded ? 'text-cyan-400' : 'text-slate-400'}`}>{new Date(dateKey + 'T00:00:00').toLocaleDateString('id-ID', { dateStyle: 'full' })}</span>
                              </div>
                              {isDateExpanded ? <ChevronDown size={16} className="text-cyan-400" /> : <ChevronRight size={16} className="text-slate-600" />}
                            </button>
                            <AnimatePresence>
                              {isDateExpanded && (
                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="px-3 pb-3 space-y-2 overflow-hidden bg-black/10">
                                  {Object.keys(groupedData[monthKey].dataTanggal[dateKey]).sort().map(kelas => {
                                    const classKey = `${dateKey}-${kelas}`;
                                    const isClassExpanded = expandedClasses[classKey];
                                    return (
                                      <div key={kelas} className="mt-2 border border-white/5 rounded-lg overflow-hidden bg-slate-950/40">
                                        <button onClick={() => toggleClass(dateKey, kelas)} className="w-full p-2.5 flex items-center justify-between hover:bg-slate-900/60 transition-all">
                                          <div className="flex items-center gap-2">
                                            <Users size={12} className="text-emerald-400" />
                                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Kelas: {kelas}</span>
                                            <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-mono font-black">{groupedData[monthKey].dataTanggal[dateKey][kelas].length} KASUS</span>
                                          </div>
                                          {isClassExpanded ? <ChevronDown size={12} className="text-emerald-400" /> : <ChevronRight size={12} className="text-slate-600" />}
                                        </button>
                                        <AnimatePresence>
                                          {isClassExpanded && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-2.5 space-y-2.5 bg-slate-950/20 border-t border-white/[0.02]">
                                              {groupedData[monthKey].dataTanggal[dateKey][kelas].map((log, i) => (
                                                <div key={i} className="group bg-slate-900/90 p-3.5 rounded-xl border border-white/5 shadow-sm">
                                                  <div className="flex justify-between items-start mb-2">
                                                    <div><p className="text-blue-400 font-black text-[10px] uppercase tracking-wider">{log.master_siswa?.NAMA}</p></div>
                                                    <div className="flex items-center gap-2">
                                                      {(currentUser?.role === 'admin' || (currentUser?.id === log.pelapor_id)) && (
                                                        <button onClick={() => handleDelete(log.id)} className="p-1.5 text-slate-600 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"><Trash2 size={14} /></button>
                                                      )}
                                                      <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] px-2 py-0.5 rounded-md font-mono font-black">+{log.poin_pelanggaran} PTS</span>
                                                    </div>
                                                  </div>
                                                  <div className="mt-1.5 p-2 bg-black/40 rounded-lg border-l-2 border-red-500">
                                                    <p className="text-slate-300 text-[9px] font-medium italic leading-relaxed">"{log.jenis_pelanggaran} - {log.catatan || 'Tanpa catatan'}"</p>
                                                  </div>
                                                  <div className="mt-2.5 flex items-center justify-between text-[8px] text-slate-500 font-black uppercase tracking-tight">
                                                    <span>Petugas: <span className="text-slate-400 font-bold">{log.pelapor?.NAMA || 'Sistem'}</span></span>
                                                    <span>{new Date(log.tanggal).toLocaleTimeString('id-ID', { timeZone: 'Asia/Makassar', hour: '2-digit', minute: '2-digit' })} WITA</span>
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
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }) : (
          <div className="py-20 text-center opacity-50 flex flex-col items-center">
            <History size={40} className="mb-2 text-slate-600" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">Belum ada riwayat kasus masuk</p>
          </div>
        )}
      </div>

      {/* ─── 📦 PANGGIL MODAL INDEPENDEN YANG SUDAH DIPISAH ─── */}
      <ModalDownloadCsv
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sortedMonths={sortedMonths}
        groupedData={groupedData}
        rawData={data}
      />

    </div>
  );
}