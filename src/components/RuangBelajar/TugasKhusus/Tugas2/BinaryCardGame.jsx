import { useState } from 'react';
import { Binary, CheckCircle2, MessageSquare, HelpCircle, Sparkles, BookOpen } from 'lucide-react';
import { useBinaryCardGame } from '../../../../hooks/RuangBelajar/TugasKhusus/Tugas2/useBinaryCardGame';
import RepresentationVisualizer from './binary/RepresentationVisualizer';
import RepresentationQuizPanel from './binary/RepresentationQuizPanel';
import M4LearningMaterial from './learning/M4LearningMaterial';

export default function BinaryCardGame({ onComplete, currentScore = 0 }) {
  const [showLearning, setShowLearning] = useState(true);

  const {
    activeSubTab,
    setActiveSubTab,
    examples,
    interactiveStates,
    handleToggleState,
    quizQuestions,
    quizAnswers,
    quizSubmitted,
    quizScoreResult,
    handleSelectQuizOption,
    handleSubmitQuiz,
    handleResetQuiz,
  } = useBinaryCardGame({ onComplete, currentScore });

  return (
    <div className="space-y-4">
      {/* If Learning Mode Active */}
      {showLearning ? (
        <M4LearningMaterial onStartPractice={() => setShowLearning(false)} />
      ) : (
        <div className="space-y-4">
          {/* Header Controls & Status */}
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Binary className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white">Praktik Representasi Data (Biner / Ya-Tidak)</h3>
                <p className="text-[10px] sm:text-[11px] text-slate-400">Eksplorasi pertanyaan 2 kemungkinan & uji kuis (20 Poin)</p>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-between sm:justify-end">
              {quizSubmitted ? (
                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Kuis Terkumpul ({currentScore || quizScoreResult * 4}/20 Poin)
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Target: 5 Soal Kuis (20 Poin)
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

          {/* Sub-Tabs: 1. Eksplorasi Cerita & Saklar Ya/Tidak, 2. Kuis Evaluasi */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveSubTab('simulasi')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeSubTab === 'simulasi'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>1. Eksplorasi Ya / Tidak</span>
            </button>

            <button
              onClick={() => setActiveSubTab('kuis')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeSubTab === 'kuis'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>2. Kuis Evaluasi (5 Soal)</span>
              {quizSubmitted && quizScoreResult >= 3 && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-950 shrink-0" />
              )}
            </button>
          </div>

          {/* SubTab Content */}
          {activeSubTab === 'simulasi' && (
            <RepresentationVisualizer
              examples={examples}
              interactiveStates={interactiveStates}
              onToggleState={handleToggleState}
            />
          )}

          {activeSubTab === 'kuis' && (
            <RepresentationQuizPanel
              questions={quizQuestions}
              answers={quizAnswers}
              submitted={quizSubmitted}
              scoreResult={quizScoreResult}
              onSelectOption={handleSelectQuizOption}
              onSubmitQuiz={handleSubmitQuiz}
              onResetQuiz={handleResetQuiz}
            />
          )}
        </div>
      )}
    </div>
  );
}
