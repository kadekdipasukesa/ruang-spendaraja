import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTugasBinerState } from '../../hooks/RuangBelajar/TugasKhusus/Tugas4/useTugasBinerState';
import BinerHeader from '../../components/RuangBelajar/TugasKhusus/Tugas4/BinerHeader';
import BinerStepTabs from '../../components/RuangBelajar/TugasKhusus/Tugas4/BinerStepTabs';
import MateriBinerAscii from '../../components/RuangBelajar/TugasKhusus/Tugas4/Tahap1Materi/MateriBinerAscii';
import DesimalKeBinerQuiz from '../../components/RuangBelajar/TugasKhusus/Tugas4/Tahap2DesimalKeBiner/DesimalKeBinerQuiz';
import BinerKeDesimalQuiz from '../../components/RuangBelajar/TugasKhusus/Tugas4/Tahap3BinerKeDesimal/BinerKeDesimalQuiz';
import AsciiKeBinerQuiz from '../../components/RuangBelajar/TugasKhusus/Tugas4/Tahap4AsciiKeBiner/AsciiKeBinerQuiz';
import FotoOrekOrekUpload from '../../components/RuangBelajar/TugasKhusus/Tugas4/Tahap5FotoOrekOrek/FotoOrekOrekUpload';
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
    uploadedPhotoInfo,
    scores,
    totalScore,
    submitting,
    savingDraft,
    submitted,
    existingSubmission,
    showSuccessModal,
    setShowSuccessModal,
    toastMessage,
    clearToast,
    handleOpenLogin,
    handleCompleteStage1,
    handleAnswerStage2,
    handleAnswerStage3,
    handleAnswerStage4,
    handleUploadPhoto,
    handleRemovePhoto,
    handleSaveProgress,
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
    <div className="min-h-screen bg-[#061022] text-slate-100 pb-20 pt-20 sm:pt-24 selection:bg-[#fbbf24] selection:text-slate-950">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#1d4ed8]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#fbbf24]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#38bdf8]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        {/* 1. Header Tugas */}
        <BinerHeader
          user={user}
          totalScore={totalScore}
          submitted={submitted}
          submitting={submitting}
          savingDraft={savingDraft}
          previousSubmission={existingSubmission}
          onOpenLogin={handleOpenLogin}
          onResetAll={handleResetAll}
          onSaveDraft={() => handleSaveProgress({ isManual: true })}
          onSubmitAll={handleSubmitAll}
        />

        {/* 2. Navigasi Tab 5 Tahapan */}
        <BinerStepTabs
          activeStage={activeStage}
          setActiveStage={setActiveStage}
          stage1Completed={stage1Completed}
          scores={scores}
          stage2Questions={stage2Questions}
          stage3Questions={stage3Questions}
          stage4Questions={stage4Questions}
          uploadedPhotoInfo={uploadedPhotoInfo}
        />

        {/* 3. Konten Tahap Aktif */}
        <main>
          {activeStage === 1 && (
            <MateriBinerAscii
              onComplete={handleCompleteStage1}
              isAlreadyCompleted={stage1Completed}
              isTaskCompleted={submitted || (existingSubmission?.skor >= 50) || totalScore >= 50}
              totalScore={totalScore}
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
              onNextStage={() => setActiveStage(5)}
              onSubmitTask={handleSubmitAll}
              submitting={submitting}
              earnedScore={scores.stage4}
              totalScore={totalScore}
            />
          )}

          {activeStage === 5 && (
            <FotoOrekOrekUpload
              uploadedPhotoInfo={uploadedPhotoInfo}
              onUploadPhoto={handleUploadPhoto}
              onRemovePhoto={handleRemovePhoto}
              onSubmitTask={handleSubmitAll}
              submitting={submitting}
              student={user}
              scores={scores}
              totalScore={totalScore}
            />
          )}
        </main>
      </div>

      {/* Floating In-App Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-full animate-bounce-short">
          <div
            className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-start gap-3 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/20'
                : toastMessage.type === 'warning'
                ? 'bg-amber-950/95 border-amber-500 text-amber-100 ring-2 ring-amber-500/20'
                : toastMessage.type === 'error'
                ? 'bg-rose-950/95 border-rose-500 text-rose-100 ring-2 ring-rose-500/20'
                : 'bg-slate-900/95 border-cyan-500 text-cyan-100 ring-2 ring-cyan-500/20'
            }`}
          >
            <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
              {toastMessage.message}
            </div>
            <button
              type="button"
              onClick={clearToast}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 4. Modal Sukses Pengumpulan */}
      <ModalSubmissionSuccessBiner
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        totalScore={totalScore}
        scores={scores}
        student={user}
        uploadedPhotoInfo={uploadedPhotoInfo}
        onGoToRuangBelajar={() => navigate('/ruang-belajar')}
      />
    </div>
  );
}
