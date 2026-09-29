import React, { useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, FileText, CheckCircle2 } from 'lucide-react';

export default function VisualPageAlignment() {
  const [alignment, setAlignment] = useState('center');
  const [orientation, setOrientation] = useState('portrait');

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <AlignCenter className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs sm:text-sm font-black text-white">
            Perataan Teks & Tata Letak Undangan Sederhana
          </h4>
        </div>
        <span className="text-[11px] text-emerald-300 font-bold">
          Coba tombol perataan (Align) di bawah!
        </span>
      </div>

      {/* Control Bar: Alignments & Orientation */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-slate-900 p-2.5 rounded-2xl border border-slate-800 text-xs">
        {/* Alignment Buttons */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400 text-[10px] font-bold px-1 hidden sm:inline">Perataan:</span>
          <button
            type="button"
            onClick={() => setAlignment('left')}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg flex items-center gap-1 font-bold transition ${
              alignment === 'left' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Left (Kiri)</span>
          </button>
          <button
            type="button"
            onClick={() => setAlignment('center')}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg flex items-center gap-1 font-bold transition ${
              alignment === 'center' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <AlignCenter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Center (Tengah)</span>
          </button>
          <button
            type="button"
            onClick={() => setAlignment('right')}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg flex items-center gap-1 font-bold transition ${
              alignment === 'right' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <AlignRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Right (Kanan)</span>
          </button>
          <button
            type="button"
            onClick={() => setAlignment('justify')}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg flex items-center gap-1 font-bold transition ${
              alignment === 'justify' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <AlignJustify className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Justify (Rata Kiri-Kanan)</span>
          </button>
        </div>

        {/* Orientation Toggle */}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-slate-400 text-[10px] font-bold px-1 hidden sm:inline">Kertas:</span>
          <button
            type="button"
            onClick={() => setOrientation('portrait')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
              orientation === 'portrait' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Portrait (Tegak)
          </button>
          <button
            type="button"
            onClick={() => setOrientation('landscape')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
              orientation === 'landscape' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Landscape (Mendatar)
          </button>
        </div>
      </div>

      {/* Simulated A4 Paper with Responsive Dimension */}
      <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-6 border border-slate-800 flex items-center justify-center">
        <div
          className={`bg-white text-slate-900 rounded-xl shadow-2xl p-4 sm:p-6 border border-slate-300 transition-all ${
            orientation === 'portrait' ? 'w-full max-w-sm min-h-[260px]' : 'w-full max-w-md min-h-[210px]'
          }`}
        >
          {/* Header Badge */}
          <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center mx-auto text-xs font-black shadow-xs mb-2">
            SPENDA
          </div>

          {/* Dynamic Align Text Demo */}
          <div
            style={{ textAlign: alignment }}
            className="space-y-2 border-b border-slate-200 pb-3"
          >
            <h5 className="font-black text-xs sm:text-sm text-blue-950 uppercase tracking-wide">
              UNDANGAN PERAYAAN HUT KE-65 SMPN 2 SINGARAJA
            </h5>
            <p className="text-[11px] text-slate-600 italic">
              "Mengukir Prestasi Emas, Menyongsong Generasi Berkarakter"
            </p>
          </div>

          {/* Event Details (Boxed Shape) */}
          <div className="mt-3 p-2.5 rounded-lg bg-blue-50/70 border border-blue-200 text-[11px] text-slate-700 space-y-1">
            <p className="font-bold text-blue-900">Rincian Acara:</p>
            <p>📅 Sabtu, 14 November 2026</p>
            <p>⏰ Pukul 08.00 WITA - Selesai</p>
            <p>📍 Aula Graha Widya Spendaraja</p>
          </div>

          <div
            style={{ textAlign: alignment }}
            className="mt-3 text-[10px] text-slate-500 font-medium"
          >
            Status Perataan Saat Ini:{' '}
            <strong className="text-blue-900 uppercase">{alignment}</strong>
          </div>
        </div>
      </div>

      {/* Quick Fact Banner */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-300 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>Kunci Desain:</strong> Gunakan <strong>Center (Rata Tengah / Ctrl+E)</strong> untuk Kop dan Judul Undangan agar tampak simetris dan anggun di lembar kerja!
        </span>
      </div>
    </div>
  );
}
