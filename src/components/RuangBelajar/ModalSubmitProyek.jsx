import { useState } from 'react';
import {
  Send,
  Link as LinkIcon,
  FileText,
  X,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModalSubmitProyek({ task, onClose, onSubmit }) {
  const [linkUrl, setLinkUrl] = useState(task?.submission?.link || '');
  const [notes, setNotes] = useState(task?.submission?.notes || '');
  const [fileName, setFileName] = useState(task?.submission?.fileName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!task) return null;

  const points = task.poin_maksimal || task.points || 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!linkUrl.trim() && !notes.trim() && !fileName.trim()) {
      alert("Harap masukkan tautan tugas atau catatan pengerjaan.");
      return;
    }

    setIsSubmitting(true);
    await onSubmit(task.id, {
      link: linkUrl.trim(),
      notes: notes.trim(),
      fileName: fileName.trim(),
      autoScore: null // Proyek biasa dinilai guru
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl relative"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
            Form Pengumpulan Tugas
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mt-1 leading-snug">
            {task.judul || task.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
            <span>Bobot: <strong className="text-slate-700">{points} Poin</strong></span>
            <span>•</span>
            <span>Kategori: <strong className="text-slate-700">{task.kategori || task.category}</strong></span>
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tautan Proyek / Link Karya (Scratch / Google Drive / Canva):
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://scratch.mit.edu/projects/... atau https://docs.google.com/..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Pastikan akses link telah diatur ke "Siapa saja yang memiliki link dapat melihat".
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Siswa / Refleksi Pengerjaan:
            </label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tuliskan kendala, fitur menarik yang Anda buat, atau penjelasan ringkas hasil tugas..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Mengirim...' : 'Kirim Tugas Sekarang'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
