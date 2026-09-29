import React, { useState } from 'react';
import { Save, Folder, Sparkles, CheckCircle2, FileText, HardDrive, ArrowRight } from 'lucide-react';

export default function VisualSaveExport() {
  const [studentName, setStudentName] = useState('Made');
  const [studentAbsen, setStudentAbsen] = useState('05');

  const generatedFileName = `tugas 5_${studentName || 'nama'}_${studentAbsen || 'noAbsen'}_pengalaman belajar.docx`;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Save className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs sm:text-sm font-black text-white">
            Simulasi Kotak Dialog Save As (Menyimpan File Dokumen)
          </h4>
        </div>
        <span className="text-[11px] text-purple-300 font-bold">
          File &gt; Save As (Ctrl + S / F12)
        </span>
      </div>

      {/* Realistic Windows / Word Save As Dialog Box */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden font-sans">
        {/* Dialog Header */}
        <div className="bg-slate-800/90 border-b border-slate-700 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white">Save As (Simpan Sebagai)</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Microsoft Word</span>
        </div>

        {/* Folder Path Breadcrumbs */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 text-xs overflow-x-auto">
          <HardDrive className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-400">PC Ini</span>
          <span className="text-slate-600">&gt;</span>
          <span className="text-slate-300 font-medium">Downloads</span>
          <span className="text-slate-600">&gt;</span>
          <span className="text-blue-400 font-medium">Kelas 7</span>
          <span className="text-slate-600">&gt;</span>
          <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            📁 {studentName}_{studentAbsen}
          </span>
        </div>

        {/* Input Interactive Form in Dialog */}
        <div className="p-4 space-y-3 text-xs">
          {/* File Name Field */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
            <label className="sm:col-span-3 font-bold text-slate-300">
              File name (Nama berkas):
            </label>
            <div className="sm:col-span-9 relative">
              <input
                type="text"
                readOnly
                value={generatedFileName}
                className="w-full bg-slate-950 border border-blue-500 rounded-xl px-3 py-2 text-emerald-300 font-mono text-xs font-bold shadow-inner focus:outline-none"
              />
              <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono">
                Auto Format
              </span>
            </div>
          </div>

          {/* Save As Type Field */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
            <label className="sm:col-span-3 font-bold text-slate-300">
              Save as type:
            </label>
            <div className="sm:col-span-9">
              <div className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs font-medium flex items-center justify-between">
                <span>Word Document (*.docx)</span>
                <span className="text-[10px] bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                  Standar Word
                </span>
              </div>
            </div>
          </div>

          {/* Test Inputs to customize name & absen */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Ketik Namamu untuk Tes:
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Contoh: Made"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                No Absenmu:
              </label>
              <input
                type="text"
                value={studentAbsen}
                onChange={(e) => setStudentAbsen(e.target.value)}
                placeholder="Contoh: 05"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Dialog Action Buttons */}
        <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs hover:text-white"
          >
            Cancel
          </button>
          <div className="px-5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5" />
            <span>Save (Simpan)</span>
          </div>
        </div>
      </div>

      {/* Guide Card */}
      <div className="p-3 bg-purple-950/30 border border-purple-500/40 rounded-2xl text-xs text-purple-200 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block font-bold">Aturan Penamaan Berkas Langkah 7:</strong>
          <span>
            Gunakan format huruf kecil rapi:{' '}
            <strong className="text-white font-mono bg-purple-900/60 px-1.5 py-0.5 rounded">
              tugas 5_nama_noAbsen_pengalaman belajar
            </strong>{' '}
            (contoh: <code className="text-emerald-300">tugas 5_Made_05_pengalaman belajar.docx</code>) agar berkas
            mudah dikenali saat diunggah ke Ruang Belajar di Tahap 3!
          </span>
        </div>
      </div>
    </div>
  );
}
