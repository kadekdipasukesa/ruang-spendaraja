import React, { useState } from 'react';
import { AlignJustify, AlignLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export default function VisualCeritaPengalaman() {
  const [alignment, setAlignment] = useState('justify'); // 'left' | 'justify'

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <AlignJustify className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs sm:text-sm font-black text-white">
            Simulasi Mengetik Paragraf Cerita &amp; Fitur Justify (Ctrl + J)
          </h4>
        </div>
        <span className="text-[11px] text-blue-300 font-bold">
          Bandingkan Rata Kiri vs Justify (Rata Kanan &amp; Kiri)
        </span>
      </div>

      {/* Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs text-slate-300">
          Status Perataan Paragraf:{' '}
          <strong className="text-white uppercase font-mono">
            {alignment === 'justify' ? 'Justify (Rata Kanan & Kiri / Ctrl+J)' : 'Align Left (Rata Kiri / Ctrl+L)'}
          </strong>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAlignment('left')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              alignment === 'left'
                ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <AlignLeft className="w-4 h-4" />
            <span>Rata Kiri (Ctrl+L)</span>
          </button>

          <button
            type="button"
            onClick={() => setAlignment('justify')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              alignment === 'justify'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <AlignJustify className="w-4 h-4" />
            <span>Justify (Ctrl+J) ★ Standar Dokumen</span>
          </button>
        </div>
      </div>

      {/* Simulated Document Preview */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 flex justify-center">
        <div className="w-full max-w-lg bg-white text-slate-900 rounded-xl shadow-lg p-6 border border-slate-300 font-['Calibri',sans-serif] space-y-3">
          {/* Section 2 Title (12 pt, Bold) */}
          <h2 className="text-xs sm:text-sm font-bold text-slate-950 uppercase">
            2. CERITA PENGALAMAN BELAJAR
          </h2>

          {/* Sub-judul Ruang Spendaraja (15 pt, Bold) */}
          <h3 className="text-base sm:text-lg font-bold text-blue-950">
            Ruang Spendaraja
          </h3>

          {/* Paragraph 1 with visual alignment toggle */}
          <div className="relative">
            <p
              className={`text-xs sm:text-sm leading-relaxed text-slate-800 indent-6 transition-all ${
                alignment === 'justify' ? 'text-justify' : 'text-left'
              }`}
            >
              Masuk sebagai siswa baru di <strong>SMPN 2 SINGARAJA</strong> memberikan pengalaman belajar yang sangat
              berkesan. Salah satu pelajaran yang paling aku tunggu adalah Informatika. Di kelas ini, kami tidak hanya
              belajar teori saja, tetapi juga langsung mempraktikkan cara menggunakan perangkat komputer dan menyusun
              dokumen dengan rapi.
            </p>
            {/* Visual right margin guide line */}
            <div className="absolute top-0 right-0 bottom-0 w-px border-r border-dashed border-slate-300 pointer-events-none" />
          </div>

          {/* Alignment Explanation Badge */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              Tepi Kanan:{' '}
              <strong className={alignment === 'justify' ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                {alignment === 'justify' ? '✓ Rata Lurus Sempurna' : '✗ Bergerigi / Tidak Rata'}
              </strong>
            </span>
            <span className="italic">Gunakan Ctrl + J untuk meratakan</span>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block font-bold">Mengapa Justify Sangat Penting?</strong>
          <span>
            Dalam penulisan naskah resmi, buku, modul, maupun surat kabar, teks selalu diatur menggunakan format{' '}
            <strong>Justify (Ctrl + J)</strong> agar tepi kiri dan tepi kanan sejajar rapi lurus, sehingga enak dipandang
            mata dan nyaman dibaca.
          </span>
        </div>
      </div>
    </div>
  );
}
