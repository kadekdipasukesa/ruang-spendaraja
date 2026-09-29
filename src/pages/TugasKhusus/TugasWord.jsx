import { useTugasWordState } from '../../hooks/RuangBelajar/TugasKhusus/Tugas5/useTugasWordState';
import WordHeader from '../../components/RuangBelajar/TugasKhusus/Tugas5/WordHeader';
import WordStepTabs from '../../components/RuangBelajar/TugasKhusus/Tugas5/WordStepTabs';
import MateriWordLiterasi from '../../components/RuangBelajar/TugasKhusus/Tugas5/Tahap1Literasi/MateriWordLiterasi';
import KuisMsWord from '../../components/RuangBelajar/TugasKhusus/Tugas5/Tahap2Kuis/KuisMsWord';
import ProyekBrosurHut from '../../components/RuangBelajar/TugasKhusus/Tugas5/Tahap3Proyek/ProyekBrosurHut';
import FormUploadCloudinaryTugas5 from '../../components/RuangBelajar/TugasKhusus/Tugas5/Tahap3Proyek/FormUploadCloudinaryTugas5';
import ModalSubmissionSuccessWord from '../../components/RuangBelajar/TugasKhusus/Tugas5/ModalSubmissionSuccessWord';
import { MATERI_TOPIK_WORD, TUGAS_5_CONFIG } from '../../data/tugas5WordData';

export default function TugasWord() {
  const {
    user,
    loading,
    activeStage,
    setActiveStage,
    // Tahap 1 Literasi
    activeTopicId,
    setActiveTopicId,
    completedTopicIds,
    readingSeconds,
    currentTopicSeconds,
    checkpointAnswers,
    checkpointFeedback,
    handleAnswerCheckpoint,
    handleVerifyCheckpoint,
    handleNextTopic,
    scoreTahap1,
    // Tahap 2 Kuis
    quizAnswers,
    quizSubmitted,
    handleAnswerQuiz,
    handleSubmitQuiz,
    scoreTahap2,
    // Tahap 3 Proyek & Cloudinary
    uploadedFileInfo,
    uploadProgress,
    isUploading,
    uploadError,
    studentNotes,
    setStudentNotes,
    handleUploadFile,
    handleRemoveUploadedFile,
    scoreTahap3,
    // Nilai & Submisi
    calculatedTotalScore,
    submitting,
    submitted,
    isFullyComplete,
    showSuccessModal,
    setShowSuccessModal,
    scoreProtectionNotice,
    toastMessage,
    clearToast,
    handleSubmitAll,
    handleOpenLogin,
  } = useTugasWordState();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-300">
          Memuat Tugas 5: Aplikasi Pengolah Kata...
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Menyinkronkan data pengerjaan & jawaban tersimpan dari database Supabase
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white pt-4 sm:pt-6 pb-16 relative">
      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
        {/* Header Tugas (Static Card, non-floating & responsive submit button) */}
        <WordHeader
          user={user}
          totalScore={calculatedTotalScore}
          maxPoints={TUGAS_5_CONFIG.poin_maksimal || 100}
          submitting={submitting}
          submitted={submitted}
          hasUploadedFile={Boolean(uploadedFileInfo?.secureUrl)}
          isFullyComplete={isFullyComplete}
          onSubmitAll={handleSubmitAll}
          onOpenLogin={handleOpenLogin}
        />

        {/* 3 Step Tabs Navigation */}
        <WordStepTabs
          activeStage={activeStage}
          onChangeStage={(stage) => setActiveStage(stage)}
          scoreTahap1={scoreTahap1}
          scoreTahap2={scoreTahap2}
          scoreTahap3={scoreTahap3}
          completedTopicsCount={completedTopicIds.length}
          totalTopicsCount={MATERI_TOPIK_WORD.length}
          quizSubmitted={quizSubmitted}
          hasUploadedFile={Boolean(uploadedFileInfo?.secureUrl)}
        />

        {/* TAHAP 1: PANDUAN 7 LANGKAH PRAKTIK */}
        {activeStage === 1 && (
          <MateriWordLiterasi
            activeTopicId={activeTopicId}
            setActiveTopicId={setActiveTopicId}
            completedTopicIds={completedTopicIds}
            readingSeconds={readingSeconds}
            currentTopicSeconds={currentTopicSeconds}
            checkpointAnswers={checkpointAnswers}
            checkpointFeedback={checkpointFeedback}
            onSelectAnswer={handleAnswerCheckpoint}
            onVerifyAnswer={handleVerifyCheckpoint}
            onNextTopic={handleNextTopic}
            onGoToStage2={() => setActiveStage(2)}
          />
        )}

        {/* TAHAP 2: KUIS FITUR TOOLBAR MS WORD */}
        {activeStage === 2 && (
          <KuisMsWord
            quizAnswers={quizAnswers}
            quizSubmitted={quizSubmitted}
            onSelectOption={handleAnswerQuiz}
            onSubmitQuiz={handleSubmitQuiz}
            scoreTahap2={scoreTahap2}
            onGoToStage3={() => setActiveStage(3)}
          />
        )}

        {/* TAHAP 3: PROYEK PRAKTIK MANDIRI & UPLOAD DOCX */}
        {activeStage === 3 && (
          <div className="space-y-8">
            <ProyekBrosurHut />
            <FormUploadCloudinaryTugas5
              user={user}
              uploadedFileInfo={uploadedFileInfo}
              uploadProgress={uploadProgress}
              isUploading={isUploading}
              uploadError={uploadError}
              studentNotes={studentNotes}
              onNotesChange={setStudentNotes}
              onUploadFile={handleUploadFile}
              onRemoveFile={handleRemoveUploadedFile}
              onSubmitAll={handleSubmitAll}
              submitting={submitting}
              submitted={submitted}
              scoreTahap3={scoreTahap3}
            />
          </div>
        )}
      </main>

      {/* Floating In-App Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[99999] max-w-md animate-fade-in">
          <div
            className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md transition-all ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/20'
                : toastMessage.type === 'warning'
                ? 'bg-amber-950/95 border-amber-500 text-amber-100 ring-2 ring-amber-500/20'
                : toastMessage.type === 'error'
                ? 'bg-rose-950/95 border-rose-500 text-rose-100 ring-2 ring-rose-500/20'
                : 'bg-slate-900/95 border-blue-500 text-blue-100 ring-2 ring-blue-500/20'
            }`}
          >
            <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
              {toastMessage.message}
            </div>
            <button
              type="button"
              onClick={clearToast}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <ModalSubmissionSuccessWord
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        totalScore={calculatedTotalScore}
        maxPoints={TUGAS_5_CONFIG.poin_maksimal || 100}
        scoreTahap1={scoreTahap1}
        scoreTahap2={scoreTahap2}
        scoreTahap3={scoreTahap3}
        fileUrl={uploadedFileInfo?.secureUrl}
        scoreProtectionNotice={scoreProtectionNotice}
      />
    </div>
  );
}
