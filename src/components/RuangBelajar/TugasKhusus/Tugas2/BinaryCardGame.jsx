import { useState } from 'react';
import { Binary, CheckCircle2, MessageSquare, HelpCircle, Sparkles, BookOpen } from 'lucide-react';
import { useBinaryCardGame } from '../../../../hooks/RuangBelajar/TugasKhusus/Tugas2/useBinaryCardGame';
import RepresentationVisualizer from './binary/RepresentationVisualizer';
import RepresentationQuizPanel from './binary/RepresentationQuizPanel';
import M4LearningMaterial from './learning/M4LearningMaterial';

export default function BinaryCardGame({ onComplete, currentScore = 0 }) {
  const [mainTab, setMainTab] = useState('practice'); // 'learning' | 'practice'

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
    <div className="space-y-5">
      {/* Top Tabs: Belajar Materi vs Praktik & Kuis */}
      <div className="flex items-center justify-between gap-3 flex-wrap p-2 rounded-2xl bg-slate-950/80 border border-slate-800">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setMainTab('learning')}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              mainTab === 'learning'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            id="subtab-m4-learning"
          >
            <BookOpen className="w-4 h-4" />
            <span>📖 Belajar Materi</span>
          </button>

          <button
            type="button"
            onClick={() => setMainTab('practice')}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              mainTab === 'practice'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            id="subtab-m4-practice"
          >
            <Binary className="w-4 h-4" />
            <span>💡 Praktik & Kuis Representasi (20 Poin)</span>
          </button>
        </div>

        <div className="flex items-center gap-2 pr-2">
          {quizSubmitted ? (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Kuis Terkumpul ({currentScore || quizScoreResult * 4} / 20 Poin)
            </span>
          ) : (
            <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Target: 5 Soal Kuis (20 Poin)
            </span>
          )}
        </div>
      </div>

      {/* Render Main Tab Content */}
      {mainTab === 'learning' ? (
        <M4LearningMaterial onStartPractice={() => setMainTab('practice')} />
      ) : (
        <div className="space-y-5">
          {/* Sub-Tabs: 1. Eksplorasi Cerita & Saklar Ya/Tidak, 2. Kuis Evaluasi */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveSubTab('simulasi')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeSubTab === 'simulasi'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>1. Simulasi Cerita & Saklar Ya/Tidak</span>
            </button>

            <button
              onClick={() => setActiveSubTab('kuis')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeSubTab === 'kuis'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>2. Kuis Representasi Data (5 Soal)</span>
              {quizSubmitted && quizScoreResult >= 3 && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
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
