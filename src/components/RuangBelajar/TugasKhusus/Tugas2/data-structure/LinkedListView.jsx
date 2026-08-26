import { ArrowRight, Link, Trash2, Plus, ShoppingCart } from 'lucide-react';

export default function LinkedListView({ linkedList, onDeleteNode }) {
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="text-center space-y-1">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
          <ShoppingCart className="w-4 h-4" /> Daftar Rantai Belanjaan Alat Tulis (Linked List)
        </span>
        <p className="text-[11px] text-slate-400 max-w-lg">
          Setiap barang adalah <strong>Node</strong> yang memuat <strong>Data</strong> dan <strong>Pointer (Next)</strong> menunjuk barang berikutnya. Jika barang di tengah dibatalkan, pointer otomatis menyambung kembali!
        </p>
      </div>

      {/* Rantai Node Visualizer */}
      <div className="w-full p-4 sm:p-5 bg-gradient-to-b from-slate-950 to-slate-900 rounded-2xl border border-indigo-500/30 min-h-[220px] flex items-center justify-start overflow-x-auto">
        <div className="flex items-center gap-2.5 mx-auto p-2">
          {/* Node Kepala (HEAD) */}
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-center shrink-0">
            <span className="text-[9px] font-mono uppercase block font-bold">HEAD</span>
            <span className="text-[10px]">Awal Rantai</span>
          </div>

          <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0" />

          {linkedList.map((item, idx) => {
            const isHead = idx === 0;
            const isTail = idx === linkedList.length - 1;

            return (
              <div key={item.id || idx} className="flex items-center gap-2.5 shrink-0">
                {/* Node Box */}
                <div className="relative p-3.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-indigo-400 transition-all shadow-md min-w-[150px] group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      Node [{idx}] {isHead && '• Head'} {isTail && '• Tail'}
                    </span>
                    {onDeleteNode && (
                      <button
                        onClick={() => onDeleteNode(idx)}
                        title="Hapus / Batalkan barang ini dari rantai belanja"
                        className="text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-xl shrink-0">{item.icon || '🛍️'}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-200 truncate">{item.name}</div>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {item.tag || 'Item'}
                      </span>
                    </div>
                  </div>

                  {/* Pointer Footer */}
                  <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[9px] font-mono text-slate-500">
                    <span>Data: OK</span>
                    <span className="text-indigo-400 font-bold">
                      Next ➔ {idx < linkedList.length - 1 ? `[${idx + 1}]` : 'NULL'}
                    </span>
                  </div>
                </div>

                {/* Panah Pointer */}
                {idx < linkedList.length - 1 ? (
                  <div className="flex flex-col items-center shrink-0">
                    <ArrowRight className="w-5 h-5 text-indigo-400 animate-pulse" />
                    <span className="text-[8px] font-mono text-slate-500">pointer</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 font-mono text-xs font-bold">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>NULL</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
