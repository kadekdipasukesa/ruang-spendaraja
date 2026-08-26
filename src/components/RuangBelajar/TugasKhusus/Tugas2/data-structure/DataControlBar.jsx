import { Plus, ArrowUp, ArrowDown, UserPlus, CheckCircle, Trash2, Sparkles } from 'lucide-react';

export default function DataControlBar({
  mode,
  presets,
  inputValue,
  setInputValue,
  message,
  onPushStack,
  onPopStack,
  onEnqueue,
  onDequeue,
  onInsertNode,
  onDeleteNode,
}) {
  return (
    <div className="space-y-4 pt-4 border-t border-slate-800">
      {/* Pilihan Cepat Alat Tulis Siswa */}
      <div>
        <span className="text-[11px] font-bold text-slate-400 block mb-2">
          ⚡ Pilihan Cepat Alat Tulis (Klik untuk langsung tambah/masukkan):
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {presets.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (mode === 'stack') onPushStack(item);
                else if (mode === 'queue') onEnqueue(item);
                else if (mode === 'linked_list') onInsertNode(item);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 transition-all flex items-center gap-1.5 text-xs text-slate-200 shrink-0 shadow-xs active:scale-95"
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Kustom & Tombol Operasi */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Atau ketik nama barang/siswa sendiri (opsional)..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
        />

        <div className="flex items-center gap-2 shrink-0">
          {mode === 'stack' && (
            <>
              <button
                onClick={() => onPushStack()}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <ArrowUp className="w-4 h-4" /> + PUSH (Tumpuk)
              </button>
              <button
                onClick={onPopStack}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <ArrowDown className="w-4 h-4" /> - POP (Ambil)
              </button>
            </>
          )}

          {mode === 'queue' && (
            <>
              <button
                onClick={() => onEnqueue()}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs transition shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <UserPlus className="w-4 h-4" /> + ENQUEUE (Antre)
              </button>
              <button
                onClick={onDequeue}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <CheckCircle className="w-4 h-4" /> DEQUEUE (Layani)
              </button>
            </>
          )}

          {mode === 'linked_list' && (
            <>
              <button
                onClick={() => onInsertNode()}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold text-xs transition shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Plus className="w-4 h-4" /> + INSERT NODE
              </button>
              <button
                onClick={() => onDeleteNode(0)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Trash2 className="w-4 h-4" /> Hapus Head
              </button>
            </>
          )}
        </div>
      </div>

      {/* Message Output */}
      {message && (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-amber-300 animate-in fade-in duration-200">
          {message}
        </div>
      )}
    </div>
  );
}
