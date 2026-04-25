import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative mt-20 pb-6"> {/* pb dikurangi agar tidak terlalu low */}
      {/* Garis Neon Tipis */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent shadow-[0_0_10px_rgba(245,158,11,0.2)]" />
      
      <div className="max-w-4xl mx-auto px-6 pt-10 flex flex-col items-center text-center">
        
        {/* Branding */}
        <div className="mb-6">
          <h2 className="text-xl font-black italic uppercase text-white tracking-tighter">
            Ruang-<span className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">Spendaraja</span>
          </h2>
          <p className="text-slate-600 text-[8px] font-black uppercase tracking-[0.5em] mt-1">
            Digital Learning Platform
          </p>
        </div>

        {/* Social Media */}
        <div className="flex items-center gap-8 mb-8">
          <motion.a
            href="https://www.instagram.com/dipa_sukesa"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.9 }}
            className="text-[#E4405F] drop-shadow-[0_0_8px_rgba(228,64,95,0.4)]"
          >
            <Instagram size={24} strokeWidth={2.5} />
          </motion.a>

          <motion.a
            href="https://wa.me/6281939415343"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.9 }}
            className="text-[#25D366] drop-shadow-[0_0_8px_rgba(37,211,102,0.4)]"
          >
            <MessageCircle size={24} fill="currentColor" fillOpacity={0.15} strokeWidth={2.5} />
          </motion.a>
        </div>

        {/* Credit & Copyright - Rapat ke Bawah */}
        <div className="flex flex-col items-center">
          <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">
            Developed by <span className="text-white/70">Kadek Dipa Sukesa</span>
          </p>
          <p className="text-[8px] font-medium text-slate-700 uppercase tracking-tighter leading-none">
            © 2026 SMP Negeri 2 Singaraja. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Glow dipindahkan posisinya agar tidak menambah tinggi halaman */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-10 bg-amber-500/5 blur-[50px] -z-10 pointer-events-none" />
    </footer>
  );
};

export default Footer;