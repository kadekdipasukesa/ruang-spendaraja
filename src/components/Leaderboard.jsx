import React from 'react';

const Leaderboard = ({ 
  data, 
  isPlaying, 
  showFull, 
  onToggleShow, 
  onShowHistory, 
  title = "Papan Peringkat",
  scoreLabel = "WPM", // Label dinamis untuk skor utama
  secondaryLabel = "ACC" // Label dinamis untuk skor sekunder
}) => {
  
  // Catatan: Jika game sedang berjalan, komponen ini tidak akan muncul di layar
  if (isPlaying) return null;

  return (
    <div className="text-left border-t border-white/10 pt-8 mt-12 animate-in fade-in slide-in-from-bottom-4">
      
      {/* --- BAGIAN HEADER LEADERBOARD --- */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span className="text-2xl">🏆</span> {title}
          </h3>
          <p className="text-xs text-slate-500">
            Siswa dengan hasil terbaik (Akurasi &gt; 90%)
          </p>
        </div>

        {/* Tombol Aksi: Riwayat dan Toggle Tampilan */}
        <div className="flex items-center gap-4">
          <button
            onClick={onShowHistory}
            className="text-xs text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider transition-all"
          >
            Riwayat Saya
          </button>

          <button
            onClick={onToggleShow}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-white/5 transition-all font-bold"
          >
            {showFull ? "Top 3" : "Top 100"}
          </button>
        </div>
      </div>

      {/* --- BAGIAN DAFTAR PERINGKAT --- */}
      <div className={`space-y-2 transition-all duration-500 ${showFull ? 'max-h-[400px] overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
        {data.length > 0 ? (
          data.slice(0, showFull ? 100 : 3).map((entry, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-transparent border-yellow-500/30' : 
                index === 1 ? 'bg-gradient-to-r from-slate-300/10 to-transparent border-slate-300/30' : 
                index === 2 ? 'bg-gradient-to-r from-orange-500/10 to-transparent border-orange-500/30' : 
                'bg-slate-900/40 border-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Nomor Urut (Badge Bulat) */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                  index === 0 ? 'bg-yellow-500 text-black' :
                  index === 1 ? 'bg-slate-300 text-black' :
                  index === 2 ? 'bg-orange-600 text-white' : 
                  'bg-slate-800 text-slate-500'
                }`}>
                  {index + 1}
                </div>

                {/* Info Siswa: Nama (2 Kata Terakhir) & Kelas */}
                <div className="flex flex-col min-w-0">
                  <span className="text-white font-bold capitalize truncate">
                    {/* Logika: Ambil 2 kata paling belakang jika nama terlalu panjang */}
                    {entry.full_name ? (
                      entry.full_name.trim().split(" ").length > 2 
                        ? entry.full_name.trim().split(" ").slice(-2).join(" ") 
                        : entry.full_name
                    ).toLowerCase() : 'siswa spenda'}
                  </span>
                  
                  {/* Menampilkan Kelas tepat di bawah nama */}
                  {entry.class && (
                    <span className="text-[10px] text-blue-400 italic font-bold uppercase mt-0.5">
                      {entry.class}
                    </span>
                  )}
                </div>
              </div>

              {/* Tampilan Skor (WPM/Skor Utama & Akurasi) */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="block text-[9px] text-slate-500 uppercase font-bold">{scoreLabel}</span>
                  <span className="text-blue-400 font-black text-lg">{entry.wpm || entry.score || 0}</span>
                </div>
                <div className="text-right w-12 border-l border-white/5 pl-4">
                  <span className="block text-[9px] text-slate-500 uppercase font-bold">{secondaryLabel}</span>
                  <span className="text-emerald-400 font-bold">{entry.accuracy || entry.points || 0}%</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-600 py-4 italic text-sm">Belum ada skor hari ini...</p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;