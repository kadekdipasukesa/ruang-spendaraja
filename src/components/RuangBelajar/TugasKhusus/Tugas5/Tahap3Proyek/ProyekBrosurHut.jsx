import { useState } from 'react';
import { Sparkles, FileText, Layout, Info, Palette, Eye } from 'lucide-react';
import { PROYEK_BROSUR_DATA, TUGAS_5_CONFIG } from '../../../../../data/tugas5WordData';
import DocxViewerProtected from '../DocxViewerProtected';

export default function ProyekBrosurHut() {
  const [showExampleViewer, setShowExampleViewer] = useState(false);

  return (
    <div className="space-y-6">
      {/* Project Banner */}
      <div className="bg-gradient-to-r from-amber-900/60 via-orange-900/40 to-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between gap-4 flex-wrap relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Tahap 3 • Praktik Proyek Mandiri
              </span>
              <span className="text-xs text-slate-300">
                Informatika Kelas 7 SMP
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white mt-1">
              Praktik Microsoft Word: Pengalaman Belajar di SMPN 2 Singaraja
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Buka aplikasi <strong>Microsoft Word</strong> di komputermu, ikuti panduan 7 langkah praktik untuk membuat naskah dokumen lengkap dengan tabel identitas 3x5 dan gambar komputer PNG, lalu simpan dengan format <strong>.docx</strong> untuk diunggah di bawah.
            </p>
          </div>

          <div className="flex items-center gap-3 ml-auto flex-wrap">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Bobot Proyek</span>
              <span className="text-sm sm:text-base font-black text-amber-300">
                {TUGAS_5_CONFIG.poin_tahap3_proyek} Poin
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowExampleViewer(!showExampleViewer)}
              className="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 font-bold rounded-xl text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-blue-300" />
              <span>{showExampleViewer ? 'Sembunyikan Contoh' : 'Lihat Contoh Jadi'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Optional Toggleable Protected Example Viewer in Tahap 3 */}
      {showExampleViewer && (
        <div className="animate-fade-in space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Contoh Acuan Resmi Hasil Jadi:</span>
            <span className="text-amber-300">Gunakan sebagai panduan praktik mandiri</span>
          </div>
          <DocxViewerProtected />
        </div>
      )}

      {/* Grid: Ketentuan Font & Rubrik Penilaian */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box Kiri: Ketentuan Tipografi & Format (Calibri) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Layout className="w-5 h-5 text-blue-400" />
            <span>Ketentuan Format &amp; Ukuran Font (Calibri)</span>
          </h3>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300">
            <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </span>
              <div>
                <strong className="text-white block">Ukuran Kertas &amp; Font Default:</strong>
                Kertas ukuran <strong>A4</strong> (tab Layout ➔ Size). Seluruh jenis huruf dokumen menggunakan <strong>Calibri</strong>.
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </span>
              <div>
                <strong className="text-white block">Judul Utama:</strong>
                Ukuran <strong>20 pt</strong>, gaya <strong>Bold</strong>, dan perataan <strong>Center (Ctrl + E)</strong>. Sub-judul modul ukuran 12 pt.
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </span>
              <div>
                <strong className="text-white block">Sub-Judul "Ruang Spendaraja":</strong>
                Ukuran <strong>15 pt</strong> dan gaya <strong>Bold (Ctrl + B)</strong>.
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                4
              </span>
              <div>
                <strong className="text-white block">Teks Lainnya (12 pt):</strong>
                Sub-judul bagian, isi tabel 3x5 (dengan header Shading), 2 paragraf cerita (Justify / Ctrl+J), kata penting Bold, istilah asing Italic, dan Pesan Penting di bawah (Center &amp; Bold).
              </div>
            </div>
          </div>
        </div>

        {/* Box Kanan: 4 Kriteria Rubrik Penilaian */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Palette className="w-5 h-5 text-amber-400" />
            <span>Rubrik Penilaian Proyek ({TUGAS_5_CONFIG.poin_tahap3_proyek} Poin)</span>
          </h3>

          <div className="space-y-3">
            {PROYEK_BROSUR_DATA.rubrikPenilaian.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{item.kriteria}</span>
                  </h4>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <span className="shrink-0 font-black px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px]">
                  {item.bobot}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
