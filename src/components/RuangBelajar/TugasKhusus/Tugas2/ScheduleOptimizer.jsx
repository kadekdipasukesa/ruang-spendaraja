import { useState } from 'react';
import { Clock, CheckCircle2, Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import { useScheduleOptimizer } from '../../../../hooks/RuangBelajar/TugasKhusus/Tugas2/useScheduleOptimizer';
import TaskList from './schedule/TaskList';
import TimelineGrid from './schedule/TimelineGrid';
import M2LearningMaterial from './learning/M2LearningMaterial';

export default function ScheduleOptimizer({ onComplete, currentScore = 0 }) {
  const [showLearning, setShowLearning] = useState(true);

  const {
    tasks,
    slots,
    schedule,
    placedTaskIds,
    selectedTask,
    message,
    isSuccess,
    handleSelectTask,
    placeTaskInSlot,
    removeTask,
    resetSchedule,
  } = useScheduleOptimizer({ onComplete, currentScore });

  return (
    <div className="space-y-4">
      {/* If Learning Mode Active */}
      {showLearning ? (
        <M2LearningMaterial onStartPractice={() => setShowLearning(false)} />
      ) : (
        <div className="space-y-4">
          {/* Header Controls & Status */}
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white">Praktik Optimasi Jadwal (Gantt Chart)</h3>
                <p className="text-[10px] sm:text-[11px] text-slate-400">Susun 5 kegiatan agar selesai sebelum pukul 13:00</p>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-between sm:justify-end">
              {isSuccess || currentScore >= 10 ? (
                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Misi Selesai ({currentScore || 10}/10 Poin)
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Target: Selesai $\le$ 13:00 (10 Poin)
                </span>
              )}

              <button
                type="button"
                onClick={() => setShowLearning(true)}
                className="text-[11px] font-bold text-slate-400 hover:text-amber-300 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                title="Buka panduan materi"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Materi</span>
              </button>
            </div>
          </div>

          {/* Cerita Kasus Berpikir Komputasional */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-200">
                  Studi Kasus: &ldquo;Waktu Terbatas Hari Minggu&rdquo;
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Budi punya 5 kegiatan dengan total durasi <strong>7 Jam</strong>, tetapi waktu yang tersedia dari pukul <strong>07:00 s.d 13:00 hanya 6 Jam</strong>.
                  <br />
                  💡 <em>Kuncinya: Mesin cuci bekerja otomatis secara mandiri. Manfaatkan waktu tersebut untuk membaca buku di jalur paralel!</em>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end md:self-center">
              <div className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[8px] sm:text-[9px] text-slate-500 uppercase block font-bold">Total Waktu Tugas</span>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-rose-400">7 Jam (Tanpa Paralel)</span>
              </div>
              <div className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <span className="text-[8px] sm:text-[9px] text-emerald-400 uppercase block font-bold">Target Waktu Rencana</span>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-emerald-300">6 Jam (07:00 - 13:00)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Daftar Aktivitas yang Harus Dijadwalkan */}
            <div className="lg:col-span-5">
              <TaskList
                tasks={tasks}
                placedTaskIds={placedTaskIds}
                selectedTask={selectedTask}
                onSelectTask={handleSelectTask}
                onRemoveTask={removeTask}
                onResetSchedule={resetSchedule}
                message={message}
                isSuccess={isSuccess}
              />
            </div>

            {/* Timeline Slot Grid (Gantt Chart View) */}
            <div className="lg:col-span-7">
              <TimelineGrid
                slots={slots}
                schedule={schedule}
                selectedTask={selectedTask}
                onPlaceTaskInSlot={placeTaskInSlot}
                onRemoveTask={removeTask}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
