import { createPortal } from 'react-dom';
import {
  X,
  Calendar,
  Award,
  Clock,
  BookOpen,
  CheckCircle2,
  FileText,
  Play,
  Send,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function TaskDetailModal({ task, onClose, onOpenSubmitModal }) {
  const navigate = useNavigate();
  if (!task) return null;

  const points = task.poin_maksimal || task.points || 100;
  const isCompleted = task.status === 'selesai' || task.status === 'dinilai';

  const formatDeadline = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-5 sm:p-7 max-w-xl w-full border border-slate-200 shadow-2xl relative my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-4">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap pr-8">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
              Tugas #{task.urutan || 1} • {task.kategori || task.category || 'Informatika'}
            </span>
            {task.earnedScore !== null && task.earnedScore !== undefined && task.earnedScore >= points ? (
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Tuntas Sempurna ({task.earnedScore}/{points} Poin)
              </span>
            ) : task.earnedScore !== null && task.earnedScore !== undefined && task.earnedScore > 0 ? (
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 flex items-center gap-1 border border-amber-300">
                <Award className="w-3 h-3 text-amber-600" />
                Tersimpan ({task.earnedScore}/{points} Poin)
              </span>
            ) : task.localDraftScore ? (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 flex items-center gap-1 border border-indigo-200">
                <Clock className="w-3 h-3 text-indigo-600" />
                Draft ({task.localDraftScore}/{points} Poin)
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Bobot: {points} Poin
              </span>
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 leading-snug">
              {task.judul || task.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {task.deskripsi || task.description}
            </p>
          </div>

          {/* Status Score Progress Banner */}
          {task.earnedScore !== null && task.earnedScore !== undefined && (
            <div className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
              task.earnedScore >= points
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/90 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-center gap-2.5">
                <Award className={`w-4 h-4 shrink-0 ${task.earnedScore >= points ? 'text-emerald-600' : 'text-amber-600'}`} />
                <div>
                  <strong className="block">
                    {task.earnedScore >= points ? 'Nilai Resmi Tercatat' : 'Skor Terbaik Tersimpan'}: {task.earnedScore} / {points} Poin
                  </strong>
                  <span className="text-[11px] opacity-80">
                    {task.earnedScore >= points
                      ? 'Nilai sempurna 100% sudah masuk ke database & Papan Peringkat.'
                      : 'Nilai sudah tersimpan. Kamu dapat mengulang misi untuk meraih poin maksimal.'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Petunjuk Langkah Pengerjaan */}
          {task.petunjuk && task.petunjuk.length > 0 && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-2">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Petunjuk Pengerjaan Tugas:
              </span>
              <div className="space-y-1.5 pt-1">
                {task.petunjuk.map((p, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submission Details if exists */}
          {task.submission && (
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Data Pengumpulan Anda:
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">
                  {task.submission.submittedAt ? new Date(task.submission.submittedAt).toLocaleDateString('id-ID') : '-'}
                </span>
              </div>
              {task.submission.link && (
                <a
                  href={task.submission.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 font-semibold hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {task.submission.link}
                </a>
              )}
              {task.submission.notes && (
                <p className="text-slate-600 italic">
                  Catatan: "{task.submission.notes}"
                </p>
              )}
              {task.submission.feedback && (
                <div className="pt-2 border-t border-emerald-200/60 text-slate-700">
                  <strong>Feedback Guru:</strong> {task.submission.feedback}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1 text-xs text-slate-400 min-w-0">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Batas: {formatDeadline(task.deadline)}</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Tutup
            </button>

            {task.tipe_tugas === 'simulasi' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(task.custom_route || '/tugas/simulasi-folder');
                }}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-2xs transition ${
                  isCompleted && (task.earnedScore ?? 0) >= points
                    ? 'bg-slate-800 hover:bg-slate-900'
                    : (task.earnedScore ?? 0) > 0 || task.status === 'sedang'
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>
                  {isCompleted && (task.earnedScore ?? 0) >= points
                    ? 'Buka Kembali Simulasi (100 Poin)'
                    : (task.earnedScore ?? 0) > 0 || task.status === 'sedang'
                    ? 'Lanjutkan Praktik Simulasi'
                    : 'Mulai Praktik Simulasi Sekarang'}
                </span>
              </button>
            )}

            {task.tipe_tugas === 'kuis' && (() => {
              const isSK = task.custom_route?.includes('sistem-komputer') || task.kode_tugas?.includes('SISTEM-KOMPUTER');
              const taskShortName = isSK ? 'Sistem Komputer' : 'BK';
              return (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(task.custom_route || (isSK ? '/tugas/sistem-komputer' : '/tugas/berpikir-komputasional'));
                  }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-2xs transition ${
                    isCompleted && (task.earnedScore ?? 0) >= points
                      ? 'bg-emerald-700 hover:bg-emerald-800'
                      : (task.earnedScore ?? 0) > 0 || task.status === 'sedang'
                      ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                      : isSK
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-amber-600/20'
                      : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {isCompleted && (task.earnedScore ?? 0) >= points
                      ? `Lihat / Ulangi Petualangan ${taskShortName} (100 Poin)`
                      : (task.earnedScore ?? 0) > 0 || task.status === 'sedang'
                      ? `Lanjutkan Petualangan ${taskShortName} (${task.earnedScore || task.localDraftScore || 0}/${points} Poin)`
                      : `Mulai Petualangan ${taskShortName} (4 Misi)`}
                  </span>
                </button>
              );
            })()}

            {task.tipe_tugas === 'submit' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSubmitModal(task);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isCompleted ? 'Kirim Pembaruan Tugas' : 'Kirim / Unggah Tugas'}</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}
