import React from 'react';
import { AlertOctagon, ShieldAlert, AlertTriangle, UserX } from 'lucide-react';

export default function RekapSiswa({ data }) {
  return (
    <div className="bg-slate-800/30 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl h-fit">
      {/* Header - Diganti dari Trophy ke AlertOctagon agar lebih tegas */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="p-2 bg-red-500/10 rounded-lg">
          <AlertOctagon size={22} className="text-red-500" />
        </div>
        <div>
          <h2 className="text-white font-black italic tracking-widest uppercase text-sm">
            Daftar Poin Kedisiplinan
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
            Siswa dengan akumulasi catatan terbanyak
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {data && data.length > 0 ? (
          data.map((siswa, idx) => {
            // Tentukan status berdasarkan jumlah poin
            const isCritical = siswa.total_pelanggaran >= 4;
            
            return (
              <div 
                key={idx} 
                className={`p-4 rounded-2xl flex items-center justify-between border transition-all duration-300 hover:scale-[1.01] shadow-sm
                  ${isCritical 
                    ? 'bg-red-500/10 border-red-500/30 shadow-red-900/10' 
                    : 'bg-slate-900/40 border-white/5'}`}
              >
                <div className="flex items-center gap-4">
                  {/* Ranking Indicator */}
                  <span className={`text-[10px] font-black italic w-6 ${isCritical ? 'text-red-500' : 'text-slate-600'}`}>
                    #{idx + 1}
                  </span>
                  
                  <div>
                    <p className={`font-black text-xs uppercase tracking-tight ${isCritical ? 'text-red-400' : 'text-slate-200'}`}>
                      {siswa.NAMA}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                       <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">
                         {siswa.Kelas || 'Tanpa Kelas'}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-950/50 px-4 py-2 rounded-xl border border-white/5">
                  <div className="text-right">
                    <p className="text-[8px] text-slate-500 font-black uppercase leading-none mb-1">Total Poin</p>
                    <span className={`font-black text-xl leading-none ${isCritical ? 'text-red-500' : 'text-yellow-500'}`}>
                      {siswa.total_pelanggaran}
                    </span>
                  </div>
                  {isCritical ? (
                    <ShieldAlert className="text-red-600 animate-pulse" size={20} />
                  ) : (
                    <AlertTriangle className="text-yellow-500" size={18} />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
              <UserX className="text-slate-700" size={30} />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">
              Data tidak ditemukan / Siswa bersih.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}