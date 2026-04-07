import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, User, Info, ChevronRight, ShieldAlert, HeartHandshake, UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function FormPelanggaran({ type, canAccess, onSubmit, loading, daftarPelanggaran }) {
  const [search, setSearch] = useState('');
  const [suggested, setSuggested] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [pelanggaran, setPelanggaran] = useState('');
  const [catatan, setCatatan] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  // Klik di luar untuk tutup dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Siswa
  useEffect(() => {
    const fetchSiswa = async () => {
      if (search.length < 3 || selectedSiswa) return setSuggested([]);
      const { data } = await supabase.from('master_siswa').select('*').ilike('NAMA', `%${search}%`).limit(5);
      setSuggested(data || []);
    };
    const delay = setTimeout(fetchSiswa, 300);
    return () => clearTimeout(delay);
  }, [search, selectedSiswa]);

  if (!canAccess) return null;

  // --- LOGIKA SUBMIT LOKAL ---
  const handleLocalSubmit = (e) => {
    e.preventDefault();
    if (!selectedSiswa) return alert("Pilih siswa terlebih dahulu!");

    let finalJenis = pelanggaran;

    if (type === 'pengabdian') {
      const skorSiswa = selectedSiswa.total_pelanggaran || 0;
      if (skorSiswa <= 0) return alert("Siswa ini tidak memiliki poin pelanggaran untuk dihapus!");

      // 1. Tentukan Keterangan Otomatis berdasarkan skor
      if (skorSiswa >= 7) finalJenis = "PENGABDIAN SEMINGGU";
      else if (skorSiswa >= 5) finalJenis = "PENGABDIAN 4 HARI";
      else if (skorSiswa >= 3) finalJenis = "PENGABDIAN 2 HARI";
      else finalJenis = "PENGABDIAN RINGAN";

      // Catatan otomatis pengurangan skor
      const infoCatatan = `[Reset Poin -${skorSiswa}] ${catatan}`;

      // 2. Kirim ke parent (PelanggaranPage.jsx)
      // Kita kirim finalJenis agar 'jenisFinal' di parent menangkap durasi hari
      onSubmit({ 
        selectedSiswa, 
        pelanggaran: finalJenis, 
        catatan: infoCatatan, 
        type 
      });
    } else {
      // Validasi Pelanggaran harus dari daftar
      if (!daftarPelanggaran.some(p => p.jenis === pelanggaran)) {
        return alert("Pilih jenis pelanggaran dari daftar yang tersedia!");
      }
      onSubmit({ selectedSiswa, pelanggaran, catatan, type });
    }

    // Reset Form
    setSelectedSiswa(null); 
    setSearch(''); 
    setCatatan('');
    setPelanggaran('');
  };

  // Helper untuk cek tombol submit
  const isSubmitDisabled = () => {
    if (loading || !selectedSiswa) return true;
    if (type === 'pelanggaran') {
      return !daftarPelanggaran.some(p => p.jenis === pelanggaran);
    }
    if (type === 'pengabdian') {
      return (selectedSiswa.total_pelanggaran || 0) <= 0;
    }
    return false;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-2xl text-white shadow-lg ${type === 'pelanggaran' ? 'bg-red-600 shadow-red-900/20' : 'bg-emerald-600 shadow-emerald-900/20'}`}>
          {type === 'pelanggaran' ? <ShieldAlert size={20} /> : <HeartHandshake size={20} />}
        </div>
        <div>
          <h2 className="text-white font-black italic tracking-tighter uppercase text-sm">
            {type === 'pelanggaran' ? 'Input Catatan Pelanggaran' : 'Input Poin Pengabdian'}
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Lengkapi data dengan teliti</p>
        </div>
      </div>

      <form onSubmit={handleLocalSubmit} className="space-y-4">
        {/* Search Siswa */}
        <div className="relative">
          <label className="text-blue-400 text-[9px] font-black uppercase tracking-widest ml-1 mb-2 block">Cari Nama Siswa</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" value={search} onChange={(e) => setSearch(e.target.value)} disabled={selectedSiswa} 
              className="w-full bg-slate-900/80 border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl outline-none text-xs font-bold uppercase transition-all" 
              placeholder="Cari nama siswa..." 
            />
          </div>
          {suggested.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {suggested.map(s => (
                <button key={s.id} type="button" onClick={() => { setSelectedSiswa(s); setSearch(s.NAMA); setSuggested([]); }} className="w-full p-4 text-left hover:bg-blue-600/20 flex justify-between items-center group transition-colors">
                  <div>
                    <p className="text-white font-bold text-xs uppercase">{s.NAMA}</p>
                    <p className="text-slate-500 text-[9px] uppercase font-black">{s.Kelas}</p>
                  </div>
                  <UserPlus size={16} className="text-slate-600 group-hover:text-blue-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedSiswa && (
          <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-2xl flex items-center justify-between animate-in zoom-in duration-300">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-xl text-white shadow-md"><User size={18} /></div>
              <div>
                <p className="text-white font-black text-xs uppercase">{selectedSiswa.NAMA}</p>
                <p className="text-blue-400 text-[9px] font-bold uppercase tracking-widest">Poin Pelanggaran: {selectedSiswa.total_pelanggaran || 0}</p>
              </div>
            </div>
            <button type="button" onClick={() => {setSelectedSiswa(null); setSearch('');}} className="text-[8px] bg-slate-800 hover:bg-red-500 text-slate-300 hover:text-white px-3 py-2 rounded-xl font-black transition-all uppercase">Ganti</button>
          </div>
        )}

        {/* Input Detail */}
        <div className="space-y-4">
          <label className="text-blue-400 text-[9px] font-black uppercase tracking-widest ml-1 block">Detail Keterangan</label>
          
          {type === 'pelanggaran' ? (
            <div className="relative" ref={dropdownRef}>
              <div className="relative">
                <input
                  type="text" value={pelanggaran} onChange={(e) => { setPelanggaran(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-slate-900/80 border border-white/10 text-white px-4 py-4 rounded-2xl outline-none text-[11px] font-bold uppercase focus:ring-2 focus:ring-red-500"
                  placeholder="Pilih jenis pelanggaran..."
                />
                <ChevronRight size={18} className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-transform ${showSuggestions ? 'rotate-90' : 'rotate-0'}`} />
              </div>
              {showSuggestions && (
                <div className="absolute z-[100] w-full mt-2 max-h-60 overflow-y-auto bg-slate-950 border border-white/20 rounded-2xl shadow-2xl backdrop-blur-2xl">
                  {daftarPelanggaran.filter(p => p.jenis.toLowerCase().includes(pelanggaran.toLowerCase())).map((p) => (
                    <div key={p.id} onMouseDown={(e) => { e.preventDefault(); setPelanggaran(p.jenis); setShowSuggestions(false); }} className="w-full p-4 text-left hover:bg-red-500/20 border-b border-white/5 flex items-center justify-between group cursor-pointer transition-all">
                      <div className="flex flex-col">
                        <span className="text-white text-[10px] font-bold uppercase group-hover:text-red-400">{p.jenis}</span>
                        <span className="text-[9px] text-slate-500 font-black uppercase">{p.kategori}</span>
                      </div>
                      <span className="bg-slate-800 text-red-500 text-[9px] px-2 py-1 rounded-lg font-black">+{p.skor}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* --- TAMPILAN OTOMATIS PENGABDIAN --- */
            <div className="w-full bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-emerald-400 text-[11px] font-black uppercase tracking-tighter">
                  {!selectedSiswa ? "Pilih Siswa Terlebih Dahulu" : (
                    selectedSiswa.total_pelanggaran >= 7 ? "PENGABDIAN SEMINGGU" :
                    selectedSiswa.total_pelanggaran >= 5 ? "PENGABDIAN 4 HARI" :
                    selectedSiswa.total_pelanggaran >= 3 ? "PENGABDIAN 2 HARI" :
                    "PENGABDIAN RINGAN"
                  )}
                </span>
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-emerald-500/20">
                  RESET TO 0
                </span>
              </div>
              <p className="text-[9px] text-emerald-500/60 font-bold uppercase">Durasi ditentukan otomatis berdasarkan akumulasi poin siswa.</p>
            </div>
          )}

          <textarea
            rows="3" value={catatan} onChange={(e) => setCatatan(e.target.value)}
            className="w-full bg-slate-900/80 border border-white/10 text-white p-4 rounded-2xl outline-none text-xs font-medium focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Catatan tambahan (lokasi, saksi, atau alasan)..."
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitDisabled()} 
          className={`w-full py-5 rounded-2xl text-white font-black flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg
            ${isSubmitDisabled() 
              ? 'bg-slate-700 cursor-not-allowed opacity-50 shadow-none' 
              : type === 'pelanggaran' 
                ? 'bg-gradient-to-r from-red-600 to-rose-700 shadow-red-900/40' 
                : 'bg-gradient-to-r from-emerald-600 to-teal-700 shadow-emerald-900/40'}`}
        >
          <Send size={18} className={loading ? "animate-ping" : ""} /> 
          {loading ? "MENYIMPAN DATA..." : "KONFIRMASI SIMPAN"}
        </button>
      </form>
    </div>
  );
}