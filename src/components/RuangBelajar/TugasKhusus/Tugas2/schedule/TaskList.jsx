import { CheckCircle2, RotateCcw, X, Plus, Info } from 'lucide-react';

export default function TaskList({
  tasks,
  placedTaskIds,
  selectedTask,
  onSelectTask,
  onRemoveTask,
  onResetSchedule,
  message,
  isSuccess,
}) {
  const totalTasks = tasks.length;
  const placedCount = placedTaskIds.length;

  return (
    <div className="p-4 sm:p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            1. Pilih Kartu Aktivitas:
          </span>
          <span className="text-[11px] text-slate-400">
            Terpasang: <strong className="text-amber-400 font-mono">{placedCount}/{totalTasks}</strong>
          </span>
        </div>

        {placedCount > 0 && (
          <button
            onClick={onResetSchedule}
            className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Jadwal
          </button>
        )}
      </div>

      {/* Daftar Kartu Aktivitas */}
      <div className="space-y-2.5">
        {tasks.map((task) => {
          const isPlaced = placedTaskIds.includes(task.id);
          const isSelected = selectedTask?.id === task.id;
          const Icon = task.icon;

          return (
            <div
              key={task.id}
              onClick={() => {
                if (!isPlaced) onSelectTask(task);
              }}
              className={`relative rounded-xl border transition-all p-3 select-none ${
                isPlaced
                  ? 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60'
                  : isSelected
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/25 scale-[1.02] cursor-pointer'
                  : 'bg-slate-900 hover:bg-slate-800/90 border-slate-700/80 text-slate-200 hover:border-slate-600 cursor-pointer shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-slate-950 text-amber-400'
                        : isPlaced
                        ? 'bg-slate-800 text-slate-500'
                        : task.bgLight
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <span>{task.name}</span>
                      {isPlaced && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>

                    <p
                      className={`text-[10px] mt-0.5 ${
                        isSelected ? 'text-slate-900 font-medium' : 'text-slate-400'
                      }`}
                    >
                      {task.desc}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                          isSelected
                            ? 'bg-slate-950/20 text-slate-950 border border-slate-950/30'
                            : 'bg-slate-800 text-amber-300 border border-slate-700'
                        }`}
                      >
                        ⏱️ Durasi: {task.duration} Jam
                      </span>

                      {task.canBeParallel && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-cyan-950 text-cyan-200'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          🔄 Mandiri / Otomatis
                        </span>
                      )}

                      {task.id === 't3' && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded animate-pulse ${
                            isSelected
                              ? 'bg-amber-950 text-amber-200'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          ⚡ Spesial: Bisa Paralel
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="shrink-0 flex items-center">
                  {isPlaced ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveTask(task.id);
                      }}
                      title="Lepas dari jadwal"
                      className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition flex items-center gap-0.5 text-[10px]"
                    >
                      <X className="w-3.5 h-3.5" /> Lepas
                    </button>
                  ) : (
                    <button
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 transition ${
                        isSelected
                          ? 'bg-slate-950 text-amber-400'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                      }`}
                    >
                      <Plus className="w-3 h-3" /> {isSelected ? 'Dipilih' : 'Pilih'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Petunjuk Komputasional */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-400">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300">Konsep Berpikir Komputasional:</strong>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Jika semua tugas dikerjakan sekuensial (satu per satu), total waktu butuh <strong>7 Jam</strong> (lewat jam 13:00). Gunakan <strong>teknik optimasi paralel</strong> untuk menyelesaikan semua tugas tepat dalam <strong>6 Jam</strong>!
          </p>
        </div>
      </div>

      {/* Status Pesan */}
      {message && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold border transition-all ${
            isSuccess
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10'
              : 'bg-amber-500/20 border-amber-500/30 text-amber-300'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

