import React, { useState } from 'react';
import { Bold, Italic, Underline, Palette, Type, Sparkles, Check } from 'lucide-react';

export default function VisualFontFormatting() {
  const [isBold, setIsBold] = useState(true);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [fontSize, setFontSize] = useState('20');
  const [fontColor, setFontColor] = useState('#1e3a8a'); // blue-900

  const colors = [
    { label: 'Biru Tua', value: '#1e3a8a' },
    { label: 'Hitam Pekat', value: '#0f172a' },
    { label: 'Merah Marun', value: '#991b1b' },
    { label: 'Hijau Toska', value: '#065f46' },
    { label: 'Emas Elegan', value: '#b45309' },
  ];

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs sm:text-sm font-black text-white">
            Simulator Interaktif: Format Tulisan (Grup Font Tab Home)
          </h4>
        </div>
        <span className="text-[11px] text-amber-300 font-bold">
          Coba klik tombol format di bawah ini!
        </span>
      </div>

      {/* Font Control Bar (Ms Word Style) */}
      <div className="p-3 bg-slate-900 border border-slate-700/80 rounded-2xl flex items-center gap-2 sm:gap-3 flex-wrap text-xs shadow-inner">
        {/* Font Family Dropdown */}
        <div className="bg-slate-800 text-white px-2.5 py-1.5 rounded-lg font-mono text-xs border border-slate-700 flex items-center gap-2">
          <Type className="w-3.5 h-3.5 text-blue-400" />
          <span>Calibri (Body)</span>
        </div>

        {/* Font Size Selector */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
          <span className="text-[10px] text-slate-400 pl-1 font-bold">Ukuran:</span>
          {['12', '16', '20', '24', '28'].map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setFontSize(sz)}
              className={`px-2 py-0.5 rounded font-mono text-xs font-bold transition ${
                fontSize === sz
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>

        {/* Bold Button */}
        <button
          type="button"
          onClick={() => setIsBold(!isBold)}
          title="Bold (Ctrl + B) - Menebalkan Tulisan"
          className={`px-3 py-1.5 rounded-lg font-black text-sm flex items-center gap-1.5 transition border ${
            isBold
              ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
          }`}
        >
          <Bold className="w-3.5 h-3.5" />
          <span>B</span>
        </button>

        {/* Italic Button */}
        <button
          type="button"
          onClick={() => setIsItalic(!isItalic)}
          title="Italic (Ctrl + I) - Memiringkan Tulisan"
          className={`px-3 py-1.5 rounded-lg italic font-serif text-sm flex items-center gap-1.5 transition border ${
            isItalic
              ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
          }`}
        >
          <Italic className="w-3.5 h-3.5" />
          <span>I</span>
        </button>

        {/* Underline Button */}
        <button
          type="button"
          onClick={() => setIsUnderline(!isUnderline)}
          title="Underline (Ctrl + U) - Garis Bawah"
          className={`px-3 py-1.5 rounded-lg underline text-sm flex items-center gap-1.5 transition border ${
            isUnderline
              ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
          }`}
        >
          <Underline className="w-3.5 h-3.5" />
          <span>U</span>
        </button>

        {/* Font Color Palette */}
        <div className="flex items-center gap-1.5 ml-auto bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
          <Palette className="w-3.5 h-3.5 text-slate-300" />
          <div className="flex items-center gap-1">
            {colors.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setFontColor(c.value)}
                style={{ backgroundColor: c.value }}
                title={c.label}
                className={`w-4 h-4 rounded-full border transition transform ${
                  fontColor === c.value ? 'scale-125 border-white ring-2 ring-blue-400' : 'border-slate-600 hover:scale-110'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview Paper Display */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-300 text-center min-h-[140px] flex flex-col items-center justify-center space-y-2 transition-all">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
          Hasil Preview Pada Lembar Kerja Word:
        </span>

        <div
          style={{
            fontWeight: isBold ? '900' : '400',
            fontStyle: isItalic ? 'italic' : 'normal',
            textDecoration: isUnderline ? 'underline' : 'none',
            fontSize: `${fontSize}px`,
            color: fontColor,
            lineHeight: '1.3',
          }}
          className="transition-all tracking-wide max-w-lg"
        >
          UNDANGAN PERAYAAN HUT KE-65 SPENDARAJA
        </div>

        <p className="text-xs text-slate-600">
          "Mengukir Prestasi Emas, Menyongsong Generasi Berkarakter"
        </p>

        <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono border">
            Bold: <strong>{isBold ? 'AKTIF (Tebal)' : 'Mati'}</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono border">
            Italic: <strong>{isItalic ? 'AKTIF (Miring)' : 'Mati'}</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono border">
            Underline: <strong>{isUnderline ? 'AKTIF (Garis Bawah)' : 'Mati'}</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono border">
            Ukuran: <strong>{fontSize} pt</strong>
          </span>
        </div>
      </div>

      {/* Keyboard Shortcut Cheatsheet */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-300">Tebal (Bold)</span>
          <kbd className="px-2 py-0.5 bg-slate-800 text-amber-300 rounded font-mono font-bold text-[11px] border border-slate-700">
            Ctrl + B
          </kbd>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-300">Miring (Italic)</span>
          <kbd className="px-2 py-0.5 bg-slate-800 text-amber-300 rounded font-mono font-bold text-[11px] border border-slate-700">
            Ctrl + I
          </kbd>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-300">Garis Bawah (Underline)</span>
          <kbd className="px-2 py-0.5 bg-slate-800 text-amber-300 rounded font-mono font-bold text-[11px] border border-slate-700">
            Ctrl + U
          </kbd>
        </div>
      </div>
    </div>
  );
}
