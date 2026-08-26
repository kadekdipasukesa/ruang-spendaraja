import { HelpCircle, ToggleLeft, ToggleRight, Check, X, ArrowRight, MessageSquare, Sparkles } from 'lucide-react';

export default function RepresentationVisualizer({ examples, interactiveStates, onToggleState }) {
  return (
    <div className="space-y-6">
      {/* Pengantar Konsep Cerita */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 space-y-2">
        <h3 className="text-xs sm:text-sm font-bold text-purple-300 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> Konsep Pilihan dalam Kehidupan Sehari-hari
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Dalam kehidupan sehari-hari, kita sering dihadapkan pada banyak pilihan. Jika suatu keadaan hanya terdiri dari <strong>2 kemungkinan</strong>, maka jawabannya adalah <strong>&ldquo;Ya&rdquo;</strong> atau <strong>&ldquo;Tidak&rdquo;</strong> (Benar / Salah).
          <br />
          Sedangkan pertanyaan seperti <em>&ldquo;Apa warna kesukaanmu?&rdquo;</em> memiliki banyak kemungkinan, namun dapat diubah menjadi 2 kemungkinan dengan bertanya: <em>&ldquo;Apakah warna kesukaanmu adalah Biru?&rdquo;</em>.
        </p>
      </div>

      {/* Kartu Perbandingan Interaktif: Terbuka vs 2 Kemungkinan (Ya/Tidak) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {examples.map((item) => {
          const isYes = Boolean(interactiveStates[item.id]);

          return (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 transition-all space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Kasus: {item.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  Kondisi Nyata
                </span>
              </div>

              {/* Tipe 1: Pertanyaan Terbuka / Banyak Kemungkinan */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>A. Pertanyaan Terbuka</span>
                  <span className="text-amber-400 font-bold">Banyak Kemungkinan</span>
                </div>
                <p className="text-xs font-semibold text-slate-200">
                  &ldquo;{item.openQuestion}&rdquo;
                </p>
                <span className="text-[10px] text-slate-500 block">
                  👉 Jawaban: {item.openType}
                </span>
              </div>

              {/* Tipe 2: Pertanyaan Terstruktur 2 Kemungkinan (Ya / Tidak) */}
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-purple-300 font-mono">
                  <span>B. Pertanyaan Biner</span>
                  <span className="text-emerald-400 font-bold">Hanya 2 Kemungkinan (Ya / Tidak)</span>
                </div>
                <p className="text-xs font-bold text-white">
                  &ldquo;{item.binaryQuestion}&rdquo;
                </p>

                {/* Saklar Interaktif Ya / Tidak */}
                <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between">
                  <span className="text-[11px] text-slate-300">Pilih Kondisi Jawaban:</span>
                  <button
                    onClick={() => onToggleState(item.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-xs ${
                      isYes
                        ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                        : 'bg-rose-600 text-white shadow-rose-600/20'
                    }`}
                  >
                    {isYes ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>{isYes ? 'YA (Benar / 1)' : 'TIDAK (Salah / 0)'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
