import { ClipboardList, Clock, CheckCircle2, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TaskSummaryStats({ stats }) {
  const statItems = [
    {
      id: 'stat-total',
      label: 'Total Tugas',
      value: stats.total,
      sublabel: 'Semester Ini',
      icon: ClipboardList,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      borderAccent: 'border-blue-100/60'
    },
    {
      id: 'stat-pending',
      label: 'Perlu Dikerjakan',
      value: stats.pending,
      sublabel: 'Menunggu Pengumpulan',
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      borderAccent: 'border-amber-100/60'
    },
    {
      id: 'stat-completed',
      label: 'Telah Selesai',
      value: stats.completed,
      sublabel: 'Tuntas Dikirim',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      borderAccent: 'border-emerald-100/60'
    },
    {
      id: 'stat-points',
      label: 'Total Poin Diperoleh',
      value: `${stats.earnedPoints} / ${stats.totalPoints}`,
      sublabel: 'Poin Tugas Siswa',
      icon: Award,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      borderAccent: 'border-purple-100/60'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" id="task-summary-stats-grid">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className={`bg-white rounded-xl p-4 sm:p-5 border ${item.borderAccent} shadow-2xs flex flex-col justify-between`}
            id={item.id}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-medium text-slate-500 line-clamp-1">{item.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${item.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                {item.value}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{item.sublabel}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
