import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  ExternalLink,
  Sparkles,
  Send,
  SwitchCamera,
  Eye,
  FileImage,
  Info
} from 'lucide-react';
import { compressImage } from '../../../../../utils/cloudinaryUpload';

export default function FotoOrekOrekUpload({
  uploadedPhotoInfo,
  onUploadPhoto,
  onRemovePhoto,
  onSubmitTask,
  submitting,
  student,
  scores,
  totalScore
}) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // Prioritas Kamera Belakang
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [capturedPreviewUrl, setCapturedPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [showFullPreview, setShowFullPreview] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const nativeInputRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
  }, []);

  const startCamera = useCallback(async (mode = facingMode) => {
    stopCamera();
    setCameraError(null);
    setIsCameraReady(false);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Browser ini tidak mendukung akses live kamera langsung. Silakan gunakan tombol "Buka Kamera HP Langsung".');
      return;
    }

    try {
      const constraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((e) => console.warn('Play video stream error:', e));
          setIsCameraReady(true);
        };
      }
    } catch (err) {
      console.warn('Gagal akses kamera dengan facingMode:', mode, err);
      // Fallback tanpa facingMode strict jika perangkat hanya memiliki 1 kamera (e.g. laptop)
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch((e) => console.warn('Play video fallback error:', e));
            setIsCameraReady(true);
          };
        }
      } catch (err2) {
        console.error('Semua akses live kamera gagal:', err2);
        if (err2.name === 'NotAllowedError' || err2.name === 'PermissionDeniedError') {
          setCameraError('Izin akses kamera ditolak. Silakan berikan izin kamera pada peramban Anda.');
        } else {
          setCameraError('Kamera tidak dapat diakses langsung. Silakan gunakan tombol "Buka Kamera HP Langsung" di bawah.');
        }
      }
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    if (isCameraOpen) {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isCameraOpen, facingMode, startCamera, stopCamera]);

  // Tangkap foto dari canvas video stream
  const handleCapturePhoto = () => {
    if (!videoRef.current || !isCameraReady) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const previewUrl = URL.createObjectURL(blob);
          setCapturedBlob(blob);
          setCapturedPreviewUrl(previewUrl);
          setIsCameraOpen(false);
          stopCamera();
        }
      }, 'image/jpeg', 0.88);
    } catch (err) {
      console.error('Error capture photo canvas:', err);
      setCameraError('Gagal mengambil tangkapan foto. Coba ulangi kembali.');
    }
  };

  // Tangkap foto via native input kamera
  const handleNativeFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Pilih berkas berupa foto/gambar.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setCapturedBlob(file);
    setCapturedPreviewUrl(previewUrl);
    setIsCameraOpen(false);
    stopCamera();
  };

  // Beralih antara kamera belakang & depan
  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Batal dan foto ulang
  const handleRetake = () => {
    if (capturedPreviewUrl) {
      URL.revokeObjectURL(capturedPreviewUrl);
    }
    setCapturedBlob(null);
    setCapturedPreviewUrl(null);
    setUploadError(null);
    setIsCameraOpen(true);
  };

  // Eksekusi unggah ke Cloudinary
  const handleConfirmUpload = async () => {
    if (!capturedBlob) return;
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // 1. Kompresi gambar client-side
      const fileToProcess = capturedBlob instanceof File
        ? capturedBlob
        : new File([capturedBlob], `orak_orek_${Date.now()}.jpg`, { type: 'image/jpeg' });

      let fileToUpload = fileToProcess;
      try {
        const compressed = await compressImage(fileToProcess, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.82
        });
        if (compressed?.file) {
          fileToUpload = compressed.file;
        }
      } catch (compErr) {
        console.warn('Kompresi gambar dilewati, menggunakan berkas asli:', compErr);
      }

      // 2. Unggah ke Cloudinary preset Tugas_4
      await onUploadPhoto(fileToUpload, (percent) => {
        setUploadProgress(percent);
      });

      // Sukses: Bersihkan blob lokal
      if (capturedPreviewUrl) {
        URL.revokeObjectURL(capturedPreviewUrl);
      }
      setCapturedBlob(null);
      setCapturedPreviewUrl(null);
    } catch (err) {
      console.error('Gagal mengunggah foto ke Cloudinary:', err);
      setUploadError(err.message || 'Gagal mengunggah foto. Pastikan koneksi internet stabil.');
    } finally {
      setIsUploading(false);
    }
  };

  const studentName = student?.NAMA || student?.nama || 'Siswa Spendaraja';
  const studentClass = student?.KELAS || student?.Kelas || student?.kelas || '7';

  return (
    <div className="space-y-6">
      {/* 1. Header Tahap 5 */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0b1b36] to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/25 shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/25">
                Tahap 5 (Final)
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">Foto Orek-Orek di Buku Tulis</h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Foto lembar catatan atau coretan hitunganmu (tangga bagi 2 atau penjumlahan bobot biner) menggunakan kamera belakang sebagai bukti pengerjaan mandiri.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/90 px-4 py-2 rounded-2xl border border-slate-800 text-xs font-bold text-slate-300 shrink-0">
          <span>Status Bukti:</span>
          {uploadedPhotoInfo?.secureUrl ? (
            <span className="text-emerald-400 flex items-center gap-1 font-black">
              <CheckCircle2 className="w-4 h-4" />
              Terunggah di Cloud
            </span>
          ) : (
            <span className="text-amber-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Wajib Foto
            </span>
          )}
        </div>
      </div>

      {/* 2. Kartu Petunjuk Pengambilan Foto */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400">
          <Info className="w-4 h-4 shrink-0" />
          <span>Panduan Pengambilan Foto Bukti:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
            <strong className="text-white block font-bold">1. Identitas di Buku Tulis</strong>
            <p className="text-slate-400 text-[11px]">
              Tuliskan <strong>Nama, Kelas, dan No Absen</strong> di bagian paling atas halaman buku catatanmu.
            </p>
          </div>
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
            <strong className="text-white block font-bold">2. Coretan Perhitungan</strong>
            <p className="text-slate-400 text-[11px]">
              Tunjukkan langkah pembagian tangga desimal atau orek-orek penjumlahan pangkat 2 untuk 5 soal kuis.
            </p>
          </div>
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
            <strong className="text-white block font-bold">3. Foto Jelas &amp; Terang</strong>
            <p className="text-slate-400 text-[11px]">
              Arahkan kamera belakang tegak lurus dengan cahaya yang cukup agar tulisan tangan terbaca jelas.
            </p>
          </div>
        </div>

        {/* Input Native Camera Tersembunyi (capture="environment" = Kamera Belakang) */}
        <input
          ref={nativeInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleNativeFileChange}
          className="hidden"
          id="native-camera-input"
        />

        {/* 3. Area Interaktif Kamera / Preview Foto */}
        {!uploadedPhotoInfo?.secureUrl && !capturedPreviewUrl && !isCameraOpen && (
          <div className="border-2 border-dashed border-slate-700/80 hover:border-amber-500/50 rounded-3xl p-8 sm:p-12 text-center bg-slate-950/40 transition flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Camera className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-white">
                Ambil Foto Buku Tulis dengan Kamera Belakang
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Tekan tombol di bawah untuk membuka kamera belakang langsung dari browser atau aplikasi kamera bawaan HP-mu.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Buka Kamera Belakang (Live)</span>
              </button>

              <button
                type="button"
                onClick={() => nativeInputRef.current?.click()}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileImage className="w-4 h-4 text-cyan-400" />
                <span>Buka Kamera HP Langsung</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. Live Viewfinder Kamera Belakang */}
        {isCameraOpen && !capturedPreviewUrl && (
          <div className="relative bg-slate-950 rounded-3xl border-2 border-amber-500/40 overflow-hidden shadow-2xl">
            <div className="relative aspect-4/3 sm:aspect-16/9 w-full bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="w-full h-full object-cover"
              />

              {/* Bingkai Panduan Foto Buku Tulis */}
              <div className="absolute inset-6 sm:inset-10 border-2 border-dashed border-amber-400/60 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                <span className="text-[10px] font-bold text-amber-300 bg-slate-950/70 px-2.5 py-1 rounded-md self-start border border-amber-400/40">
                  {facingMode === 'environment' ? '📷 Kamera Belakang Aktif' : '📷 Kamera Depan'}
                </span>
                <span className="text-[10px] font-medium text-slate-300 bg-slate-950/70 px-2.5 py-1 rounded-md self-center border border-slate-700/60">
                  Posisikan tulisan lembar buku catatan di dalam kotak ini
                </span>
              </div>

              {!isCameraReady && !cameraError && (
                <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-4">
                  <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-3" />
                  <p className="text-xs font-bold text-slate-300">Menghubungkan ke Kamera Belakang...</p>
                </div>
              )}

              {cameraError && (
                <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-rose-400" />
                  <p className="text-xs text-rose-200 max-w-sm">{cameraError}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startCamera(facingMode)}
                      className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold border border-slate-700"
                    >
                      Coba Lagi
                    </button>
                    <button
                      type="button"
                      onClick={() => nativeInputRef.current?.click()}
                      className="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold"
                    >
                      Gunakan Kamera HP
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tombol Kontrol Shutter Kamera */}
            <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsCameraOpen(false);
                  stopCamera();
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Tutup Kamera
              </button>

              <button
                type="button"
                onClick={handleCapturePhoto}
                disabled={!isCameraReady}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                <Camera className="w-5 h-5" />
                <span>Ambil Foto</span>
              </button>

              <button
                type="button"
                onClick={handleToggleFacingMode}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                title="Ganti Kamera (Belakang / Depan)"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 5. Tinjauan Hasil Tangkapan (Captured Preview Sebelum Diunggah) */}
        {capturedPreviewUrl && !uploadedPhotoInfo?.secureUrl && (
          <div className="bg-slate-950 p-5 rounded-3xl border border-amber-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                Pratinjau Hasil Foto Kamera:
              </span>
              <span className="text-[11px] text-slate-400">
                Periksa apakah tulisan terbaca jelas sebelum diunggah
              </span>
            </div>

            <div className="relative aspect-4/3 sm:aspect-16/9 max-w-xl mx-auto rounded-2xl overflow-hidden border border-slate-800 bg-black">
              <img
                src={capturedPreviewUrl}
                alt="Pratinjau Hasil Tangkapan"
                className="w-full h-full object-contain"
              />
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-2 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{uploadError}</span>
              </div>
            )}

            {isUploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Mengompres &amp; Mengunggah ke Cloudinary (Preset: Tugas_4)...</span>
                  <span className="text-amber-400 font-mono">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleRetake}
                disabled={isUploading}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Foto Ulang</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmUpload}
                disabled={isUploading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isUploading ? 'Sedang Mengunggah...' : 'Unggah ke Cloudinary'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. Tampilan Foto Yang Sudah Berhasil Diunggah ke Cloudinary */}
        {uploadedPhotoInfo?.secureUrl && (
          <div className="bg-slate-950 p-5 rounded-3xl border-2 border-emerald-500/40 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white">
                    Foto Orek-Orek Berhasil Disimpan di Cloudinary
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Preset: Tugas_4 • Folder: Tugas/4
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFullPreview(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Lihat Foto</span>
                </button>
                <button
                  type="button"
                  onClick={onRemovePhoto}
                  className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-pointer"
                  title="Hapus foto dan foto ulang"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Foto */}
            <div className="relative aspect-16/9 sm:aspect-21/9 max-w-2xl mx-auto rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 group">
              <img
                src={uploadedPhotoInfo.secureUrl}
                alt="Bukti Orek-Orek Biner"
                className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                <div className="text-[11px] text-slate-300 flex items-center justify-between w-full">
                  <span className="font-mono text-cyan-300 truncate max-w-xs">
                    {uploadedPhotoInfo.originalFileName || 'bukti_catatan_biner.jpg'}
                  </span>
                  <a
                    href={uploadedPhotoInfo.secureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-400 hover:underline font-bold"
                  >
                    <span>Buka Resolusi Asli</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7. Rekapitulasi & Tombol Kumpulkan Final */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0a1931] to-slate-900 border-2 border-[#1e3e70] rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
              Finalisasi Pengumpulan Tugas 4
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            Siap Mengamankan Nilaimu di Database?
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            {uploadedPhotoInfo?.secureUrl
              ? `Foto bukti orak-orek telah siap. Nilai kuis sebesar ${totalScore}/50 Poin akan disimpan secara resmi ke akun ${studentName} (${studentClass}).`
              : `Kamu telah memperoleh ${totalScore}/50 Poin pada kuis. Unggah foto bukti orak-orek di atas untuk menyempurnakan pengumpulan tugas.`}
          </p>
        </div>

        <button
          type="button"
          onClick={onSubmitTask}
          disabled={submitting}
          className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2.5 shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>{submitting ? 'Menyimpan ke Cloud...' : 'Kumpulkan Tugas 4 Sekarang'}</span>
        </button>
      </div>

      {/* Modal Pratinjau Foto Layar Penuh */}
      {showFullPreview && uploadedPhotoInfo?.secureUrl && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowFullPreview(false)}
        >
          <div
            className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                Foto Bukti Orek-Orek: {uploadedPhotoInfo.originalFileName}
              </span>
              <button
                type="button"
                onClick={() => setShowFullPreview(false)}
                className="text-slate-400 hover:text-white text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto bg-black p-2 flex items-center justify-center">
              <img
                src={uploadedPhotoInfo.secureUrl}
                alt="Foto Penuh"
                className="max-h-[70vh] object-contain rounded-xl"
              />
            </div>
            <div className="p-3.5 bg-slate-950 flex justify-end">
              <button
                type="button"
                onClick={() => setShowFullPreview(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
