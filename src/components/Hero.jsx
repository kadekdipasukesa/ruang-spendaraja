import { Sparkles, GraduationCap, ArrowRight } from 'lucide-react';

// Pastikan ada kata 'export default' di sini
export default function Hero({ student, onStart }) {
  const firstName = student ? student.NAMA.split(' ')[0] : '';

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/40 via-indigo-900/40 to-slate-900/40 border border-white/10 p-8 md:p-12 rounded-[2rem] mb-8 shadow-2xl backdrop-blur-xl group text-left">
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-6">
            <Sparkles size={12} />
            Platform Digital SMPN 2
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
            {student ? (
              <>Selamat Datang, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">{firstName}!</span></>
            ) : (
              <>Eksplorasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Ruang Spenda</span></>
            )}
          </h1>

          <p className="text-slate-400 max-w-md text-sm md:text-base leading-relaxed mb-8">
            Pusat kreativitas, pantau tugas, dan raih prestasi bersama teman-teman sekelas.
          </p>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onStart}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
            >
              Cek Tugas <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="bg-gradient-to-tr from-blue-500 to-indigo-500 p-6 rounded-3xl shadow-2xl rotate-3">
            <GraduationCap size={80} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};