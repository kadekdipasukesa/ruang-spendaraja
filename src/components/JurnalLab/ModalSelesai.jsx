import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, FileEdit, ShieldCheck, Sparkles, Camera, Image, Trash2, UploadCloud, RefreshCw, AlertCircle } from 'lucide-react';
import { compressImage, uploadToCloudinary } from '../../utils/cloudinaryUpload';

export default function ModalSelesai({ isOpen, onClose, onConfirm, item }) {
  const [kondisiAwal, setKondisiAwal] = useState('Baik');
  const [checklists, setChecklists] = useState({
    elektronik: false,
    kebersihan: false,
    kerapian: false,
  });
  const [catatanKendala, setCatatanKendala] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Dokumentasi Foto
  const [fotoUrl, setFotoUrl] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [compressedStats, setCompressedStats] = useState(null); // { originalSize, compressedSize }
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Refs to prevent state reset on parent re-renders (such as 1-second clock updates)
  const isInitializedRef = useRef(false);
  const currentItemIdRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const hasExistingJournal = Boolean(
    (item?.status_pengajuan === 'completed') ||
    (item?.kondisi_akhir && 
     String(item.kondisi_akhir).trim() !== '' && 
     String(item.kondisi_akhir).trim() !== '{}' &&
     String(item.kondisi_akhir).trim().toLowerCase() !== 'baik' &&
     String(item.kondisi_akhir).trim().toLowerCase() !== 'null')
  );

  // Inisialisasi data hanya saat modal pertama kali dibuka atau ID item berganti
  useEffect(() => {
    if (!isOpen) {
      isInitializedRef.current = false;
      return;
    }

    if (!isInitializedRef.current || currentItemIdRef.current !== item?.id) {
      isInitializedRef.current = true;
      currentItemIdRef.current = item?.id;

      let initialChecklists = { elektronik: false, kebersihan: false, kerapian: false };
      if (item?.kondisi_akhir) {
        try {
          const parsed = typeof item.kondisi_akhir === 'string' 
            ? JSON.parse(item.kondisi_akhir) 
            : item.kondisi_akhir;

          if (parsed && typeof parsed === 'object') {
            initialChecklists = {
              elektronik: Boolean(parsed.elektronik_dimatikan),
              kebersihan: Boolean(parsed.ruangan_dibersihkan),
              kerapian: Boolean(parsed.kursi_dirapikan),
            };
          }
        } catch (e) {
          // format non-json fallback
        }
      }

      setChecklists(initialChecklists);
      setKondisiAwal(item?.kondisi_awal || 'Baik');
      setCatatanKendala(item?.catatan_kendala || '');
      setFotoUrl(item?.foto_dokumentasi || '');
      setSelectedImageFile(null);
      setPreviewImageUrl(item?.foto_dokumentasi || '');
      setCompressedStats(null);
      setUploadProgress(0);
      setUploadError('');
    }
  }, [isOpen, item?.id, item?.kondisi_awal, item?.kondisi_akhir, item?.catatan_kendala, item?.foto_dokumentasi]);

  // Lock scroll dan Escape key handler (tidak terpicu re-render berulang)
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onCloseRef.current) {
        onCloseRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Toggle handler untuk checkbox
  const handleCheckboxChange = (key) => {
    setChecklists((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handler pemilihan file foto (baik dari gallery atau camera capture)
  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setIsCompressing(true);

    try {
      // Kompresi otomatis di browser lewat canvas (1280px, quality 0.75, format webp/jpeg)
      const compressed = await compressImage(file, {
        maxWidth: 1280,
        maxHeight: 1280,
        quality: 0.75,
      });

      setSelectedImageFile(compressed.file);
      setPreviewImageUrl(compressed.dataUrl);
      setCompressedStats({
        originalSize: compressed.originalSize,
        compressedSize: compressed.compressedSize,
      });
    } catch (err) {
      console.error('Error saat kompresi foto:', err);
      setUploadError('Gagal memproses gambar: ' + (err.message || 'Format tidak didukung'));
    } finally {
      setIsCompressing(false);
      // Reset input agar bisa memilih file yang sama jika diperlukan
      e.target.value = '';
    }
  };

  const handleRemovePhoto = () => {
    setSelectedImageFile(null);
    setPreviewImageUrl('');
    setFotoUrl('');
    setCompressedStats(null);
    setUploadError('');
  };

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setUploadError('');

    let finalFotoUrl = fotoUrl;

    // Jika pengguna memilih foto baru yang belum di-upload ke Cloudinary
    if (selectedImageFile) {
      try {
        setUploadProgress(10);
        finalFotoUrl = await uploadToCloudinary(selectedImageFile, 'jurnal-lab', (pct) => {
          setUploadProgress(pct);
        });
        setFotoUrl(finalFotoUrl);
      } catch (err) {
        console.error('Gagal mengunggah foto ke Cloudinary:', err);
        setUploadError(err.message || 'Gagal mengunggah foto. Periksa koneksi internet Anda.');
        setIsSubmitting(false);
        return;
      }
    }

    // Format JSON yang akan disimpan ke kolom kondisi_akhir
    const dataKondisiAkhir = JSON.stringify({
      elektronik_dimatikan: checklists.elektronik,
      ruangan_dibersihkan: checklists.kebersihan,
      kursi_dirapikan: checklists.kerapian,
    });

    try {
      await onConfirm({
        kondisi_awal: kondisiAwal || 'Baik',
        kondisi_akhir: dataKondisiAkhir,
        catatan_kendala: catatanKendala || '',
        foto_dokumentasi: finalFotoUrl || null,
      });
      onClose();
    } catch (err) {
      console.error('Gagal menyimpan jurnal:', err);
      setUploadError('Gagal menyimpan data ke database: ' + (err.message || 'Kesalahan sistem'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[250] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-start justify-between gap-3 mb-4 sticky top-0 bg-slate-900/95 backdrop-blur-sm pt-1 pb-2 z-20 border-b border-slate-800/80">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              {hasExistingJournal ? (
                <>
                  <FileEdit className="w-5 h-5 text-indigo-400" />
                  Lihat / Edit Jurnal Lab
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Pengisian Jurnal Penggunaan Lab
                </>
              )}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Peminjam: <strong className="text-slate-200">{item?.guru_pengajar || '-'}</strong> ({item?.mata_pelajaran || 'Kegiatan'}, Kelas {item?.kelas || '-'})
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex-shrink-0 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Kondisi Awal Fasilitas */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-2">
            <label className="block text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Kondisi Awal Fasilitas / Ruangan Lab
            </label>
            <p className="text-[11px] text-slate-400">
              Kondisi perangkat dan kebersihan lab saat Anda pertama kali masuk/memulai kegiatan:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {[
                { label: 'Baik & Siap Pakai', val: 'Baik' },
                { label: 'Cukup Baik', val: 'Cukup Baik' },
                { label: 'Ada Kendala Awal', val: 'Ada Kerusakan/Kendala Awal' }
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setKondisiAwal(opt.val)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    kondisiAwal === opt.val
                      ? 'bg-cyan-950/50 border-cyan-500/80 text-cyan-200 font-bold shadow-sm'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Atau ketik keterangan kondisi awal lainnya..."
              value={kondisiAwal}
              onChange={(e) => setKondisiAwal(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 mt-2 transition-colors"
            />
          </div>

          {/* Checklist Kondisi Akhir Pengembalian */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Checklist Kondisi Akhir Pengembalian Lab
            </label>
            <div className="space-y-2.5 bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl">
              {/* Item 1 */}
              <label htmlFor="chk-elektronik" className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 hover:text-white transition-colors">
                <input
                  id="chk-elektronik"
                  type="checkbox"
                  checked={checklists.elektronik}
                  onChange={() => handleCheckboxChange('elektronik')}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/40 w-4 h-4 cursor-pointer"
                />
                <span>
                  Komputer, laptop, IFP, AC, lampu, dan peralatan elektronik lainnya sudah <strong>dimatikan</strong>.
                </span>
              </label>

              {/* Item 2 */}
              <label htmlFor="chk-kebersihan" className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 hover:text-white transition-colors">
                <input
                  id="chk-kebersihan"
                  type="checkbox"
                  checked={checklists.kebersihan}
                  onChange={() => handleCheckboxChange('kebersihan')}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/40 w-4 h-4 cursor-pointer"
                />
                <span>Ruangan sudah <strong>dibersihkan dan disapu</strong>.</span>
              </label>

              {/* Item 3 */}
              <label htmlFor="chk-kerapian" className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 hover:text-white transition-colors">
                <input
                  id="chk-kerapian"
                  type="checkbox"
                  checked={checklists.kerapian}
                  onChange={() => handleCheckboxChange('kerapian')}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/40 w-4 h-4 cursor-pointer"
                />
                <span>
                  Kursi dan meja telah <strong>dirapikan kembali</strong> ke posisi semula.
                </span>
              </label>
            </div>
          </div>

          {/* Catatan Kendala */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Catatan Kendala / Kerusakan (Opsional)
            </label>
            <textarea
              rows="2"
              value={catatanKendala}
              onChange={(e) => setCatatanKendala(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Misal: PC 04 monitor berkedip, AC unit 2 kurang dingin..."
            />
          </div>

          {/* Foto Dokumentasi Kegiatan / Kondisi Lab */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                Foto Dokumentasi Kondisi Lab (Opsional)
              </label>
              {compressedStats && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-medium">
                  {formatFileSize(compressedStats.compressedSize)} (Hemat {Math.round((1 - compressedStats.compressedSize / compressedStats.originalSize) * 100)}%)
                </span>
              )}
            </div>

            {/* Hidden native file inputs */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileSelected}
            />
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileSelected}
            />

            {/* Photo Preview or Selection Area */}
            {previewImageUrl ? (
              <div className="relative rounded-2xl border border-slate-800 bg-slate-950/90 p-2 overflow-hidden group">
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                  <img
                    src={previewImageUrl}
                    alt="Dokumentasi Lab"
                    className="h-full w-full object-cover"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                  {/* Top Bar Status */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur border border-slate-700/70 text-slate-200 font-medium">
                      {selectedImageFile ? 'Foto Baru Terkompresi' : 'Foto Tersimpan'}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      title="Hapus Foto"
                      className="pointer-events-auto p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-800/60 transition-colors shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom Action inside preview */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-lg bg-slate-900/85 hover:bg-slate-800 text-slate-200 text-[11px] font-medium border border-slate-700/80 backdrop-blur flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Camera className="w-3 h-3 text-cyan-400" />
                        Ganti (Kamera)
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-lg bg-slate-900/85 hover:bg-slate-800 text-slate-200 text-[11px] font-medium border border-slate-700/80 backdrop-blur flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Image className="w-3 h-3 text-indigo-400" />
                        Galeri
                      </button>
                    </div>
                  </div>
                </div>

                {/* Upload Progress Bar if submitting and uploading */}
                {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2 px-1">
                    <div className="flex justify-between text-[10px] text-cyan-300 mb-1">
                      <span>Mengunggah ke Cloudinary...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-cyan-500 h-full transition-all duration-200" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-2xl p-4 bg-slate-950/50 text-center transition-colors">
                {isCompressing ? (
                  <div className="flex flex-col items-center justify-center py-2 text-slate-400 text-xs">
                    <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin mb-1.5" />
                    <span>Mengompres resolusi foto (1280px WebP)...</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-slate-400 mb-3">
                      Sertakan foto bukti ruangan lab bersih & perangkat telah dimatikan:
                    </p>
                    <div className="flex items-center justify-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/60 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Ambil Foto Kamera
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Image className="w-3.5 h-3.5 text-indigo-400" />
                        Pilih dari Galeri
                      </button>
                    </div>
                    <span className="block text-[10px] text-slate-400 mt-2">
                      Foto otomatis dikompresi menjadi ~150 KB sebelum diunggah ke Cloudinary
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Error upload display */}
            {uploadError && (
              <div className="mt-2 p-2 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium py-2.5 rounded-xl text-xs border border-slate-700 transition-colors cursor-pointer text-center"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              {isSubmitting 
                ? 'Menyimpan...' 
                : hasExistingJournal ? 'Perbarui Jurnal Lab' : 'Simpan Jurnal Lab'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
