import { Flag, Bot, AlertTriangle, Frown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MazeGrid({ mazeGrid, playerPos, message, status }) {
  const rows = mazeGrid.length;
  const cols = mazeGrid[0]?.length || rows;
  const isLargeGrid = rows >= 10;
  const isFailed = status === 'failed' || status === 'suboptimal';
  const isSuccess = status === 'success';

  return (
    <div className="flex flex-col items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2.5">
      {/* Dynamic Square Grid with Amber/Slate Styling & Mobile Scaled Sizing */}
      <div
        className={`grid gap-0.5 sm:gap-1.5 w-full mx-auto p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner select-none transition-all ${
          isLargeGrid
            ? 'max-w-[260px] sm:max-w-[340px] md:max-w-[400px] aspect-square'
            : rows === 4
            ? 'max-w-[200px] sm:max-w-[260px] md:max-w-[300px] aspect-square'
            : 'max-w-[220px] sm:max-w-[290px] md:max-w-[340px] aspect-square'
        }`}
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
        }}
      >
        {mazeGrid.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const isPlayerHere = playerPos.r === rIdx && playerPos.c === cIdx;
            const isWall = cell === 1;
            const isFinish = cell === 'F';
            const isStart = cell === 'S';

            return (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`relative aspect-square w-full h-full rounded sm:rounded-lg flex items-center justify-center font-bold transition-all overflow-hidden ${
                  isWall
                    ? 'bg-amber-950/80 border border-amber-900/80 shadow-inner'
                    : isFinish
                    ? 'bg-emerald-950/90 border border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/20'
                    : isStart
                    ? 'bg-blue-950/70 border border-blue-500/50 text-blue-400'
                    : 'bg-slate-900/90 border border-slate-800/90'
                }`}
              >
                {/* Visual Gambar Tembok Bata */}
                {isWall && (
                  <div className="absolute inset-0 p-0.5 flex flex-col justify-between bg-gradient-to-b from-amber-950/90 via-orange-950/80 to-amber-950/95">
                    {/* Layer Baris Bata 1 */}
                    <div className="flex gap-0.5 h-[28%]">
                      <div className="flex-1 bg-amber-700/80 rounded-[1px] border-b border-r border-amber-900" />
                      <div className="w-[40%] bg-amber-800/90 rounded-[1px] border-b border-amber-900" />
                    </div>
                    {/* Layer Baris Bata 2 */}
                    <div className="flex gap-0.5 h-[28%]">
                      <div className="w-[38%] bg-amber-800/90 rounded-[1px] border-b border-r border-amber-900" />
                      <div className="flex-1 bg-amber-700/80 rounded-[1px] border-b border-amber-900" />
                    </div>
                    {/* Layer Baris Bata 3 */}
                    <div className="flex gap-0.5 h-[28%]">
                      <div className="flex-1 bg-amber-700/80 rounded-[1px] border-b border-r border-amber-900" />
                      <div className="w-[42%] bg-amber-800/90 rounded-[1px] border-b border-amber-900" />
                    </div>
                  </div>
                )}

                {/* Indikator Start */}
                {isStart && !isPlayerHere && (
                  <div className="flex flex-col items-center justify-center">
                    <span className={`${isLargeGrid ? 'text-[7px]' : 'text-[9px]'} font-black tracking-wider text-blue-400 leading-none`}>
                      S
                    </span>
                  </div>
                )}

                {/* Indikator Finish */}
                {isFinish && !isPlayerHere && (
                  <div className="flex flex-col items-center justify-center">
                    <Flag className={`${isLargeGrid ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'} text-emerald-400 fill-emerald-400/20 animate-bounce`} />
                  </div>
                )}

                {/* Robot Avatar */}
                {isPlayerHere && (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={`absolute inset-0 m-0.5 rounded sm:rounded-md flex items-center justify-center text-slate-950 z-10 transition-all ${
                      isFailed
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/50'
                        : isSuccess
                        ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/50'
                        : 'bg-gradient-to-tr from-amber-400 to-orange-400 shadow-lg shadow-amber-500/50'
                    }`}
                  >
                    {isFailed ? (
                      <span className="text-[10px] sm:text-xs">😢</span>
                    ) : (
                      <Bot className={`${isLargeGrid ? 'w-3 h-3' : 'w-4 h-4 sm:w-5 sm:h-5'}`} />
                    )}
                  </motion.div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Grid Legend */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-4 text-[9px] sm:text-[10px] text-slate-400 font-medium flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-blue-950 border border-blue-500/50" />
          <span>Start (S)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-amber-950/80 border border-amber-800/80" />
          <span>Tembok Bata</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-emerald-950 border border-emerald-500" />
          <span>Finish (F)</span>
        </div>
      </div>

      {/* Feedback Message with Emoji Animations */}
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`p-2.5 sm:p-3 rounded-xl text-xs font-semibold w-full text-center border transition-all flex items-center justify-center gap-2 ${
              isSuccess
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10'
                : status === 'suboptimal'
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                : status === 'failed'
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : 'bg-blue-500/20 border-blue-500/40 text-blue-300'
            }`}
          >
            {isFailed && <span className="text-base animate-bounce">🥺</span>}
            {isSuccess && <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />}
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
