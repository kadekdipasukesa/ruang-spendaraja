import React, { useEffect, useState } from 'react';
import { supabase } from "../../lib/supabaseClient";
import { 
  ChevronDown, ChevronRight, Calendar, Users, 
  UserCheck, Lock, Unlock, PieChart 
} from 'lucide-react';

export default function Absensi({ student }) {
  const [loading, setLoading] = useState(true);
  const [dataAbsen, setDataAbsen] = useState([]);
  const [absenSettings, setAbsenSettings] = useState([]);
  const [expandedDates, setExpandedDates] = useState({});
  const [expandedClasses, setExpandedClasses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
    fetchSettings();

    // --- FITUR REALTIME: Pantau perubahan data absen & gembok ---
    const channel = supabase
      .channel('realtime_absensi_all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'data_absen' }, () => {
        fetchData(); // Update tabel otomatis jika ada yang absen
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'absen_settings' }, () => {
        fetchSettings(); // Update gembok otomatis jika admin merubah status
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('data_absen')
      .select('*')
      .order('tanggal', { ascending: false })
      .order('no_absen', { ascending: true });
    if (!error) setDataAbsen(data);
    setLoading(false);
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('absen_settings').select('*');
    if (!error) setAbsenSettings(data);
  };

  const groupedData = dataAbsen.reduce((acc, curr) => {
    if (!acc[curr.tanggal]) acc[curr.tanggal] = {};
    if (!acc[curr.tanggal][curr.kelas]) acc[curr.tanggal][curr.kelas] = [];
    acc[curr.tanggal][curr.kelas].push(curr);
    return acc;
  }, {});

  const handleAbsen = async () => {
    if (!student) return alert("Data siswa tidak ditemukan.");
    
    const userKelas = student.Kelas || student.kelas;
    const userNama = student.NAMA || student.nama;
    const userNoAbsen = student['No Absen'] || student.No_Absen || student.no_absen;

    if (!userNoAbsen) {
      alert("Error: Nomor absen tidak ditemukan di data profil kamu!");
      return;
    }

    const settings = absenSettings.find(s => s.kelas === userKelas);
    if (!settings?.is_open && student.role !== 'admin') {
      alert(`Maaf, absen Kelas ${userKelas} sedang ditutup.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('data_absen').insert([{
        nama: userNama,
        no_absen: parseInt(userNoAbsen),
        kelas: userKelas,
        status: 'Hadir',
        tanggal: new Date().toISOString().split('T')[0]
      }]);

      if (error) {
        if (error.code === '23505') alert("Kamu sudah absen hari ini!");
        else throw error;
      } else {
        alert("Berhasil! Absensi otomatis tercatat.");
        // fetchData() tidak perlu dipanggil manual karena sudah di-handle Realtime
      }
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAdminAbsen = async (kelas, currentStatus) => {
    const { error } = await supabase
      .from('absen_settings')
      .update({ is_open: !currentStatus })
      .eq('kelas', kelas);
    
    // fetchSettings() tidak perlu dipanggil manual karena sudah di-handle Realtime
    if (error) alert("Gagal update gembok: " + error.message);
  };

  if (loading) return <div className="text-white text-center p-10">Memuat data absensi...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 animate-in fade-in duration-500">
      
      {/* --- TOMBOL ABSEN (USER) --- */}
      {/* --- TOMBOL ABSEN (USER) --- */}
      <div className="bg-slate-900 border border-blue-500/30 p-6 rounded-[2rem] shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCheck className="text-blue-400" /> Absensi Hari Ini
          </h2>
          <p className="text-slate-400 text-sm">Halo {student?.NAMA || student?.nama}, jangan lupa absen ya!</p>
        </div>
        
        {/* Logika Tombol Berubah Warna & Status */}
        {(() => {
          const userKelas = student.Kelas || student.kelas;
          const settings = absenSettings.find(s => s.kelas === userKelas);
          const isOpen = settings?.is_open || student.role === 'admin';

          return (
            <button
              onClick={handleAbsen}
              disabled={isSubmitting || !isOpen}
              className={`px-8 py-3 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg disabled:opacity-70 
                ${isOpen 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40' 
                  : 'bg-red-600 text-white shadow-red-900/40 cursor-not-allowed'
                }`}
            >
              {isSubmitting ? 'MEMPROSES...' : isOpen ? 'ABSEN SEKARANG' : 'ABSEN DITUTUP'}
            </button>
          );
        })()}
      </div>

      {/* --- PANEL ADMIN --- */}
      {student.role === 'admin' && (
        <div className="bg-slate-900/50 border border-emerald-500/20 p-4 rounded-2xl">
          <h3 className="text-emerald-400 font-bold text-xs mb-3 uppercase tracking-widest">Kontrol Absen Per Kelas (Admin)</h3>
          <div className="flex flex-wrap gap-2">
            {absenSettings.sort((a,b) => a.kelas.localeCompare(b.kelas, undefined, {numeric: true})).map(s => (
              <button 
                key={s.id}
                onClick={() => toggleAdminAbsen(s.kelas, s.is_open)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1
                ${s.is_open ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-white/10 text-slate-500'}`}
              >
                {s.is_open ? <Unlock size={12}/> : <Lock size={12}/>} Kelas {s.kelas}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- LIST DATA ABSEN (Tabel tetap sama) --- */}
      <div className="space-y-4">
        {Object.keys(groupedData).map(tanggal => (
          <div key={tanggal} className="bg-slate-900/80 border border-white/5 rounded-[2rem] overflow-hidden">
            <div 
              onClick={() => setExpandedDates(prev => ({...prev, [tanggal]: !prev[tanggal]}))}
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-3">
                <Calendar className="text-blue-400" size={20} />
                <span className="text-white font-bold">{new Date(tanggal).toLocaleDateString('id-ID', { dateStyle: 'full' })}</span>
              </div>
              {expandedDates[tanggal] ? <ChevronDown className="text-slate-500"/> : <ChevronRight className="text-slate-500"/>}
            </div>

            {expandedDates[tanggal] && (
              <div className="p-4 pt-0 space-y-2">
                {Object.keys(groupedData[tanggal]).map(kelas => {
                  const listSiswa = groupedData[tanggal][kelas];
                  const totalHadir = listSiswa.length;
                  const targetMaks = 40; 
                  const percentage = Math.min(100, Math.round((totalHadir / targetMaks) * 100));

                  return (
                    <div key={kelas} className="border border-white/5 rounded-2xl bg-slate-800/30 overflow-hidden">
                      <div 
                        onClick={() => setExpandedClasses(prev => ({...prev, [`${tanggal}-${kelas}`]: !prev[`${tanggal}-${kelas}`]}))}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <Users className="text-emerald-400" size={18} />
                          <span className="text-slate-200 font-semibold text-sm">Kelas {kelas}</span>
                          <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-400">{totalHadir} Siswa</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                              <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-700" strokeWidth="4"></circle>
                              <circle cx="18" cy="18" r="16" fill="none" className="stroke-emerald-500" strokeWidth="4" 
                                strokeDasharray={`${percentage}, 100`} strokeLinecap="round"></circle>
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[7px] text-white font-bold">{percentage}%</span>
                          </div>
                          {expandedClasses[`${tanggal}-${kelas}`] ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                        </div>
                      </div>

                      {expandedClasses[`${tanggal}-${kelas}`] && (
                        <div className="px-4 pb-4 animate-in slide-in-from-top-2">
                          <table className="w-full text-left text-[11px]">
                            <thead>
                              <tr className="text-slate-500 border-b border-white/5">
                                <th className="py-2">No</th>
                                <th className="py-2">Nama Siswa</th>
                                <th className="py-2">Waktu</th>
                                <th className="py-2 text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody className="text-slate-300">
                              {listSiswa.map((item) => (
                                <tr key={item.id} className="border-b border-white/5 last:border-0">
                                  <td className="py-2 font-mono text-emerald-500">{item.no_absen}</td>
                                  <td className="py-2 font-bold uppercase">{item.nama}</td>
                                  <td className="py-2 text-[10px] text-slate-500">
                                    {new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                  </td>
                                  <td className="py-2 text-right">
                                    <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-md font-black text-[9px]">HADIR</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}