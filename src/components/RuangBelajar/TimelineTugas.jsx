import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Play,
  FileCheck,
  Send,
  Calendar,
  Award,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Sliders,
  Check,
  Edit2,
  Lock,
  LogIn,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TimelineTugas({
  tasks,
  student,
  isAdmin,
  onOpenSubmitModal,
  onToggleActive,
  onUpdateWeight,
  onUpdateDeadline,
  onSelectDetail
}) {
  const navigate = useNavigate();
  const [editingWeightId, setEditingWeightId] = useState(null);
  const [tempWeightValue, setTempWeightValue] = useState(100);
  const [editingDeadlineId, setEditingDeadlineId] = useState(null);
  const [tempDeadlineValue, setTempDeadlineValue] = useState('');
  const isGuest = !student;

  const handleOpenLogin = () => {
    window.dispatchEvent(new CustomEvent('open-login-modal'));
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'simulasi':
        return {
          label: '🎮 Praktik Simulasi Lab',
          className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      case 'kuis':
        return {
          label: '📝 Kuis Logika Interaktif',
          className: 'bg-purple-50 text-purple-700 border-purple-200'
        };
      case 'submit':
        return {
          label: '📦 Pengumpulan Proyek / Link',
          className: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      default:
        return {
          label: '📄 Lembar Kerja Tugas',
          className: 'bg-slate-50 text-slate-700 border-slate-200'
        };
    }
  };

  const formatDeadline = (dateStr) => {
    if (!dateStr) return 'Belum diatur';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Compute action button label & style based on student progress
  const getTaskActionButton = (task) => {
    const isCompleted = task.status === 'selesai' || task.status === 'dinilai';
    const earnedScore = task.earnedScore;
    const maxPoints = task.poin_maksimal || task.points || 100;
    const isPerfect = earnedScore !== null && earnedScore !== undefined && earnedScore >= maxPoints;
    const hasStarted = (earnedScore !== null && earnedScore !== undefined) || task.status === 'sedang';

    if (isPerfect) {
      return {
        label: `Lihat Hasil Praktik (${earnedScore}/${maxPoints} Poin)`,
        btnClass: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300/80',
        icon: Award
      };
    }

    if (hasStarted && (!earnedScore || earnedScore < maxPoints)) {
      return {
        label: earnedScore !== null && earnedScore !== undefined
          ? `Lanjutkan Pengerjaan (Skor Saat Ini: ${earnedScore}/${maxPoints})`
          : 'Lanjutkan Pengerjaan yang Belum Selesai',
        btnClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm shadow-amber-600/20',
        icon: Play
      };
    }

    // Never started
    if (task.tipe_tugas === 'simulasi') {
      return {
        label: 'Mulai Praktik Simulasi Lab',
        btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20',
        icon: Play
      };
    }
    if (task.tipe_tugas === 'kuis') {
      return {
        label: 'Mulai Kuis Interaktif',
        btnClass: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-600/20',
        icon: Play
      };
    }
    return {
      label: 'Kirim / Kumpulkan Tugas',
      btnClass: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20',
      icon: Send
    };
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>Alur Roadmap Pembelajaran Informatika</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Selesaikan setiap tantangan tugas secara bertahap untuk mengumpulkan poin maksimal.
          </p>
        </div>
      </div>

      {/* Timeline Node List */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
        {tasks.map((task, idx) => {
          const typeInfo = getTypeBadge(task.tipe_tugas);
          const isCompleted = task.status === 'selesai' || task.status === 'dinilai';
          const isInProgress = task.status === 'sedang';
          const isDisabled = task.is_active === false;
          const points = task.poin_maksimal || task.points || 100;
          const isEditingThisWeight = editingWeightId === task.id;

          return (
            <motion.div
              key={task.id || idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative group"
            >
              {/* Timeline Bullet Node */}
              <div
                className={`absolute -left-6 sm:-left-10 top-5 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-xs transition-all z-10 ${
                  isDisabled
                    ? 'bg-slate-100 border-slate-300 text-slate-400'
                    : isCompleted
                    ? 'bg-emerald-500 border-emerald-600 text-white'
                    : isInProgress
                    ? 'bg-indigo-600 border-indigo-700 text-white ring-4 ring-indigo-100'
                    : 'bg-white border-indigo-400 text-indigo-700'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
              </div>

              {/* Task Card Box */}
              <div
                className={`rounded-3xl border transition-all p-5 sm:p-6 ${
                  isDisabled
                    ? 'bg-slate-50/70 border-slate-200/80 opacity-75'
                    : isCompleted
                    ? 'bg-white border-emerald-200/90 shadow-2xs'
                    : 'bg-white border-slate-200/90 shadow-2xs hover:border-indigo-300'
                }`}
              >
                {/* Header: Badges & Status */}
                <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                      Tugas #{task.urutan || idx + 1}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${typeInfo.className}`}
                    >
                      {typeInfo.label}
                    </span>
                    {task.kategori && (
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {task.kategori}
                      </span>
                    )}
                  </div>

                  {/* Right Status Badge */}
                  <div className="flex items-center gap-2">
                    {isDisabled ? (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Nonaktif
                      </span>
                    ) : isCompleted ? (
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1.5 shadow-2xs">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        Tuntas: {task.earnedScore ?? points}/{points} Poin
                      </span>
                    ) : isInProgress ? (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> Menunggu Penilaian
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        Bobot: {points} Poin
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
                  {task.judul || task.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  {task.deskripsi || task.description}
                </p>

                {/* Instructions preview if any */}
                {task.petunjuk && task.petunjuk.length > 0 && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block mb-1">
                      Langkah Pengerjaan:
                    </span>
                    {task.petunjuk.slice(0, 3).map((inst, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-1.5">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{inst}</span>
                      </div>
                    ))}
                    {task.petunjuk.length > 3 && (
                      <span className="text-[10px] text-slate-400 font-medium pl-3">
                        + {task.petunjuk.length - 3} langkah lainnya
                      </span>
                    )}
                  </div>
                )}

                {/* Bottom Meta & Action Bar */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                  {/* Deadline Info */}
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Batas: <strong className="text-slate-700">{formatDeadline(task.deadline)}</strong></span>
                    </span>
                    {task.submission?.submittedAt && (
                      <span className="text-emerald-600 font-medium hidden sm:inline">
                        • Dikirim: {new Date(task.submission.submittedAt).toLocaleDateString('id-ID')}
                      </span>
                    )}
                  </div>

                  {/* Unified Action Button: Triggers Detail Modal so student reads instructions before proceeding */}
                  {(() => {
                    const action = getTaskActionButton(task);
                    const ActionIcon = action.icon;
                    return (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectDetail(task)}
                          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition shadow-xs select-none ${action.btnClass}`}
                          id={`btn-action-task-${task.id}`}
                        >
                          <ActionIcon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{action.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-70 ml-0.5" />
                        </button>
                      </div>
                    );
                  })()}
                </div>

                {/* --- ADMIN QUICK CONTROLS (If Role Admin) --- */}
                {isAdmin && (
                  <div className="mt-4 pt-3 border-t border-dashed border-amber-200/80 bg-amber-50/50 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:px-6 rounded-b-3xl flex items-center justify-between gap-3 flex-wrap text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-900 text-[11px] flex items-center gap-1">
                        <Sliders className="w-3 h-3 text-amber-700" /> Kontrol Pengajar:
                      </span>

                      {/* Enable / Disable Switch */}
                      <button
                        type="button"
                        onClick={() => onToggleActive(task.id, task.is_active !== false)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                          task.is_active !== false
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {task.is_active !== false ? (
                          <>
                            <Eye className="w-3 h-3" /> Status: Aktif (Terbuka)
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Status: Dinonaktifkan
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      {/* Deadline Customizer */}
                      <div className="flex items-center gap-1.5">
                        {editingDeadlineId === task.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="date"
                              value={tempDeadlineValue}
                              onChange={(e) => setTempDeadlineValue(e.target.value)}
                              className="px-2 py-0.5 text-xs font-semibold bg-white border border-amber-300 rounded text-slate-800"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateDeadline(task.id, tempDeadlineValue);
                                setEditingDeadlineId(null);
                              }}
                              className="p-1 bg-amber-600 text-white rounded hover:bg-amber-700"
                              title="Simpan Batas Waktu"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingDeadlineId(null)}
                              className="p-1 bg-slate-200 text-slate-600 rounded hover:bg-slate-300"
                              title="Batal"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDeadlineId(task.id);
                              setTempDeadlineValue(task.deadline ? task.deadline.slice(0, 10) : '');
                            }}
                            className="inline-flex items-center gap-1 text-[11px] text-amber-800 font-medium hover:underline bg-white/80 px-2 py-0.5 rounded border border-amber-200"
                          >
                            <Calendar className="w-3 h-3 text-amber-600" /> Atur Batas Waktu
                          </button>
                        )}
                      </div>

                      {/* Weight / Points Customizer */}
                      <div className="flex items-center gap-1.5">
                        {isEditingThisWeight ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="10"
                              max="500"
                              value={tempWeightValue}
                              onChange={(e) => setTempWeightValue(e.target.value)}
                              className="w-16 px-2 py-0.5 text-xs font-bold bg-white border border-amber-300 rounded text-slate-800"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateWeight(task.id, tempWeightValue);
                                setEditingWeightId(null);
                              }}
                              className="p-1 bg-amber-600 text-white rounded hover:bg-amber-700"
                              title="Simpan Bobot"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingWeightId(null)}
                              className="p-1 bg-slate-200 text-slate-600 rounded hover:bg-slate-300"
                              title="Batal"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingWeightId(task.id);
                              setTempWeightValue(points);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] text-amber-800 font-medium hover:underline bg-white/80 px-2 py-0.5 rounded border border-amber-200"
                          >
                            <Edit2 className="w-3 h-3 text-amber-600" /> Ubah Bobot ({points} Poin)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
