import { Calendar, Clock, Award, CheckCircle2, ChevronRight, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TaskCard({ task, onOpenDetail }) {
  // Format Date & Urgency
  const formatDeadline = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getUrgencyBadge = () => {
    if (task.status === 'selesai') {
      return {
        label: 'Telah Selesai',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        icon: CheckCircle2
      };
    }
    if (task.status === 'sedang') {
      return {
        label: 'Sedang Dikerjakan',
        bg: 'bg-blue-50 text-blue-700 border-blue-200/80',
        icon: Clock
      };
    }
    // Check if near or past
    const deadlineTime = new Date(task.deadline).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((deadlineTime - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: 'Terlambat',
        bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
        icon: AlertCircle
      };
    }
    if (diffDays <= 2) {
      return {
        label: `${diffDays === 0 ? 'Hari Ini' : `${diffDays} hari lagi`}`,
        bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
        icon: Clock
      };
    }
    return {
      label: `${diffDays} hari lagi`,
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: Calendar
    };
  };

  const badge = getUrgencyBadge();
  const UrgencyIcon = badge.icon;

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Tinggi':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Sedang':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`group bg-white rounded-2xl border p-5 sm:p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
        task.status === 'selesai'
          ? 'border-slate-200/90 bg-slate-50/40 opacity-95'
          : 'border-slate-200 hover:border-indigo-200'
      }`}
      id={`task-card-${task.id}`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {task.category}
            </span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getPriorityStyle(
                task.priority
              )}`}
            >
              Prioritas {task.priority}
            </span>
          </div>

          <div
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.bg}`}
          >
            <UrgencyIcon className="w-3 h-3" />
            <span>{badge.label}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
          {task.title}
        </h3>

        {/* Description summary */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {task.description}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-4 border-t border-slate-100/90 flex items-center justify-between gap-3 mt-auto">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDeadline(task.deadline)}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-purple-700">
            <Award className="w-3.5 h-3.5 text-purple-500" />
            <span>+{task.points} Poin</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenDetail(task)}
          className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            task.status === 'selesai'
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs'
          }`}
          id={`btn-open-task-${task.id}`}
        >
          <span>{task.status === 'selesai' ? 'Lihat Hasil' : 'Buka Tugas'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
