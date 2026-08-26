import { useState } from 'react';
import { Zap, CheckCircle2, Sparkles, BookOpen, Layers, Target, ChevronRight } from 'lucide-react';
import { useAlgorithmMaze } from '../../../../hooks/RuangBelajar/TugasKhusus/Tugas2/useAlgorithmMaze';
import MazeGrid from './maze/MazeGrid';
import CommandPanel from './maze/CommandPanel';
import M1LearningMaterial from './learning/M1LearningMaterial';

export default function AlgorithmMaze({ onComplete, currentScore = 0 }) {
  const [activeSubTab, setActiveSubTab] = useState('practice'); // 'learning' | 'practice'

  const {
    currentLevel,
    selectLevel,
    levelScores,
    totalM1Score,
    activeGrid,
    optimalSteps,
    maxPoints,
    commands,
    playerPos,
    isRunning,
    status,
    activeStep,
    message,
    addCommand,
    removeCommand,
    clearCommands,
    runAlgorithm,
    resetPlayer,
  } = useAlgorithmMaze({ onComplete, currentScore });

  return (
    <div className="space-y-5">
      {/* Sub-Tabs: Belajar Materi vs Praktik Labirin */}
      <div className="flex items-center justify-between gap-3 flex-wrap p-2 rounded-2xl bg-slate-950/80 border border-slate-800">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('learning')}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'learning'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            id="subtab-m1-learning"
          >
            <BookOpen className="w-4 h-4" />
            <span>📖 Belajar Materi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('practice')}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeSubTab === 'practice'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            id="subtab-m1-practice"
          >
            <Zap className="w-4 h-4" />
            <span>🎮 Praktik Labirin (3 Level)</span>
          </button>
        </div>

        <div className="flex items-center gap-2 pr-2">
          <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Total Skor Misi 1: {totalM1Score || currentScore || 0} / 50 Poin
          </span>
        </div>
      </div>

      {/* Render Active Sub-Tab */}
      {activeSubTab === 'learning' ? (
        <M1LearningMaterial onStartPractice={() => setActiveSubTab('practice')} />
      ) : (
        <div className="space-y-5">
          {/* Level Switcher Bar */}
          <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-slate-950 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mr-1">
                <Layers className="w-4 h-4" /> Pilih Level:
              </span>

              {/* Level 1: 4x4 */}
              <button
                type="button"
                onClick={() => selectLevel(1)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  currentLevel === 1
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-amber-500/50'
                }`}
                id="btn-select-level-1"
              >
                <span>Level 1 (4x4)</span>
                {levelScores[1] > 0 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />}
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${currentLevel === 1 ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-300'}`}>
                  {levelScores[1] || 0}/15p
                </span>
              </button>

              {/* Level 2: 5x5 */}
              <button
                type="button"
                onClick={() => selectLevel(2)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  currentLevel === 2
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-amber-500/50'
                }`}
                id="btn-select-level-2"
              >
                <span>Level 2 (5x5)</span>
                {levelScores[2] > 0 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />}
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${currentLevel === 2 ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-300'}`}>
                  {levelScores[2] || 0}/15p
                </span>
              </button>

              {/* Level 3: 10x10 */}
              <button
                type="button"
                onClick={() => selectLevel(3)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  currentLevel === 3
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-amber-500/50'
                }`}
                id="btn-select-level-3"
              >
                <span>Level 3 (10x10)</span>
                {levelScores[3] > 0 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />}
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${currentLevel === 3 ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-300'}`}>
                  {levelScores[3] || 0}/20p
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                🎯 Target Level {currentLevel}: {optimalSteps} Langkah ({maxPoints} Poin)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Kolom 1: Grid Labirin (Maze Stage) */}
            <div className="lg:col-span-6">
              <MazeGrid
                mazeGrid={activeGrid}
                playerPos={playerPos}
                message={message}
                status={status}
              />
            </div>

            {/* Kolom 2: Command Builder & Controller */}
            <div className="lg:col-span-6">
              <CommandPanel
                commands={commands}
                activeStep={activeStep}
                isRunning={isRunning}
                optimalSteps={optimalSteps}
                onAddCommand={addCommand}
                onRemoveCommand={removeCommand}
                onClearCommands={clearCommands}
                onRunAlgorithm={runAlgorithm}
                onResetPlayer={resetPlayer}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
