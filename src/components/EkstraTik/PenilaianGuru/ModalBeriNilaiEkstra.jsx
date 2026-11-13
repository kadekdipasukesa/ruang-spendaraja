import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, Award, Star, MessageSquare, FileText, Eye, 
  ExternalLink, User, Sparkles, AlertCircle, Save, Clock, Lock
} from 'lucide-react';
import { simpanNilaiTugasEkstra } from '../../../services/ekstraTikService';

const PRESET_NILAI = [100, 95, 90, 85, 80, 75];

const PRESET_FEEDBACK = [
  '🌟 Luar biasa, format dan struktur dokumen sangat rapi!',
  '👍 Bagus sekali, tugas sesuai dengan seluruh petunjuk.',
  '📝 Cukup baik, perhatikan kerapian margin, font, dan spasi.',
  '⚠️ Sudah diterima, tingkatkan lagi ketelitian dan kerapian tugas.',
  '💡 Ide dan kreativitas pengerjaan sangat baik!'
];

export default function ModalBeriNilaiEkstra({
  isOpen,
  onClose,
  item,
  onSuccess,
  onPreview
}) {
  const [nilai, setNilai] = useState('');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (item) {
      setNilai(item.nilai !== null && item.nilai !== undefined ? String(item.nilai) : '');
      setFeedback(item.feedback_guru || '');
      setErrorMsg('');
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const namaSiswa = item.nama || item.master_siswa?.NAMA || 'Siswa Ekstra TIK';
  const kelasSiswa = item.kelas || item.master_siswa?.Kelas || '-';
  const noAbsen = item.no_absen || item.master_siswa?.['No Absen'] || '-';
  const judulTugas = item.ekstra_tugas_master?.judul_tugas || item.judul_tugas || 'Tugas Ekstra TIK';
  const fileName = item.file_name || 'Dokumen Tugas';
  const fileUrl = item.file_url || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (nilai === '') {
      setErrorMsg('Harap masukkan nilai tugas (0 - 100).');
      return;
    }

    const numNilai = Number(nilai);
    if (isNaN(numNilai) || numNilai < 0 || numNilai > 100) {
      setErrorMsg('Nilai harus berupa angka antara 0 sampai 100.');
      return;
    }

    setSaving(true);
    try {
      const updated = await simpanNilaiTugasEkstra({
        pengumpulanId: item.id,
        nilai: numNilai,
        feedback_guru: feedback
      });
      if (onSuccess) onSuccess(updated || { ...item, nilai: numNilai, feedback_guru: feedback });
      onClose();
    } catch (err) {
      console.error('Gagal menyimpan nilai:', err);
      setErrorMsg(err.message || 'Gagal menyimpan nilai ke database');
    } finally {
      setSaving(false);
    }
  };

  const getPredikatBadge = (val) => {
    const num = Number(val);
    if (isNaN(num) || val === '') return null;
    if (num >= 90) return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">Sangat Baik (A)</span>;
    if (num >= 80) return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800 border border-indigo-300">Baik (B)</span>;
    if (num >= 70) return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300">Cukup (C)</span>;
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">Perlu Bimbingan (D)</span>;
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
      >
        {/* Header Modal */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-violet-800 via-indigo-900 to-slate-900 text-white flex items-center justify-between gap-3 shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate">
                Penilaian Tugas Siswa
              </h3>
              <p className="text-[11px] text-indigo-200 truncate">
                Ekstrakurikuler TIK SMPN 2 Singaraja
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Card Info Siswa & Tugas */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-xs shrink-0">
                  {namaSiswa.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                    {namaSiswa}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Kelas {kelasSiswa} • Absen #{noAbsen}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-600 shrink-0 font-mono">
                {item.submitted_at ? new Date(item.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : ''}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200/60 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs truncate">
                <span className="text-violet-600">📑</span>
                <span className="truncate">{judulTugas}</span>
              </div>
              <div className="flex items-center justify-between gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/70 text-[11px]">
                <span className="truncate text-slate-600 flex items-center gap-1 font-mono">
                  <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate">{fileName}</span>
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onPreview && onPreview(item, { canDownload: true })}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] border border-indigo-200 transition cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Lihat</span>
                  </button>
                  {fileUrl && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition"
                      title="Buka Langsung di Tab Baru"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {item.catatan_siswa && (
              <div className="text-[11px] text-slate-500 italic bg-amber-50/60 p-2 rounded-lg border border-amber-200/50">
                💬 Catatan Siswa: "{item.catatan_siswa}"
              </div>
            )}
          </div>

          {/* Input Nilai & Preset Nilai */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Skor Nilai Tugas (0 - 100):</span>
              </label>
              {getPredikatBadge(nilai)}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                value={nilai}
                onChange={(e) => setNilai(e.target.value)}
                placeholder="Contoh: 95"
                className="w-32 text-center text-lg font-black tracking-wider py-2 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono bg-white shadow-2xs"
                autoFocus
              />
              <div className="flex flex-wrap items-center gap-1 flex-1">
                {PRESET_NILAI.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNilai(String(p))}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                      String(nilai) === String(p)
                        ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                        : 'bg-slate-100 hover:bg-violet-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback / Catatan Guru */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-violet-600" />
              <span>Catatan / Feedback Evaluasi Guru (Opsional):</span>
            </label>

            {/* Quick Feedback Chips */}
            <div className="flex flex-wrap gap-1">
              {PRESET_FEEDBACK.map((fbText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFeedback(fbText)}
                  className="text-left px-2 py-1 rounded-md bg-slate-100 hover:bg-violet-50 border border-slate-200 text-[10px] text-slate-600 hover:text-violet-800 transition cursor-pointer"
                >
                  {fbText}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tuliskan catatan apresiasi, koreksi kerapian, atau masukan untuk siswa..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            />
          </div>

          {/* Pesan Kunci Setelah Dinilai */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900">
            <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <b>Perhatian:</b> Setelah nilai disimpan, tugas ini akan terkunci otomatis dan siswa tidak dapat mengunggah ulang berkas tugas.
            </p>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-600/20 transition cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Nilai</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

