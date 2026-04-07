import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function HeroPelanggaran({ role }) {
  return (
    <section className="relative pt-20 pb-36 text-center px-4 overflow-hidden"
      style={{
        background: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url('https://uks.bulelengkab.go.id/uploads/sekolah/Foto-smp-negeri-2-singaraja-B.jpg')`,
        backgroundSize: 'cover', backgroundPosition: 'center top'
      }}>
      
      {/* Badge Akses - Pojok Kanan Atas */}
      <div className="absolute top-5 right-5 z-30 text-right border-r-2 border-red-500 pr-3">
        <p className="text-[10px] text-red-400 font-black uppercase tracking-[0.2em]">Akses: {role}</p>
        <p className="text-[12px] text-white font-bold tracking-wide uppercase">SMPN 2 Singaraja</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="relative z-10 max-w-3xl mx-auto"
      >
        {/* Logo Sekolah */}
        <img 
          src="https://smpn2singaraja.sch.id/wp-content/uploads/2025/05/cropped-cropped-cropped-LOGO-SMP-NEGERI-2-SINGARAJA-1.png"
          className="w-20 mx-auto mb-8 drop-shadow-2xl" 
          alt="Logo" 
        />

        {/* Judul Utama */}
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase italic leading-none">
          KEDISIPLINAN <span className="text-red-500 underline decoration-white/10">SISWA</span>
        </h1>
        
        {/* TAGLINE BARU */}
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
          <ShieldCheck className="text-blue-400" size={18} />
          <p className="text-blue-100 text-xs md:text-sm font-bold tracking-[0.1em] uppercase italic">
            "Membentuk Karakter, Mewujudkan Integritas"
          </p>
        </div>

      </motion.div>

      {/* Dekorasi Wave Bawah */}
      <div className="absolute bottom-0 left-0 w-full leading-[0]">
        <svg viewBox="0 0 1440 120" className="relative block w-full h-[80px] fill-[#0f172a]">
          <path d="M0,96L80,90.7C160,85,320,75,480,69.3C640,64,800,64,960,69.3C1120,75,1280,85,1360,90.7L1440,96L1440,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
}