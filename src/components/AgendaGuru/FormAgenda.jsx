import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, UserCheck, Calendar, Briefcase, Save, MapPin } from 'lucide-react';

export default function FormAgenda({ siswaKelas, onKelasChange, onSave, loading }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [tipeAgenda, setTipeAgenda] = useState('KBM'); // 'KBM' atau 'NON_KBM'
  
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kelas: '',
    mata_pelajaran: '',
    jam_ke: '',
    materi_pokok: '', // Jadi deskripsi/nama kegiatan kalau NON_KBM
    ketercapaian: 'Selesai',
    catatan_kelas: '' // Jadi lokasi/keterangan kalau NON_KBM
  });

  const [absenSiswa, setAbsenSiswa] = useState({});

  useEffect(() => {
    const savedUser = localStorage.getItem('user_siswa');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  const handleKelasChange = (e) => {
    const kelas = e.target.value;
    setForm(prev => ({ ...prev, kelas }));
    setAbsenSiswa({});
    onKelasChange(kelas);
  };

  const handleStatusAbsen = (siswaId, nama, status) => {
    setAbsenSiswa(prev => {
      const current = prev[siswaId];
      if (current?.status_absen === status) {
        const updated = { ...prev };
        delete updated[siswaId];
        return updated;
      }
      return { ...prev, [siswaId]: { nama, status_absen: status } };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (tipeAgenda === 'KBM' && (!form.kelas || !form.mata_pelajaran || !form.materi_pokok)) {
      alert('Mohon lengkapi data kelas, mapel, dan materi!');
      return;
    }
    if (tipeAgenda === 'NON_KBM' && !form.materi_pokok) {
      alert('Mohon isi nama atau deskripsi kegiatan!');
      return;
    }

    const agendaPayload = {
      ...form,
      tipe_agenda: tipeAgenda,
      guru_id: currentUser?.id || null,
      nama_guru: currentUser?.NAMA || 'Guru Spenda',
      // Bersihkan field KBM jika tipenya NON_KBM
      ...(tipeAgenda === 'NON_KBM' && { kelas: null, mata_pelajaran: null, jam_ke: null })
    };

    const absenPayload = tipeAgenda === 'KBM' 
      ? Object.entries(absenSiswa).map(([id, info]) => ({
          siswa_id: id,
          nama_siswa: info.nama,
          status_absen: info.status_absen
        }))
      : [];

    onSave(agendaPayload, absenPayload);
    
    setForm(prev => ({ ...prev, materi_pokok: '', catatan_kelas: '', jam_ke: '' }));
    setAbsenSiswa({});
  };

  const opsiKelas = ['VII A', 'VII B', 'VIII A', 'VIII B', 'IX A', 'IX B'];
  const opsiMapel = ['Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'IPA', 'IPS', 'PPKn', 'Informatika', 'Seni Budaya', 'PJOK'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/60 border border-white/10 rounded-3xl p-6 shadow-inner">
      
      {/* Pilihan Tipe Agenda */}
      <div>
        <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-wider">Jenis Aktivitas Guru</label>
        <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-white/5">
          <button
            type="button" onClick={() => setTipeAgenda('KBM')}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all ${tipeAgenda === 'KBM' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <BookOpen size={14} /> KBM / Mengajar
          </button>
          <button
            type="button" onClick={() => setTipeAgenda('NON_KBM')}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all ${tipeAgenda === 'NON_KBM' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Briefcase size={14} /> Kegiatan Lain
          </button>
        </div>
      </div>

      {/* Baris Tanggal & Meta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-wider">Tanggal</label>
          <input 
            type="date" value={form.tanggal} 
            onChange={e => setForm(prev => ({ ...prev, tanggal: e.target.value }))}
            className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
        {tipeAgenda === 'KBM' ? (
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-wider">Jam Ke-</label>
            <input 
              type="text" placeholder="Misal: 1 - 3" value={form.jam_ke}
              onChange={e => setForm(prev => ({ ...prev, jam_ke: e.target.value }))}
              className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        ) : (
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-wider">Status Kegiatan</label>
            <select 
              value={form.ketercapaian} onChange={e => setForm(prev => ({ ...prev, ketercapaian: e.target.value }))}
              className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="Selesai">Terlaksana</option>
              <option value="Belum Selesai">Tertunda / Belum Selesai</option>
            </select>
          </div>
        )}
      </div>

      {/* INPUT DINAMIS BERDASARKAN TIPE */}
      {tipeAgenda === 'KBM' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-wider">Kelas</label>
              <select 
                value={form.kelas} onChange={handleKelasChange}
                className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="">-- Pilih Kelas --</option>
                {opsiKelas.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-wider">Mata Pelajaran</label>
              <select 
                value={form.mata_pelajaran} onChange={e => setForm(prev => ({ ...prev, mata_pelajaran: e.target.value }))}
                className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="">-- Pilih Mapel --</option>
                {opsiMapel.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-wider">Materi Pokok</label>
            <textarea 
              rows="2" placeholder="Bahasan materi pembelajaran di kelas hari ini..."
              value={form.materi_pokok} onChange={e => setForm(prev => ({ ...prev, materi_pokok: e.target.value }))}
              className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* AREA PRESENSI SISWA */}
          {form.kelas && (
            <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-3">
                <UserCheck size={14} className="text-emerald-400" />
                <span className="text-[9px] font-black uppercase tracking-widest">Siswa Absen ({siswaKelas.length} Terdaftar)</span>
              </div>
              {siswaKelas.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto no-scrollbar">
                  {siswaKelas.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-2 bg-slate-900 rounded-xl border border-white/[0.02]">
                      <span className="text-[10px] font-bold text-slate-300 truncate max-w-[140px]">{s.NAMA}</span>
                      <div className="flex gap-1">
                        {['Sakit', 'Izin', 'Alpha'].map(st => (
                          <button
                            key={st} type="button" onClick={() => handleStatusAbsen(s.id, s.NAMA, st)}
                            className={`w-6 h-6 rounded-md text-[9px] font-black flex items-center justify-center transition-all ${absenSiswa[s.id]?.status_absen === st ? 'bg-slate-100 text-slate-950 font-black' : 'bg-slate-950 text-slate-500 border border-white/5'}`}
                          >
                            {st[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-[10px] text-slate-500 italic text-center">Memuat data siswa...</p>}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-wider">Catatan Khusus Kelas (Opsional)</label>
            <input 
              type="text" placeholder="Misal: Suasana kondusif, proyektor bermasalah..."
              value={form.catatan_kelas} onChange={e => setForm(prev => ({ ...prev, catatan_kelas: e.target.value }))}
              className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </>
      ) : (
        /* TAMPILAN JIKA NON-KBM / KEGIATAN LAIN */
        <>
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-wider">Nama / Deskripsi Kegiatan</label>
            <input 
              type="text" placeholder="Misal: Rapat Pleno Kelulusan, Mengawas Ujian, Workshop Kurikulum..."
              value={form.materi_pokok} onChange={e => setForm(prev => ({ ...prev, materi_pokok: e.target.value }))}
              className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-1.5 tracking-wider">Tempat / Lokasi Keterangan</label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-3.5 text-slate-500" />
              <input 
                type="text" placeholder="Misal: Ruang Guru, Aula Utama, Lab Komputer..."
                value={form.catatan_kelas} onChange={e => setForm(prev => ({ ...prev, catatan_kelas: e.target.value }))}
                className="w-full p-3 pl-9 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </>
      )}

      <button
        type="submit" disabled={loading}
        className={`w-full py-3 bg-gradient-to-r text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] ${tipeAgenda === 'KBM' ? 'from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500' : 'from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'}`}
      >
        <Save size={14} />
        {loading ? 'Menyimpan...' : 'Kunci & Simpan Jurnal'}
      </button>
    </form>
  );
}