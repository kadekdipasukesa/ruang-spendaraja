import { useState } from 'react';
import { useRuangBelajarDB } from '../hooks/RuangBelajar/useRuangBelajarDB';
import RuangBelajarHeader from '../components/RuangBelajar/RuangBelajarHeader';
import TimelineTugas from '../components/RuangBelajar/TimelineTugas';
import LogScoreTugas from '../components/RuangBelajar/LogScoreTugas';
import LeaderboardKelas from '../components/RuangBelajar/LeaderboardKelas';
import ModalSubmitProyek from '../components/RuangBelajar/ModalSubmitProyek';
import TaskDetailModal from '../components/RuangBelajar/TaskDetailModal';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function RuangBelajar() {
  const {
    student,
    isAdmin,
    tasks,
    submissions,
    stats,
    leaderboard,
    availableClasses,
    selectedClass,
    setSelectedClass,
    activeTab,
    setActiveTab,
    selectedTask,
    setSelectedTask,
    loading,
    toastMessage,
    handleSubmitTask,
    handleToggleTaskActive,
    handleUpdateTaskWeight,
    handleUpdateTaskDeadline,
    handleGradeSubmission
  } = useRuangBelajarDB();

  const [submitModalTask, setSubmitModalTask] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-32 sm:pb-36">
      {/* Toast Floating Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 space-y-6">
        {/* Top Header Card */}
        <RuangBelajarHeader
          student={student}
          stats={stats}
          isAdmin={isAdmin}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Loading Skeleton */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
            <p className="text-xs font-medium text-slate-600">Memuat alur tugas dan papan peringkat...</p>
          </div>
        ) : (
          /* Active Tab Content */
          <div className="transition-all">
            {activeTab === 'timeline' && (
              <TimelineTugas
                tasks={tasks}
                student={student}
                isAdmin={isAdmin}
                onOpenSubmitModal={(task) => setSubmitModalTask(task)}
                onToggleActive={handleToggleTaskActive}
                onUpdateWeight={handleUpdateTaskWeight}
                onUpdateDeadline={handleUpdateTaskDeadline}
                onSelectDetail={(task) => setSelectedTask(task)}
              />
            )}

            {activeTab === 'log_score' && (
              <LogScoreTugas
                submissions={submissions}
                tasks={tasks}
                student={student}
                isAdmin={isAdmin}
                onGradeSubmission={handleGradeSubmission}
              />
            )}

            {activeTab === 'leaderboard' && (
              <LeaderboardKelas
                leaderboard={leaderboard}
                availableClasses={availableClasses}
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
                student={student}
              />
            )}
          </div>
        )}
      </div>

      {/* Submission Modal for Project/Link tasks */}
      {submitModalTask && (
        <ModalSubmitProyek
          task={submitModalTask}
          onClose={() => setSubmitModalTask(null)}
          onSubmit={handleSubmitTask}
        />
      )}

      {/* Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onOpenSubmitModal={(t) => {
            setSelectedTask(null);
            setSubmitModalTask(t);
          }}
        />
      )}
    </div>
  );
}
