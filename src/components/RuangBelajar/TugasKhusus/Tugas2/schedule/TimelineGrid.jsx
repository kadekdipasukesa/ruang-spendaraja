import { Clock, Plus, X, Layers, AlertCircle, ArrowRight } from 'lucide-react';

export default function TimelineGrid({
  slots,
  schedule,
  selectedTask,
  onPlaceTaskInSlot,
  onRemoveTask,
}) {
  return (
    <div className="p-4 sm:p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            2. Bagan Waktu (Timeline 07:00 - 13:00):
          </span>
          <span className="text-[11px] text-slate-400">
            Klik slot waktu di bawah untuk memasang kartu yang sedang dipilih.
          </span>
        </div>

        {selectedTask && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold animate-pulse">
            <span>Memasang: {selectedTask.name} ({selectedTask.duration} Jam)</span>
          </div>
        )}
      </div>

      {/* Header Kolom Jalur */}
      <div className="grid grid-cols-12 gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-bold text-slate-400">
        <div className="col-span-3 sm:col-span-2 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-amber-400" /> Jam
        </div>
        <div className="col-span-5 sm:col-span-6 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-blue-400" /> Jalur Utama (Sekuensial)
        </div>
        <div className="col-span-4 sm:col-span-4 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-amber-400" /> Jalur Paralel (Multitask)
        </div>
      </div>

      {/* Daftar Baris Slot Timeline */}
      <div className="space-y-2">
        {slots.map((slot, idx) => {
          const item = schedule[idx];
          const hasPrimary = Boolean(item.primary);
          const hasParallel = Boolean(item.parallel);

          // Cek apakah slot sebelumnya memiliki primary task yang sama (untuk multi-hour span indicator)
          const prevPrimary = idx > 0 ? schedule[idx - 1].primary : null;
          const isContinuationPrimary = hasPrimary && prevPrimary?.id === item.primary?.id;

          // Cek apakah slot ini cocok untuk dipasang selected task
          const canPlacePrimary =
            selectedTask &&
            !hasPrimary &&
            idx + selectedTask.duration <= slots.length &&
            !selectedTask.parallelWith;

          const canPlaceParallel =
            selectedTask &&
            selectedTask.id === 't3' &&
            !hasParallel &&
            hasPrimary &&
            item.primary.id === 't2';

          return (
            <div
              key={idx}
              className={`grid grid-cols-12 gap-2 p-2 sm:p-2.5 rounded-xl border transition-all items-center ${
                canPlacePrimary || canPlaceParallel
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-sm'
                  : 'bg-slate-900/70 border-slate-800/80'
              }`}
            >
              {/* Kolom Waktu */}
              <div className="col-span-3 sm:col-span-2 flex flex-col justify-center">
                <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-300">
                  {slot.start}
                </span>
                <span className="text-[9px] text-slate-500 font-mono">
                  s.d {slot.end}
                </span>
              </div>

              {/* Kolom Jalur Utama */}
              <div className="col-span-5 sm:col-span-6 min-h-[44px] flex items-center">
                {hasPrimary ? (
                  <div
                    className={`w-full p-2 rounded-lg bg-gradient-to-r ${item.primary.color} text-white flex items-center justify-between shadow-xs border ${
                      isContinuationPrimary ? 'border-t-0 rounded-t-none opacity-95' : 'border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs font-bold truncate">
                        {item.primary.name}
                      </span>
                      {item.primary.duration > 1 && (
                        <span className="text-[9px] bg-black/30 px-1.5 py-0.5 rounded font-mono shrink-0">
                          {isContinuationPrimary ? 'Jam ke-2' : 'Jam ke-1'}
                        </span>
                      )}
                    </div>

                    {!isContinuationPrimary && onRemoveTask && (
                      <button
                        onClick={() => onRemoveTask(item.primary.id)}
                        title="Hapus dari jadwal"
                        className="p-1 rounded hover:bg-black/30 text-white/80 hover:text-white transition shrink-0 ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => onPlaceTaskInSlot(idx, false)}
                    disabled={!canPlacePrimary}
                    className={`w-full h-full min-h-[40px] py-1.5 px-2.5 rounded-lg border border-dashed text-left flex items-center justify-between text-[11px] transition ${
                      canPlacePrimary
                        ? 'border-amber-500/70 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 font-bold cursor-pointer'
                        : 'border-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span className="truncate">
                      {canPlacePrimary
                        ? `+ Pasang di Jam ${slot.start}`
                        : '+ Kosong'}
                    </span>
                    {canPlacePrimary && <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />}
                  </button>
                )}
              </div>

              {/* Kolom Jalur Paralel */}
              <div className="col-span-4 sm:col-span-4 min-h-[44px] flex items-center">
                {hasParallel ? (
                  <div className="w-full p-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center justify-between shadow-xs border border-white/10">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-[11px] font-bold truncate">
                        {item.parallel.name}
                      </span>
                    </div>

                    {onRemoveTask && (
                      <button
                        onClick={() => onRemoveTask(item.parallel.id)}
                        title="Hapus dari jadwal paralel"
                        className="p-1 rounded hover:bg-black/30 text-white/80 hover:text-white transition shrink-0 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => onPlaceTaskInSlot(idx, true)}
                    disabled={!canPlaceParallel}
                    className={`w-full h-full min-h-[40px] py-1.5 px-2 rounded-lg border border-dashed text-center flex items-center justify-center text-[10px] transition ${
                      canPlaceParallel
                        ? 'border-orange-500 bg-orange-500/20 text-orange-200 hover:bg-orange-500/30 font-bold cursor-pointer animate-pulse'
                        : 'border-slate-800 text-slate-600 opacity-30 cursor-not-allowed'
                    }`}
                  >
                    <span className="truncate">
                      {canPlaceParallel ? '⚡ Pasang Paralel' : '-'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

