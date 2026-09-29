import React, { useState } from 'react';
import { Bold, Italic, AlignCenter, Sparkles, CheckCircle2 } from 'lucide-react';

export default function VisualFormatKhusus() {
  const [boldActive, setBoldActive] = useState(true);
  const [italicActive, setItalicActive] = useState(true);
  const [centerActive, setCenterActive] = useState(true);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Bold className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs sm:text-sm font-black text-white">
            Simulasi Format Teks Khusus (Bold, Italic &amp; Pesan Penting Center)
          </h4>
        </div>
        <span className="text-[11px] text-blue-300 font-bold">
          Coba aktifkan/matikan format di bawah
        </span>
      </div>

      {/* Formatting Toggle Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            type="button"
            onClick={() => setBoldActive(!boldActive)}
            className={`px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1.5 ${
              boldActive
                ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Bold className="w-3.5 h-3.5 stroke-[3]" />
            <span>Bold Nama (Ctrl+B): {boldActive ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => setItalicActive(!italicActive)}
            className={`px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1.5 ${
              italicActive
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Italic className="w-3.5 h-3.5" />
            <span>Italic Istilah Asing (Ctrl+I): {italicActive ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => setCenterActive(!centerActive)}
            className={`px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1.5 ${
              centerActive
                ? 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <AlignCenter className="w-3.5 h-3.5" />
            <span>Center Pesan (Ctrl+E): {centerActive ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Simulated Document Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 flex justify-center">
        <div className="w-full max-w-lg bg-white text-slate-900 rounded-xl shadow-lg p-5 border border-slate-300 font-['Calibri',sans-serif] space-y-4">
          {/* Paragraph showing Bold & Italic */}
          <p className="text-xs sm:text-sm text-justify leading-relaxed text-slate-800 indent-6">
            Hal yang paling menarik adalah saat guru menggunakan web interaktif{' '}
            <span
              className={`transition-all ${
                boldActive ? 'font-bold text-slate-950 bg-blue-100/70 px-1 rounded' : 'font-normal'
              }`}
            >
              Ruang Spendaraja
            </span>{' '}
            untuk menyampaikan materi serta memberikan tugas. Melalui{' '}
            <span
              className={`transition-all ${
                italicActive ? 'italic font-medium text-indigo-900 bg-indigo-100/70 px-1 rounded' : 'not-italic font-normal'
              }`}
            >
              platform online
            </span>{' '}
            ini, suasana belajar menjadi lebih{' '}
            <span
              className={`transition-all ${
                italicActive ? 'italic font-medium text-indigo-900 bg-indigo-100/70 px-1 rounded' : 'not-italic font-normal'
              }`}
            >
              flexible
            </span>
            , interaktif, dan menyenangkan bagi seluruh siswa.
          </p>

          {/* Pesan Penting Box with Center formatting */}
          <div
            className={`p-3 rounded-lg border transition-all ${
              centerActive ? 'text-center border-amber-300 bg-amber-50/60' : 'text-left border-slate-200 bg-slate-50'
            }`}
          >
            <p className="text-xs sm:text-sm font-bold text-slate-950 leading-normal">
              "Pesan Penting: Keterampilan digital dan pemahaman teknologi adalah kunci utama untuk meraih kesuksesan di masa depan!"
            </p>
          </div>
        </div>
      </div>

      {/* Quick Summary of Rules */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
            1. Huruf Tebal (Bold)
          </span>
          <p className="text-slate-300 text-[11px]">
            Gunakan pada kata <strong>SMPN 2 SINGARAJA</strong> &amp; <strong>Ruang Spendaraja</strong>.
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
            2. Huruf Miring (Italic)
          </span>
          <p className="text-slate-300 text-[11px]">
            Gunakan pada istilah asing: <em>platform online</em> &amp; <em>flexible</em>.
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
            3. Rata Tengah (Center)
          </span>
          <p className="text-slate-300 text-[11px]">
            Gunakan pada <strong>Pesan Penting</strong> di baris paling bawah dokumen.
          </p>
        </div>
      </div>
    </div>
  );
}
