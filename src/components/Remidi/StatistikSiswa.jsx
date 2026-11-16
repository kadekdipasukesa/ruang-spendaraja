import React from 'react';
import { Users, Coins } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient'; // Pastikan path import benar

export default function StatistikSiswa({ peserta, statusSesi }) {
  
  const updatePoinLokal = async (id, poin) => {
    const { error } = await supabase
      .from('ujian_peserta')
      .update({ total_poin_didapat: parseInt(poin) || 0 })
      .eq('id', id);
    
    if (error) console.error("Gagal update poin:", error.message);
  };

  return (
    <div className="bg-slate-900 border border-white/10 rounded-[2rem] overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-2">
          <Users className="text-blue-400" size={20} />
          <h3 className="text-white font-bold">Daftar Peserta ({peserta.length})</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-500 text-[10px] uppercase font-black tracking-widest bg-black/20">
              <th className="p-4">Nama Siswa</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Pelanggaran</th>
              <th className="p-4 text-right">Skor</th>
              <th className="p-4 text-center text-blue-400">
                <div className="flex items-center justify-center gap-1">
                  <Coins size={12} /> ADD POIN
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {peserta.map((s) => (
              <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-medium text-slate-200">
                  {s.master_siswa?.NAMA || 'Siswa Tanpa Nama'}
                </td>
                <td className="p-4">
                  <StatusBadge status={s.status_ujian} />
                </td>
                <td className="p-4 text-center">
                  <span className={`font-bold ${s.cheat_count > 0 ? 'text-red-500' : 'text-slate-600'}`}>
                    {s.cheat_count}
                  </span>
                </td>
                <td className="p-4 text-right font-mono font-bold text-slate-400">
                  {s.nilai_akhir !== null ? s.nilai_akhir : '-'}
                </td>
                
                {/* KOLOM INPUT POIN */}
                <td className="p-4 text-center">
                  <input 
                    type="number"
                    min="0"
                    className={`w-20 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-center font-black text-blue-400 focus:outline-none focus:border-blue-500 transition-all ${
                        statusSesi !== 'finished' ? 'opacity-30 cursor-not-allowed' : 'hover:border-white/20'
                    }`}
                    defaultValue={s.total_poin_didapat || 0}
                    disabled={statusSesi !== 'finished'}
                    onBlur={(e) => updatePoinLokal(s.id, e.target.value)}
                    placeholder="0"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper Badge
function StatusBadge({ status }) {
  const styles = {
    ready: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    starting: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    ongoing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    blocked: "bg-red-500/10 text-red-500 border-red-500/20",
    submitted: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };

  return (
    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase border ${styles[status] || styles.submitted}`}>
      {status}
    </span>
  );
}