import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { X, ShieldAlert, Calendar, AlertTriangle, MessageSquare } from 'lucide-react';

export default function ModalRiwayatSiswa({ siswa, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!siswa) return;
    
    const fetchRiwayat = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('log_pelanggaran_siswa')
          .select('id, tanggal, jenis_pelanggaran, poin_pelanggaran, catatan')
          .eq('siswa_id', siswa.id)
          .order('tanggal', { ascending: false });

        if (error) throw error;
        setLogs(data || []);
      } catch (err) {
        console.error('Gagal memuat riwayat:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRiwayat();
  }, [siswa]);

  if (!siswa) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header Modal */}
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
              <ShieldAlert size={16} />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">{siswa.NAMA}</h3>
              <p className="text-[9px] text-slate-500 font-bold">KELAS {siswa.Kelas || '-'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Konten Log Kasus */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3 bg-slate-950/10">
          {loading ? (
            <div className="text-center py-10 text-[10px] text-slate-500 font-bold uppercase tracking-wider animate-pulse">Memuat Berkas Log...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-10 text-[10px] text-slate-600 italic">Siswa ini bersih dari catatan pelanggaran tertulis.</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="bg-slate-950/40 border border-white/5 p-3 rounded-xl space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] text-slate-200 font-black uppercase tracking-wide">{log.jenis_pelanggaran}</span>
                  <span className="text-[10px] bg-red-500/10 text-red-400 font-mono px-2 py-0.5 rounded-md font-black shrink-0 flex items-center gap-1">
                    <AlertTriangle size={10} /> +{log.poin_pelanggaran} Poin
                  </span>
                </div>
                {log.catatan && (
                  <p className="text-[10px] text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-white/[0.02] flex items-start gap-1.5">
                    <MessageSquare size={10} className="text-slate-600 shrink-0 mt-0.5" />
                    <span className="italic">"{log.catatan}"</span>
                  </p>
                )}
                <div className="text-[9px] text-slate-500 font-medium flex items-center gap-1 pt-1">
                  <Calendar size={10} /> 
                  {log.tanggal ? new Date(log.tanggal).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' }) : '-'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}