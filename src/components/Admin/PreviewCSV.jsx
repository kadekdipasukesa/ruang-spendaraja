import React from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, UserPlus, RefreshCw, GraduationCap } from 'lucide-react';

export default function PreviewCSV({ previewData, onCommit, onCancel, loading }) {
  if (!previewData || previewData.length === 0) return null;

  const countBaru = previewData.filter((i) => i.type === 'BARU').length;
  const countPindah = previewData.filter((i) => i.type === 'PINDAH_KELAS').length;
  const countAlumni = previewData.filter((i) => i.type === 'ALUMNI').length;
  const countError = previewData.filter((i) => i.type === 'ERROR').length;

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-black uppercase text-white tracking-wider">Preview Konfirmasi Perubahan</h2>
          <p className="text-xs text-slate-400">Silahkan periksa baris data sebelum dikunci ke database.</p>
        </div>

        {/* Legend Indikator */}
        <div className="flex flex-wrap gap-2 text-[10px] font-bold">
          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg flex items-center gap-1">
            <UserPlus size={12} /> {countBaru} Baru
          </span>
          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg flex items-center gap-1">
            <RefreshCw size={12} /> {countPindah} Naik/Pindah Kelas
          </span>
          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg flex items-center gap-1">
            <GraduationCap size={12} /> {countAlumni} Menjadi Alumni
          </span>
          {countError > 0 && (
            <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg flex items-center gap-1">
              <AlertCircle size={12} /> {countError} Error
            </span>
          )}
        </div>
      </div>

      {/* Tabel Preview */}
      <div className="max-h-96 overflow-y-auto rounded-xl border border-white/5 no-scrollbar">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 sticky top-0 uppercase text-[10px] font-mono tracking-wider">
            <tr>
              <th className="p-3">Nama Siswa</th>
              <th className="p-3">NISN</th>
              <th className="p-3">Status / Aksi</th>
              <th className="p-3">Kelas Lama</th>
              <th className="p-3">Kelas Baru</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {previewData.map((item, idx) => {
              let rowStyle = 'hover:bg-slate-800/50';
              let badge = null;

              if (item.type === 'BARU') {
                rowStyle = 'bg-emerald-950/20 border-l-4 border-l-emerald-500 text-emerald-200';
                badge = <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Siswa Baru</span>;
              } else if (item.type === 'PINDAH_KELAS') {
                rowStyle = 'bg-blue-950/20 border-l-4 border-l-blue-500 text-blue-200';
                badge = <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Pindah Kelas</span>;
              } else if (item.type === 'ALUMNI') {
                rowStyle = 'bg-amber-950/20 border-l-4 border-l-amber-500 text-amber-200';
                badge = <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Alumni</span>;
              } else if (item.type === 'ERROR') {
                rowStyle = 'bg-rose-950/30 border-l-4 border-l-rose-500 text-rose-200';
                badge = <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">Error: {item.reason}</span>;
              } else {
                rowStyle = 'text-slate-400';
                badge = <span className="text-[9px] font-medium text-slate-500">Tetap</span>;
              }

              return (
                <tr key={idx} className={`transition-colors ${rowStyle}`}>
                  <td className="p-3 font-bold">{item.payload?.NAMA || item.data?.NAMA || '-'}</td>
                  <td className="p-3 font-mono">{item.payload?.NISN || '-'}</td>
                  <td className="p-3">{badge}</td>
                  <td className="p-3 font-mono">{item.oldKelas || '-'}</td>
                  <td className="p-3 font-mono font-bold flex items-center gap-1">
                    {item.oldKelas !== item.newKelas && <ArrowRight size={12} className="text-slate-500" />}
                    {item.newKelas}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tombol Aksi */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onCommit}
          disabled={loading}
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 transition-all"
        >
          <CheckCircle2 size={16} />
          {loading ? 'Proses Simpan...' : 'Konfirmasi & Terapkan Perubahan'}
        </button>
      </div>
    </div>
  );
}