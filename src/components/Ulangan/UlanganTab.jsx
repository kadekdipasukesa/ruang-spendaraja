import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UlanganCard from './UlanganCard';

const UlanganTab = () => {
  const [activeCategory, setActiveCategory] = useState('Ulangan_1');

  const categories = [
    { id: 'Ulangan_1', label: 'Ulangan Utama' },
    { id: 'Ulangan_2', label: 'Ulangan Susulan' },
    { id: 'Remedial', label: 'Remedial' }
  ];

  return (
    <div className="relative z-30"> {/* Memastikan container berada di atas layer lain */}
      
      {/* Navigasi Internal */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={(e) => {
              e.preventDefault();
              setActiveCategory(cat.id);
            }}
            className={`px-6 py-2.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20 scale-105'
                : 'bg-slate-800/50 text-slate-500 border border-white/5 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Area List Kartu dengan Animasi */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {activeCategory === 'Ulangan_1' && (
            <>
              <UlanganCard 
                title="Simulasi Ulangan Informatika" 
                subject="Persiapan Minggu Depan" 
                time={60} 
                status="Aktif" 
                onPress={() => {
                  console.log("Membuka Link Simulasi...");
                  window.open("https://mediapembelajarantekscerpenkelasixsmp.my.canva.site/c75bzm3ns9b1n34r", "_blank", "noopener,noreferrer");
                }}
              />

              <UlanganCard 
                title="Latihan Teks Cerpen" 
                subject="Bahasa Indonesia" 
                time={45} 
                status="Selesai" 
                onPress={() => alert("Sesi Latihan ini sudah ditutup.")}
              />
            </>
          )}

          {activeCategory !== 'Ulangan_1' && (
            <div className="col-span-full py-20 text-center rounded-3xl border-2 border-dashed border-white/5">
              <p className="text-white/20 italic font-medium">Belum ada jadwal aktif untuk kategori ini.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UlanganTab;