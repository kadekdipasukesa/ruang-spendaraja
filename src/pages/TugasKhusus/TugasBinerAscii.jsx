import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTugasBinerState } from '../../hooks/RuangBelajar/TugasKhusus/Tugas4/useTugasBinerState';
import BinerHeader from '../../components/RuangBelajar/TugasKhusus/Tugas4/BinerHeader';
import BinerStepTabs from '../../components/RuangBelajar/TugasKhusus/Tugas4/BinerStepTabs';
import MateriBinerAscii from '../../components/RuangBelajar/TugasKhusus/Tugas4/Tahap1Materi/MateriBinerAscii';
import DesimalKeBinerQuiz from '../../components/RuangBelajar/TugasKhusus/Tugas4/Tahap2DesimalKeBiner/DesimalKeBinerQuiz';
import BinerKeDesimalQuiz from '../../components/RuangBelajar/TugasKhusus/Tugas4/Tahap3BinerKeDesimal/BinerKeDesimalQuiz';
import AsciiKeBinerQuiz from '../../components/RuangBelajar/TugasKhusus/Tugas4/Tahap4AsciiKeBiner/AsciiKeBinerQuiz';
import ModalSubmissionSuccessBiner from '../../components/RuangBelajar/TugasKhusus/Tugas4/ModalSubmissionSuccessBiner';

export default function TugasBinerAscii() {
  const navigate = useNavigate();
  const {
    user,
    loading,
    activeStage,
    setActiveStage,
    stage1Completed,
    stage2Questions,
    stage3Questions,
    stage4Questions,
    scores,
    totalScore,
    submitting,
    submitted,
    existingSubmission,
    showSuccessModal,
    setShowSuccessModal,
    handleOpenLogin,
    handleCompleteStage1,
    handleAnswerStage2,
    handleAnswerStage3,
    handleAnswerStage4,
    handleSubmitAll,
    handleResetAll
  } = useTugasBinerState();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4" />
        <h2 className="text-sm font-bold text-slate-300">Menyiapkan Laboratorium Biner & ASCII...</h2>
        <p className="text-xs text-slate-500 mt-1">Mengambil data pengerjaan dari database</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 selection:bg-amber-500 selection:text-slate-950">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* 1. Header Tugas */}
        <BinerHeader
          user={user}
          totalScore={totalScore}
          submitted={submitted}
          submitting={submitting}
          previousSubmission={existingSubmission}
          onOpenLogin={handleOpenLogin}
          onResetAll={handleResetAll}
          onSubmitAll={handleSubmitAll}
        />

        {/* 2. Navigasi Tab 4 Tahapan */}
        <BinerStepTabs
          activeStage={activeStage}
          setActiveStage={setActiveStage}
          stage1Completed={stage1Completed}
          scores={scores}
          stage2Questions={stage2Questions}
          stage3Questions={stage3Questions}
          stage4Questions={stage4Questions}
        />

        {/* 3. Konten Tahap Aktif */}
        <main>
          {activeStage === 1 && (
            <MateriBinerAscii
              onComplete={handleCompleteStage1}
              isAlreadyCompleted={stage1Completed}
            />
          )}

          {activeStage === 2 && (
            <DesimalKeBinerQuiz
              questions={stage2Questions}
              onAnswerQuestion={handleAnswerStage2}
              onNextStage={() => setActiveStage(3)}
              earnedScore={scores.stage2}
            />
          )}

          {activeStage === 3 && (
            <BinerKeDesimalQuiz
              questions={stage3Questions}
              onAnswerQuestion={handleAnswerStage3}
              onNextStage={() => setActiveStage(4)}
              earnedScore={scores.stage3}
            />
          )}

          {activeStage === 4 && (
            <AsciiKeBinerQuiz
              questions={stage4Questions}
              onAnswerQuestion={handleAnswerStage4}
              onSubmitTask={handleSubmitAll}
              submitting={submitting}
              earnedScore={scores.stage4}
              totalScore={totalScore}
            />
          )}
        </main>
      </div>

      {/* 4. Modal Sukses Pengumpulan */}
      <ModalSubmissionSuccessBiner
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
