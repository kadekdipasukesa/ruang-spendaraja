import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UlanganCard from './UlanganCard';
import { useNavigate } from 'react-router-dom';
import { Settings, Award, CheckCircle2, XCircle } from 'lucide-react';
// Mundur dua tingkat (../../) untuk keluar ke folder src, lalu masuk ke lib
import { supabase } from '../../lib/supabaseClient';

const UlanganTab = () => {
  // ⚡ SEKARANG DEFAULT SELECT LANGSUNG KE REMEDIAL
  const [activeCategory, setActiveCategory] = useState('Remedial');
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasilRemidi, setHasilRemidi] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const navigate = useNavigate();

  // Cek role user saat komponen dimuat
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user_siswa'));
    if (user?.role === 'admin') setIsAdmin(true);
  }, []);

  // ⚡ AMBIL DATA HASIL REMIDI DARI SUPABASE SECARA REALTIME
  useEffect(() => {
    if (activeCategory === 'Remedial') {
      fetchHasilRemidi();

      // Setup Realtime Subscription agar nilai yang masuk langsung muncul di tabel tanpa reload
      const channel = supabase
        .channel('live_hasil_remidi')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'remidi_peserta' }, () => {
          fetchHasilRemidi();
        })
        .subscribe();

      return () => supabase.removeChannel(channel);
    }
  }, [activeCategory]);

  const fetchHasilRemidi = async () => {
    setLoadingTable(true);
    try {
      const { data, error } = await supabase
        .from('remidi_peserta')
        .select(`
          id,
          nilai_akhir,
          status_ujian,
          master_siswa (NAMA)
        `)
        .in('status_ujian', ['submitted', 'blocked']) // Hanya tampilkan yang sudah selesai / diblokir
        .order('nilai_akhir', { ascending: false }); // Urutkan dari nilai tertinggi

      if (!error && data) {
        setHasilRemidi(data);
      }
    } catch (err) {
      console.error("Gagal mengambil tabel hasil remidi:", err);
    } finally {
      setLoadingTable(false);
    }
  };

  const categories = [
    { id: 'Ulangan_1', label: 'Ulangan Utama' },
    { id: 'Ulangan_2', label: 'Ulangan Susulan' },
    { id: 'Remedial', label: 'Remedial' }
  ];

  const handleAdminNavigation = () => {
    if (activeCategory === 'Remedial') {
      navigate('/admin-remidi');
    } else {
      navigate('/admin-ujian');
    }
  };

  return (
    <div className="relative z-30"> 
      
      {/* Header Tab & Label Admin */}
      <div className="flex justify-between items-center mb-8">
        {/* Navigasi Internal */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory(cat.id);
              }}
              className={`px-6 py-2.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 shrink-0 ${activeCategory === cat.id
                  ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-slate-800/50 text-slate-500 border border-white/5 hover:text-white'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Label Admin Dinamis */}
        {isAdmin && (
          <button 
            onClick={handleAdminNavigation}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all group"
          >
            <Settings size={12} className="group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-[10px] font-black uppercase tracking-tighter">
              Panel {activeCategory === 'Remedial' ? 'Guru Remidi' : 'Guru Ujian'}
            </span>
          </button>
        )}
      </div>

      {/* Area List Kartu dengan Animasi */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-8"
        >
          {/* CONTENT GRID UNTUK CARD KATEGORI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TAB 1: ULANGAN UTAMA (Disabled) */}
            {activeCategory === 'Ulangan_1' && (
              <div className="opacity-40 cursor-not-allowed pointer-events-none select-none col-span-1">
                <UlanganCard
                  title="Ulangan Informatika"
                  subject="Informatika"
                  time={60}
                  status="Selesai"
                  onPress={() => {}}
                />
              </div>
            )}

            {/* TAB 3: REMEDIAL (Kartu Aktif) */}
            {activeCategory === 'Remedial' && (
              <div className="col-span-1">
                <UlanganCard
                  title="Remidi Informatika (Masa Aktif 2 Hari)"
                  subject="Informatika"
                  time={45}
                  status="Tersedia"
                  onPress={() => navigate('/remidi')}
                />
              </div>
            )}

            {/* STATE KOSONG SUSULAN */}
            {activeCategory === 'Ulangan_2' && (
              <div className="col-span-full py-20 text-center rounded-3xl border-2 border-dashed border-white/5">
                <p className="text-white/20 italic font-medium">Belum ada jadwal aktif untuk kategori ini.</p>
              </div>
            )}
          </div>

          {/* ============================================================
              📊 TABEL LIVE HASIL REMIDI (Hanya muncul jika tab Remedial aktif)
             ============================================================ */}
          {activeCategory === 'Remedial' && (
            <div className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-6 md:p-8 backdrop-blur shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
                  <Award size={18} />
                </div>
                <div>
                  <h3 className="font-black text-white text-base tracking-tight">Live Papan Skor Remidi</h3>
                  <p className="text-xs text-slate-500">Daftar nilai siswa yang telah menyelesaikan remidi</p>
                </div>
              </div>

              {loadingTable && hasilRemidi.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500 animate-pulse font-mono">
                  MEMUAT DATA PAPAN SKOR...
                </div>
              ) : hasilRemidi.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl text-slate-600 text-xs italic">
                  Belum ada siswa yang menyelesaikan remidi.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] uppercase font-black text-slate-500 tracking-wider">
                        <th className="pb-4 pl-2 w-12 text-center">Peringkat</th>
                        <th className="pb-4">Nama Siswa</th>
                        <th className="pb-4 text-center w-28">Status</th>
                        <th className="pb-4 text-right pr-4 w-24">Nilai Remidi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03] text-xs font-medium">
                      {hasilRemidi.map((p, idx) => (
                        <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
                          {/* Kolom Peringkat */}
                          <td className="py-4 font-mono font-black text-center">
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                          </td>
                          {/* Kolom Nama */}
                          <td className="py-4 text-slate-200 font-bold group-hover:text-white transition-colors">
                            {p.master_siswa?.NAMA || 'Siswa Spenda'}
                          </td>
                          {/* Kolom Status Kecurangan */}
                          <td className="py-4 text-center">
                            {p.status_ujian === 'blocked' ? (
                              <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 uppercase tracking-tighter">
                                <XCircle size={10} /> Terblokir
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-tighter">
                                <CheckCircle2 size={10} /> Sukses
                              </span>
                            )}
                          </td>
                          {/* Kolom Skor Akhir */}
                          <td className="py-4 text-right pr-4 font-mono font-black text-amber-400 text-sm">
                            {p.nilai_akhir ?? 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UlanganTab;