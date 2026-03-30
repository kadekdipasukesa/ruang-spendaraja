import React from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  ExternalLink,
  AlertCircle,
  PlayCircle, // Tambahan icon untuk video
  FileText    // Tambahan icon untuk esai
} from 'lucide-react';

export default function AssignmentCard({ data, onOpen }) {
  // 1. LOGIKA SISA WAKTU (Tetap sama)
  const calculateTimeLeft = () => {
    const diff = new Date(data.deadline) - new Date();
    if (diff <= 0) return { label: 'Sudah Berakhir', color: 'text-gray-500', bg: 'bg-gray-500/10' };
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return { label: `${days} Hari Lagi`, color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
    if (hours > 0) return { label: `${hours} Jam Lagi`, color: 'text-amber-400', bg: 'bg-amber-400/10' };
    return { label: 'Hampir Habis!', color: 'text-red-400', bg: 'bg-red-400/10' };
  };

  const status = calculateTimeLeft();

  // 2. FUNGSI BARU: Untuk menampilkan thumbnail jika itu tugas Link Video
  const renderThumbnail = () => {
    if (data.tipe_konten === 'link' && data.link_materi?.includes('youtube.com')) {
      // Ambil ID video youtube
      const videoId = data.link_materi.split('v=')[1]?.split('&')[0];
      return (
        <div className="mt-3 relative rounded-xl overflow-hidden aspect-video border border-slate-700">
          <img 
            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
            alt="Youtube Preview"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="w-10 h-10 text-white/50 group-hover:text-red-500 transition-colors" />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      onClick={() => onOpen(data)}
      className="group relative bg-[#1e293b] border border-slate-700 hover:border-blue-500/50 p-5 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden shadow-lg hover:shadow-blue-500/10"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BookOpen className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-500 leading-none mb-1">{data.mapel}</p>
              <span className="text-xs font-bold text-slate-300">
                {data.tipe_konten === 'quiz' ? '📝 Quiz' : data.tipe_konten === 'esai' ? '✍️ Esai' : '🔗 Kumpul Link'}
              </span>
            </div>
          </div>
          <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${status.bg} ${status.color} border border-current/20`}>
            {status.label}
          </span>
        </div>

        {/* Judul & Preview Content */}
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {data.judul}
        </h3>
        
        {/* DISINI PERUBAHANNYA: Menampilkan thumbnail video jika ada */}
        {renderThumbnail()}

        <p className={`text-sm text-slate-400 mb-4 ${data.tipe_konten === 'link' ? 'mt-2' : ''} line-clamp-2`}>
          {data.deskripsi || 'Klik untuk melihat detail tugas.'}
        </p>

        {/* Footer Info */}
        <div className="space-y-2 border-t border-slate-700/50 pt-4 mt-2">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center text-slate-400">
              <User className="w-3.5 h-3.5 mr-1.5" />
              <span className="truncate max-w-[100px]">{data.guru_nama}</span>
            </div>
            <div className="flex items-center text-slate-400">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              <span>{new Date(data.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}