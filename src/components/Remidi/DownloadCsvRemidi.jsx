import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Download, FileSpreadsheet, X, Eye, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DownloadCsvRemidi({ sesiId, judulSesi }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataPreview, setDataPreview] = useState([]);

    // Fungsi mengambil data real dari Supabase dengan relasi nama kolom yang presisi
    const fetchDataRemidi = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('remidi_peserta')
                .select(`
                    id,
                    status_ujian,
                    cheat_count,
                    nilai_akhir,
                    created_at,
                    master_siswa (
                        "NAMA",
                        "Kelas",
                        "No Absen",
                        "NISN"
                    )
                `)
                .eq('sesi_id', sesiId);

            if (error) throw error;

            // Proses sorting: Urut Kelas -> Urut No Absen sesuai nama kolom baru kamu
            const sortedData = (data || []).sort((a, b) => {
                const kelasA = (a.master_siswa?.['Kelas'] || '').toLowerCase();
                const kelasB = (b.master_siswa?.['Kelas'] || '').toLowerCase();
                if (kelasA !== kelasB) return kelasA.localeCompare(kelasB);

                const absenA = parseInt(a.master_siswa?.['No Absen']) || 0;
                const absenB = parseInt(b.master_siswa?.['No Absen']) || 0;
                return absenA - absenB;
            });

            setDataPreview(sortedData);
        } catch (err) {
            console.error('Gagal memuat preview data CSV:', err.message);
            alert('Gagal mengambil data untuk CSV');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        setIsOpen(true);
        fetchDataRemidi();
    };

    const handleDownloadCsv = () => {
        if (dataPreview.length === 0) return alert('Tidak ada data untuk didownload');

        const headers = ['No', 'Kelas', 'No Absen', 'Nama Siswa', 'NISN', 'Status Ujian', 'Jumlah Cheat', 'Nilai Akhir'];
        
        const rows = dataPreview.map((p, index) => [
            index + 1,
            `"${p.master_siswa?.['Kelas'] || '-'}"`,
            p.master_siswa?.['No Absen'] || '-',
            `"${p.master_siswa?.['NAMA'] || '-'}"`,
            `'${p.master_siswa?.['NISN'] || '-'}`, // Tetap aman dengan prefiks petik agar nol di depan tidak hilang di Excel
            `"${p.status_ujian}"`,
            p.cheat_count,
            p.nilai_akhir !== null ? p.nilai_akhir : 'Belum Selesai'
        ]);

        const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Hasil_Remidi_${judulSesi.replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <button
                onClick={handleOpenModal}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer"
            >
                <FileSpreadsheet size={14} />
                EKSPOR CSV
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-950/40">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                                        <Eye size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-tight">Preview Data Sebelum Ekspor</h3>
                                        <p className="text-[10px] text-slate-400">Data terurut berdasarkan Kelas & No Absen (Master Siswa Mapping)</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsOpen(false)} 
                                    className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1 bg-slate-950/20 scrollbar-hide">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 text-xs">
                                        <RefreshCw size={24} className="animate-spin text-emerald-500" />
                                        Sedang menyinkronkan data...
                                    </div>
                                ) : dataPreview.length === 0 ? (
                                    <div className="text-center py-20 text-xs text-slate-500 italic">
                                        Belum ada peserta yang terdaftar pada sesi remidi ini.
                                    </div>
                                ) : (
                                    <div className="border border-white/5 rounded-2xl overflow-hidden bg-slate-950/60">
                                        <table className="w-full text-left text-xs divide-y divide-white/5">
                                            <thead className="bg-slate-900 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                                <tr>
                                                    <th className="p-3 text-center">No</th>
                                                    <th className="p-3">Kelas</th>
                                                    <th className="p-3 text-center">Absen</th>
                                                    <th className="p-3">Nama Siswa</th>
                                                    <th className="p-3">NISN</th>
                                                    <th className="p-3">Status</th>
                                                    <th className="p-3 text-center">Cheat</th>
                                                    <th className="p-3 text-right">Nilai Final</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/[0.02] text-slate-300 font-medium">
                                                {dataPreview.map((p, idx) => (
                                                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                                                        <td className="p-3 text-center text-slate-500 font-mono">{idx + 1}</td>
                                                        <td className="p-3 font-bold text-amber-400">{p.master_siswa?.['Kelas'] || '-'}</td>
                                                        <td className="p-3 text-center font-mono">{p.master_siswa?.['No Absen'] || '-'}</td>
                                                        <td className="p-3 text-white font-semibold">{p.master_siswa?.['NAMA'] || '-'}</td>
                                                        <td className="p-3 font-mono text-slate-400">{p.master_siswa?.['NISN'] || '-'}</td>
                                                        <td className="p-3">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                                p.status_ujian === 'submitted' ? 'bg-emerald-500/10 text-emerald-400' :
                                                                p.status_ujian === 'blocked' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                                                            }`}>
                                                                {p.status_ujian}
                                                            </span>
                                                        </td>
                                                        <td className="p-3 text-center font-mono text-red-400">{p.cheat_count}x</td>
                                                        <td className="p-3 text-right font-bold text-white font-mono">
                                                            {p.nilai_akhir !== null ? p.nilai_akhir : <span className="text-slate-600 text-[10px] italic">Process</span>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-white/5 bg-slate-900 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-5 py-3 border border-white/10 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    disabled={loading || dataPreview.length === 0}
                                    onClick={handleDownloadCsv}
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-black px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/10"
                                >
                                    <Download size={14} />
                                    Download CSV Sekarang
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}