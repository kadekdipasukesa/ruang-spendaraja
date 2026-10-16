import { useState, useMemo } from 'react';
import { useRuangBelajarDB } from '../hooks/RuangBelajar/useRuangBelajarDB';
import RuangBelajarHeader from '../components/RuangBelajar/RuangBelajarHeader';
import TimelineTugas from '../components/RuangBelajar/TimelineTugas';
import LogScoreTugas from '../components/RuangBelajar/LogScoreTugas';
import LeaderboardKelas from '../components/RuangBelajar/LeaderboardKelas';
import ModalSubmitProyek from '../components/RuangBelajar/ModalSubmitProyek';
import TaskDetailModal from '../components/RuangBelajar/TaskDetailModal';
import AiCompanionBanner from '../components/RuangBelajar/AiCompanion/AiCompanionBanner';
import AiCompanionModal from '../components/RuangBelajar/AiCompanion/AiCompanionModal';
import AiFloatingButton from '../components/RuangBelajar/AiCompanion/AiFloatingButton';
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
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalTab, setAiModalTab] = useState('video'); // 'video' | 'chat'

  const handleOpenAiModal = (tab = 'video') => {
    setAiModalTab(tab);
    setIsAiModalOpen(true);
  };

  // Snapshot ringkasan status akademik siswa saat ini untuk AI Companion (Aurora & Arunika)
  const studentContext = useMemo(() => {
    if (!student) return null;

    const rawClass = student?.Kelas || student?.KELAS || '';
    const studentClassClean = rawClass.toString().replace(/^Kelas\s+/i, '').trim().toUpperCase();

    // Hitung posisi ranking kelas siswa saat ini dari leaderboard aktif
    const classList = (leaderboard || [])
      .filter((item) => {
        const itemPts = Number(item.total_points) || 0;
        if (itemPts <= 0) return false;
        const c = (item.Kelas || item.KELAS || '').toString().replace(/^Kelas\s+/i, '').trim().toUpperCase();
        return c === studentClassClean;
      })
      .sort((a, b) => Number(b.total_points || 0) - Number(a.total_points || 0));

    const myIndex = classList.findIndex(
      (item) => Number(item.id) === Number(student.id) || (item.NISN && item.NISN === student?.NISN)
    );
    const rank = myIndex !== -1 ? myIndex + 1 : null;

    // Filter tugas yang masih belum berstatus selesai/dinilai
    const pending = (tasks || [])
      .filter((t) => {
        const sub = (submissions || []).find((s) => s.tugas_id === t.id);
        const isDone = sub && (sub.status === 'sudah' || (sub.skor !== null && sub.skor !== undefined && sub.skor > 0));
        return !isDone;
      })
      .map((t) => t.judul || t.kode_tugas);

    return {
      name: student.NAMA || student.nama || 'Teman',
      kelas: student.Kelas || student.KELAS || 'Kelas 7',
      absen: student['No Absen'] || student.no_absen || '-',
      totalPoints: student.total_points || 0,
      rank,
      totalInClass: classList.length,
      completedTasksCount: stats?.completed ?? 0,
      totalTasksCount: stats?.total ?? 0,
      pendingTasks: pending.slice(0, 5),
      totalPelanggaran: student.total_pelanggaran || 0
    };
  }, [student, leaderboard, tasks, submissions, stats]);

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 space-y-6">
        {/* Top Header Card */}
        <RuangBelajarHeader
          student={student}
          stats={stats}
          isAdmin={isAdmin}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          leaderboard={leaderboard}
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
              <div className="space-y-6">
                {/* Banner AI Companion Aurora & Arunika */}
                <AiCompanionBanner onOpenModal={handleOpenAiModal} />

                {/* Timeline Roadmap Tugas */}
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
              </div>
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

      {/* Floating Action Button Teman Belajar AI Aurora & Arunika */}
      <AiFloatingButton onClick={() => handleOpenAiModal('chat')} />

      {/* Modal Dialog AI Companion (YouTube Shorts & Live Chat) */}
      <AiCompanionModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialTab={aiModalTab}
        studentName={student?.NAMA || student?.nama || 'Teman'}
        studentId={student?.id}
        studentContext={studentContext}
      />

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
