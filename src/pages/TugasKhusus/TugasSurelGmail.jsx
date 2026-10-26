/**
 * src/pages/TugasKhusus/TugasSurelGmail.jsx
 * Halaman Utama Siswa - Tugas 6: Praktik Resmi Surel (Gmail)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { useTugasSurelState } from '../../hooks/RuangBelajar/TugasKhusus/Tugas6/useTugasSurelState';
import SurelHeader from '../../components/RuangBelajar/TugasKhusus/Tugas6/SurelHeader';
import SurelStepTabs from '../../components/RuangBelajar/TugasKhusus/Tugas6/SurelStepTabs';
import TahapWatchAndDoCard from '../../components/RuangBelajar/TugasKhusus/Tugas6/TahapWatchAndDoCard';
import ModalSubmissionSuccessSurel from '../../components/RuangBelajar/TugasKhusus/Tugas6/ModalSubmissionSuccessSurel';
import { TAHAPAN_TUGAS_6 } from '../../data/tugas6SurelData';

export default function TugasSurelGmail() {
  const navigate = useNavigate();
  const {
    user,
    loading,
    isAdmin,
    activeStage,
    setActiveStage,
    quizAnswers,
    handleAnswerQuiz,
    uploadedScreenshots,
    uploadingStage,
    uploadProgress,
    handleUploadScreenshot,
    handleDeleteScreenshot,
    completionStats,
    existingSubmission,
    submitting,
    showSuccessModal,
    setShowSuccessModal,
    toastMessage,
    handleSubmitAll,
  } = useTugasSurelState();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-300">Memuat Tugas 6: Praktik Surel Gmail...</p>
        <p className="text-xs text-slate-500 mt-1">Menyinkronkan data pengerjaan dari database Supabase</p>
      </div>
    );
  }

  const currentTahapData = TAHAPAN_TUGAS_6.find((t) => t.id === activeStage) || TAHAPAN_TUGAS_6[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pt-4 sm:pt-6 pb-20 relative selection:bg-rose-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[99999] bg-slate-900 border border-rose-500/40 text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-2xl shadow-2xl animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 space-y-6">
        {/* Shortcut Banner Khusus Admin */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-rose-950/60 to-amber-950/40 border border-rose-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Kamu Memiliki Hak Akses Admin
                </h4>
                <p className="text-[11px] text-slate-400">
                  Periksa dan beri nilai (ACC) pada kiriman tangkapan layar siswa di Galeri Penilaian.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/admin/review-tugas-6')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-950/40 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <span>Buka Galeri Penilaian</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Banner Status Menunggu Verifikasi */}
        {existingSubmission?.status === 'menunggu_verifikasi' && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="text-xs text-slate-300">
              <strong className="text-amber-300 block mb-0.5">Tugasmu Sudah Dikirim!</strong>
              Seluruh 3 screenshot pengerjaan Gmail-mu sudah berhasil disimpan dan sedang menunggu verifikasi/ACC dari Admin. Kamu masih bisa mengganti screenshot jika ada yang ingin diperbaiki sebelum dinilai.
            </div>
          </div>
        )}

        {/* Banner Status Perlu Revisi */}
        {existingSubmission?.status === 'revisi' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <strong className="text-red-300 block mb-0.5">Perlu Perbaikan (Revisi):</strong>
              {existingSubmission.catatan_guru || 'Tolong perbaiki screenshot pengerjaanmu sesuai petunjuk.'}
            </div>
          </div>
        )}

        {/* Header Tugas */}
        <SurelHeader
          user={user}
          existingSubmission={existingSubmission}
          completionStats={completionStats}
          submitting={submitting}
          onSubmitAll={handleSubmitAll}
        />

        {/* 3 Step Tabs Navigation */}
        <SurelStepTabs
          activeStage={activeStage}
          setActiveStage={setActiveStage}
          quizAnswers={quizAnswers}
          uploadedScreenshots={uploadedScreenshots}
        />

        {/* Active Stage Card: Watch and Do */}
        <TahapWatchAndDoCard
          tahap={currentTahapData}
          user={user}
          quizAnswer={quizAnswers[activeStage]}
          onAnswerQuiz={handleAnswerQuiz}
          uploadedScreenshot={uploadedScreenshots[activeStage]}
          uploading={uploadingStage === activeStage}
          uploadProgress={uploadProgress}
          onUploadScreenshot={handleUploadScreenshot}
          onDeleteScreenshot={handleDeleteScreenshot}
          onNextStage={() => setActiveStage((prev) => Math.min(3, prev + 1))}
          isLastStage={activeStage === 3}
        />
      </main>

      {/* Modal Sukses Pengumpulan */}
      <ModalSubmissionSuccessSurel
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
