import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Clock } from 'lucide-react';

const ShortcutCard = ({ app, index, student }) => {
  const navigate = useNavigate();

  // --- LOGIKA AKSES ---
  // Kita tetap simpan pengecekan di sini agar card tahu kapan harus menampilkan ikon merah
  const isClassMatch = student?.Kelas && /^7\.(1[0-1]|[1-9])$/.test(student.Kelas);
  const isAdmin = student?.role === 'admin';
  const hasAccess = !app.isLocked || (app.isLocked && (isAdmin || isClassMatch));
  const isSoon = app.isComingSoon;

  const handlePress = () => {
    // Jika soon atau tidak ada akses, fungsi navigasi mati
    if (isSoon || !hasAccess) return;

    if (app.isExternal || app.path.startsWith('http')) {
      window.open(app.path, '_blank');
    } else {
      navigate(app.path);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 400 }}
      animate={{ opacity: 1, y: 0 }}
      // DURASI 1 DETIK agar fade-in terasa dramatis sesuai permintaan
      transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.01 }}
      onClick={handlePress}
      className={`group relative rounded-[2.5rem] bg-slate-900/60 border border-white/10 p-8 overflow-hidden backdrop-blur-xl transition-all duration-500 
                 ${app.glow} ${app.shadow} shadow-lg hover:bg-slate-950 ${(!hasAccess || isSoon) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {/* 1. Aksentuasi Warna di Pojok */}
      <div className={`absolute top-0 left-0 w-32 h-32 bg-gradient-to-br ${app.color} opacity-60 group-hover:opacity-100 transition-opacity duration-700 blur-2xl -z-10`} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          
          {/* 2. Ikon Utama */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 bg-slate-950/80 shadow-lg transition-all duration-500 group-hover:scale-110 ${app.glowColor}`}>
            {React.cloneElement(app.icon, { 
              size: 28,
              strokeWidth: 2.5,
              className: "drop-shadow-[0_0_8px_rgba(currentColor)]"
            })}
          </div>
          
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white/80 transition-all">
            {app.tag}
          </span>
        </div>

        <div className="space-y-1">
          {/* 3. Subtitle */}
          <h3 className={`text-[10px] font-black uppercase tracking-[0.25em] ${app.glowColor} opacity-80 group-hover:opacity-100 transition-all`}>
            {app.subtitle}
          </h3>
          <h2 className="text-2xl font-black italic text-white tracking-tighter leading-none uppercase">
            {app.title}
          </h2>
        </div>

        <p className="text-slate-400 text-[11px] leading-relaxed mt-4 mb-10 font-medium group-hover:text-slate-200 transition-colors line-clamp-2">
          {app.desc}
        </p>

        {/* 4. Footer Panah / Lock / Soon (Warna Merah Tanpa Label) */}
        <div className="mt-auto flex items-center justify-between">
          <div className={`h-[1px] flex-grow bg-white/5 mr-4 group-hover:bg-white/20 transition-all`} />
          
          <div className={`p-2.5 rounded-full border transition-all duration-500 shadow-lg 
            ${(!hasAccess || isSoon) 
              ? 'border-red-500 text-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
              : `border-current ${app.glowColor} bg-white/5 group-hover:bg-white/10 shadow-[0_0_10px_rgba(currentColor)]`}`}
          >
            {isSoon ? (
              <Clock size={16} className="animate-pulse" />
            ) : !hasAccess ? (
              <Lock size={16} />
            ) : (
              <ArrowRight size={16} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShortcutCard;