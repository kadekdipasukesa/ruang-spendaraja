import React, { useEffect, useState } from 'react';
import useAgendaGuru from '../hooks/AgendaGuru/useAgendaGuru';
import FormAgenda from '../components/AgendaGuru/FormAgenda';
import { Calendar, ClipboardList, Briefcase, BookOpen, MapPin, User } from 'lucide-react';

export default function AgendaGuruPage() {
  const { loading, agendaList, siswaKelas, fetchAgenda, fetchSiswaByKelas, simpanAgenda } = useAgendaGuru();
  const [filterKelas, setFilterKelas] = useState('');

  useEffect(() => {
    fetchAgenda(filterKelas);
  }, [filterKelas, fetchAgenda]);

  const handleSaveAgenda = async (agendaPayload, absenPayload) => {
    const res = await simpanAgenda(agendaPayload, absenPayload);
    if (res.success) {
      alert('Agenda aktivitas berhasil disimpan!');
      fetchAgenda(filterKelas);
    } else {
      alert(`Gagal menyimpan: ${res.error}`);
    }
  };

  return (
    < div className = "min-h-screen bg-slate-950 text-slate-100 p-4 pt-24 sm:p-8 sm:pt-28 space-y-8" >
      
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="p-2.5 bg-indigo-500/10 rounded-2xl text-indigo-400">
          <ClipboardList size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black uppercase tracking-wider bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Jurnal Agenda Kerja Guru</h1>
          <p className="text-xs text-slate-500 font-medium">Log terpadu untuk kegiatan pengajaran kelas maupun aktivitas non-KBM kedinasan sekolah.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-5">
          <FormAgenda
            siswaKelas={siswaKelas}
            onKelasChange={fetchSiswaByKelas}
            onSave={handleSaveAgenda}
            loading={loading}
          />
        </div>

        <div className="xl:col-span-7 space-y-5">
          <div className="flex items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Linimasa Jurnal Aktivitas</span>
            <select
              value={filterKelas} onChange={e => setFilterKelas(e.target.value)}
              className="p-2 bg-slate-950 border border-white/10 rounded-xl text-[11px] font-bold text-slate-300 focus:outline-none"
            >
              <option value="">Semua Filter</option>
              <option value="VII A">Kelas VII A</option>
              <option value="VIII A">Kelas VIII A</option>
              <option value="IX A">Kelas IX A</option>
            </select>
          </div>

          <div className="space-y-4 max-h-[72vh] overflow-y-auto pr-2 no-scrollbar">
            {agendaList.map((agenda) => {
              const isKBM = agenda.tipe_agenda !== 'NON_KBM';
              return (
                <div key={agenda.id} className={`bg-slate-900/50 border rounded-2xl p-5 space-y-4 transition-all hover:bg-slate-900/80 ${isKBM ? 'border-white/5' : 'border-purple-500/20 bg-gradient-to-br from-slate-900/40 to-purple-950/10'}`}>
                  
                  {/* Meta Bar */}
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-white/[0.02] pb-2 text-[10px] font-mono text-slate-500 font-bold">
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-md text-slate-400">
                      <Calendar size={12} className={isKBM ? "text-indigo-400" : "text-purple-400"} />
                      {new Date(agenda.tanggal).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                    </div>
                    {isKBM && (
                      <div className="text-slate-400">Jam ke- <span className="text-indigo-400 font-black">{agenda.jam_ke}</span></div>
                    )}
                    <div className="flex items-center gap-1 text-slate-400"><User size={12} /> {agenda.nama_guru}</div>
                  </div>

                  {/* Isi Konten Dinamis */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {isKBM ? (
                          <span className="p-1 bg-indigo-500/10 text-indigo-400 rounded-md"><BookOpen size={12} /></span>
                        ) : (
                          <span className="p-1 bg-purple-500/10 text-purple-400 rounded-md"><Briefcase size={12} /></span>
                        )}
                        <h3 className="text-xs font-black uppercase tracking-wide text-slate-200">
                          {isKBM ? `Kelas ${agenda.kelas} • ${agenda.mata_pelajaran}` : 'Aktivitas Kerja Non-KBM'}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {agenda.materi_pokok}
                      </p>
                    </div>

                    <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${agenda.ketercapaian === 'Selesai' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      {agenda.ketercapaian === 'Selesai' ? 'Terlaksana' : agenda.ketercapaian}
                    </span>
                  </div>

                  {/* Lokasi (Hanya untuk Non-KBM jika diisi) */}
                  {!isKBM && agenda.catatan_kelas && (
                    <div className="flex items-center gap-1.5 text-[10px] text-purple-400 font-bold bg-purple-500/5 px-3 py-1.5 rounded-xl w-fit">
                      <MapPin size={12} />
                      Lokasi: <span className="text-slate-300 font-medium">{agenda.catatan_kelas}</span>
                    </div>
                  )}

                  {/* Absen Siswa (Hanya untuk KBM) */}
                  {isKBM && agenda.absen_agenda_siswa && agenda.absen_agenda_siswa.length > 0 && (
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1.5">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 block">Siswa Absen:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {agenda.absen_agenda_siswa.map((abs, idx) => (
                          <span key={idx} className="text-[9px] font-bold bg-slate-950 px-2 py-0.5 rounded-md text-slate-300 border border-white/5">
                            {abs.nama_siswa} <span className="text-amber-400 font-mono">({abs.status_absen[0]})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {isKBM && agenda.catatan_kelas && (
                    <div className="text-[10px] text-slate-500 bg-slate-950/40 p-2.5 rounded-xl border-l border-white/10">
                      <span className="font-bold text-slate-400">Catatan Kelas:</span> {agenda.catatan_kelas}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div >
  );
}