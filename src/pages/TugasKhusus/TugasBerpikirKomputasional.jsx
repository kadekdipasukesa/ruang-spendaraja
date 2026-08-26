import { useNavigate } from 'react-router-dom';
import { useTugasBKState } from '../../hooks/RuangBelajar/TugasKhusus/Tugas2/useTugasBKState';
import BKHeader from '../../components/RuangBelajar/TugasKhusus/Tugas2/BKHeader';
import BKMissionTabs from '../../components/RuangBelajar/TugasKhusus/Tugas2/BKMissionTabs';
import BKFooterNav from '../../components/RuangBelajar/TugasKhusus/Tugas2/BKFooterNav';
import AlgorithmMaze from '../../components/RuangBelajar/TugasKhusus/Tugas2/AlgorithmMaze';
import ScheduleOptimizer from '../../components/RuangBelajar/TugasKhusus/Tugas2/ScheduleOptimizer';
import DataStructureVisualizer from '../../components/RuangBelajar/TugasKhusus/Tugas2/DataStructureVisualizer';
import BinaryCardGame from '../../components/RuangBelajar/TugasKhusus/Tugas2/BinaryCardGame';
import ModalSubmissionSuccessBK from '../../components/RuangBelajar/TugasKhusus/Tugas2/ModalSubmissionSuccessBK';

export default function TugasBerpikirKomputasional() {
  const navigate = useNavigate();
  const {
    user,
    activeMission,
    setActiveMission,
    scores,
    completed,
    totalScore,
    isAllCompleted,
    submitting,
    submitted,
    existingSubmission,
    loading,
    showSuccessModal,
    setShowSuccessModal,
    handleOpenLogin,
    handleMissionComplete,
    handleResetAll,
    handleSubmitAll,
  } = useTugasBKState();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Memuat Modul Berpikir Komputasional...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 pt-20 sm:pt-24 selection:bg-amber-500 selection:text-slate-950">
      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 space-y-4 sm:space-y-5">
        {/* Unified Top Header Bar (Model SimulationTopBar & Amber Glow) */}
        <BKHeader
          user={user}
          totalScore={totalScore}
          submitted={submitted}
          submitting={submitting}
          previousSubmission={existingSubmission}
          onOpenLogin={handleOpenLogin}
          onResetAll={handleResetAll}
          onSubmitAll={handleSubmitAll}
        />

        {/* Step Navigation Tabs */}
        <BKMissionTabs
          activeMission={activeMission}
          setActiveMission={setActiveMission}
          scores={scores}
          completed={completed}
        />

        {/* Mission Container View with Amber Warm Glow Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl shadow-amber-500/5 text-slate-100">
          {activeMission === 1 && (
            <AlgorithmMaze
              currentScore={scores.m1}
              onComplete={(key, sc) => handleMissionComplete('m1', sc)}
            />
          )}
          {activeMission === 2 && (
            <ScheduleOptimizer
              currentScore={scores.m2}
              onComplete={(key, sc) => handleMissionComplete('m2', sc)}
            />
          )}
          {activeMission === 3 && (
            <DataStructureVisualizer
              currentScore={scores.m3}
              onComplete={(key, sc) => handleMissionComplete('m3', sc)}
            />
          )}
          {activeMission === 4 && (
            <BinaryCardGame
              currentScore={scores.m4}
              onComplete={(key, sc) => handleMissionComplete('m4', sc)}
            />
          )}
        </div>

        {/* Footer Guidance & Navigators */}
        <BKFooterNav
          activeMission={activeMission}
          setActiveMission={setActiveMission}
        />
      </main>

      {/* Success Modal on Submission */}
      <ModalSubmissionSuccessBK
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        totalScore={totalScore}
        scores={scores}
        student={user}
        onGoToRuangBelajar={() => navigate('/ruang-belajar')}
      />
    </div>
  );
}
