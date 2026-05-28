import React, { useState } from 'react';
import { useResetRemidi } from '../../hooks/Admin/useResetRemidi';
import { usePengumumanData } from '../../hooks/PengumumanSas/usePengumumanData'; 
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Search, RefreshCw, AlertTriangle, ShieldCheck, ArrowLeft, User, X, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResetRemidiAdmin() {
    const navigate = useNavigate();
    const { user } = usePengumumanData(); 
    const { pesertaList, loadingFetch, loadingReset, pesan, setPesan, eksekusiResetRemidi } = useResetRemidi();

    // State pencarian dinamis
    const [keyword, setKeyword] = useState('');
    const [pesertaTerpilih, setPesertaTerpilih] = useState(null); 
    const [showDropdown, setShowDropdown] = useState(false);

    // --- 🔒 PROTEKSI GEBANG UTAMA ADMIN ---
    const roleUser = user?.role || user?.ROLE || '';

    if (!user || roleUser !== 'admin') {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-slate-900 border border-red-500/20 rounded-[2.5rem] p-8 text-center space-y-4 shadow-2xl"
                >
                    <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
                        <AlertTriangle size={32} />
                    </div>
                    <h1 className="text-xl font-black text-white tracking-tight">AKSES DITOLAK!</h1>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Halaman ini dilindungi enkripsi sistem dan hanya dapat diakses oleh Administrator resmi Ruang Spendaraja.
                    </p>
                    <button onClick={() => navigate('/')} className="w-full bg-slate-950 border border-white/10 hover:bg-slate-800 text-slate-300 text-xs py-3 rounded-xl font-bold transition-all">
                        Kembali ke Beranda
                    </button>
                </motion.div>
            </div>
        );
    }

    // Filter dinamis berdasarkan nama siswa di dalam object join master_siswa
    const hasilFilterPeserta = pesertaList.filter(p => {
        const namaSiswa = p.master_siswa?.NAMA || '';
        const kelasSiswa = p.master_siswa?.Kelas || '';
        return namaSiswa.toLowerCase().includes(keyword.toLowerCase()) || 
               kelasSiswa.toLowerCase().includes(keyword.toLowerCase());
    });

    const handlePilihPeserta = (peserta) => {
        setPesertaTerpilih(peserta);
        setKeyword(peserta.master_siswa?.NAMA || ''); 
        setShowDropdown(false);
        setPesan({ tipe: '', teks: '' });
    };

    const handleResetInput = () => {
        setPesertaTerpilih(null);
        setKeyword('');
        setShowDropdown(false);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!pesertaTerpilih) return;

        const namaSiswa = pesertaTerpilih.master_siswa?.NAMA || 'Siswa';

        if (window.confirm(`Buka blokir remidi untuk ${namaSiswa}? Status akan diubah ke 'working', cheat count kembali 0, dan waktu pengerjaan dimundurkan 30 menit.`)) {
            const sukses = await eksekusiResetRemidi(pesertaTerpilih.id, namaSiswa);
            if (sukses) {
                handleResetInput(); 
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 pt-24 md:pt-28 font-sans relative overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-xl mx-auto relative z-10 space-y-6">
                
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors"
                >
                    <ArrowLeft size={14} /> Kembali ke Panel Admin
                </button>

                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-6 md:p-8 shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20">
                                <ShieldAlert size={20} />
                            </div>
                            <div>
                                <h2 className="text-base font-black tracking-tight">Buka Blokir Remidi</h2>
                                <p className="text-[11px] text-slate-500">Pulihkan paksa status ujian siswa terblokir</p>
                            </div>
                        </div>
                        <span className="flex items-center gap-1 text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-xl font-black uppercase tracking-wider">
                            <ShieldCheck size={12} /> Emergency
                        </span>
                    </div>

                    {/* Feedback Pesan */}
                    {pesan.teks && (
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`p-4 rounded-2xl text-xs font-medium mb-6 border ${
                                pesan.tipe === 'success' 
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                            }`}
                        >
                            {pesan.teks}
                        </motion.div>
                    )}

                    {/* Form Utama */}
                    <form onSubmit={handleFormSubmit} className="space-y-5">
                        <div className="space-y-2 relative">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                                Ketik Nama Siswa Remidi:
                            </label>
                            
                            <div className="relative">
                                <Search className="absolute left-4 top-3.5 text-slate-500 pointer-events-none" size={16} />
                                
                                <input
                                    type="text"
                                    disabled={loadingReset || loadingFetch}
                                    placeholder={loadingFetch ? "Memuat data remidi..." : "Cari nama peserta ujian remidi..."}
                                    value={keyword}
                                    onChange={(e) => {
                                        setKeyword(e.target.value);
                                        if (!pesertaTerpilih) setShowDropdown(true);
                                    }}
                                    onFocus={() => {
                                        if (!pesertaTerpilih) setShowDropdown(true);
                                    }}
                                    className="w-full bg-slate-950 border border-white/10 pl-12 pr-10 py-3.5 rounded-2xl text-xs focus:outline-none focus:border-red-500 text-slate-200 disabled:opacity-50"
                                />

                                {keyword && (
                                    <button
                                        type="button"
                                        onClick={handleResetInput}
                                        className="absolute right-4 top-3.5 text-slate-500 hover:text-white transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Dropdown Autocomplete */}
                            <AnimatePresence>
                                {showDropdown && keyword.trim() !== '' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute z-50 w-full bg-slate-950 border border-white/10 mt-1 rounded-2xl max-h-52 overflow-y-auto shadow-2xl divide-y divide-white/[0.03] scrollbar-hide"
                                    >
                                        {hasilFilterPeserta.length === 0 ? (
                                            <div className="p-4 text-xs text-slate-500 italic text-center">
                                                Peserta remidi tidak ditemukan.
                                            </div>
                                        ) : (
                                            hasilFilterPeserta.map((peserta) => (
                                                <div
                                                    key={peserta.id}
                                                    onClick={() => handlePilihPeserta(peserta)}
                                                    className="p-3 text-xs text-slate-300 hover:bg-red-500 hover:text-slate-950 cursor-pointer transition-colors flex justify-between items-center group font-medium"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <User size={12} className="opacity-60" />
                                                        <span>{peserta.master_siswa?.NAMA}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px]">
                                                        {peserta.cheat_count > 0 && (
                                                            <span className="bg-red-500/20 text-red-400 group-hover:bg-black/20 group-hover:text-red-900 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold">
                                                                <Flame size={10} /> {peserta.cheat_count}x Nyontek
                                                            </span>
                                                        )}
                                                        <span className="opacity-60 font-mono bg-white/5 group-hover:bg-black/10 px-2 py-0.5 rounded">
                                                            {peserta.status_ujian.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Indikator Target Detail yang akan Direset */}
                        {pesertaTerpilih && (
                            <motion.div 
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 space-y-2"
                            >
                                <span className="text-[9px] font-black uppercase tracking-widest text-red-400 block">Detail Pelanggaran Aktif:</span>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-sm font-black text-slate-200">{pesertaTerpilih.master_siswa?.NAMA}</h4>
                                        <p className="text-xs text-slate-400">Kelas {pesertaTerpilih.master_siswa?.Kelas || '-'}</p>
                                    </div>
                                    <div className="text-right text-xs">
                                        <p className="text-slate-400">Status Saat Ini: <span className="text-red-400 font-bold">{pesertaTerpilih.status_ujian}</span></p>
                                        <p className="text-slate-400">Terdeteksi Keluar: <span className="text-amber-500 font-bold">{pesertaTerpilih.cheat_count} Kali</span></p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="bg-slate-950/50 border border-white/[0.02] p-3 rounded-xl text-[10px] text-slate-500 leading-relaxed">
                            ⚠️ **Sistem Kritis:** Mengklik tombol di bawah akan memaksa status ujian menjadi **`working`**, menghapus riwayat deteksi curang menjadi **`0`**, dan memberikan tambahan waktu otomatis dengan memundurkan jam mulai kerja sebanyak **`30 Menit`**.
                        </div>

                        <button
                            type="submit"
                            disabled={loadingReset || !pesertaTerpilih}
                            className="w-full bg-red-500 hover:bg-red-400 disabled:bg-slate-800 disabled:text-slate-600 disabled:border-none border border-red-400/20 text-slate-950 font-black text-xs py-4 rounded-2xl uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/10 cursor-pointer"
                        >
                            {loadingReset ? (
                                <>
                                    <RefreshCw size={14} className="animate-spin" /> Sedang Memulihkan Sistem...
                                </>
                            ) : (
                                'Pulihkan & Buka Blokir Ujian'
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}