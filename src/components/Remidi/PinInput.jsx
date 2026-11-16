import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Play } from 'lucide-react';

export default function PinInput({ value, onChange, onJoin }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="bg-blue-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="text-blue-400" size={32} />
          </div>
          <h2 className="text-white font-black text-2xl uppercase tracking-tighter">Ruang Tunggu</h2>
          <p className="text-slate-400 text-sm">Masukkan PIN Ujian dari Guru</p>
        </div>
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder="PIN"
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-center text-3xl font-black text-blue-400 tracking-[0.5em] mb-4 focus:border-blue-500 outline-none"
        />
        <button onClick={onJoin} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2">
          <Play size={18} fill="currentColor" /> MASUK
        </button>
      </motion.div>
    </div>
  );
}