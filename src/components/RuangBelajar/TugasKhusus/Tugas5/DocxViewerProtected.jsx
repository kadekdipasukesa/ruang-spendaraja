import React, { useState, useEffect } from 'react';
import {
  FileText,
  Shield,
  Lock,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Loader2,
  RefreshCw,
  ExternalLink,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import komputerImg from '../../../../assets/ruang-belajar/komputer_transparan.png';

// URL Dokumen .docx resmi di Cloudinary (sama seperti sistem Ekstra TIK)
const DOCX_PUBLIC_URL = 'https://res.cloudinary.com/cjt4xpst/raw/upload/v1790653556/Tugas/5/uw52vcknjgpo6z65k9tz.docx';

export default function DocxViewerProtected({ inModal = false }) {
  // 2 Engine Andal: 'google' (Google Docs Viewer) & 'native' (Lembar A4 Asli berpresisi warna & highlight)
  const [activeEngine, setActiveEngine] = useState('google');
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [loadingSlow, setLoadingSlow] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);

  // Monitor loading iframe Google Docs
  useEffect(() => {
    if (activeEngine === 'native') {
      setIframeLoading(false);
      setLoadingSlow(false);
      return;
    }

    setIframeLoading(true);
    setLoadingSlow(false);

    const timer = setTimeout(() => {
      setLoadingSlow(true);
    }, 4500);

    return () => clearTimeout(timer);
  }, [activeEngine, iframeKey]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 145));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 70));
  const handleResetZoom = () => setZoomLevel(100);

  const getEmbedUrl = () => {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(DOCX_PUBLIC_URL)}&embedded=true`;
  };

  const handleRefreshIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  // Anti-copy handler
  const handlePreventCopy = (e) => {
    e.preventDefault();
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  // Native A4 sheet renderer with authentic docx font colors & yellow highlight
  const renderNativeSheet = (scale = 1) => (
    <div
      onContextMenu={handleContextMenu}
      onCopy={handlePreventCopy}
      onCut={handlePreventCopy}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      className="w-full max-w-[760px] bg-white text-slate-900 rounded-lg shadow-2xl p-6 sm:p-12 border border-slate-300 relative select-none transition-transform duration-200"
    >
      {/* Subtle Security Diagonal Watermark */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-10">
        <div className="text-slate-950/[0.035] font-black text-3xl sm:text-5xl -rotate-30 tracking-widest uppercase select-none text-center leading-relaxed">
          CONTOH RESMI SPENDARAJA<br />DOKUMEN TERPROTEKSI
        </div>
      </div>

      {/* Sheet Content (Calibri Typography, authentic colors & yellow highlight) */}
      <div className="space-y-4 font-['Calibri',sans-serif] text-slate-900 leading-normal pointer-events-none">
        {/* Judul Utama (20 pt, Bold, Center, Color #2B579A) */}
        <div className="text-center pt-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight uppercase" style={{ color: '#2B579A' }}>
            PENGALAMAN BELAJAR DI SMPN 2 SINGARAJA
          </h1>
          {/* Sub-judul Modul (12 pt, Center, Color #555555) */}
          <p className="text-xs sm:text-sm mt-1 font-normal" style={{ color: '#555555' }}>
            Modul Latihan Microsoft Word Kelas 7 SMP
          </p>
        </div>

        {/* 1. IDENTITAS SISWA (12 pt, Bold, Left, Color #2F5496) */}
        <div className="pt-2">
          <h2 className="text-xs sm:text-sm font-bold uppercase" style={{ color: '#2F5496' }}>
            1. IDENTITAS SISWA
          </h2>

          {/* Tabel Identitas (3 Kolom x 5 Baris, Header Color #2F5496 & White Text) */}
          <div className="mt-2 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-800 text-[11px] sm:text-xs">
              <thead>
                <tr className="text-white font-bold border-b border-slate-800" style={{ backgroundColor: '#2F5496' }}>
                  <th className="border border-slate-800 py-1.5 px-3 text-center w-12 font-bold text-white">
                    No
                  </th>
                  <th className="border border-slate-800 py-1.5 px-4 text-left font-bold w-48 text-white">
                    Informasi Siswa
                  </th>
                  <th className="border border-slate-800 py-1.5 px-4 text-left font-bold text-white">
                    Keterangan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-800">
                <tr>
                  <td className="border border-slate-800 py-1 px-3 text-center">1</td>
                  <td className="border border-slate-800 py-1 px-4 font-medium">Nama Lengkap</td>
                  <td className="border border-slate-800 py-1 px-4 text-slate-500 font-mono">
                    .................................................................
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-800 py-1 px-3 text-center">2</td>
                  <td className="border border-slate-800 py-1 px-4 font-medium">Kelas / No. Absen</td>
                  <td className="border border-slate-800 py-1 px-4 text-slate-500 font-mono">
                    7. ..... / .....
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-800 py-1 px-3 text-center">3</td>
                  <td className="border border-slate-800 py-1 px-4 font-medium">Mata Pelajaran</td>
                  <td className="border border-slate-800 py-1 px-4 text-slate-900 font-medium">
                    Informatika
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-800 py-1 px-3 text-center">4</td>
                  <td className="border border-slate-800 py-1 px-4 font-medium">Hobi / Minat</td>
                  <td className="border border-slate-800 py-1 px-4 text-slate-500 font-mono">
                    .................................................................
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. CERITA PENGALAMAN BELAJAR (12 pt, Bold, Left, Color #2F5496) */}
        <div className="pt-3 space-y-3">
          <h2 className="text-xs sm:text-sm font-bold uppercase" style={{ color: '#2F5496' }}>
            2. CERITA PENGALAMAN BELAJAR
          </h2>

          {/* Sub-judul Platform: Ruang Spendaraja (15 pt, Bold, Color #2B579A) */}
          <h3 className="text-base sm:text-lg font-bold" style={{ color: '#2B579A' }}>
            Ruang Spendaraja
          </h3>

          {/* Paragraf 1 (Justify, 12 pt, SMPN 2 SINGARAJA dengan HIGHLIGHT KUNING) */}
          <p className="text-xs sm:text-sm text-justify leading-relaxed text-slate-800 indent-6">
            Masuk sebagai siswa baru di{' '}
            <span className="bg-yellow-300 text-slate-950 font-bold px-1.5 py-0.5 rounded shadow-xs border border-yellow-400">
              SMPN 2 SINGARAJA
            </span>{' '}
            memberikan pengalaman belajar yang sangat berkesan. Salah satu pelajaran yang paling aku tunggu adalah Informatika.
            Di kelas ini, kami tidak hanya belajar teori saja, tetapi juga langsung mempraktikkan cara menggunakan perangkat
            komputer dan menyusun dokumen dengan rapi.
          </p>

          {/* Sisipan Gambar Komputer PNG (Wrap Text: Top and Bottom) */}
          <div className="py-2 flex flex-col items-center justify-center border-y border-dashed border-slate-200/90 my-2">
            <img
              src={komputerImg}
              alt="Komputer PNG"
              className="max-h-36 sm:max-h-44 object-contain select-none pointer-events-none drop-shadow-md"
              draggable="false"
            />
            <span className="text-[9px] text-slate-400 italic mt-1 text-center">
              This Photo by Unknown Author is licensed under CC BY-NC
            </span>
          </div>

          {/* Paragraf 2 (Justify, 12 pt, Ruang Spendaraja #2B579A Bold, Italic pada platform online & flexible) */}
          <p className="text-xs sm:text-sm text-justify leading-relaxed text-slate-800 indent-6">
            Hal yang paling menarik adalah saat guru menggunakan web interaktif{' '}
            <strong className="font-bold" style={{ color: '#2B579A' }}>
              Ruang Spendaraja
            </strong>{' '}
            untuk menyampaikan materi serta memberikan tugas. Melalui <em className="italic font-medium text-slate-900">platform online</em> ini,
            suasana belajar menjadi lebih <em className="italic font-medium text-slate-900">flexible</em>, interaktif, dan menyenangkan
            bagi seluruh siswa.
          </p>

          {/* Pesan Penting (Center, 12 pt, Bold, Color #C00000 Merah Resmi Word) */}
          <div className="pt-3 text-center">
            <p className="text-xs sm:text-sm font-bold leading-normal" style={{ color: '#C00000' }}>
              "Pesan Penting: Keterampilan digital dan pemahaman teknologi adalah kunci utama untuk meraih kesuksesan di masa depan!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Office / Word Styled Header */}
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            {/* Window control dots */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            <div className="h-4 w-px bg-slate-800" />

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white text-[11px] font-black shadow-sm">
                W
              </div>
              <span className="text-xs font-bold text-slate-200 truncate max-w-[200px] sm:max-w-md">
                PENGALAMAN BELAJAR DI SMPN 2 SINGARAJA.docx
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto flex-wrap">
            {/* Engine Switcher: Google Docs (Default) vs Lembar A4 Native */}
            <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveEngine('google')}
                className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeEngine === 'google'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Google Docs Viewer (Viewer Resmi Google Docs)"
              >
                <span>Google Docs</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveEngine('native')}
                className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeEngine === 'native'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Lembar A4 Native (Presisi Warna Font & Highlight Kuning)"
              >
                <span>Lembar A4 Native</span>
              </button>
            </div>

            {/* Refresh Button for Iframe */}
            {activeEngine !== 'native' && (
              <button
                type="button"
                onClick={handleRefreshIframe}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
                title="Muat Ulang Pratinjau"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Security Pill */}
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Lock className="w-3 h-3" />
              <span>Hanya Lihat • Terproteksi</span>
            </span>

            {/* Fullscreen Modal Button */}
            {!inModal && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="p-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 text-xs flex items-center gap-1 transition"
                title="Perbesar Layar Penuh"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px] font-bold">Layar Penuh</span>
              </button>
            )}
          </div>
        </div>

        {/* Word Ribbons Simulation Bar */}
        <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-400 overflow-x-auto gap-4 scrollbar-none">
          <div className="flex items-center gap-3 shrink-0">
            <span className="px-2 py-0.5 rounded text-white font-bold bg-blue-600/30 border border-blue-500/40">
              {activeEngine === 'google' ? 'Google Docs Viewer Engine' : 'Lembar Kerja A4 Native Word'}
            </span>
            <span className="text-slate-300">File</span>
            <span className="text-blue-400 font-semibold border-b border-blue-400">Home</span>
            <span className="text-slate-300">Insert</span>
            <span className="text-slate-300">Layout</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 shrink-0">
            <span>Font: <strong className="text-slate-200">Calibri</strong></span>
            <span>•</span>
            <span>Highlight: <strong className="text-yellow-400 bg-yellow-950/60 px-1 rounded border border-yellow-500/40">Kuning</strong></span>
            <span>•</span>
            <span>Pesan: <strong className="text-rose-400">Merah</strong></span>
          </div>
        </div>

        {/* Viewer Workspace Area */}
        <div className="relative bg-slate-950 flex flex-col items-center justify-start min-h-[560px] sm:min-h-[660px] max-h-[780px] overflow-hidden">
          {/* Iframe Mode (Google Docs Viewer) */}
          {activeEngine !== 'native' ? (
            <div className="relative w-full h-full min-h-[560px] sm:min-h-[660px] flex-1 flex flex-col">
              {iframeLoading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/90 text-white p-4">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                  <p className="text-sm font-bold text-slate-200">
                    Menyiapkan Pratinjau Dokumen (Google Docs Viewer)...
                  </p>
                  <p className="text-xs text-slate-400 mt-1 text-center max-w-md">
                    Memuat naskah contoh dengan penataan teks dan tata letak Microsoft Word.
                  </p>
                  {loadingSlow && (
                    <div className="mt-4 p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs text-amber-200 max-w-md text-center space-y-2">
                      <p>Koneksi viewer sedang antre. Anda dapat langsung membuka tampilan Lembar A4 Native:</p>
                      <button
                        type="button"
                        onClick={() => setActiveEngine('native')}
                        className="px-3.5 py-1.5 bg-amber-500 text-slate-950 font-black rounded-lg hover:bg-amber-400 transition"
                      >
                        Buka Lembar A4 Native Langsung
                      </button>
                    </div>
                  )}
                </div>
              )}

              <iframe
                key={iframeKey}
                src={getEmbedUrl()}
                title="Pratinjau Dokumen Microsoft Word"
                className="w-full h-full min-h-[560px] sm:min-h-[660px] border-0 rounded-b-2xl bg-white"
                onLoad={() => setIframeLoading(false)}
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>
          ) : (
            /* Native Mode (Full Color, Highlight Kuning, Protected Sheet) */
            <div className="w-full h-full overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
              {renderNativeSheet(zoomLevel / 100)}
            </div>
          )}
        </div>

        {/* Word Status Bar */}
        <div className="bg-slate-950 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span>Halaman 1 dari 1</span>
            <span>•</span>
            <span>185 kata</span>
            <span>•</span>
            <span>Bahasa Indonesia</span>
            <span>•</span>
            <span className="text-yellow-400 font-medium">Highlight: SMPN 2 SINGARAJA</span>
          </div>

          {activeEngine === 'native' && (
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 70}
                className="px-2 py-0.5 text-slate-400 hover:text-white"
              >
                -
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="px-1 font-mono text-[10px] text-slate-300"
              >
                {zoomLevel}%
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 145}
                className="px-2 py-0.5 text-slate-400 hover:text-white"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Protected Viewer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-md flex flex-col p-2 sm:p-4 animate-fade-in">
          {/* Modal Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 mb-2 flex items-center justify-between shadow-2xl flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black">
                W
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-white">
                  Pratinjau Dokumen Word (Layar Penuh)
                </h3>
                <span className="text-[10px] text-slate-400">
                  PENGALAMAN BELAJAR DI SMPN 2 SINGARAJA.docx • Terproteksi
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Engine Switcher in Modal */}
              <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveEngine('google')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition ${
                    activeEngine === 'google' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Google Docs
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEngine('native')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition ${
                    activeEngine === 'native' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Lembar A4 Native
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition"
                title="Tutup Layar Penuh"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Workspace */}
          <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 p-1 flex justify-center items-stretch overflow-hidden">
            {activeEngine !== 'native' ? (
              <iframe
                src={getEmbedUrl()}
                title="Pratinjau Dokumen Microsoft Word"
                className="w-full h-full border-0 rounded-xl bg-white"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            ) : (
              <div className="w-full h-full overflow-auto p-4 sm:p-8 flex justify-center items-start">
                {renderNativeSheet(zoomLevel / 100)}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
