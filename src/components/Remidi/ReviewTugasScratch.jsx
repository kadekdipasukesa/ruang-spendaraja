import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Star, FileSpreadsheet, Download, RefreshCw, Youtube, CheckCircle } from 'lucide-react';

export default function ReviewTugasScratch() {
    const [tugasList, setTugasList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Ambil semua tugas beserta data nomor absen dari relasi master_siswa
    const fetchSemuaTugas = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('tugas_scratch_sas')
                .select(`
                    id,
                    siswa_id,
                    nama_siswa,
                    kelas,
                    link_youtube,
                    terpilih_terbaik,
                    master_siswa (
                        "No Absen"
                    )
                `);
            
            if (error) throw error;

            // Urutkan berdasarkan Kelas, lalu berdasarkan No Absen
            const sorted = (data || []).sort((a, b) => {
                const kelasA = (a.kelas || '').toLowerCase();
                const kelasB = (b.kelas || '').toLowerCase();
                if (kelasA !== kelasB) return kelasA.localeCompare(kelasB);

                const absenA = parseInt(a.master_siswa?.['No Absen']) || 0;
                const absenB = parseInt(b.master_siswa?.['No Absen']) || 0;
                return absenA - absenB;
            });

            setTugasList(sorted);
        } catch (err) {
            console.error('Gagal memuat tugas scratch:', err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSemuaTugas();
    }, []);

    // Fungsi utilitas untuk konversi link youtube reguler menjadi url embed player
    const dapatkanUrlEmbed = (url) => {
        // Jika string kosong atau bukan teks, kembalikan halaman kosong bawaan browser (aman dari eror sameorigin)
        if (!url || typeof url !== 'string') return 'about:blank';
        
        // Bersihkan spasi tidak sengaja di awal/akhir link
        const cleanUrl = url.trim();
    
        try {
            // Regex mutakhir untuk menangkap segala jenis keanehan link YouTube dari kiriman siswa
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
            const match = cleanUrl.match(regExp);
            
            if (match && match[2] && match[2].length === 11) {
                const videoId = match[2];
                // Format wajib resmi untuk pemutar internal iframe
                return `https://www.youtube.com/embed/${videoId}`;
            }
    
            // AKAL CERDIK: Jika link tidak mengandung format ID YouTube yang valid, 
            // jangan return URL aslinya! Return 'about:blank' agar iframe tetap kosong 
            // tanpa memicu spam eror X-Frame-Options di console browser.
            return 'about:blank';
        } catch (e) {
            return 'about:blank';
        }
    };

    // Fungsi mengubah nilai terpilih_terbaik secara instan ke server Supabase
    const toggleTerbaik = async (id, currentStatus) => {
        try {
            const { error } = await supabase
                .from('tugas_scratch_sas')
                .update({ terpilih_terbaik: !currentStatus })
                .eq('id', id);

            if (error) throw error;

            // Perbarui state lokal agar UI langsung sinkron tanpa reload total
            setTugasList(prev => prev.map(item => 
                item.id === id ? { ...item, terpilih_terbaik: !currentStatus } : item
            ));
        } catch (err) {
            alert('Gagal memperbarui status pilihan terbaik');
        }
    };

    // Fungsi ekspor data valid ke format .CSV
    const handleDownloadCsv = () => {
        if (tugasList.length === 0) return alert('Tidak ada data tugas untuk diekspor');

        const headers = ['No', 'Kelas', 'No Absen', 'Nama Siswa', 'Link YouTube Karya', 'Status Pilihan Terbaik'];
        
        const rows = tugasList.map((t, idx) => [
            idx + 1,
            `"${t.kelas || '-'}"`,
            t.master_siswa?.['No Absen'] || '-',
            `"${t.nama_siswa || '-'}"`,
            `"${t.link_youtube}"`,
            t.terpilih_terbaik ? 'TERBAIK (LULUS SAS)' : 'Tugas Reguler'
        ]);

        const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Rekap_Nilai_Tugas_Scratch_SAS.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-6 shadow-xl space-y-6">
            {/* Header Kontrol Utama */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                        🛡️ Panel Koreksi Admin (Tugas Scratch)
                    </h3>
                    <p className="text-[10px] text-slate-400">Review video kiriman siswa dan tentukan 10 karya showcase terbaik.</p>
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={fetchSemuaTugas}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors"
                        title="Refresh Data"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={handleDownloadCsv}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer"
                    >
                        <FileSpreadsheet size={14} />
                        UNDUH CSV VALID
                    </button>
                </div>
            </div>

            {/* Grid List Video Review */}
            {loading ? (
                <div className="text-center py-12 text-xs text-slate-500 flex items-center justify-center gap-2">
                    <RefreshCw size={16} className="animate-spin text-orange-500" /> Membuka repositori video siswa...
                </div>
            ) : tugasList.length === 0 ? (
                <div className="text-center py-12 text-[10px] text-slate-600 italic">Belum ada siswa mengumpulkan tugas ini.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1 scrollbar-hide">
                    {tugasList.map((item) => (
                        <div 
                            key={item.id} 
                            className={`p-3 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                                item.terpilih_terbaik 
                                ? 'bg-amber-500/5 border-amber-500/20 shadow-lg shadow-amber-500/[0.02]' 
                                : 'bg-slate-950/40 border-white/5'
                            }`}
                        >
                            {/* Baris Informasi Siswa */}
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <div className="p-2 bg-red-500/10 text-red-500 rounded-lg shrink-0">
                                        <Youtube size={14} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="font-bold text-[11px] text-slate-200 truncate">{item.nama_siswa}</h4>
                                        <p className="text-[9px] text-slate-400 font-medium">
                                            Kelas {item.kelas} <span className="text-slate-600 mx-1">•</span> Absen {item.master_siswa?.['No Absen'] || '-'}
                                        </p>
                                    </div>
                                </div>

                                {/* Tombol Bintang Penilaian */}
                                <button
                                    onClick={() => toggleTerbaik(item.id, item.terpilih_terbaik)}
                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${
                                        item.terpilih_terbaik
                                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <Star size={11} fill={item.terpilih_terbaik ? 'currentColor' : 'none'} />
                                    {item.terpilih_terbaik ? 'Terbaik' : 'Pilih'}
                                </button>
                            </div>

                            {/* Embed Video Preview */}
                            <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/5 bg-slate-900 relative">
                                <iframe
                                    className="w-full h-full"
                                    src={dapatkanUrlEmbed(item.link_youtube)}
                                    title={`Review ${item.nama_siswa}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}