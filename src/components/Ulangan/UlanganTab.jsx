import React, { useState, useEffect } from 'react'; // Tambahkan useEffect
import { motion, AnimatePresence } from 'framer-motion';
import UlanganCard from './UlanganCard';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react'; // Opsional: Pakai icon agar manis

const UlanganTab = () => {
  const [activeCategory, setActiveCategory] = useState('Ulangan_1');
  const [isAdmin, setIsAdmin] = useState(false); // State cek admin
  const navigate = useNavigate();

  // Cek role user saat komponen dimuat
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user_siswa'));
    if (user?.role === 'admin') setIsAdmin(true);
  }, []);

  const categories = [
    { id: 'Ulangan_1', label: 'Ulangan Utama' },
    { id: 'Ulangan_2', label: 'Ulangan Susulan' },
    { id: 'Remedial', label: 'Remedial' }
  ];

  return (
    <div className="relative z-30"> 
      
      {/* Header Tab & Label Admin */}
      <div className="flex justify-between items-center mb-8">
        {/* Navigasi Internal */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory(cat.id);
              }}
              className={`px-6 py-2.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 shrink-0 ${activeCategory === cat.id
                  ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-slate-800/50 text-slate-500 border border-white/5 hover:text-white'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Label Admin (Hanya muncul jika user adalah admin) */}
        {isAdmin && (
          <button 
            onClick={() => navigate('/admin-ujian')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all group"
          >
            <Settings size={12} className="group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Panel Guru</span>
          </button>
        )}
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
                  window.open("https://mediapembelajarantekscerpenkelasixsmp.my.canva.site/c75bzm3ns9b1n34r", "_blank", "noopener,noreferrer");
                }}
              />

              <UlanganCard
                title="Ulangan Informatika"
                subject="Informatika"
                time={60}
                status="Tersedia"
                onPress={() => navigate('/ulangan')} 
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