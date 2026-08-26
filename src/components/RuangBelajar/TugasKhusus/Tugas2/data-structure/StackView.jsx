import { Layers, ArrowDown, ArrowUp, Sparkles, BookOpen } from 'lucide-react';

export default function StackView({ stack }) {
  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-lg">
      <div className="text-center space-y-1">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
          <BookOpen className="w-4 h-4" /> Tumpukan Buku & Alat Tulis di Meja Belajar
        </span>
        <p className="text-[11px] text-slate-400">
          Prinsip <strong>STACK (LIFO: Last In, First Out)</strong>: Barang yang ditaruh <strong>terakhir di puncak</strong> harus diambil <strong>paling pertama</strong>.
        </p>
      </div>

      {/* Wadah Tumpukan (Stack Container) */}
      <div className="w-full relative mt-2">
        {/* Indikator Puncak (TOP OF STACK) */}
        <div className="flex items-center justify-between px-3 py-1.5 mb-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <ArrowDown className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>PUNCAK TUMPUKAN (TOP)</span>
          </div>
          <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded font-mono">
            {stack.length} / 5 Barang
          </span>
        </div>

        <div className="w-full space-y-2 border-b-4 border-l-4 border-r-4 border-amber-500/40 p-3 rounded-b-2xl min-h-[220px] flex flex-col justify-end bg-gradient-to-b from-slate-950/60 to-slate-900/90 shadow-inner">
          {stack.length === 0 ? (
            <div className="text-center text-slate-500 text-xs py-12 flex flex-col items-center gap-2">
              <Layers className="w-8 h-8 opacity-40 text-amber-400" />
              <span>Meja kosong! Klik tombol <strong>&ldquo;+ PUSH&rdquo;</strong> di bawah untuk menumpuk alat tulis.</span>
            </div>
          ) : (
            stack.map((item, idx) => {
              const isTop = idx === 0;

              return (
                <div
                  key={item.id || idx}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between shadow-md ${
                    isTop
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-300 shadow-amber-500/20 scale-[1.02] font-bold'
                      : 'bg-slate-900/90 border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{item.icon || '📦'}</span>
                    <div>
                      <div className="text-xs font-bold">{item.name}</div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                          isTop
                            ? 'bg-slate-950/20 text-slate-950'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {item.tag || 'Alat Tulis'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    {isTop ? (
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-950 text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Siap Diambil (POP)
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">
                        Tingkat ke-{stack.length - idx}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* Dasar Meja */}
        <div className="h-2 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 rounded-full mt-1 opacity-80" />
        <span className="text-[9px] text-slate-500 font-mono text-center block mt-1">
          DASAR MEJA BELAJAR (BOTTOM OF STACK)
        </span>
      </div>
    </div>
  );
}
