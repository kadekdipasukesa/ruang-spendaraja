import React, { useState } from 'react';
import { usePengumumanData } from '../hooks/PengumumanSas/usePengumumanData';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Video, Search, Send, Youtube, Flame, SearchCode, Sparkles, AlertTriangle, CheckCircle, KeyRound, ExternalLink, HelpCircle, Cloud, CloudRain } from 'lucide-react';

// --- ☁️ KOMPONEN ANIMASI AWAN BACKGROUND ---
const BackgroundClouds = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ x: -250, y: 50 + i * 120 }}
                    animate={{ x: "100vw" }}
                    transition={{
                        duration: 25 + i * 5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 2
                    }}
                    className="absolute text-slate-400"
                >
                    <Cloud size={120 + i * 30} fill="currentColor" />
                </motion.div>
            ))}
        </div>
    );
};

// --- 🎆 KOMPONEN ANIMASI KEMBANG API (LULUS) ---
const FireworksAnimation = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(3)].map((_, group) => (
                <div key={group} className="absolute" style={{ left: `${25 + group * 25}%`, top: `${30 + (group % 2) * 20}%` }}>
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                            animate={{ 
                                scale: [0, 1.2, 0], 
                                x: Math.cos((i * 36) * (Math.PI / 180)) * 90, 
                                y: Math.sin((i * 36) * (Math.PI / 180)) * 90,
                                opacity: [1, 1, 0]
                            }}
                            transition={{ duration: 1.8, repeat: Infinity, delay: group * 0.4, ease: "easeOut" }}
                            className="absolute w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

// --- 🌧️ KOMPONEN ANIMASI AWAN MENDUNG & HUJAN (REMIDI) ---
const RainyCloudAnimation = () => {
    return (
        <div className="absolute inset-0 pointer-events-none flex justify-around items-start pt-6 opacity-20 overflow-hidden">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col items-center text-slate-500 mt-4">
                    <CloudRain size={50} fill="currentColor" />
                    <div className="flex gap-2 mt-1">
                        {[...Array(2)].map((_, j) => (
                            <motion.div
                                key={j}
                                animate={{ y: [0, 30], opacity: [0, 1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: Math.random() }}
                                className="w-0.5 h-3 bg-blue-400 rounded-full"
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- 🔗 HELPER EMBED VIDEO YOUTUBE ---
const dapatkanUrlEmbedYoutube = (url) => {
    if (!url) return "";
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
};

export default function HalamanPengumuman() {
    const navigate = useNavigate();
    const {
        user, nilaiSiswa, karyaTerbaik, top10Sas, liveRemidi, loading, submitting,
        searchResult, searching, cariDataManual, kirimTugasScratch
    } = usePengumumanData();

    const [keyword, setKeyword] = useState('');
    const [inputLink, setInputLink] = useState('');

    const handleAksiRemidi = () => {
        if (!user) {
            alert("🔒 Anda harus login terlebih dahulu di Ruang Spendaraja untuk mengambil ujian remidi!");
            return;
        }
        navigate('/remidi');
    };

    const handleAksiTugas = (e) => {
        e.preventDefault();
        if (!user) {
            alert("🔒 Anda harus login terlebih dahulu di Ruang Spendaraja untuk mengirimkan tugas tambahan!");
            return;
        }
        if (!inputLink.includes('youtube.com') && !inputLink.includes('youtu.be')) {
            alert("Pastikan link yang masukkan adalah URL video YouTube yang valid!");
            return;
        }
        const kelasSiswa = nilaiSiswa?.kelas || "Umum";
        const success = kirimTugasScratch(inputLink, kelasSiswa);
        if (success) setInputLink('');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-mono text-xs animate-pulse">
                MEMUAT DATA SUMATIF AKHIR SEMESTER 2026...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 pt-24 md:pt-28 font-sans selection:bg-amber-500 selection:text-slate-900 relative">
            
            {/* ☁️ Efek animasi awan mengambang di seluruh background halaman */}
            <BackgroundClouds />

            <div className="max-w-5xl mx-auto space-y-8 relative z-10">

                {/* 🌟 HEADER UTAMA */}
                <div className="text-center py-8 bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur relative overflow-hidden">
                    <span className="bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-amber-500/20">
                        Papan Informasi Kelulusan SAS 2026
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black mt-4 tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">RUANG PENGUMUMAN</h1>
                    <p className="text-xs text-slate-400 mt-2">Pusat Transparansi Hasil Belajar Mandiri Siswa Spendaraja</p>

                    {!user && (
                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[11px] font-bold">
                            <AlertTriangle size={14} /> Anda melihat halaman ini sebagai Tamu. Silakan login ke Ruang Spendaraja untuk melakukan Remidi atau mengumpulkan Tugas.
                        </div>
                    )}
                </div>

                {/* ==================== DISPLAY NILAI (OTOMATIS AKUN LOGIN) ==================== */}
                <AnimatePresence mode="wait">
                    {user && nilaiSiswa ? (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`border rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden shadow-2xl ${nilaiSiswa.nilai_sas >= 75 ? 'bg-gradient-to-br from-slate-900 via-emerald-950/20 to-slate-900 border-emerald-500/30' : 'bg-gradient-to-br from-slate-900 via-red-950/20 to-slate-900 border-red-500/30'
                                }`}
                        >
                            {/* 🎆 Animasi kembang api jika lulus (>=75), 🌧️ animasi awan hujan jika remidi (<75) */}
                            {nilaiSiswa.nilai_sas >= 75 ? <FireworksAnimation /> : <RainyCloudAnimation />}

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className="text-base font-black flex items-center gap-2">
                                        <Sparkles className={nilaiSiswa.nilai_sas >= 75 ? 'text-emerald-400' : 'text-red-400'} size={18} />
                                        Hasil Akun Anda ({user.nama || user.NAMA})
                                    </h2>
                                    <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border tracking-widest ${nilaiSiswa.nilai_sas >= 75 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                        {nilaiSiswa.nilai_sas >= 75 ? '🎉 TUNTAS LULUS' : '⚠️ BUTUH REMIDI'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
                                    <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                                        <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider block">Nama Peserta</span>
                                        <span className="text-xs font-black text-slate-200">{nilaiSiswa.nama_siswa}</span>
                                    </div>
                                    <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                                        <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider block">Kelas</span>
                                        <span className="text-xs font-black text-slate-200">{nilaiSiswa.kelas}</span>
                                    </div>
                                    <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 flex justify-between items-center px-6 backdrop-blur-sm">
                                        <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider block">Nilai SAS</span>
                                        <span className={`text-3xl font-mono font-black ${nilaiSiswa.nilai_sas >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>{nilaiSiswa.nilai_sas}</span>
                                    </div>
                                </div>

                                {/* ⚡ JIKA REMIDI: TAMPILKAN TOMBOL MASUK DAN PIN BESAR */}
                                {nilaiSiswa.nilai_sas < 75 && (
                                    <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                        <div className="bg-slate-950 border border-red-500/20 rounded-2xl p-4 text-center relative group overflow-hidden">
                                            <KeyRound size={40} className="absolute -right-2 -bottom-2 text-white/[0.02] group-hover:scale-110 transition-transform" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">PIN MASUK UJIAN REMIDI</span>
                                            <span className="text-4xl font-mono font-black tracking-wider text-red-400 block mt-1 drop-shadow-[0_0_15px_rgba(239,68,68,0.2)]">12C90</span>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-xs text-slate-400">Nilai Anda belum mencapai KKM (75). Salin PIN raksasa di samping lalu klik tombol di bawah untuk memulai remedial.</p>
                                            <button onClick={handleAksiRemidi} className="w-full bg-red-600 hover:bg-red-500 font-black text-xs px-6 py-3.5 rounded-xl uppercase tracking-wider transition-all shadow-lg shadow-red-600/20">
                                                Mulai Ujian Sekarang
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        /* ==================== MESIN PENCARIAN MANDIRI (TAMU / DATA UNMATCHED) ==================== */
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-6 md:p-8 shadow-xl">
                            <h2 className="text-base font-black flex items-center gap-2 mb-2"><SearchCode className="text-amber-400" size={18} /> Cari Lembar Hasil Nilai</h2>
                            <p className="text-xs text-slate-500 mb-6">Ketik Nama Lengkap atau Kelas Anda untuk mengecek hasil kelulusan SAS:</p>
                            <div className="relative">
                                <Search className="absolute left-4 top-3.5 text-slate-500" size={16} />
                                <input
                                    type="text" placeholder="Ketik Nama Siswa atau Kelas (Contoh: 9A)..." value={keyword}
                                    onChange={(e) => { setKeyword(e.target.value); cariDataManual(e.target.value); }}
                                    className="w-full bg-slate-950 border border-white/10 pl-12 pr-4 py-3 rounded-2xl text-xs focus:outline-none focus:border-amber-500 text-slate-200"
                                />
                            </div>

                            {keyword.trim() !== '' && (
                                <div className="mt-4 border-t border-white/5 pt-4 max-h-60 overflow-y-auto space-y-2 scrollbar-hide">
                                    {searching ? (
                                        <div className="text-center py-4 text-xs text-slate-500 font-mono animate-pulse">MENCARI DATA...</div>
                                    ) : searchResult.length === 0 ? (
                                        <div className="text-center py-4 text-xs text-slate-600 italic">Data tidak ditemukan. Pastikan ejaan nama sudah benar.</div>
                                    ) : (
                                        searchResult.map((siswa, index) => (
                                            <div key={index} className="bg-slate-950 p-4 rounded-xl border border-white/[0.03] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div>
                                                    <h4 className="text-xs font-black text-slate-200">{siswa.nama_siswa}</h4>
                                                    <p className="text-[10px] text-slate-500">Kelas: {siswa.kelas}</p>
                                                </div>
                                                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                                                    <div className="text-right">
                                                        <span className="text-[9px] text-slate-500 block font-bold">SKOR SAS</span>
                                                        <span className={`text-sm font-mono font-black ${siswa.nilai_sas >= 75 ? 'text-emerald-400' : 'text-red-400'}`}>{siswa.nilai_sas}</span>
                                                    </div>
                                                    {siswa.nilai_sas < 75 ? (
                                                        <div className="flex items-center gap-3">
                                                            <div className="bg-slate-900 border border-white/5 px-3 py-1.5 rounded-lg text-center font-mono font-bold text-[10px] text-red-400">PIN: 12C90</div>
                                                            <button onClick={handleAksiRemidi} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-md">REMIDI</button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-emerald-400 flex items-center gap-1 text-[10px] font-bold"><CheckCircle size={14} /> TUNTAS</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ==================== BOX TUGAS TAMBAHAN (OPSIONAL & REFERENSI VIDEO) ==================== */}
                <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="md:col-span-2 space-y-3">
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-black flex items-center gap-2"><Video className="text-blue-400" size={18} /> Tugas Tambahan Nilai (Opsional)</h2>
                            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-md uppercase">Tema Bebas</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Bagi seluruh siswa yang ingin mendongkrak akumulasi nilai, kalian bisa membuat rekaman video proyek **Scratch dengan tema bebas** (bukan hanya game edukasi). Rekam layar karyamu, unggah ke YouTube, dan kirim link videonya di kolom pengumpulan.
                        </p>

                        <form onSubmit={handleAksiTugas} className="flex gap-2 pt-2">
                            <input
                                type="url" placeholder="Tempel link video YouTube tugas Scratch kamu..." value={inputLink}
                                onChange={(e) => setInputLink(e.target.value)}
                                className="flex-1 bg-slate-950 border border-white/10 px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-200"
                            />
                            <button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-500 font-black text-xs px-5 py-3 rounded-xl uppercase tracking-wider flex items-center gap-2">
                                <Send size={11} /> Kirim
                            </button>
                        </form>
                    </div>

                    {/* Pembungkus Link Referensi Eksternal dengan Fitur Langsung Play */}
                    <div className="bg-slate-950 border border-white/5 p-4 rounded-2xl flex flex-col justify-between h-full group">
                        <div>
                            <span className="text-[9px] text-amber-400 font-black uppercase tracking-wider flex items-center gap-1 mb-2">
                                <Youtube size={12} className="text-red-500" /> Video Referensi Panduan
                            </span>

                            {/* Bingkai Player Embed Youtube */}
                            <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/5 bg-slate-900 mb-2">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/FwFcGt6E5Qw"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>

                            <h4 className="text-[11px] font-bold text-slate-300 line-clamp-2">
                                Cara Membuat & Rekam Project Scratch Keren (Tema Bebas)
                            </h4>
                        </div>
                    </div>
                </div>

                {/* ==================== SECTION LIVE MONITORING & DATA UTAMA ==================== */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* KOLOM 1: 🥇 TOP 10 BESAR NILAI UTAMA SAS */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-6 shadow-xl">
                        <h3 className="text-xs font-black flex items-center gap-2 mb-4 text-amber-400"><Award size={15} /> Peringkat 10 Besar SAS</h3>
                        <div className="divide-y divide-white/[0.03] rounded-xl bg-slate-950/40 border border-white/5 overflow-hidden">
                            {top10Sas.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 text-xs hover:bg-white/[0.01]">
                                    <div className="flex items-center gap-2 overflow-hidden mr-2">
                                        <span className="font-mono font-black text-slate-500 text-[10px] w-4">{idx + 1}.</span>
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-slate-200 truncate text-[11px]">{item.nama_siswa}</p>
                                            <p className="text-[9px] text-slate-500 font-medium">Kelas {item.kelas}</p>
                                        </div>
                                    </div>
                                    <span className="font-mono font-black text-amber-400 shrink-0">{item.nilai_sas}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* KOLOM 2: ⚡ LIVE HASIL REMIDI (REALTIME VIEW DARI RE-SUBMIT) */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-6 shadow-xl">
                        <h3 className="text-xs font-black flex items-center gap-2 mb-4 text-rose-400">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> Live Skor Remidi
                        </h3>
                        <div className="rounded-xl bg-slate-950/40 border border-white/5 overflow-hidden">
                            {liveRemidi.length === 0 ? (
                                <div className="text-center py-16 text-[10px] text-slate-600 italic">Belum ada siswa yang menyelesaikan remidi.</div>
                            ) : (
                                <div className="divide-y divide-white/[0.03] max-h-[385px] overflow-y-auto scrollbar-hide">
                                    {liveRemidi.map((p, idx) => (
                                        <div key={p.id} className="flex justify-between items-center p-3 text-xs hover:bg-white/[0.01]">
                                            <div className="flex items-center gap-2 overflow-hidden mr-2">
                                                <span className="text-[10px]">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '✨'}</span>
                                                <div className="overflow-hidden">
                                                    <p className="font-bold text-slate-200 truncate text-[11px]">{p.master_siswa?.NAMA || 'Siswa Spenda'}</p>
                                                    <p className="text-[8px] tracking-tighter uppercase font-black text-slate-500">
                                                        {p.status_ujian === 'blocked' ? '❌ Terblokir' : '✅ Sukses'}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="font-mono font-black text-rose-400 shrink-0">{p.nilai_akhir ?? 0}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* KOLOM 3: 🔥 SHOWCASE GALLERY 10 KARYA TERBAIK (DENGAN EMBED VIDEO) */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-6 shadow-xl">
                        <h3 className="text-xs font-black flex items-center gap-2 mb-4 text-orange-500"><Flame size={15} /> Showcase 10 Video</h3>
                        {karyaTerbaik.length === 0 ? (
                            <div className="text-center py-16 text-[10px] text-slate-600 italic">Belum ada karya pilihan guru.</div>
                        ) : (
                            <div className="space-y-4 max-h-[385px] overflow-y-auto pr-1 scrollbar-hide">
                                {karyaTerbaik.map((karya) => (
                                    <div key={karya.id} className="bg-slate-950/40 p-2.5 rounded-xl border border-white/5 space-y-2">
                                        <div className="overflow-hidden flex items-center gap-2">
                                            <Youtube size={14} className="text-red-500 shrink-0" />
                                            <div className="overflow-hidden">
                                                <h4 className="font-bold text-[11px] text-slate-200 truncate">{karya.nama_siswa}</h4>
                                                <p className="text-[9px] text-slate-500">Kelas {karya.kelas}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Player interaktif internal agar video milik siswa bisa langsung diputar di tempat */}
                                        <div className="w-full aspect-video rounded-lg overflow-hidden border border-white/5 bg-slate-900">
                                            <iframe
                                                className="w-full h-full"
                                                src={dapatkanUrlEmbedYoutube(karya.link_youtube)}
                                                title={`Karya Scratch ${karya.nama_siswa}`}
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

                </div>

            </div>
        </div>
    );
}