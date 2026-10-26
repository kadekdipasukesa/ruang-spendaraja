import React, { useState } from 'react';
import { 
  Play, 
  ExternalLink, 
  UploadCloud, 
  CheckCircle2, 
  Trash2, 
  Copy, 
  Check, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileText
} from 'lucide-react';
import { TEMPLATE_SURAT_IZIN } from '../../../../data/tugas6SurelData';

export default function TahapWatchAndDoCard({
  tahap,
  user,
  quizAnswer,
  onAnswerQuiz,
  uploadedScreenshot,
  uploading,
  uploadProgress,
  onUploadScreenshot,
  onDeleteScreenshot,
  onNextStage,
  isLastStage,
}) {
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(Boolean(quizAnswer));

  // Ganti placeholder draf surat jika di Tahap 3
  const studentName = user?.NAMA || user?.nama || 'Siswa Spendaraja';
  const studentClass = user?.Kelas || user?.kelas || '7A';
  const studentAbsen = user?.['No Absen'] || user?.no_absen || '01';

  const personalizedDraft = TEMPLATE_SURAT_IZIN
    .replace(/{NAMA_SISWA}/g, studentName)
    .replace(/{KELAS_SISWA}/g, studentClass)
    .replace(/{ABSEN_SISWA}/g, String(studentAbsen));

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(personalizedDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2500);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadScreenshot(tahap.id, file);
    }
  };

  const isQuizCorrect = quizAnswer === tahap.kuis.opsi.find((o) => o.benar)?.id;

  return (
    <div className="space-y-6">
      {/* 1. KARTU WATCH: Video / Materi Visual Ringkas */}
      <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
            <Play className="w-4 h-4 fill-rose-400" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400">
              Langkah 1: Tonton & Pahami (Watch)
            </span>
            <h2 className="text-base sm:text-lg font-black text-white">
              {tahap.title}
            </h2>
          </div>
        </div>

        {/* Ringkasan Visual Poin Penting */}
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4 my-4">
          <p className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Poin Inti yang Perlu Kamu Ketahui:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            {tahap.videoSummary.poinPenting.map((poin, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                <span>{poin}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Khusus Tahap 3: Kotak Draf Surat Izin yang Dapat Disalin */}
        {tahap.id === 3 && (
          <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Draf Resmi Surat Izin (Kasus 1 November 2026):
              </span>
              <button
                type="button"
                onClick={handleCopyDraft}
                className="px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all active:scale-95 cursor-pointer"
              >
                {copiedDraft ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDraft ? 'Tersalin!' : 'Salin Draf'}</span>
              </button>
            </div>
            <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 max-h-48 overflow-y-auto">
              {personalizedDraft}
            </pre>
            <p className="text-[11px] text-amber-400/90 mt-2">
              💡 <em>Catatan penting: Pada tahap ini kamu <strong>TIDAK PERLU melampirkan berkas PDF</strong>. Cukup tuliskan surat izin dengan bahasa formal di badan pesan Gmail!</em>
            </p>
          </div>
        )}
      </section>

      {/* 2. KARTU KUIS: Checkpoint Pemahaman */}
      <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-400">
              Langkah 2: Kuis Checkpoint
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {tahap.kuis.pertanyaan}
            </h3>
          </div>
        </div>

        {/* Pilihan Opsi */}
        <div className="grid grid-cols-1 gap-2.5 my-4">
          {tahap.kuis.opsi.map((opsi) => {
            const isSelected = quizAnswer === opsi.id;
            return (
              <button
                key={opsi.id}
                type="button"
                onClick={() => {
                  onAnswerQuiz(tahap.id, opsi.id);
                  setQuizSubmitted(true);
                }}
                className={`p-3.5 rounded-xl text-left border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${
                  isSelected
                    ? opsi.benar
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-500/60 text-rose-200'
                    : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-300'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center font-bold shrink-0 text-xs ${
                    isSelected
                      ? opsi.benar
                        ? 'bg-emerald-500 text-white'
                        : 'bg-rose-500 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {opsi.id}
                </span>
                <span className="flex-1 mt-0.5">{opsi.teks}</span>
              </button>
            );
          })}
        </div>

        {/* Pembahasan Kuis */}
        {quizAnswer && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 border ${
              isQuizCorrect
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}
          >
            {isQuizCorrect ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            )}
            <div>
              <p className="font-bold mb-0.5">
                {isQuizCorrect ? 'Jawaban Benar!' : 'Jawaban Kurang Tepat, tetapi tetap tercatat.'}
              </p>
              <p className="text-slate-300">{tahap.kuis.pembahasan}</p>
            </div>
          </div>
        )}
      </section>

      {/* 3. KARTU PRAKTIK GMAIL & UPLOAD SCREENSHOT */}
      <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                Langkah 3: Praktik di Gmail Asli & Bukti Screenshot
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {tahap.praktek.targetLabel}
              </h3>
            </div>
          </div>

          {/* Tombol Deep Link Buka Gmail */}
          <a
            href="https://mail.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-900/30 transition-all active:scale-95"
          >
            <span>Buka Gmail</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Instruksi Praktik */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 mb-4 text-xs sm:text-sm text-slate-300">
          <p className="font-semibold text-white mb-1">Instruksi:</p>
          <p>{tahap.praktek.instruksi}</p>
          <p className="text-[11px] text-amber-400 mt-2 font-medium">
            📸 {tahap.praktek.petunjukSS}
          </p>
        </div>

        {/* Area Upload Screenshot */}
        {uploadedScreenshot?.secureUrl ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center gap-4">
            <img
              src={uploadedScreenshot.secureUrl}
              alt="Screenshot Tahap"
              className="w-full sm:w-36 h-28 object-cover rounded-lg border border-emerald-500/40 shadow-md"
            />
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-400 font-bold text-xs mb-1">
                <CheckCircle2 className="w-4 h-4" />
                Screenshot Berhasil Diunggah!
              </div>
              <p className="text-xs text-slate-300 font-mono truncate">
                {uploadedScreenshot.fileName || 'screenshot_pengerjaan.jpg'}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                <a
                  href={uploadedScreenshot.secureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                >
                  Lihat Gambar Penuh
                </a>
                <button
                  type="button"
                  onClick={() => onDeleteScreenshot(tahap.id)}
                  className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Ganti Screenshot
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative border-2 border-dashed border-slate-700 hover:border-rose-500/60 rounded-xl p-6 text-center transition-all bg-slate-950/40">
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-bold text-slate-200">
              {uploading ? `Mengunggah... ${uploadProgress}%` : 'Pilih atau Tarik Screenshot ke Sini'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Mendukung format gambar (.jpg, .png, .webp). Gambar otomatis dikompres agar hemat kuota.
            </p>

            {uploading && (
              <div className="w-full max-w-xs mx-auto bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className="bg-rose-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* Tombol Lanjut ke Tahap Berikutnya */}
        {!isLastStage && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onNextStage}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <span>Lanjut ke Tahap {tahap.id + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
