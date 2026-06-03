import React, { useState } from 'react';
import { AlertOctagon, ShieldAlert, AlertTriangle, UserX, Search, ChevronDown, ChevronUp } from 'lucide-react';
import ModalRiwayatSiswa from './ModalRiwayatSiswa';

export default function RekapSiswa({ data }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('Semua'); // State baru untuk filter kelas dropdown
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [limit, setLimit] = useState(10); // Default menampilkan 10 siswa pertama

  // 1. Ekstrak daftar kelas unik secara otomatis dari props data untuk kebutuhan isi dropdown filter
  const daftarKelasUnik = Array.from(
    new Set((data || []).map(s => s.Kelas).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  // 2. Filter data: Mengambil SEMUA siswa yang melanggar (> 0) + lolos filter pencarian + lolos dropdown kelas
  const filteredData = (data || []).filter(siswa => {
    const mempunyaiPelanggaran = (siswa.total_pelanggaran || 0) > 0;
    const cocokNama = siswa.NAMA?.toLowerCase().includes(searchQuery.toLowerCase());
    const cocokKelasKetik = siswa.Kelas?.toLowerCase().includes(searchQuery.toLowerCase());
    const cocokDropdownKelas = selectedKelas === 'Semua' || siswa.Kelas === selectedKelas;

    return mempunyaiPelanggaran && (cocokNama || cocokKelasKetik) && cocokDropdownKelas;
  });

  // 3. Batasi pemotongan (slice) hanya pada level rendering tampilan saja agar data di bawahnya tetap tersimpan
  const itemsToRender = filteredData.slice(0, limit);
  const hasMore = filteredData.length > limit;

  return (
    <div className="bg-slate-800/30 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl h-fit">
      {/* Header - Diganti dari Trophy ke AlertOctagon agar lebih tegas */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <AlertOctagon size={22} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-white font-black italic tracking-widest uppercase text-sm">
              Daftar Poin Kedisiplinan
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
              Siswa dengan akumulasi catatan terbanyak
            </p>
          </div>
        </div>

        {/* CONTROLLER BOX: PENCARIAN & FILTER DROPDOWN KELAS */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Dropdown Filter Kelas */}
          <select
            value={selectedKelas}
            onChange={(e) => {
              setSelectedKelas(e.target.value);
              setLimit(10); // Reset limit ke 10 setiap kali filter kelas diganti
            }}
            className="bg-slate-950/50 border border-white/5 rounded-xl px-2.5 py-1.5 text-[10px] font-black uppercase text-slate-300 focus:outline-none focus:border-white/20 transition-all cursor-pointer h-[32px]"
          >
            <option value="Semua" className="bg-slate-900 text-white">Semua Kelas</option>
            {daftarKelasUnik.map((kls) => (
              <option key={kls} value={kls} className="bg-slate-900 text-white">Kelas {kls}</option>
            ))}
          </select>

          {/* Kolom Pencarian Dinamis */}
          <div className="relative flex-1 sm:w-44">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Cari nama siswa..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setLimit(10); // Reset limit ke 10 setiap kali admin mengetik pencarian baru
              }}
              className="w-full bg-slate-950/50 border border-white/5 rounded-xl pl-8 pr-3 py-1.5 text-[10px] font-bold uppercase text-white placeholder-slate-600 focus:outline-none focus:border-white/20 transition-all h-[32px]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1 scrollbar-hide">
        {itemsToRender.length > 0 ? (
          <>
            {itemsToRender.map((siswa, idx) => {
              // Tentukan status berdasarkan jumlah poin
              const isCritical = siswa.total_pelanggaran >= 4;
              
              return (
                <div 
                  key={siswa.id || idx} 
                  onClick={() => setSelectedSiswa(siswa)} // Trigger modal log riwayat
                  className={`p-4 rounded-2xl flex items-center justify-between border transition-all duration-300 hover:scale-[1.01] shadow-sm cursor-pointer active:scale-[0.99]
                    ${isCritical 
                      ? 'bg-red-500/10 border-red-500/30 shadow-red-900/10' 
                      : 'bg-slate-900/40 border-white/5'}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Ranking Indicator */}
                    <span className={`text-[10px] font-black italic w-6 ${isCritical ? 'text-red-500' : 'text-slate-600'}`}>
                      #{idx + 1}
                    </span>
                    
                    <div>
                      <p className={`font-black text-xs uppercase tracking-tight ${isCritical ? 'text-red-400' : 'text-slate-200'}`}>
                        {siswa.NAMA}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                         <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">
                           {siswa.Kelas || 'Tanpa Kelas'}
                         </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-950/50 px-4 py-2 rounded-xl border border-white/5">
                    <div className="text-right">
                      <p className="text-[8px] text-slate-500 font-black uppercase leading-none mb-1">Total Poin</p>
                      <span className={`font-black text-xl leading-none ${isCritical ? 'text-red-500' : 'text-yellow-500'}`}>
                        {siswa.total_pelanggaran}
                      </span>
                    </div>
                    {isCritical ? (
                      <ShieldAlert className="text-red-600 animate-pulse" size={20} />
                    ) : (
                      <AlertTriangle className="text-yellow-500" size={18} />
                    )}
                  </div>
                </div>
              );
            })}

            {/* 🔥 BUTTON SHOW MORE / SHOW LESS GAYA DASHED INTERAKTIF */}
            {(hasMore || limit > 10) && (
              <button
                onClick={() => setLimit(prev => hasMore ? prev + 15 : 10)}
                className="w-full py-3 mt-2 border border-dashed border-white/5 bg-slate-900/20 hover:bg-slate-900/40 text-[10px] text-slate-400 hover:text-white font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                {hasMore ? (
                  <>Tampilkan Lebih Banyak ({filteredData.length - limit} Siswa) <ChevronDown size={12} /></>
                ) : (
                  <>Sembunyikan Daftar <ChevronUp size={12} /></>
                )}
              </button>
            )}
          </>
        ) : (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
              <UserX className="text-slate-700" size={30} />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">
              Data tidak ditemukan / Siswa bersih.
            </p>
          </div>
        )}
      </div>

      {/* Tampilkan modal log riwayat khusus siswa terpilih */}
      {selectedSiswa && (
        <ModalRiwayatSiswa 
          siswa={selectedSiswa} 
          onClose={() => setSelectedSiswa(null)} 
        />
      )}
    </div>
  );
}