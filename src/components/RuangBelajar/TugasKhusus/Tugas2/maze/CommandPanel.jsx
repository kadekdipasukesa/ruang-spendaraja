import { Play, RotateCcw, ArrowUp, ArrowRight, ArrowDown, ArrowLeft, Trash2, HelpCircle, Check, AlertCircle } from 'lucide-react';

const DIR_ICONS = {
  UP: { icon: ArrowUp, label: 'Maju Atas' },
  RIGHT: { icon: ArrowRight, label: 'Maju Kanan' },
  DOWN: { icon: ArrowDown, label: 'Maju Bawah' },
  LEFT: { icon: ArrowLeft, label: 'Maju Kiri' },
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
    <div className="flex flex-col justify-between p-4 sm:p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4 h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            1. Pilih Blok Perintah Arah:
          </span>
          <span className="text-[11px] text-slate-400">
            Optimal: <strong className="text-amber-400 font-mono">{optimalSteps} Langkah</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(DIR_ICONS).map(([dir, info]) => {
            const Icon = info.icon;
            return (
              <button
                key={dir}
                onClick={() => onAddCommand(dir)}
                disabled={isRunning || commands.length >= 15}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-slate-200 hover:text-amber-400 flex flex-col items-center gap-1.5 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px] font-bold">{info.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Urutan Blok Perintah yang Disusun */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2. Urutan Langkah Robot:
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 ${
                isOptimalCount
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : isTooLong
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {commands.length} / {optimalSteps} Langkah
              {isOptimalCount && <Check className="w-3 h-3 text-emerald-400" />}
              {isTooLong && <AlertCircle className="w-3 h-3 text-amber-400" />}
            </span>
          </div>

          {commands.length > 0 && (
            <button
              onClick={onClearCommands}
              disabled={isRunning}
              className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" /> Hapus Semua
            </button>
          )}
        </div>

        <div className="min-h-[110px] p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap gap-2 items-center content-start">
          {commands.length === 0 ? (
            <div className="w-full text-center text-slate-500 text-xs py-4 flex flex-col items-center gap-1">
              <HelpCircle className="w-5 h-5 opacity-50" />
              <span>Belum ada perintah. Klik tombol arah di atas untuk menyusun jalur tercepat ({optimalSteps} langkah).</span>
            </div>
          ) : (
            commands.map((cmd, idx) => {
              const info = DIR_ICONS[cmd] || { icon: ArrowUp, label: cmd };
              const Icon = info.icon;
              const isCurrentStep = activeStep === idx;

              return (
                <div
                  key={idx}
                  className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
                    isCurrentStep
                      ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800/90 text-slate-200 border-slate-700'
                  }`}
                >
                  <span className="text-[10px] text-slate-400">{idx + 1}.</span>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cmd}</span>
                  {!isRunning && (
                    <button
                      onClick={() => onRemoveCommand(idx)}
                      className="ml-1 text-slate-400 hover:text-rose-400 opacity-60 group-hover:opacity-100 transition"
                      title="Hapus langkah ini"
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
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onRunAlgorithm}
          disabled={isRunning || commands.length === 0}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>JALANKAN ALGORITMA</span>
        </button>
        <button
          onClick={onResetPlayer}
          disabled={isRunning}
          className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition active:scale-95 disabled:opacity-40"
          title="Reset Robot ke Awal"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

