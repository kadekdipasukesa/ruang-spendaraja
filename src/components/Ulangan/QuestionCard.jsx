import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function QuestionCard({ soal, selectedJawab, onPilih, isBlocked }) {
  // Jika soal belum dimuat, tampilkan loading atau null
  if (!soal) {
    return (
      <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 flex items-center justify-center">
        <p className="text-slate-500 animate-pulse font-black">MEMUAT SOAL...</p>
      </div>
    );
  }

  return (
    <motion.div 
      key={soal.id}
      initial={{ x: 20, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }}
      className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden"
    >
      {/* Overlay jika siswa diblokir karena curang */}
      {isBlocked && (
        <div className="absolute inset-0 bg-red-600/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-8 text-center">
          <Lock size={64} className="mb-4 text-white animate-bounce" />
          <h2 className="text-3xl font-black text-white uppercase mb-2">Akses Terkunci</h2>
          <p className="text-white/80 font-medium">Anda terdeteksi melakukan pelanggaran tab lebih dari 3 kali. Silakan lapor ke Guru Pengawas.</p>
        </div>
      )}

      {/* Label Materi */}
      <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
        {soal.materi}
      </span>
      
      {/* Teks Pertanyaan (Menggunakan 'teks' sesuai SOAL_POOL) */}
      <h3 className="text-xl md:text-2xl font-bold leading-relaxed my-6 text-white">
        {soal.teks}
      </h3>

      {/* Daftar Pilihan Jawaban */}
      <div className="grid grid-cols-1 gap-3">
        {soal.opsi && soal.opsi.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onPilih(soal.id, opt)}
            className={`p-5 rounded-2xl border-2 text-left transition-all font-bold flex items-center justify-between group ${
              selectedJawab === opt 
              ? 'bg-blue-600 border-blue-400 text-white shadow-lg' 
              : 'bg-slate-800/40 border-white/5 hover:bg-slate-800 text-slate-400'
            }`}
          >
            <span className="flex-1">{opt}</span>
            
            {/* Indikator Bulat (Radio Button Style) */}
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
              selectedJawab === opt ? 'border-white' : 'border-slate-700'
            }`}>
              {selectedJawab === opt && (
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="w-3 h-3 bg-white rounded-full" 
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}