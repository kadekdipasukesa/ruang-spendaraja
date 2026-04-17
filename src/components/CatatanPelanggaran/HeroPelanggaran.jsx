import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users } from 'lucide-react';

export default function HeroPelanggaran({ role }) {
  return (
    <section className="relative pt-20 pb-36 text-center px-4 overflow-hidden"
      style={{
        background: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url('https://uks.bulelengkab.go.id/uploads/sekolah/Foto-smp-negeri-2-singaraja-B.jpg')`,
        backgroundSize: 'cover', backgroundPosition: 'center top'
      }}>
      
      {/* Badge Akses - Pojok Kanan Atas */}
      <div className="absolute top-5 right-5 z-30 text-right border-r-2 border-red-500 pr-3">
        <p className="text-[8px] text-red-400 font-black uppercase tracking-[0.2em]">Akses: {role}</p>
        <p className="text-[10px] text-white font-bold tracking-wide uppercase">SMPN 2 Singaraja</p>
      </div>

      <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="relative z-10 text-center"
>
  {/* LOGO SEKOLAH DENGAN EFEK GLOW */}
  <div className="relative inline-block mb-6">
    <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
    <img
      src="https://smpn2singaraja.sch.id/wp-content/uploads/2025/05/cropped-cropped-cropped-LOGO-SMP-NEGERI-2-SINGARAJA-1.png"
      className="relative w-24 md:w-28 mx-auto drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]"
      alt="Logo SMPN 2 Singaraja"
    />
  </div>

  {/* NAMA SEKOLAH */}
  <p className="text-white/80 font-bold tracking-[0.4em] mb-3 text-xs md:text-sm uppercase">
    SMP Negeri 2 Singaraja<span className="text-blue-500 text-lg"></span>
  </p>

  {/* JUDUL UTAMA - Lebih mengarah ke Gerakan/Sistem */}
  <h1 className="text-5xl md:text-7xl font-black text-white mb-3 tracking-tighter uppercase italic leading-none">
    KEDISIPLINAN <span className="text-blue-500">SISWA</span>
  </h1>

  {/* SUB-JUDUL - Menonjolkan Kolaborasi Guru & OSIS */}
  <p className="text-blue-400 text-[10px] md:text-sm font-black tracking-[0.25em] uppercase mb-8 italic leading-relaxed max-w-2xl mx-auto">
    Platform Kolaborasi Guru & OSIS dalam Monitoring Kedisiplinan
  </p>

  {/* TAGLINE BOX */}
  <div className="inline-flex items-center gap-3 px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
    <Users className="text-blue-400" size={20} />
    <div className="flex flex-col items-start leading-none text-left border-l border-white/20 pl-3">
      <span className="text-[9px] text-slate-500 font-black tracking-widest uppercase mb-1 text-[8px]">Sinergi Sekolah</span>
      <p className="text-blue-100 text-[10px] md:text-xs font-bold tracking-[0.05em] uppercase italic">
        "Satu Catatan, Beribu Langkah Menuju Karakter Mulia"
      </p>
    </div>
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