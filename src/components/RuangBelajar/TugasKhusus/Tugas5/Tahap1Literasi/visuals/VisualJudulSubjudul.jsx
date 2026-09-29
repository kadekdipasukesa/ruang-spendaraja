import React, { useState } from 'react';
import { AlignCenter, AlignLeft, Bold, Sparkles, CheckCircle2 } from 'lucide-react';

export default function VisualJudulSubjudul() {
  const [alignment, setAlignment] = useState('center'); // 'left' | 'center'
  const [isBold, setIsBold] = useState(true);
  const [fontSize, setFontSize] = useState(20);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <AlignCenter className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs sm:text-sm font-black text-white">
            Simulasi Mengetik Judul Utama & Sub-Judul Modul
          </h4>
        </div>
        <span className="text-[11px] text-blue-300 font-bold">
          Coba tombol Center (Ctrl+E) & Bold (Ctrl+B) di bawah!
        </span>
      </div>

      {/* Toolbar Mini Simulation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Font Selector */}
          <div className="bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-700 text-xs font-bold text-white flex items-center gap-2">
            <span>Calibri</span>
          </div>

          {/* Font Size Selector */}
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-700 text-xs font-bold text-white">
            <button
              type="button"
              onClick={() => setFontSize(12)}
              className={`px-2 py-0.5 rounded ${fontSize === 12 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              12 pt
            </button>
            <button
              type="button"
              onClick={() => setFontSize(20)}
              className={`px-2 py-0.5 rounded ${fontSize === 20 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              20 pt
            </button>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          {/* Bold Toggle */}
          <button
            type="button"
            onClick={() => setIsBold(!isBold)}
            className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-bold ${
              isBold
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Bold (Ctrl + B)"
          >
            <Bold className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Bold (Ctrl+B)</span>
          </button>

          {/* Align Center Toggle */}
          <button
            type="button"
            onClick={() => setAlignment('center')}
            className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-bold ${
              alignment === 'center'
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Center (Ctrl + E)"
          >
            <AlignCenter className="w-4 h-4" />
            <span className="hidden sm:inline">Center (Ctrl+E)</span>
          </button>

          {/* Align Left Toggle */}
          <button
            type="button"
            onClick={() => setAlignment('left')}
            className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-bold ${
              alignment === 'left'
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Left (Ctrl + L)"
          >
            <AlignLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Left (Ctrl+L)</span>
          </button>
        </div>
      </div>

      {/* Simulated A4 Paper Workspace */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 flex justify-center">
        <div className="w-full max-w-lg bg-white text-slate-900 rounded-xl shadow-lg p-6 border border-slate-300 font-['Calibri',sans-serif]">
          <div className={`${alignment === 'center' ? 'text-center' : 'text-left'} space-y-1 transition-all`}>
            {/* Main Title */}
            <h1
              style={{ fontSize: `${fontSize}px` }}
              className={`tracking-tight uppercase transition-all ${
                isBold ? 'font-bold text-slate-950' : 'font-normal text-slate-800'
              }`}
            >
              PENGALAMAN BELAJAR DI SMPN 2 SINGARAJA
            </h1>

            {/* Sub-Title */}
            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              Modul Latihan Microsoft Word Kelas 7 SMP
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Perataan: <strong className="text-slate-800 uppercase">{alignment}</strong></span>
            <span>Ukuran: <strong className="text-slate-800">{fontSize} pt</strong></span>
            <span>Gaya: <strong className="text-slate-800">{isBold ? 'Bold (Tebal)' : 'Normal'}</strong></span>
          </div>
        </div>
      </div>

      {/* Key Tips */}
      <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-800/50 flex items-start gap-2.5 text-xs text-blue-200">
        <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block font-bold">Kunci Sukses Langkah 2:</strong>
          <span>
            Gunakan tombol <strong className="text-white">Ctrl + E</strong> untuk membuat teks tepat di tengah kertas, dan{' '}
            <strong className="text-white">Ctrl + B</strong> dengan ukuran <strong className="text-white">20 pt</strong> untuk
            membuat judul utama terlihat menonjol dan berwibawa!
          </span>
        </div>
      </div>
    </div>
  );
}
