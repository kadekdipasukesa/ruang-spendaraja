import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Minus, History, User, Calendar, Star, Search, X } from 'lucide-react';
import { supabase } from "../../lib/supabaseClient";

export default function AdminPoinPanel() {
  // State untuk Input Pencarian Dinamis
  const [inputNama, setInputNama] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSiswaObj, setSelectedSiswaObj] = useState(null); // Menyimpan objek siswa terpilih
  
  const [amount, setAmount] = useState(10);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  // LOGIK PENCARIAN DINAMIS (Sama seperti Navbar)
  useEffect(() => {
    if (inputNama.length > 2 && !selectedSiswaObj) {
      const searchNama = async () => {
        const { data } = await supabase
          .from('master_siswa')
          .select('*')
          .ilike('NAMA', `%${inputNama}%`)
          .limit(5);
        setSuggestions(data || []);
      };
      searchNama();
    } else {
      setSuggestions([]);
    }
  }, [inputNama, selectedSiswaObj]);

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('point_logs')
      .select('*, master_siswa(NAMA, Kelas)') // Pastikan kolom NAMA (huruf besar/kecil) sesuai DB
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setLogs(data);
  };

  const handleUpdatePoint = async (type) => {
    if (!selectedSiswaObj || !amount) return alert("Pilih siswa dan jumlah poin!");
    
    setLoading(true);
    const finalAmount = type === 'plus' ? amount : -amount;
    const activity = type === 'plus' ? 'Penambahan Poin' : 'Pengurangan Poin';

    try {
      const { error } = await supabase.from('point_logs').insert([
        {
          siswa_id: selectedSiswaObj.id,
          amount: finalAmount,
          activity_type: activity,
          description: description || 'Input Manual Admin'
        }
      ]);

      if (error) throw error;
      
      alert(`Berhasil ${activity} untuk ${selectedSiswaObj.NAMA}!`);
      
      // Reset Form
      setDescription('');
      setInputNama('');
      setSelectedSiswaObj(null);
      fetchLogs();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const groupedLogs = useMemo(() => {
    const groups = {};
    logs.forEach(log => {
      const date = new Date(log.created_at).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(log);
    });
    return groups;
  }, [logs]);

  return (
    <div className="space-y-6">
      {/* FORM INPUT POIN */}
      <div className="bg-slate-900 border border-emerald-500/30 p-6 rounded-3xl shadow-xl">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Star className="text-yellow-400" size={20} /> Input Poin Siswa
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* KOLOM PENCARIAN DINAMIS */}
          <div className="space-y-2 relative">
            <label className="text-xs text-slate-400 ml-1 font-bold uppercase tracking-widest">Cari Siswa</label>
            <div className={`flex items-center border rounded-xl p-3 bg-slate-800 transition-all ${selectedSiswaObj ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-700'}`}>
              <Search size={18} className={selectedSiswaObj ? 'text-emerald-500 mr-2' : 'text-slate-500 mr-2'} />
              <input 
                type="text"
                placeholder="Ketik nama siswa..."
                className="w-full bg-transparent text-white outline-none text-sm"
                value={selectedSiswaObj ? selectedSiswaObj.NAMA : inputNama}
                onChange={(e) => {
                  setInputNama(e.target.value);
                  setSelectedSiswaObj(null);
                }}
              />
              {selectedSiswaObj && (
                <button onClick={() => {setSelectedSiswaObj(null); setInputNama('');}}>
                  <X size={16} className="text-slate-400 hover:text-white" />
                </button>
              )}
            </div>

            {/* SUGGESTIONS DROPDOWN */}
            {suggestions.length > 0 && (
              <div className="absolute w-full bg-slate-800 border border-slate-700 rounded-xl mt-1 shadow-2xl z-50 overflow-hidden">
                {suggestions.map((s) => (
                  <div 
                    key={s.id} 
                    onClick={() => { setSelectedSiswaObj(s); setSuggestions([]); }}
                    className="p-3 hover:bg-emerald-600/20 cursor-pointer text-sm border-b border-slate-700 last:border-0 flex justify-between items-center text-white"
                  >
                    <span className="font-medium">{s.NAMA}</span>
                    <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded font-bold uppercase">{s.Kelas}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 ml-1 font-bold uppercase tracking-widest">Jumlah Poin</label>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <label className="text-xs text-slate-400 ml-1 font-bold uppercase tracking-widest">Keterangan / Alasan</label>
          <input 
            type="text"
            placeholder="Contoh: Juara Lomba Matematika / Melanggar Aturan"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={() => handleUpdatePoint('plus')}
            disabled={loading || !selectedSiswaObj}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus size={18} /> Tambah
          </button>
          <button
            onClick={() => handleUpdatePoint('minus')}
            disabled={loading || !selectedSiswaObj}
            className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white p-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus size={18} /> Kurangi
          </button>
        </div>
      </div>

      {/* RIWAYAT (Tetap sama) */}
      <div className="space-y-4">
        <h3 className="text-white font-bold flex items-center gap-2 px-2">
          <History className="text-blue-400" size={20} /> Riwayat Perubahan
        </h3>

        {Object.keys(groupedLogs).map(date => (
          <div key={date} className="space-y-2">
            <div className="sticky top-0 bg-slate-950/80 backdrop-blur-md py-1 px-3 rounded-lg z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={12} /> {date}
              </span>
            </div>
            
            <div className="space-y-2">
              {groupedLogs[date].map(log => (
                <div key={log.id} className="bg-slate-800/40 border border-slate-700/50 p-3 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${log.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {log.amount > 0 ? <Plus size={14}/> : <Minus size={14}/>}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">{log.master_siswa?.NAMA}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-medium">{log.master_siswa?.Kelas} • {log.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black ${log.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {log.amount > 0 ? `+${log.amount}` : log.amount}
                    </p>
                    <p className="text-[9px] text-slate-600 font-bold">
                      {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}