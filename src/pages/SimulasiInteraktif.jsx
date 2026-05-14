import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Cat, ArrowRight, Settings2, Code, MessageSquare, Flag } from 'lucide-react';

const SimulasiScratchLoop = () => {
  const [loopCount, setLoopCount] = useState(4);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [spritePosition, setSpritePosition] = useState(0);
  const [activeBlock, setActiveBlock] = useState(null);

  useEffect(() => {
    let interval;
    if (isRunning) {
      if (currentIteration < loopCount) {
        // Step 1: Sorot blok Repeat
        setActiveBlock('repeat');
        
        interval = setTimeout(() => {
          // Step 2: Sorot blok Move dan gerakkan sprite
          setActiveBlock('move');
          setSpritePosition((prev) => prev + 60);
          
          interval = setTimeout(() => {
            // Step 3: Iterasi bertambah
            setCurrentIteration((prev) => prev + 1);
          }, 600);
        }, 600);
      } else {
        setIsRunning(false);
        setActiveBlock('end');
      }
    }
    return () => clearTimeout(interval);
  }, [isRunning, currentIteration, loopCount]);

  const handleRun = () => {
    setIsRunning(false);
    setCurrentIteration(0);
    setSpritePosition(0);
    setActiveBlock(null);
    setTimeout(() => setIsRunning(true), 100);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentIteration(0);
    setSpritePosition(0);
    setActiveBlock(null);
  };

  // Komponen Blok Kode Internal
  const ScratchBlock = ({ children, color, active }) => (
    <div className={`${color} ${active ? 'ring-4 ring-yellow-400 scale-105 z-10' : 'opacity-90'} text-white px-4 py-3 rounded-lg font-bold text-sm mb-1 flex items-center gap-2 shadow-md transition-all duration-300 w-full border-b-4 border-black/20`}>
      {children}
    </div>
  );

  return (
    <div className="p-8 pt-24 bg-slate-50 min-h-screen font-sans text-slate-800">
      {/* HEADER MODUL */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-orange-600 mb-1">
            <Code size={20} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Eksplorasi Nalar Analitis</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase">Simulasi Logika Perulangan</h2>
          <p className="text-slate-500 text-sm italic">Media Interaktif Ruang Spendaraja - SMPN 2 Singaraja</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleRun} 
            disabled={isRunning} 
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-black flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-orange-200 active:scale-95"
          >
            <Play size={20} fill="currentColor" /> JALANKAN LOGIKA
          </button>
          <button 
            onClick={handleReset} 
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all border border-slate-200"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* KIRI: PANEL KONTROL & KODE */}
        <div className="lg:col-span-4 space-y-6">
          {/* Input Variabel */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
              <Settings2 size={18} className="text-orange-500" /> Konfigurasi Algoritma
            </h3>
            <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <label className="text-[10px] text-slate-400 font-black uppercase">Jumlah Iterasi (n)</label>
                    <span className="text-3xl font-black text-orange-600">{loopCount}<span className="text-sm text-slate-400 font-normal">x</span></span>
                </div>
                <input 
                    type="range" min="1" max="8" value={loopCount} 
                    onChange={(e) => setLoopCount(parseInt(e.target.value))}
                    disabled={isRunning}
                    className="w-full h-3 bg-slate-100 rounded-xl appearance-none cursor-pointer accent-orange-500 border border-slate-200"
                />
            </div>
            <div className="mt-6 bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
                <MessageSquare size={24} className="text-blue-500 flex-shrink-0" />
                <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                    "Ubah variabel di atas untuk menganalisis bagaimana instruksi <span className="font-bold italic">repeat</span> mengontrol pergerakan objek secara otomatis."
                </p>
            </div>
          </div>

          {/* Area Blok Kode Scratch */}
          <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl">
            <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Script Editor</h3>
            <div className="space-y-1">
                <ScratchBlock color="bg-orange-500" active={activeBlock === 'repeat'}>
                   <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
                   <span>repeat</span>
                   <span className="bg-white text-orange-600 px-3 py-0.5 rounded text-xs font-black">{loopCount}</span>
                </ScratchBlock>
                <div className="pl-8 py-1 border-l-8 border-orange-600/30 ml-4">
                    <ScratchBlock color="bg-blue-500" active={activeBlock === 'move'}>
                        <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
                        <span>move</span>
                        <span className="bg-white text-blue-600 px-3 py-0.5 rounded text-xs font-black">10</span>
                        <span>steps</span>
                    </ScratchBlock>
                </div>
                <div className="w-1/2 h-4 bg-orange-500 rounded-b-xl ml-4 opacity-50"></div>
            </div>
          </div>
        </div>

        {/* KANAN: PANEL VISUALISASI (STAGE) */}
        <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-800 rounded-2xl p-6 flex justify-between items-center text-white mb-2">
                    <div className="flex gap-4">
                        <div className="bg-slate-700 px-4 py-2 rounded-xl border border-slate-600">
                            <p className="text-[9px] uppercase text-slate-400 font-bold">Iterasi Saat Ini</p>
                            <p className="text-xl font-black text-orange-400">{currentIteration}</p>
                        </div>
                        <div className="bg-slate-700 px-4 py-2 rounded-xl border border-slate-600">
                            <p className="text-[9px] uppercase text-slate-400 font-bold">Koordinat X</p>
                            <p className="text-xl font-black text-blue-400">{spritePosition}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400">STATUS SISTEM</p>
                        <p className={`text-xs font-black uppercase ${isRunning ? 'text-green-400' : 'text-slate-500'}`}>
                            {isRunning ? '● Menjalankan Algoritma' : '○ Standby'}
                        </p>
                    </div>
                </div>

                {/* STAGE AREA */}
                <div className="relative bg-slate-950 rounded-2xl h-[350px] w-full overflow-hidden border-8 border-slate-200">
                    {/* Grid Background */}
                    <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(#2d3748 1px, transparent 1px), linear-gradient(90deg, #2d3748 1px, transparent 1px)', size: '40px 40px'}}></div>
                    
                    {/* Skala Jarak */}
                    <div className="absolute bottom-4 inset-x-0 flex justify-between px-10">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="h-2 w-0.5 bg-slate-700"></div>
                                <span className="text-[9px] text-slate-600 font-mono mt-1">{i * 10}</span>
                            </div>
                        ))}
                    </div>

                    {/* Sprite Kucing */}
                    <div 
                        className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out flex flex-col items-center"
                        style={{ left: `${spritePosition + 40}px` }}
                    >
                        {isRunning && (
                            <div className="absolute -inset-8 bg-orange-500/20 rounded-full animate-ping"></div>
                        )}
                        <div className={`p-5 rounded-3xl border-4 transition-transform duration-300 shadow-2xl ${isRunning ? 'bg-orange-500 border-white scale-110 -rotate-6' : 'bg-white border-orange-500'}`}>
                            <Cat size={60} className={isRunning ? 'text-white' : 'text-orange-500'} />
                        </div>
                        <div className="mt-3 bg-black/50 backdrop-blur-md text-[10px] text-white px-4 py-1 rounded-full font-bold border border-white/20">
                            SPRITE_CAT_01
                        </div>
                    </div>

                    {/* Finish Line */}
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-30 flex flex-col items-center">
                        <Flag size={80} className="text-white" />
                        <p className="text-white font-black text-xs tracking-widest mt-2">FINISH</p>
                    </div>
                </div>
            </div>

            {/* ANALISIS OUTPUT (REFLEKSI) */}
            <div className="bg-slate-900 p-6 rounded-3xl border-b-8 border-blue-600 shadow-xl">
                <h4 className="text-blue-400 text-[10px] font-black uppercase mb-3">Log Analisis Nalar:</h4>
                <div className="font-mono text-sm">
                    {currentIteration === 0 && !isRunning && <p className="text-slate-500 underline">Menunggu input variabel untuk memulai simulasi...</p>}
                    {isRunning && <p className="text-white">Executing: <span className="text-orange-400">Repeat loop {currentIteration + 1} of {loopCount}</span></p>}
                    {!isRunning && currentIteration > 0 && (
                        <div className="space-y-1">
                            <p className="text-green-400 font-bold">✓ Algoritma Selesai Dieksekusi!</p>
                            <p className="text-slate-400 text-xs italic">Kesimpulan: Dengan perulangan {loopCount}x, objek berpindah total {spritePosition} unit ke arah kanan.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SimulasiScratchLoop;