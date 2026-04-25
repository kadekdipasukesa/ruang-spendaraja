import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, GraduationCap, LayoutGrid } from 'lucide-react';

export default function Hero({ student, activeTab, setActiveTab }) {
    const fullName = student ? student.NAMA : '';
    const categories = ['Semua', 'Akademik', 'Event', 'Fasilitas'];

    return (


        /* BACKGROUND & BORDER DISAMAKAN DENGAN CARD (slate-900/60 & backdrop-blur-xl) */
        <motion.div
            // Animasi: Mulai dari transparan dan posisi agak ke atas (-40)
            initial={{ opacity: 0, y: -400 }}
            // Berakhir di posisi asli dan muncul penuh
            animate={{ opacity: 1, y: 0 }}
            // Durasi 1.5 detik dengan transisi smooth (easeOut)
            transition={{ duration: 0.5, ease: "easeOut" }}

            // Background Hitam Pekat dengan Glassmorphism
            className="relative overflow-hidden bg-slate-900/60 border border-white/10 p-8 md:p-12 rounded-[2.5rem] mb-12 backdrop-blur-xl group text-left mt-10 transition-all duration-500 shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_-10px_rgba(59,130,246,0.5)] hover:border-blue-500/30">

            {/* GLOW AKSENTUASI DI POJOK (Sama seperti card, menyala dari awal) */}
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-600/20 to-transparent opacity-60 blur-[100px] -z-10 transition-opacity duration-700 group-hover:opacity-100" />

            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
                <div className="w-full lg:max-w-3xl">

                    {/* BADGE PLATFORM - Warna Amber disesuaikan pendarannya */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-amber-500/30 text-amber-500 text-[11px] font-black uppercase tracking-[0.2em] mb-6 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                        <Sparkles size={14} className="text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" />
                        Platform Digital Ruang Spendaraja
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-black text-white/40 tracking-tight leading-none italic uppercase">
                            {student ? "Senang Melihatmu Kembali," : "Selamat Datang di Portal"}
                        </h1>

                        <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight">
                            {student ? (
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400 capitalize drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                    {fullName.toLowerCase()}
                                </span>
                            ) : (
                                <div className="flex flex-col">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 italic">
                                        Ruang Spendaraja
                                    </span>
                                    <span className="text-[14px] md:text-[18px] text-white/20 uppercase tracking-[0.5em] mt-2 ml-1 font-black">
                                        Digital Ecosystem v3.0
                                    </span>
                                </div>
                            )}
                        </h2>
                    </div>

                    <p className="text-slate-400 max-w-lg text-sm md:text-base leading-relaxed mt-8 mb-10 font-medium">
                        Akses seluruh layanan digital sekolah dalam satu genggaman. Pantau aktivitas, eksplorasi materi, dan raih masa depanmu.
                    </p>

                    {/* FILTER KATEGORI - Style Tombol Neon Blue */}
                    <div className="flex flex-wrap gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all duration-500 flex items-center gap-2 border ${activeTab === cat
                                    // SAAT AKTIF: Gunakan efek Glow Biru Neon (Default Saran)
                                    ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-105'
                                    // SAAT TIDAK AKTIF: Redup dan menyatu dengan background
                                    : 'bg-slate-950/50 text-slate-500 border-white/5 hover:border-white/20 hover:text-white'
                                    }`}
                            >
                                {cat === 'Semua' && (
                                    <LayoutGrid
                                        size={14}
                                        className={`transition-all ${activeTab === 'Semua' ? 'drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]' : ''}`}
                                    />
                                )}
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ILLUSTRATION AREA - Floating Neon Style */}
                <div className="hidden lg:block">
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative bg-slate-950/80 p-12 rounded-[3.5rem] shadow-[0_0_50px_rgba(59,130,246,0.2)] rotate-3 border border-white/10"
                    >
                        {/* Efek Cahaya di belakang Icon */}
                        <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full -z-10" />

                        <GraduationCap size={120} className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />

                        {/* Floating Small Element */}
                        <div className="absolute -top-4 -right-4 bg-slate-900 border border-amber-500/50 p-4 rounded-2xl shadow-[0_0_15px_rgba(245,158,11,0.3)] -rotate-12">
                            <Sparkles size={24} className="text-amber-400" />
                        </div>
                    </motion.div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .firework {
                  color: #60a5fa;
                  /* ... sisanya tetap sesuai kode asli kamu ... */
                }
              `}} />
        </motion.div>
    );
}