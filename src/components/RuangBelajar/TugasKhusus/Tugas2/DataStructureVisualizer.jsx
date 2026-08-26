import { useState } from 'react';
import { Layers, CheckCircle2, ShoppingBag, HelpCircle, Sparkles, BookOpen } from 'lucide-react';
import { useDataStructureVisualizer } from '../../../../hooks/RuangBelajar/TugasKhusus/Tugas2/useDataStructureVisualizer';
import ListVisualizer from './data-structure/ListVisualizer';
import StructureQuizPanel from './data-structure/StructureQuizPanel';
import M3LearningMaterial from './learning/M3LearningMaterial';

export default function DataStructureVisualizer({ onComplete, currentScore = 0 }) {
  const [mainTab, setMainTab] = useState('practice'); // 'learning' | 'practice'

  const {
    activeSubTab,
    setActiveSubTab,
    listType,
    items,
    newItemName,
    setNewItemName,
    newItemCategory,
    setNewItemCategory,
    handleSwitchListType,
    handleAddItem,
    handleDeleteItem,
    actualSecretWord,
    userGuessWord,
    setUserGuessWord,
    guessFeedback,
    handleCheckSecretWord,
    quizQuestions,
    quizAnswers,
    quizSubmitted,
    quizScoreResult,
    handleSelectQuizOption,
    handleSubmitQuiz,
    handleResetQuiz,
  } = useDataStructureVisualizer({ onComplete, currentScore });

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
            id="subtab-m3-learning"
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
            id="subtab-m3-practice"
          >
            <Layers className="w-4 h-4" />
            <span>📝 Praktik & Kuis List (20 Poin)</span>
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
        <M3LearningMaterial onStartPractice={() => setMainTab('practice')} />
      ) : (
        <div className="space-y-5">
          {/* Sub-Tabs: 1. Simulasi List & Kata Rahasia, 2. Kuis Evaluasi */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveSubTab('simulasi')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeSubTab === 'simulasi'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>1. Simulasi Daftar & Kata Rahasia</span>
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
              <span>2. Kuis Struktur Data (5 Soal)</span>
              {quizSubmitted && quizScoreResult >= 3 && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              )}
            </button>
          </div>

          {/* SubTab Content */}
          {activeSubTab === 'simulasi' && (
            <ListVisualizer
              listType={listType}
              items={items}
              newItemName={newItemName}
              setNewItemName={setNewItemName}
              newItemCategory={newItemCategory}
              setNewItemCategory={setNewItemCategory}
              onSwitchListType={handleSwitchListType}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              actualSecretWord={actualSecretWord}
              userGuessWord={userGuessWord}
              setUserGuessWord={setUserGuessWord}
              guessFeedback={guessFeedback}
              onCheckSecretWord={handleCheckSecretWord}
              onGoToQuiz={() => setActiveSubTab('kuis')}
            />
          )}

          {activeSubTab === 'kuis' && (
            <StructureQuizPanel
              questions={quizQuestions}
              answers={quizAnswers}
              onSelectOption={handleSelectQuizOption}
              onSubmitQuiz={handleSubmitQuiz}
              onResetQuiz={handleResetQuiz}
              submitted={quizSubmitted}
              scoreResult={quizScoreResult}
              onBackToSimulation={() => setActiveSubTab('simulasi')}
            />
          )}
        </div>
      )}
    </div>
  );
}
