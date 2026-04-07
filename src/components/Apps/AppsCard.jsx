import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';

export default function AppsCard({ title, description, icon: Icon, color = "blue", onOpen, badge }) {
  const colorVariants = {
    blue: "from-blue-600 to-indigo-700 shadow-blue-900/20 group-hover:shadow-blue-500/40",
    emerald: "from-emerald-600 to-teal-700 shadow-emerald-900/20 group-hover:shadow-emerald-500/40",
    purple: "from-purple-600 to-pink-700 shadow-purple-900/20 group-hover:shadow-purple-500/40",
    orange: "from-orange-500 to-red-600 shadow-orange-900/20 group-hover:shadow-orange-500/40",
    rose: "from-rose-600 to-pink-700 shadow-rose-900/20 group-hover:shadow-rose-500/40",
  };

  const iconBgVariants = {
    blue: "bg-blue-500/20 text-blue-400",
    emerald: "bg-emerald-500/20 text-emerald-400",
    purple: "bg-purple-500/20 text-purple-400",
    orange: "bg-orange-500/20 text-orange-400",
    rose: "bg-rose-500/20 text-rose-400",
  };

  return (
    <div 
      onClick={onOpen}
      className="group relative bg-slate-900/40 backdrop-blur-md border border-white/10 p-6 rounded-[2.5rem] cursor-pointer hover:bg-slate-800/60 transition-all duration-500 hover:-translate-y-2 hover:border-white/20"
    >
      {/* Badge jika ada (misal: "HOT", "NEW", "BETA") */}
      {badge && (
        <span className="absolute top-5 right-5 bg-white/10 backdrop-blur-md text-white text-[8px] font-black px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest z-10">
          {badge}
        </span>
      )}

      <div className="flex flex-col h-full gap-5">
        {/* Icon Area */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${iconBgVariants[color] || iconBgVariants.blue}`}>
          {Icon ? <Icon size={28} strokeWidth={2.5} /> : <ExternalLink size={28} />}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-white font-black text-xl italic tracking-tighter uppercase leading-none">
            {title}
          </h3>
          <p className="text-slate-400 text-xs font-medium leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Action Button */}
        <div className={`mt-auto flex items-center justify-center w-full py-3 rounded-2xl bg-gradient-to-r ${colorVariants[color] || colorVariants.blue} text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all group-hover:gap-4 gap-2 shadow-xl`}>
          Buka Aplikasi
          <ArrowRight size={14} className="transition-all group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
}