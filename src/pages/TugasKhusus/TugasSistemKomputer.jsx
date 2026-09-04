import { useNavigate } from 'react-router-dom';
import { useTugasSKState } from '../../hooks/RuangBelajar/TugasKhusus/Tugas3/useTugasSKState';
import SKHeader from '../../components/RuangBelajar/TugasKhusus/Tugas3/SKHeader';
import SKMissionTabs from '../../components/RuangBelajar/TugasKhusus/Tugas3/SKMissionTabs';
import SKFooterNav from '../../components/RuangBelajar/TugasKhusus/Tugas3/SKFooterNav';
import HardwareExplorer from '../../components/RuangBelajar/TugasKhusus/Tugas3/Mission1Hardware/HardwareExplorer';
import DataAppPipeline from '../../components/RuangBelajar/TugasKhusus/Tugas3/Mission2DataApp/DataAppPipeline';
import DigitalToolbox from '../../components/RuangBelajar/TugasKhusus/Tugas3/Mission3DigitalTools/DigitalToolbox';
import DigitalEthicsDetective from '../../components/RuangBelajar/TugasKhusus/Tugas3/Mission4ImpactEthics/DigitalEthicsDetective';
import ModalSubmissionSuccessSK from '../../components/RuangBelajar/TugasKhusus/Tugas3/ModalSubmissionSuccessSK';

export default function TugasSistemKomputer() {
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
    submissionMeta,
    handleOpenLogin,
    handleMissionComplete,
    handleResetAll,
    handleSubmitAll,
  } = useTugasSKState();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium">Memuat Modul Sistem Komputer & TIK...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 pt-20 sm:pt-24 selection:bg-amber-500 selection:text-slate-950">
      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 space-y-4 sm:space-y-5">
        {/* Unified Top Header Bar */}
        <SKHeader
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
        <SKMissionTabs
          activeMission={activeMission}
          setActiveMission={setActiveMission}
          scores={scores}
          completed={completed}
        />

        {/* Mission Container View */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl shadow-amber-500/5 text-slate-100">
          {activeMission === 1 && (
            <HardwareExplorer
              currentScore={scores.m1}
              initialPlacements={existingSubmission?.detail_jawaban?.placements?.m1 || existingSubmission?.detail_jawaban?.missionData?.m1}
              onComplete={handleMissionComplete}
              onNextMission={() => setActiveMission(2)}
            />
          )}
          {activeMission === 2 && (
            <DataAppPipeline
              currentScore={scores.m2}
              initialPlacements={existingSubmission?.detail_jawaban?.placements?.m2 || existingSubmission?.detail_jawaban?.missionData?.m2}
              onComplete={handleMissionComplete}
              onNextMission={() => setActiveMission(3)}
            />
          )}
          {activeMission === 3 && (
            <DigitalToolbox
              currentScore={scores.m3}
              initialPlacements={existingSubmission?.detail_jawaban?.placements?.m3 || existingSubmission?.detail_jawaban?.missionData?.m3}
              onComplete={handleMissionComplete}
              onNextMission={() => setActiveMission(4)}
            />
          )}
          {activeMission === 4 && (
            <DigitalEthicsDetective
              currentScore={scores.m4}
              initialPlacements={existingSubmission?.detail_jawaban?.placements?.m4 || existingSubmission?.detail_jawaban?.missionData?.m4}
              onComplete={handleMissionComplete}
              onSubmitAll={handleSubmitAll}
              isSubmitting={submitting}
            />
          )}
        </div>

        {/* Footer Guidance & Navigators */}
        <SKFooterNav
          activeMission={activeMission}
          setActiveMission={setActiveMission}
        />
      </main>

      {/* Success Modal on Submission */}
      <ModalSubmissionSuccessSK
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        totalScore={totalScore}
        scores={scores}
        submissionMeta={submissionMeta}
        student={user}
        onGoToRuangBelajar={() => navigate('/ruang-belajar')}
      />
    </div>
  );
}
