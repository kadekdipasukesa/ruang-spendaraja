import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Eye, Table } from 'lucide-react';

export default function ModalDownloadCsv({ isOpen, onClose, sortedMonths, groupedData, rawData }) {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [previewData, setPreviewData] = useState([]);

  // Set default select ke bulan terbaru saat modal terbuka
  useEffect(() => {
    if (sortedMonths && sortedMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(sortedMonths[0]);
    }
  }, [sortedMonths, isOpen]);

  // Efek untuk memperbarui data preview setiap kali bulan diubah
  useEffect(() => {
    if (!selectedMonth || !rawData) {
      setPreviewData([]);
      return;
    }

    const filtered = rawData.filter(item => {
      if (!item.tanggal) return false;
      const dateObj = new Date(item.tanggal);
      const itemMonthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      return itemMonthKey === selectedMonth;
    });

    setPreviewData(filtered);
  }, [selectedMonth, rawData, isOpen]);

  const handleDownloadCsv = () => {
    if (previewData.length === 0) {
      alert('Tidak ada data pelanggaran di bulan yang Anda pilih.');
      return;
    }

    // 1. Definisikan header kolom CSV
    const headers = ['Tanggal', 'Waktu (WITA)', 'Nama Siswa', 'Kelas', 'Jenis Pelanggaran', 'Poin', 'Catatan', 'Pelapor'];

    // 2. Map data ke baris-baris CSV
    const rows = previewData.map(item => {
      const dateObj = new Date(item.tanggal);
      const tanggalFormat = dateObj.toLocaleDateString('id-ID', { dateStyle: 'medium' });
      const waktuFormat = dateObj.toLocaleTimeString('id-ID', { timeZone: 'Asia/Makassar', hour: '2-digit', minute: '2-digit' });
      
      return [
        `"${tanggalFormat}"`,
        `"${waktuFormat}"`,
        `"${item.master_siswa?.NAMA || '-'}"`,
        `"${item.master_siswa?.Kelas || '-'}"`,
        `"${item.jenis_pelanggaran || '-'}"`,
        item.poin_pelanggaran,
        `"${item.catatan || 'Tanpa catatan'}"`,
        `"${item.pelapor?.NAMA || 'Sistem'}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    // Blob UTF-8 encoding
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const namaFile = `Log_Pelanggaran_${groupedData[selectedMonth]?.namaBulan.replace(/\s+/g, '_') || selectedMonth}.csv`;
    link.setAttribute('download', namaFile);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Gelap */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          />

          {/* Kotak Konten Modal (Lebar ditingkatkan ke max-w-2xl untuk area preview) */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-2xl p-6 overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 flex-shrink-0">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <Download size={18} />
                <h4 className="text-white font-black text-xs uppercase tracking-wider">Export & Preview Data (.CSV)</h4>
              </div>
              <button 
                onClick={onClose} 
                className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Seleksi Bulan */}
            <div className="space-y-2 mb-4 flex-shrink-0">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                Pilih Periode Bulan:
              </label>
              {sortedMonths && sortedMonths.length > 0 ? (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                >
                  {sortedMonths.map((monthKey) => (
                    <option key={monthKey} value={monthKey}>
                      {groupedData[monthKey]?.namaBulan || monthKey} ({groupedData[monthKey]?.totalPelanggaranBulan || 0} Berkas)
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-xs text-slate-500 italic">Tidak ada data rekap bulanan yang tersedia.</p>
              )}
            </div>

            {/* ─── 👀 AREA PREVIEW DATA TABEL ─── */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-950/60 border border-white/5 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-2 text-slate-400 mb-3 flex-shrink-0">
                <Eye size={14} className="text-indigo-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Pratinjau Lembar Kerja ({previewData.length} Baris Terdeteksi)
                </span>
              </div>

              {previewData.length > 0 ? (
                <div className="flex-1 overflow-auto border border-white/[0.03] rounded-xl bg-slate-950 text-[10px] no-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-slate-900 sticky top-0 border-b border-white/5 text-slate-400 font-bold uppercase tracking-wider z-20">
                      <tr>
                        <th className="p-2.5 pl-4">Tanggal</th>
                        <th className="p-2.5">Siswa</th>
                        <th className="p-2.5">Kelas</th>
                        <th className="p-2.5">Pelanggaran</th>
                        <th className="p-2.5 pr-4 text-right">Poin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02] text-slate-300 font-medium">
                      {previewData.map((item, index) => {
                        const dateObj = new Date(item.tanggal);
                        return (
                          <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-2.5 pl-4 font-mono text-slate-500">
                              {dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' })}
                            </td>
                            <td className="p-2.5 font-bold text-slate-200 truncate max-w-[120px]">
                              {item.master_siswa?.NAMA || '-'}
                            </td>
                            <td className="p-2.5 text-indigo-400 font-black">{item.master_siswa?.Kelas || '-'}</td>
                            <td className="p-2.5 text-slate-400 truncate max-w-[200px]" title={item.jenis_pelanggaran}>
                              {item.jenis_pelanggaran || '-'}
                            </td>
                            <td className="p-2.5 pr-4 text-right font-mono font-black text-red-400">
                              +{item.poin_pelanggaran}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-40 py-8">
                  <Table size={24} className="mb-2 text-slate-600" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Kosong • Tidak ada data</p>
                </div>
              )}
            </div>

            {/* Tombol Aksi Bawah */}
            <div className="flex gap-3 border-t border-white/5 pt-4 flex-shrink-0">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-black uppercase tracking-wider rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDownloadCsv}
                disabled={previewData.length === 0}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/20 active:scale-[0.98] transition-all"
              >
                Confirm & Download
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}