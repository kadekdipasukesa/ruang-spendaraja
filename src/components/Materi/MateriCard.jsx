import { BookOpen, ChevronRight, FileText, Video } from 'lucide-react';

export default function MateriCard({ 
  title, 
  description, 
  type = "pdf", // pdf, video, atau link
  color = "blue", 
  onOpen 
}) {
  
  const icons = {
    pdf: <FileText className="text-white" size={30} />,
    video: <Video className="text-white" size={30} />,
    link: <BookOpen className="text-white" size={30} />
  };

  const colors = {
    blue: "from-blue-600/20 border-blue-500/20 hover:border-blue-500/50 bg-blue-600",
    purple: "from-purple-600/20 border-purple-500/20 hover:border-purple-500/50 bg-purple-600",
    emerald: "from-emerald-600/20 border-emerald-500/20 hover:border-emerald-500/50 bg-emerald-600",
    // Tambahkan ini supaya tidak crash saat dipanggil
    amber: "from-amber-600/20 border-amber-500/20 hover:border-amber-500/50 bg-amber-600",
    rose: "from-rose-600/20 border-rose-500/20 hover:border-rose-500/50 bg-rose-600",
  };

  return (
    <div 
      className={`relative group bg-gradient-to-br to-slate-900 border p-6 rounded-[2rem] transition-all cursor-pointer shadow-xl ${colors[color].split(' bg-')[0]}`}
      onClick={onOpen}
    >
      {/* Icon */}
      <div className={`${colors[color].split(' ').pop()} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-black/40`}>
        {icons[type]}
      </div>
      
      {/* Content */}
      <h3 className="text-white font-bold text-xl mb-1">{title}</h3>
      <p className="text-slate-400 text-xs mb-4 leading-relaxed">{description}</p>

      {/* Action */}
      <div className={`flex items-center text-xs font-bold uppercase tracking-widest gap-2 text-${color}-400`}>
        Pelajari Sekarang <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>

      {/* Badge Umum (Opsional) */}
      <div className="absolute top-4 right-4 bg-white/5 px-2 py-1 rounded-md border border-white/10 text-[8px] text-slate-400 font-bold uppercase tracking-tighter">
        Akses Umum
      </div>
    </div>
  );
}