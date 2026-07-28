import React from 'react';
import { Users, GraduationCap, School } from 'lucide-react';

export default function StatistikKelas({ listSiswa, selectedKelas, onSelectKelas }) {
  // Hitung jumlah siswa per kelas
  const kelasMap = listSiswa.reduce((acc, siswa) => {
    const k = siswa.Kelas ? siswa.Kelas.toString().trim() : 'Tanpa Kelas';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  const sortedKelas = Object.keys(kelasMap).sort();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <School size={16} className="text-indigo-400" /> Ringkasan Jumlah Siswa Per Kelas
        </h2>
        <span className="text-[10px] font-mono text-slate-500">Total: {listSiswa.length} Siswa</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Card Semua */}
        <button
          type="button"
          onClick={() => onSelectKelas('')}
          className={`p-3 rounded-2xl border text-left transition-all ${
            selectedKelas === ''
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg scale-[1.02]'
              : 'bg-slate-900 border-white/5 text-slate-300 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <Users size={16} className="opacity-70" />
            <span className="text-xs font-mono font-black">{listSiswa.length}</span>
          </div>
          <div className="text-[10px] font-black uppercase tracking-wider mt-2">Semua Siswa</div>
        </button>

        {/* Loop Per Kelas */}
        {sortedKelas.map((kelasName) => {
          const isAlumni = kelasName.toLowerCase().includes('alumni');
          const isSelected = selectedKelas === kelasName;

          return (
            <button
              key={kelasName}
              type="button"
              onClick={() => onSelectKelas(kelasName)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? isAlumni
                    ? 'bg-amber-600 border-amber-400 text-white shadow-lg scale-[1.02]'
                    : 'bg-indigo-600 border-indigo-400 text-white shadow-lg scale-[1.02]'
                  : isAlumni
                  ? 'bg-amber-950/30 border-amber-500/20 text-amber-300 hover:border-amber-500/40'
                  : 'bg-slate-900 border-white/5 text-slate-300 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                {isAlumni ? <GraduationCap size={16} className="opacity-70" /> : <School size={16} className="opacity-70" />}
                <span className="text-xs font-mono font-black">{kelasMap[kelasName]}</span>
              </div>
              <div className="text-[10px] font-black uppercase tracking-wider mt-2 truncate">
                {isAlumni ? 'Alumni' : `Kelas ${kelasName}`}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}