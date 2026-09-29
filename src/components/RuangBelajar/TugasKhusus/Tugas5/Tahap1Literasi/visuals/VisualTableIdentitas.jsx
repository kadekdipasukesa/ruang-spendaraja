import React, { useState } from 'react';
import { Table, Palette, Sparkles, CheckCircle2, MoveHorizontal } from 'lucide-react';

export default function VisualTableIdentitas() {
  const [hasShading, setHasShading] = useState(true);
  const [shadingColor, setShadingColor] = useState('blue'); // 'blue' | 'gray' | 'none'
  const [columnWidthState, setColumnWidthState] = useState('adjusted'); // 'equal' | 'adjusted'

  const getHeaderBg = () => {
    if (shadingColor === 'blue') return 'bg-blue-100 text-slate-900';
    if (shadingColor === 'gray') return 'bg-slate-200 text-slate-900';
    return 'bg-white text-slate-900';
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs sm:text-sm font-black text-white">
            Simulasi Membuat Tabel Identitas Siswa (3 Kolom x 5 Baris)
          </h4>
        </div>
        <span className="text-[11px] text-blue-300 font-bold">
          Insert &gt; Table &gt; Shading Header
        </span>
      </div>

      {/* Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3 flex-wrap text-xs">
        {/* Shading Options */}
        <div className="flex items-center gap-2">
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-300 font-bold">Warna Shading Header:</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShadingColor('blue')}
              className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                shadingColor === 'blue'
                  ? 'bg-blue-600 text-white border-blue-400'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              Biru Muda
            </button>
            <button
              type="button"
              onClick={() => setShadingColor('gray')}
              className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                shadingColor === 'gray'
                  ? 'bg-blue-600 text-white border-blue-400'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              Abu-Abu
            </button>
            <button
              type="button"
              onClick={() => setShadingColor('none')}
              className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                shadingColor === 'none'
                  ? 'bg-blue-600 text-white border-blue-400'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              Tanpa Warna
            </button>
          </div>
        </div>

        {/* Column Width Adjuster */}
        <div className="flex items-center gap-2">
          <MoveHorizontal className="w-3.5 h-3.5 text-blue-400" />
          <button
            type="button"
            onClick={() => setColumnWidthState(columnWidthState === 'adjusted' ? 'equal' : 'adjusted')}
            className={`px-2.5 py-1 rounded-lg font-bold border transition ${
              columnWidthState === 'adjusted'
                ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {columnWidthState === 'adjusted' ? '✓ Garis Kolom No Disesuaikan' : 'Lebar Kolom Sama Rata'}
          </button>
        </div>
      </div>

      {/* Simulated Table Display */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 flex justify-center">
        <div className="w-full max-w-lg bg-white text-slate-900 rounded-xl shadow-lg p-5 border border-slate-300 font-['Calibri',sans-serif]">
          {/* Section Heading */}
          <h2 className="text-xs sm:text-sm font-bold text-slate-950 uppercase mb-2">
            1. IDENTITAS SISWA
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-800 text-[11px] sm:text-xs">
              <thead>
                <tr className={`${getHeaderBg()} font-bold transition-colors`}>
                  <th
                    style={{ width: columnWidthState === 'adjusted' ? '48px' : '33%' }}
                    className="border border-slate-800 py-1.5 px-2 text-center transition-all"
                  >
                    No
                  </th>
                  <th
                    style={{ width: columnWidthState === 'adjusted' ? '180px' : '33%' }}
                    className="border border-slate-800 py-1.5 px-3 text-left transition-all"
                  >
                    Informasi Siswa
                  </th>
                  <th className="border border-slate-800 py-1.5 px-3 text-left">
                    Keterangan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="border border-slate-800 py-1 px-2 text-center">1</td>
                  <td className="border border-slate-800 py-1 px-3 font-medium">Nama Lengkap</td>
                  <td className="border border-slate-800 py-1 px-3 text-slate-400 font-mono">
                    .................................................................
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-800 py-1 px-2 text-center">2</td>
                  <td className="border border-slate-800 py-1 px-3 font-medium">Kelas / No. Absen</td>
                  <td className="border border-slate-800 py-1 px-3 text-slate-400 font-mono">
                    7. ..... / .....
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-800 py-1 px-2 text-center">3</td>
                  <td className="border border-slate-800 py-1 px-3 font-medium">Mata Pelajaran</td>
                  <td className="border border-slate-800 py-1 px-3 text-slate-900 font-medium">
                    Informatika
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-800 py-1 px-2 text-center">4</td>
                  <td className="border border-slate-800 py-1 px-3 font-medium">Hobi / Minat</td>
                  <td className="border border-slate-800 py-1 px-3 text-slate-400 font-mono">
                    .................................................................
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Guide Note */}
      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block font-bold">Tips Merapikan Tabel:</strong>
          <span>
            Arahkan kursor mouse ke garis pembatas antara kolom <strong>No</strong> dan{' '}
            <strong>Informasi Siswa</strong> sampai kursor berubah menjadi tanda panah ganda (↔), lalu klik tahan dan
            geser ke arah kiri agar kolom nomor tidak terlalu lebar dan pas dengan angka 1–4.
          </span>
        </div>
      </div>
    </div>
  );
}
