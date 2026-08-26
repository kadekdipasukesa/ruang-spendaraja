import { Play, RotateCcw, ArrowUp, ArrowRight, ArrowDown, ArrowLeft, Trash2, HelpCircle, Check, AlertCircle } from 'lucide-react';

const DIR_ICONS = {
  UP: { icon: ArrowUp, label: 'Atas', short: '↑' },
  RIGHT: { icon: ArrowRight, label: 'Kanan', short: '→' },
  DOWN: { icon: ArrowDown, label: 'Bawah', short: '↓' },
  LEFT: { icon: ArrowLeft, label: 'Kiri', short: '←' },
};

export default function CommandPanel({
  commands,
  activeStep,
  isRunning,
  optimalSteps = 8,
  onAddCommand,
  onRemoveCommand,
  onClearCommands,
  onRunAlgorithm,
  onResetPlayer,
}) {
  const isOptimalCount = commands.length === optimalSteps;
  const isTooLong = commands.length > optimalSteps;

  return (
    <div className="flex flex-col justify-between p-3 sm:p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3 sm:space-y-4 h-full">
      {/* 1. Tombol Arah */}
      <div>
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
            1. Tambah Blok Arah:
          </span>
          <span className="text-[10px] sm:text-[11px] text-slate-400">
            Target Tercepat: <strong className="text-amber-400 font-mono font-bold">{optimalSteps} Langkah</strong>
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {Object.entries(DIR_ICONS).map(([dir, info]) => {
            const Icon = info.icon;
            return (
              <button
                key={dir}
                type="button"
                onClick={() => onAddCommand(dir)}
                disabled={isRunning || commands.length >= 40}
                className="p-2 sm:p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-slate-200 hover:text-amber-400 flex flex-col items-center justify-center gap-1 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                <span className="text-[10px] sm:text-[11px] font-bold leading-none">{info.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Urutan Blok Perintah yang Disusun */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
              2. Urutan Instruksi:
            </span>
            <span
              className={`px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-mono font-bold flex items-center gap-1 ${
                isOptimalCount
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : isTooLong
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {commands.length} / {optimalSteps}
              {isOptimalCount && <Check className="w-3 h-3 text-emerald-400" />}
              {isTooLong && <AlertCircle className="w-3 h-3 text-amber-400" />}
            </span>
          </div>

          {commands.length > 0 && (
            <button
              type="button"
              onClick={onClearCommands}
              disabled={isRunning}
              className="text-[10px] sm:text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline disabled:opacity-40 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> Hapus
            </button>
          )}
        </div>

        <div className="min-h-[70px] sm:min-h-[100px] max-h-[140px] sm:max-h-[180px] overflow-y-auto p-2 sm:p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap gap-1 sm:gap-1.5 items-center content-start">
          {commands.length === 0 ? (
            <div className="w-full text-center text-slate-500 text-[11px] sm:text-xs py-2 sm:py-4 flex flex-col items-center gap-1">
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 opacity-40" />
              <span>Tekan tombol arah di atas untuk menyusun {optimalSteps} langkah optimal.</span>
            </div>
          ) : (
            commands.map((cmd, idx) => {
              const info = DIR_ICONS[cmd] || { icon: ArrowUp, label: cmd };
              const Icon = info.icon;
              const isCurrentStep = activeStep === idx;

              return (
                <div
                  key={idx}
                  className={`group inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md border text-[10px] sm:text-xs font-bold transition select-none ${
                    isCurrentStep
                      ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105 shadow-md shadow-amber-500/20 ring-2 ring-amber-300'
                      : 'bg-slate-800/90 text-slate-200 border-slate-700/80'
                  }`}
                >
                  <span className="text-[9px] text-slate-400 font-mono">{idx + 1}.</span>
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">{cmd}</span>
                  {!isRunning && (
                    <button
                      type="button"
                      onClick={() => onRemoveCommand(idx)}
                      className="ml-0.5 text-slate-400 hover:text-rose-400 opacity-60 group-hover:opacity-100 transition cursor-pointer"
                      title="Hapus langkah"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1 sm:pt-2">
        <button
          type="button"
          onClick={onRunAlgorithm}
          disabled={isRunning || commands.length === 0}
          className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 sm:gap-2 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          id="btn-run-algo"
        >
          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
          <span>JALANKAN ROBOT</span>
        </button>
        <button
          type="button"
          onClick={onResetPlayer}
          disabled={isRunning}
          className="p-2.5 sm:p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition active:scale-95 disabled:opacity-40 cursor-pointer"
          title="Reset Posisi Robot"
          id="btn-reset-player"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}

