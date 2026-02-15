import { Lock, Unlock, ChevronRight, Gamepad2 } from 'lucide-react';

export default function GameCard({ 
  title,             // Judul Game
  description,       // Deskripsi Game
  icon: Icon,        // Ikon (Lucide icon)
  color = "blue",    // Warna tema (blue, green, dll)
  gameId,            // ID unik untuk seleksi class (game1, game2, dll)
  student, 
  allLockStatuses, 
  isGameLocked, 
  onPlay, 
  onToggleLock, 
  getOptionLabel 
}) {
  // Ambil kelas siswa secara spesifik
  const userClass = student?.Kelas || student?.kelas || 'Tanpa Kelas'
  
  // PERBAIKAN: Pastikan kita mengecek field yang tepat di allLockStatuses
  // Kita harus memastikan status yang dibaca benar-benar milik userClass tersebut
  const isLockedForStudent = 
    allLockStatuses?.[gameId]?.[userClass] === true && student?.role !== 'admin';

  // Mapping warna supaya dinamis
  const colors = {
    blue: "from-blue-600/20 border-blue-500/20 hover:border-blue-500/50 bg-blue-600",
    green: "from-green-600/20 border-green-500/20 hover:border-green-500/50 bg-green-600",
    orange: "from-orange-600/20 border-orange-500/20 hover:border-orange-500/50 bg-orange-600"
  };

  console.log(`Game: ${gameId}, Kelas: ${userClass}, Status: ${allLockStatuses?.[gameId]?.[userClass]}`);

  return (
    <div className="relative group">
      {/* 1. KARTU UTAMA */}
      <div
        className={`bg-gradient-to-br to-slate-900 border p-6 rounded-[2rem] transition-all cursor-pointer shadow-xl
          ${isLockedForStudent
            ? 'border-red-500/30 opacity-60 blur-[1px] grayscale-[0.5]'
            : `${colors[color].split(' bg-')[0]} opacity-100 blur-0`
          }`}
        onClick={() => {
          if (isLockedForStudent) return;
          onPlay();
        }}
      >
        <div className={`${colors[color].split(' ').pop()} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-black/40`}>
          {Icon ? <Icon className="text-white" size={30} /> : <Gamepad2 className="text-white" size={30} />}
        </div>
        
        <h3 className="text-white font-bold text-xl mb-1">{title}</h3>
        <p className="text-slate-400 text-xs mb-3">{description}</p>

        <div className={`flex items-center text-xs font-bold uppercase tracking-widest gap-2 ${isLockedForStudent ? 'text-red-500' : `text-${color}-400`}`}>
          {isLockedForStudent ? (
            <span className="flex items-center gap-1">Terkunci</span>
          ) : (
            <>Mainkan <ChevronRight size={14} /></>
          )}
        </div>
      </div>

      {/* 2. INDIKATOR KUNCI (Siswa) */}
      {isLockedForStudent && (
        <div className="absolute top-4 right-4 z-20 animate-in fade-in zoom-in duration-300 pointer-events-none">
          <div className="bg-red-500/20 p-2.5 rounded-xl border border-red-500/40 backdrop-blur-md shadow-lg shadow-red-900/40">
            <Lock size={20} className="text-red-500" />
          </div>
        </div>
      )}

      {/* 3. INTERFACE ADMIN */}
      {student?.role === 'admin' && (
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-30">
          <select
            id={`select-class-${gameId}`}
            onChange={(e) => onToggleLock(e.target.value, 'check')} 
            className="bg-slate-800 text-white text-[11px] font-bold border border-white/10 rounded-lg px-2 py-1 outline-none focus:border-blue-500 cursor-pointer appearance-none text-center transition-all shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {["Tanpa Kelas", "7.1", "7.2", "7.3", "7.4", "7.5", "7.6", "7.7", "7.8", "7.9", "7.10", "7.11"].map(cls => (
              <option key={cls} value={cls}>
                {getOptionLabel(cls, cls === "Tanpa Kelas" ? "Guest / Umum" : `Kelas ${cls}`)}
              </option>
            ))}
          </select>

          <button
            onClick={(e) => {
              e.stopPropagation();
              const selectedClass = document.getElementById(`select-class-${gameId}`).value;
              onToggleLock(selectedClass, 'toggle');
            }}
            className={`p-3 rounded-2xl border transition-all shadow-xl ${
              isGameLocked
                ? 'bg-red-500 border-red-400 text-white'
                : 'bg-slate-800 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {isGameLocked ? <Lock size={18} /> : <Unlock size={18} />}
          </button>
        </div>
      )}
    </div>
  );
}