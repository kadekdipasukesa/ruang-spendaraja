import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ExternalLink, FileText, Loader2, Download, RefreshCw, 
  Image as ImageIcon, FileCheck, AlertCircle, Sparkles, Monitor, Layers
} from 'lucide-react';

export default function ModalPreviewDokumen({ isOpen, onClose, fileData }) {
  const cleanUrl = fileData?.fileUrl || fileData?.previewUrl || '';
  const fileName = fileData?.fileName || 'Dokumen Tugas';

  // Deteksi ekstensi file
  const ext = (fileName.split('.').pop() || cleanUrl.split('.').pop() || '').toLowerCase();
  const isImage = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp'].includes(ext);
  const isPdf = ext === 'pdf';
  const isOffice = ['docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls'].includes(ext);
  const isVideo = ['mp4', 'webm', 'ogg'].includes(ext);
  const isAudio = ['mp3', 'wav', 'm4a'].includes(ext);

  // Default engine: jika office docx/xlsx/pptx -> default 'office' (Microsoft Office Online, paling cepat & stabil)
  // jika gambar -> 'native'
  // jika pdf -> 'office' atau 'google'
  const [activeEngine, setActiveEngine] = useState('office');
  const [iframeLoading, setIframeLoading] = useState(true);
  const [loadingSlow, setLoadingSlow] = useState(false);

  // Set default engine saat fileData berubah
  useEffect(() => {
    if (isImage) {
      setActiveEngine('native');
    } else if (isOffice) {
      setActiveEngine('office');
    } else if (isPdf) {
      setActiveEngine('office');
    } else {
      setActiveEngine('office');
    }
    setIframeLoading(true);
    setLoadingSlow(false);
  }, [cleanUrl, isImage, isOffice, isPdf]);

  // Timeout deteksi jika preview memakan waktu lebih dari 5 detik
  useEffect(() => {
    if (!isOpen || isImage || isVideo || isAudio) return;
    setIframeLoading(true);
    setLoadingSlow(false);

    const timer = setTimeout(() => {
      setLoadingSlow(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isOpen, activeEngine, cleanUrl, isImage, isVideo, isAudio]);

  if (!isOpen || !fileData || !cleanUrl) return null;

  // Bangun URL pratinjau berdasarkan engine yang dipilih
  const getEmbedUrl = () => {
    if (activeEngine === 'office') {
      // Microsoft Office Online Web Viewer (resmi, cepat, tanpa login, render .docx, .pptx, .xlsx)
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(cleanUrl)}`;
    }
    if (activeEngine === 'google') {
      // Google Docs Viewer
      return `https://docs.google.com/viewer?url=${encodeURIComponent(cleanUrl)}&embedded=true`;
    }
    return cleanUrl;
  };

  const embedUrl = getEmbedUrl();

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-5xl h-[92vh] max-h-[880px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
      >
        {/* Header Modal */}
        <div className="px-4 py-3 sm:px-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between gap-3 shadow-md shrink-0 border-b border-indigo-900/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
              {isImage ? (
                <ImageIcon className="w-5 h-5 text-emerald-400" />
              ) : (
                <FileText className="w-5 h-5 text-indigo-300" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                  {fileName}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/20 uppercase">
                  {ext || 'DOKUMEN'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                {fileData.nama ? (
                  <span className="font-semibold text-amber-300 mr-1.5">{fileData.nama} ({fileData.kelas || 'Ekstra TIK'})</span>
                ) : null}
                <span>{fileData.judulTugas || 'Tugas Ekstrakurikuler TIK'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Tombol Buka Tab Baru */}
            <a
              href={cleanUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition border border-white/10"
              title="Buka File di Tab Baru"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buka Langsung</span>
            </a>

            {/* Tombol Unduh Dokumen */}
            <a
              href={cleanUrl}
              download={fileName}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-800 rounded-xl transition border border-emerald-500/30"
              title="Unduh File ke Perangkat"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unduh</span>
            </a>

            {/* Tombol Tutup */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer ml-1"
              title="Tutup Pratinjau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Engine Switcher Bar (Jika dokumen office / pdf / file viewer) */}
        {!isImage && !isVideo && !isAudio && (
          <div className="px-4 py-2 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Opsi Viewer:</span>
              <div className="inline-flex items-center p-0.5 bg-slate-200/80 rounded-lg ml-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveEngine('office');
                    setIframeLoading(true);
                    setLoadingSlow(false);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                    activeEngine === 'office'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Microsoft Office Online Viewer (Sangat direkomendasikan untuk .docx, .xlsx, .pptx)"
                >
                  <Monitor className="w-3 h-3" />
                  <span>Office Viewer (Cepat)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveEngine('google');
                    setIframeLoading(true);
                    setLoadingSlow(false);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                    activeEngine === 'google'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Google Docs Viewer (Alternatif cadangan)"
                >
                  <FileCheck className="w-3 h-3" />
                  <span>Google Docs</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="hidden md:inline">Tersimpan aman di Cloudinary (Preset tugas_ekstra_tik7)</span>
              <button
                type="button"
                onClick={() => {
                  setIframeLoading(true);
                  setLoadingSlow(false);
                  // Trigger reload iframe
                  const iframe = document.getElementById('modal-doc-iframe');
                  if (iframe) iframe.src = getEmbedUrl();
                }}
                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-0.5 hover:bg-indigo-50 rounded transition cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Muat Ulang Viewer</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Viewer Area */}
        <div className="relative flex-1 bg-slate-100 flex flex-col items-center justify-center overflow-hidden">
          {/* Gambar Native (0 delay, instant, tanpa iframe!) */}
          {isImage ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 overflow-auto bg-slate-900/5">
              <img
                src={cleanUrl}
                alt={fileName}
                className="max-w-full max-h-full object-contain rounded-xl shadow-lg border border-slate-200"
              />
            </div>
          ) : isVideo ? (
            /* Video Native */
            <div className="w-full h-full flex items-center justify-center p-4 bg-black">
              <video controls className="max-w-full max-h-full rounded-xl shadow-xl" src={cleanUrl}>
                Browser Anda tidak mendukung tag video.
              </video>
            </div>
          ) : isAudio ? (
            /* Audio Native */
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-50 text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 shadow-sm">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800 mb-2">{fileName}</h4>
              <audio controls className="w-full max-w-md mt-2" src={cleanUrl} />
            </div>
          ) : (
            /* Dokumen Iframe (Office / Google Docs Viewer) */
            <>
              {iframeLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-50/95 z-10 px-4 text-center">
                  <Loader2 className="w-9 h-9 text-indigo-600 animate-spin" />
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                      Menyiapkan Pratinjau Dokumen ({activeEngine === 'office' ? 'Microsoft Office Viewer' : 'Google Docs Viewer'})...
                    </p>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      Sedang merender berkas {fileName} dari Cloudinary.
                    </p>
                  </div>
                </div>
              )}

              <iframe
                id="modal-doc-iframe"
                key={`${activeEngine}-${cleanUrl}`}
                src={embedUrl}
                className="w-full h-full border-0 bg-white"
                title={fileName}
                onLoad={() => setIframeLoading(false)}
                allow="autoplay"
                allowFullScreen
              />
            </>
          )}

          {/* Banner Bantuan jika Loading Terasa Lama (> 5 Detik) */}
          <AnimatePresence>
            {loadingSlow && !isImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md p-3.5 bg-amber-50/95 border border-amber-300 text-amber-900 rounded-xl shadow-lg z-20 text-xs backdrop-blur-md flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900">Loading Pratinjau Terasa Lama?</p>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Jika engine {activeEngine === 'office' ? 'Office' : 'Google'} sedang antre, Anda dapat:
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveEngine(activeEngine === 'office' ? 'google' : 'office');
                        setIframeLoading(true);
                        setLoadingSlow(false);
                      }}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] transition shadow-xs cursor-pointer"
                    >
                      Ganti ke {activeEngine === 'office' ? 'Google Docs' : 'Office Viewer'}
                    </button>
                    <a
                      href={cleanUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg font-semibold text-[11px] transition inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Buka Langsung
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLoadingSlow(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                  title="Tutup Saran"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info Modal */}
        <div className="px-4 py-2.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 shrink-0 gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="font-medium text-slate-700">Berkas:</span>
            <span className="font-mono text-slate-600 truncate max-w-xs">{fileName}</span>
            {fileData.fileSize && <span>• {fileData.fileSize}</span>}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Cloudinary Multi-Engine
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}
