import { useState } from 'react';
import { Zap, CheckCircle2, Sparkles, BookOpen, Layers, Target, ChevronRight, ArrowRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlgorithmMaze } from '../../../../hooks/RuangBelajar/TugasKhusus/Tugas2/useAlgorithmMaze';
import MazeGrid from './maze/MazeGrid';
import CommandPanel from './maze/CommandPanel';
import M1LearningMaterial from './learning/M1LearningMaterial';

export default function AlgorithmMaze({ onComplete, currentScore = 0 }) {
  // Default to learning material on initial load
  const [showLearning, setShowLearning] = useState(true);

  const {
    currentLevel,
    selectLevel,
    nextLevel,
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
    <div className="space-y-4">
      {/* If Learning Mode Active */}
      {showLearning ? (
        <M1LearningMaterial onStartPractice={() => setShowLearning(false)} />
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {/* Level Switcher & Header Controls */}
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1 mr-1">
                <Layers className="w-4 h-4" /> Level:
              </span>

              {/* Level 1: 4x4 */}
              <button
                type="button"
                onClick={() => selectLevel(1)}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  currentLevel === 1
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-amber-500/50'
                }`}
                id="btn-select-level-1"
              >
                <span>Lvl 1 (4x4)</span>
                {levelScores[1] > 0 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${currentLevel === 1 ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-slate-800 text-amber-300'}`}>
                  {levelScores[1] || 0}/15p
                </span>
              </button>

              {/* Level 2: 5x5 */}
              <button
                type="button"
                onClick={() => selectLevel(2)}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  currentLevel === 2
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-amber-500/50'
                }`}
                id="btn-select-level-2"
              >
                <span>Lvl 2 (5x5)</span>
                {levelScores[2] > 0 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${currentLevel === 2 ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-slate-800 text-amber-300'}`}>
                  {levelScores[2] || 0}/15p
                </span>
              </button>

              {/* Level 3: 10x10 */}
              <button
                type="button"
                onClick={() => selectLevel(3)}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  currentLevel === 3
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-amber-500/50'
                }`}
                id="btn-select-level-3"
              >
                <span>Lvl 3 (10x10)</span>
                {levelScores[3] > 0 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${currentLevel === 3 ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-slate-800 text-amber-300'}`}>
                  {levelScores[3] || 0}/20p
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 justify-between sm:justify-end">
              <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Skor Misi: {totalM1Score || currentScore || 0}/50 Poin
              </span>

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

          {/* Next Level Notification Banner (Appears when current level is solved) */}
          <AnimatePresence>
            {status === 'success' && currentLevel < 3 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-slate-900 border border-emerald-500/40 flex items-center justify-between gap-3 shadow-lg shadow-emerald-500/10"
              >
                <div className="flex items-center gap-2 text-xs text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Level {currentLevel} berhasil diselesaikan dengan {optimalSteps} langkah optimal (+{maxPoints} Poin)!
                  </span>
                </div>
                <button
                  type="button"
                  onClick={nextLevel}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer shrink-0"
                  id="btn-next-level"
                >
                  <span>Lanjut ke Level {currentLevel + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}

            {status === 'success' && currentLevel === 3 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-slate-900 border border-amber-500/40 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 text-xs text-amber-200">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Selamat!</strong> Semua 3 Level Labirin berhasil diselesaikan secara optimal (+50 Poin Penuh)!
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Maze Stage & Command Builder */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 items-start">
            {/* Kolom 1: Grid Labirin (Maze Stage) */}
            <div className="md:col-span-5 lg:col-span-5 flex justify-center">
              <MazeGrid
                mazeGrid={activeGrid}
                playerPos={playerPos}
                message={message}
                status={status}
              />
            </div>

            {/* Kolom 2: Command Builder & Controller */}
            <div className="md:col-span-7 lg:col-span-7">
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
