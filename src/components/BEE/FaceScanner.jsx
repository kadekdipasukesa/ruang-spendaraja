import React from 'react';
import { Camera, ShieldCheck } from 'lucide-react';

export default function FaceScanner({ videoRef, scanning, isLoaded }) {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-video bg-slate-900 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl">
      {!scanning ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
          <Camera size={48} className="mb-4 text-slate-500" />
          <p className="text-sm font-bold opacity-50 uppercase tracking-widest">Kamera Belum Aktif</p>
        </div>
      ) : (
        <>
          <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
          {/* Efek Scanning Overlay */}
          <div className="absolute inset-0 border-2 border-amber-500/30 animate-pulse pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-scan" />
        </>
      )}
      
      {isLoaded && (
        <div className="absolute bottom-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] font-black flex items-center gap-2 uppercase tracking-tighter">
          <ShieldCheck size={12} /> System Ready
        </div>
      )}
    </div>
  );
}