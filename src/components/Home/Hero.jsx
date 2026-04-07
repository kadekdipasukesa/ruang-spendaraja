import { Sparkles, GraduationCap, ArrowRight, PartyPopper } from 'lucide-react';

export default function Hero({ student, onStart }) {
  const fullName = student ? student.NAMA : '';

  return (
    <div className="relative overflow-hidden bg-[#1e293b]/50 border border-white/10 p-8 md:p-12 rounded-[2.5rem] mb-8 shadow-2xl backdrop-blur-xl group text-left">
      
      {/* --- ANIMASI KEMBANG API --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="firework absolute top-1/4 left-1/4"></div>
        <div className="firework absolute top-1/3 left-2/3"></div>
        <div className="firework absolute top-1/2 left-1/2"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-black uppercase tracking-[0.2em] mb-6 animate-pulse">
            <Sparkles size={14} className="text-yellow-400" />
            Platform Digital Ruang Spendaraja
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
              {student ? "Selamat Datang," : "Eksplorasi"}
            </h1>
            
            {/* Penyesuaian di sini: Menambahkan flex & items-center agar nama dan badge sejajar rapi */}
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight flex flex-wrap items-center gap-x-4 gap-y-2">
              {student ? (
                <>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 capitalize">
                    {fullName.toLowerCase()}
                  </span>
                  
                  {/* Logika: Hanya muncul jika Admin ATAU Siswa Kelas 7.1 - 7.11 */}
{(student?.role === 'admin' || (student?.Kelas && /^7\.(1[0-1]|[1-9])$/.test(student.Kelas))) && (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)] transition-all duration-500 hover:scale-105">
    <div className="p-1 rounded-full bg-yellow-500/20">
      <PartyPopper size={14} className="text-yellow-400" />
    </div>
    <div className="flex flex-col leading-none">
      <span className="text-[9px] text-yellow-500/70 font-black uppercase tracking-wider">POIN</span>
      <span className="text-lg font-black text-yellow-400">
        {/* Fallback ke 0 jika data belum sync */}
        {student.total_points ?? 0}
      </span>
    </div>
  </div>
)}
                </>
              ) : (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  Ruang Spendaraja
                </span>
              )}
            </h2>
          </div>

          <p className="text-slate-400 max-w-lg text-sm md:text-base leading-relaxed my-8 font-medium">
            Pusat kreativitas, pantau tugas, dan raih prestasi bersama teman-teman sekelas di platform kebanggaan kita.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onStart}
              className="group/btn flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"
            >
              Mulai Petualangan <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        <div className="hidden lg:block relative">
          <div className="absolute inset-0 bg-blue-500 blur-[80px] opacity-20"></div>
          <div className="relative bg-gradient-to-tr from-blue-600 to-indigo-600 p-8 rounded-[2.5rem] shadow-2xl rotate-3 group-hover:rotate-6 transition-transform duration-500 border-2 border-white/20">
            <GraduationCap size={100} className="text-white drop-shadow-2xl" />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .firework {
          width: 6px;
          aspect-ratio: 1;
          border-radius: 50%;
          color: #60a5fa;
          background: 
            radial-gradient(circle at 50% 50%, currentColor 0, transparent 0) 50% 50%,
            radial-gradient(circle at 50% 50%, currentColor 0, transparent 0) 50% 50%,
            radial-gradient(circle at 50% 50%, currentColor 0, transparent 0) 50% 50%,
            radial-gradient(circle at 50% 50%, currentColor 0, transparent 0) 50% 50%,
            radial-gradient(circle at 50% 50%, currentColor 0, transparent 0) 50% 50%,
            radial-gradient(circle at 50% 50%, currentColor 0, transparent 0) 50% 50%,
            radial-gradient(circle at 50% 50%, currentColor 0, transparent 0) 50% 50%,
            radial-gradient(circle at 50% 50%, currentColor 0, transparent 0) 50% 50%;
          background-size: 0 0;
          background-repeat: no-repeat;
          animation: firework 3s infinite;
        }

        @keyframes firework {
          0% { background-size: 0 0; opacity: 1; }
          40% { background-size: 6px 6px; opacity: 1; }
          100% { background-size: 15px 15px; opacity: 0; background-position: 10% 10%, 90% 10%, 90% 90%, 10% 90%, 50% 0, 0 50%, 100% 50%, 50% 100%; }
        }
      `}} />
    </div>
  );
}