import React from 'react';
import { ExternalLink, Gamepad2, Globe, Cpu, Smartphone } from 'lucide-react';

export default function ExpoCard({ item }) {
  const getCategoryStyle = (cat) => {
    switch (cat) {
      case 'Game': return { bg: 'bg-orange-100', text: 'text-orange-600', icon: <Gamepad2 size={14}/> };
      case 'Web': return { bg: 'bg-blue-100', text: 'text-blue-600', icon: <Globe size={14}/> };
      case 'IoT': return { bg: 'bg-purple-100', text: 'text-purple-600', icon: <Cpu size={14}/> };
      case 'App': return { bg: 'bg-emerald-100', text: 'text-emerald-600', icon: <Smartphone size={14}/> };
      default: return { bg: 'bg-slate-100', text: 'text-slate-600', icon: <Globe size={14}/> };
    }
  };

  const style = getCategoryStyle(item.category);

  return (
    <div className="group bg-white rounded-[2.5rem] p-4 border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-amber-200/40 transition-all duration-500">
      {/* Container Gambar */}
      <div className="relative h-56 rounded-[2rem] overflow-hidden mb-5">
        <img 
          src={item.image_url} 
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className={`absolute top-4 right-4 ${style.bg} ${style.text} backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-sm`}>
          {style.icon} {item.category}
        </div>
      </div>

      {/* Konten */}
      <div className="px-2 pb-2">
        <h3 className="text-xl font-black text-slate-800 mb-1 group-hover:text-amber-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          BY {item.creator_name}
        </p>
        <p className="text-slate-500 text-sm mb-6 line-clamp-2 font-medium">
          {item.description}
        </p>

        {/* Tombol Link */}
        <a 
          href={item.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full bg-slate-50 hover:bg-amber-500 hover:text-white p-4 rounded-2xl transition-all duration-300 group/btn"
        >
          <span className="text-xs font-black uppercase tracking-widest">Kunjungi Karya</span>
          <div className="bg-white group-hover/btn:bg-white/20 p-2 rounded-xl text-slate-900 group-hover/btn:text-white transition-colors">
            <ExternalLink size={16} />
          </div>
        </a>
      </div>
    </div>
  );
}