import { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  Sparkles,
  Send,
  CheckSquare,
  Square,
  ShieldCheck,
} from 'lucide-react';
import { TUGAS_5_CONFIG } from '../../../../../data/tugas5WordData';

export default function FormUploadCloudinaryTugas5({
  user,
  uploadedFileInfo = null,
  uploadProgress = 0,
  isUploading = false,
  uploadError = null,
  studentNotes = '',
  onNotesChange,
  onUploadFile,
  onRemoveFile,
  onSubmitAll,
  submitting = false,
  submitted = false,
  scoreTahap3 = 0,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // 4 Kriteria Verifikasi Praktik Mandiri (Hybrid Auto-Grading)
  const [checklist, setChecklist] = useState({
    halamanJudul: true,
    tabelIdentitas: true,
    ceritaFormat: true,
    gambarFile: true,
  });

  const checklistItems = [
    {
      id: 'halamanJudul',
      title: 'Kertas A4, Font Calibri & Judul 20 pt Bold',
      desc: 'Ukuran kertas A4, seluruh tulisan berjenis Calibri, judul utama 20 pt Bold Center (Ctrl+E & B), dan sub-judul 12 pt.',
    },
    {
      id: 'tabelIdentitas',
      title: 'Tabel Identitas Siswa (3 Kolom x 5 Baris)',
      desc: 'Tabel 3x5 dibuat via Insert Table, header diberi warna Shading, lebar kolom No disesuaikan, dan identitas terisi lengkap.',
    },
    {
      id: 'ceritaFormat',
      title: 'Cerita Pengalaman Justify, Bold, Italic & Pesan Center',
      desc: 'Sub-judul 15 pt Bold, 2 paragraf cerita dirapikan Justify (Ctrl+J), kata penting di-Bold, istilah asing di-Italic, dan Pesan Penting Center Bold.',
    },
    {
      id: 'gambarFile',
      title: 'Gambar Komputer PNG & Berkas .docx Asli',
      desc: 'Gambar komputer PNG disisipkan dengan Wrap Text Top and Bottom, berkas disimpan dengan format nama tugas 5_nama_noAbsen_pengalaman belajar.docx.',
    },
  ];

  const toggleChecklist = (id) => {
    setChecklist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allChecked = Object.values(checklist).every(Boolean);
  const checkedCount = Object.values(checklist).filter(Boolean).length;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const validateAndUpload = (file) => {
    // Khusus format dokumen pengolah kata
    const allowedExtensions = ['docx', 'doc', 'rtf', 'odt'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!allowedExtensions.includes(ext)) {
      alert(
        `⚠️ Format berkas .${ext} tidak diizinkan!\n\nTugas 5 adalah praktik aplikasi pengolah kata. Berkas yang wajib diunggah adalah dokumen Microsoft Word (.docx atau .doc).\n\nBerkas gambar (.png/.jpg) atau .pdf tidak dapat diterima.`
      );
      return;
    }

    // Validasi ukuran minimal: 15 KB untuk mencegah file kosong / dummy
    if (file.size < 15 * 1024) {
      alert(
        '⚠️ Ukuran berkas terlalu kecil (kurang dari 15 KB)!\n\nPastikan dokumen Word kamu sudah berisi teks undangan lengkap dan logo sekolah, serta sudah disimpan (Save / Ctrl+S) di laptop/komputer sebelum diunggah.'
      );
      return;
    }

    // Limit ukuran maksimal: 15MB
    if (file.size > 15 * 1024 * 1024) {
      alert('Ukuran berkas terlalu besar. Maksimal 15 MB.');
      return;
    }

    onUploadFile(file);
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const isReadyToSubmit = Boolean(uploadedFileInfo?.secureUrl) && allChecked;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Cloudinary Direct Storage
            </span>
            <h3 className="text-base sm:text-lg font-black text-white mt-1">
              Pengumpulan Berkas Dokumen Word (.docx / .doc)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Folder: <span className="font-mono text-slate-300">Tugas/5</span> &bull; Preset:{' '}
              <span className="font-mono text-slate-300">{TUGAS_5_CONFIG.cloudinaryPreset || 'tugas_5'}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Poin Proyek</span>
            <span className="text-xs sm:text-sm font-black text-amber-300">
              {isReadyToSubmit
                ? `${TUGAS_5_CONFIG.poin_tahap3_proyek} / ${TUGAS_5_CONFIG.poin_tahap3_proyek} pt`
                : `0 / ${TUGAS_5_CONFIG.poin_tahap3_proyek} pt`}
            </span>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      {!uploadedFileInfo?.secureUrl ? (
        <div>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`p-8 sm:p-10 rounded-3xl border-2 border-dashed transition text-center cursor-pointer relative overflow-hidden ${
              isDragOver
                ? 'border-amber-400 bg-amber-500/10'
                : 'border-slate-700 bg-slate-850/50 hover:bg-slate-800/60 hover:border-slate-600'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".docx,.doc,.rtf,.odt"
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <UploadCloud className="w-8 h-8" />
              </div>

              <div>
                <span className="text-sm sm:text-base font-bold text-white block">
                  {isDragOver ? 'Lepaskan Berkas Word Disini' : 'Tarik & Lepas Berkas Dokumen Word Disini'}
                </span>
                <span className="text-xs text-slate-400 block mt-1">
                  atau klik untuk memilih berkas <strong>.docx / .doc</strong> dari komputermu
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-blue-300 bg-blue-950/60 px-3 py-1.5 rounded-full border border-blue-800">
                <FileText className="w-3.5 h-3.5" />
                <span>Khusus format: .docx atau .doc (Minimal 15 KB &bull; Maks 15 MB)</span>
              </div>
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 space-y-3">
                <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-white">
                  Mengunggah ke Cloudinary ({uploadProgress}%)...
                </span>
                <div className="w-full max-w-xs bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Upload Error Alert */}
          {uploadError && (
            <div className="mt-3 p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/60 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      ) : (
        /* Uploaded File Card */
        <div className="p-5 sm:p-6 rounded-3xl bg-emerald-950/30 border border-emerald-500/50 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-[#2b579a] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                DOCX
              </div>

              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-bold text-white block truncate">
                  {uploadedFileInfo.fileName}
                </span>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 flex-wrap">
                  <span className="text-emerald-400 font-semibold font-mono">
                    {formatBytes(uploadedFileInfo.fileSize)}
                  </span>
                  <span>&bull;</span>
                  <span className="uppercase text-slate-400 font-mono">
                    {uploadedFileInfo.format || 'docx'}
                  </span>
                  <span>&bull;</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Berhasil Diunggah
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <a
                href={uploadedFileInfo.secureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Lihat Berkas</span>
              </a>

              <button
                type="button"
                onClick={onRemoveFile}
                className="p-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition cursor-pointer"
                title="Ganti berkas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold bg-emerald-950/60 p-3 rounded-2xl border border-emerald-600/40">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Berkas dokumen Word telah aman tersimpan di cloud. Lengkapi ceklis konfirmasi di bawah untuk mengirim nilai!
            </span>
          </div>
        </div>
      )}

      {/* ─── SELF-VERIFICATION CHECKLIST (Opsi 1: Hybrid Auto-Grading) ─── */}
      <div className="bg-slate-850 border border-slate-800 rounded-3xl p-4 sm:p-6 space-y-3">
        <div className="flex items-center justify-between gap-2 border-b border-slate-700/80 pb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h4 className="text-xs sm:text-sm font-black text-white">
              Ceklis Verifikasi Praktik Mandiri (Wajib Dicentang 4/4)
            </h4>
          </div>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              allChecked
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {checkedCount}/4 Terpenuhi
          </span>
        </div>

        <p className="text-[11px] text-slate-400">
          Centang kriteria di bawah ini sebagai bukti kejujuran bahwa kamu telah mempraktikkan fitur Word pada berkas yang kamu unggah:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {checklistItems.map((item) => {
            const isChecked = checklist[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-2.5 select-none ${
                  isChecked
                    ? 'bg-emerald-950/20 border-emerald-500/40 hover:bg-emerald-950/30'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/60'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <span
                    className={`text-xs font-bold block leading-tight ${
                      isChecked ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 block leading-tight">
                    {item.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Notes Field */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <span>Catatan / Keterangan Karya untuk Guru (Opsional):</span>
        </label>
        <textarea
          rows={3}
          value={studentNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Contoh: Saya mendesain brosur undangan dengan logo SMPN 2 diatur Wrap Text In Front of Text dan tema warna biru-emas..."
          className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Submit Action Box */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="text-xs text-slate-400 block">
            {isReadyToSubmit
              ? '✨ Seluruh syarat lengkap! Nilai 60 Poin Proyek siap dicatat otomatis.'
              : !uploadedFileInfo?.secureUrl
              ? '⚠️ Unggah berkas dokumen .docx terlebih dahulu di atas.'
              : '⚠️ Centang seluruh 4 kriteria bukti praktik di atas untuk membuka tombol submit.'}
          </span>
          <span className="text-xs font-bold text-white">
            Nilai langsung tercatat di profil & leaderboard begitu dikirim.
          </span>
        </div>

        <button
          type="button"
          onClick={onSubmitAll}
          disabled={submitting || !isReadyToSubmit}
          className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition shadow-lg flex items-center gap-2 ${
            isReadyToSubmit
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-600 hover:from-blue-500 hover:to-amber-500 text-white shadow-blue-500/25 cursor-pointer animate-pulse'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Menyimpan ke Database...</span>
            </>
          ) : submitted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Kirim Pembaruan Tugas</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Kumpulkan Tugas 5 Sekarang</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
