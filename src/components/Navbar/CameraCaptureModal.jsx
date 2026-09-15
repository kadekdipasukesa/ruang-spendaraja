/* global process */
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Camera,
  RotateCcw,
  Check,
  RefreshCw,
  AlertCircle,
  Loader2,
  VideoOff,
} from 'lucide-react';

export default function CameraCaptureModal({
  isOpen,
  onClose,
  onCapture,
  isProcessing = false,
  uploadProgress = 0,
  uploadStatus = '',
}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fallbackInputRef = useRef(null);

  const [facingMode, setFacingMode] = useState('user'); // 'user' (depan/selfie) atau 'environment' (belakang)
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);

  // Fungsi menghentikan stream kamera secara tuntas
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.warn('Gagal menghentikan track kamera:', err);
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
  }, []);

  // Inisialisasi kamera langsung via navigator.mediaDevices.getUserMedia
  const startCamera = useCallback(async (mode = facingMode) => {
    stopCamera();
    setCameraError(null);
    setIsCameraReady(false);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Browser ini tidak mendukung akses kamera langsung. Gunakan aplikasi browser modern.');
      return;
    }

    try {
      const constraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1080 },
          height: { ideal: 1080 },
          aspectRatio: { ideal: 1 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((e) => console.warn('Video play error:', e));
          setIsCameraReady(true);
        };
      }
    } catch (err) {
      console.error('Error saat mengakses kamera:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Izin akses kamera ditolak. Silakan izinkan akses kamera di browser Anda.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('Tidak ada kamera yang ditemukan pada perangkat Anda.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError('Kamera sedang digunakan oleh aplikasi lain. Tutup aplikasi tersebut dan coba lagi.');
      } else {
        setCameraError('Gagal membuka kamera: ' + (err.message || 'Terjadi kesalahan tidak dikenal'));
      }
    }
  }, [facingMode, stopCamera]);

  // Efek saat modal terbuka / tertutup
  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera(facingMode);
    } else if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ganti kamera depan / belakang
  const handleToggleFacingMode = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    startCamera(newMode);
  };

  // Ambil gambar snapshot dari video stream
  const handleTakeSnapshot = () => {
    if (!videoRef.current || !isCameraReady) return;

    try {
      setFlashEffect(true);
      setTimeout(() => setFlashEffect(false), 200);

      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const vWidth = video.videoWidth || 640;
      const vHeight = video.videoHeight || 640;

      // Buat pemotongan bujur sangkar (square crop 1:1) tepat di tengah wajah
      const size = Math.min(vWidth, vHeight);
      const startX = (vWidth - size) / 2;
      const startY = (vHeight - size) / 2;

      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Jika kamera depan, mirror secara horizontal agar natural seperti cermin
        if (facingMode === 'user') {
          ctx.translate(size, 0);
          ctx.scale(-1, 1);
        }

        ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);

        // Hentikan stream sementara agar lampu indikator kamera mati saat siswa meninjau hasil
        stopCamera();
      }
    } catch (err) {
      console.error('Gagal mengambil snapshot:', err);
      setCameraError('Gagal menangkap foto. Coba ulangi kembali.');
    }
  };

  // Ambil ulang foto
  const handleRetake = () => {
    setCapturedImage(null);
    setCameraError(null);
    startCamera(facingMode);
  };

  // Konfirmasi dan gunakan foto
  const handleConfirmPhoto = () => {
    if (!capturedImage) return;
    onCapture(capturedImage);
  };

  // Fallback khusus jika browser memblokir getUserMedia (hanya membuka kamera native tanpa galeri)
  const handleNativeCameraFallback = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedImage(event.target.result);
      setCameraError(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="camera-capture-overlay" className="fixed inset-0 z-[200] overflow-y-auto px-4 py-6 flex justify-center items-center">
          {/* Backdrop */}
          <motion.div
            key="camera-capture-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isProcessing ? undefined : onClose}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"
          />

          {/* Modal Window */}
          <motion.div
            key="camera-capture-window"
            id="modal-camera-capture"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-[#0f172a] w-full max-w-sm sm:max-w-md rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-6 border border-white/10 text-white z-10 my-auto flex flex-col items-center"
          >
          {/* Header */}
          <div className="w-full flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Camera size={18} />
              </div>
              <div>
                <h3 className="font-black text-lg text-white leading-tight">
                  Kamera Foto Profil
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  {capturedImage ? 'Tinjau hasil foto Anda' : 'Posisikan wajah di dalam lingkaran'}
                </p>
              </div>
            </div>

            {!isProcessing && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 bg-white/5 hover:bg-rose-500/20 rounded-xl transition-all text-slate-400 hover:text-rose-400"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Viewfinder / Preview Container */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden ring-4 ring-blue-500/40 shadow-2xl bg-black flex items-center justify-center my-2">
            {/* Flash Effect on capture */}
            {flashEffect && (
              <div className="absolute inset-0 bg-white z-30 animate-out fade-out duration-200" />
            )}

            {/* State 1: Preview Hasil Foto */}
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Hasil Foto"
                className="w-full h-full object-cover"
              />
            ) : (
              /* State 2: Live Video Stream */
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isCameraReady ? 'opacity-100' : 'opacity-0'
                  } ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />

                {!isCameraReady && !cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-400 gap-2 p-4 text-center">
                    <Loader2 size={32} className="animate-spin text-blue-400" />
                    <span className="text-xs font-semibold">Mengaktifkan kamera...</span>
                  </div>
                )}
              </>
            )}

            {/* Overlay Grid / Target Panduan Wajah */}
            {!capturedImage && isCameraReady && (
              <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-dashed border-blue-400/40 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border border-white/20" />
              </div>
            )}

            {/* Processing Overlay Saat Upload */}
            {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center z-40 p-4 text-center">
                <Loader2 size={36} className="text-blue-400 animate-spin mb-2" />
                <span className="text-xs font-bold text-white mb-1">{uploadStatus}</span>
                <div className="w-36 bg-slate-800 rounded-full h-2 overflow-hidden border border-white/10">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-[10px] text-blue-300 font-bold mt-1.5">{uploadProgress}%</span>
              </div>
            )}
          </div>

          {/* Camera Error Message */}
          {cameraError && (
            <div className="mt-3 w-full bg-rose-500/15 border border-rose-500/30 p-3.5 rounded-2xl flex flex-col items-center gap-2 text-center text-xs text-rose-300">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle size={16} className="shrink-0 text-rose-400" />
                <span>Kendala Akses Kamera</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">{cameraError}</p>
              
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw size={13} />
                  <span>Coba Lagi</span>
                </button>

                {/* Fallback Native Camera: capture="user" menjamin hanya buka kamera */}
                <button
                  type="button"
                  onClick={() => fallbackInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-white/10 transition-all"
                >
                  <Camera size={13} />
                  <span>Kamera Bawaan HP</span>
                </button>
                <input
                  ref={fallbackInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={handleNativeCameraFallback}
                />
              </div>
            </div>
          )}

          {/* Controls Bar */}
          <div className="w-full mt-4 flex flex-col items-center gap-3">
            {!capturedImage ? (
              /* State Mengambil Foto */
              <div className="flex items-center justify-center gap-6 w-full">
                {/* Tombol Balik Kamera (Depan / Belakang) */}
                <button
                  type="button"
                  onClick={handleToggleFacingMode}
                  disabled={!isCameraReady || isProcessing}
                  title="Balik Kamera"
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 hover:text-white transition-all disabled:opacity-30 border border-white/10"
                >
                  <RefreshCw size={18} />
                </button>

                {/* Tombol Shutter Ambil Foto */}
                <button
                  id="btn-shutter-take-photo"
                  type="button"
                  onClick={handleTakeSnapshot}
                  disabled={!isCameraReady || isProcessing}
                  title="Ambil Foto"
                  className="relative p-1.5 rounded-full border-4 border-blue-400/50 hover:border-blue-400 active:scale-90 transition-all group disabled:opacity-40"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 group-hover:from-blue-500 group-hover:to-indigo-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                    <Camera size={26} className="text-white" />
                  </div>
                </button>

                {/* Tombol Batal */}
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  title="Tutup"
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 hover:text-white transition-all border border-white/10"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              /* State Konfirmasi Hasil Foto */
              <div className="flex items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={handleRetake}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <RotateCcw size={15} />
                  <span>Ambil Ulang</span>
                </button>

                <button
                  id="btn-confirm-use-photo"
                  type="button"
                  onClick={handleConfirmPhoto}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Gunakan Foto</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
