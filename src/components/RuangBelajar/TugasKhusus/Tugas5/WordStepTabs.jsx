import React from 'react';
import { BookOpen, CheckCircle2, FileEdit, UploadCloud, Lock } from 'lucide-react';
import { TUGAS_5_CONFIG } from '../../../../data/tugas5WordData';

export default function WordStepTabs({
  activeStage = 1,
  onChangeStage,
  scoreTahap1 = 0,
  scoreTahap2 = 0,
  scoreTahap3 = 0,
  completedTopicsCount = 0,
  totalTopicsCount = 7,
  quizSubmitted = false,
  hasUploadedFile = false,
}) {
  const isTahap1Complete = completedTopicsCount >= totalTopicsCount;
  const isTahap2Locked = !isTahap1Complete;
  const isTahap3Locked = !isTahap1Complete || !quizSubmitted;

  const steps = [
    {
      id: 1,
      title: "1. Panduan 7 Langkah Praktik",
      subtitle: `${completedTopicsCount}/${totalTopicsCount} Langkah Tuntas`,
      icon: BookOpen,
      points: `${scoreTahap1}/${TUGAS_5_CONFIG.poin_tahap1_materi} pt`,
      isComplete: isTahap1Complete,
      isLocked: false,
      color: "blue"
    },
    {
      id: 2,
      title: "2. Kuis Fitur Ms. Word",
      subtitle: isTahap2Locked
        ? `🔒 Selesaikan ${totalTopicsCount} Langkah Dulu`
        : quizSubmitted
        ? "Kuis Selesai"
        : "5 Soal Pemahaman",
      icon: isTahap2Locked ? Lock : FileEdit,
      points: `${scoreTahap2}/${TUGAS_5_CONFIG.poin_tahap2_kuis} pt`,
      isComplete: quizSubmitted,
      isLocked: isTahap2Locked,
      color: "indigo"
    },
    {
      id: 3,
      title: "3. Proyek Praktik & Upload Word",
      subtitle: isTahap3Locked
        ? !isTahap1Complete
          ? "🔒 Selesaikan Panduan Dulu"
          : "🔒 Selesaikan Kuis Dulu"
        : hasUploadedFile
        ? "Berkas .docx Terunggah"
        : "Upload Berkas .docx/.doc",
      icon: isTahap3Locked ? Lock : UploadCloud,
      points: `${scoreTahap3}/${TUGAS_5_CONFIG.poin_tahap3_proyek} pt`,
      isComplete: hasUploadedFile,
      isLocked: isTahap3Locked,
      color: "amber"
    }
  ];

  const handleStepClick = (step) => {
    if (step.id === 2 && isTahap2Locked) {
      alert(`⚠️ Tahap 2 (Kuis) masih terkunci!\n\nKamu baru menyelesaikan ${completedTopicsCount} dari ${totalTopicsCount} langkah materi. Selesaikan seluruh langkah dan jawab soal checkpoint di Tahap 1 terlebih dahulu.`);
      return;
    }
    if (step.id === 3 && isTahap3Locked) {
      if (!isTahap1Complete) {
        alert(`⚠️ Tahap 3 (Proyek) masih terkunci!\n\nSelesaikan seluruh ${totalTopicsCount} langkah panduan di Tahap 1 terlebih dahulu.`);
      } else {
        alert(`⚠️ Tahap 3 (Proyek) masih terkunci!\n\nSelesaikan dan kunci jawaban Kuis di Tahap 2 terlebih dahulu sebelum mengumpulkan proyek.`);
      }
      return;
    }
    onChangeStage(step.id);
  };

  return (
    <div className="w-full bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {steps.map((step) => {
          const isActive = activeStage === step.id;
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => handleStepClick(step)}
              className={`flex-1 min-w-[200px] sm:min-w-0 flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl border transition-all text-left ${
                step.isLocked
                  ? 'bg-slate-950/40 border-slate-850 opacity-65 cursor-not-allowed hover:border-slate-800'
                  : isActive
                  ? 'bg-slate-800/90 border-blue-500/60 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/30'
                  : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700/80 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition ${
                    step.isLocked
                      ? 'bg-slate-850 text-slate-500 border border-slate-800'
                      : step.isComplete
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {step.isComplete ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <span
                    className={`text-xs font-bold block truncate ${
                      step.isLocked
                        ? 'text-slate-500'
                        : isActive
                        ? 'text-white'
                        : 'text-slate-300'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span
                    className={`text-[10px] block truncate ${
                      step.isLocked ? 'text-amber-500/70 font-medium' : 'text-slate-400'
                    }`}
                  >
                    {step.subtitle}
                  </span>
                </div>
              </div>

              {/* Point Badge */}
              <div
                className={`px-2 py-0.5 rounded-lg text-[11px] font-black shrink-0 border ${
                  step.isLocked
                    ? 'bg-slate-900 text-slate-600 border-slate-800'
                    : step.isComplete
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                    : isActive
                    ? 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {step.points}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
