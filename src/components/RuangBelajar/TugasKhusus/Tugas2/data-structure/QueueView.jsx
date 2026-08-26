import { ArrowRight, ShoppingBag, Store, UserCheck, Users } from 'lucide-react';

export default function QueueView({ queue }) {
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="text-center space-y-1">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
          <Store className="w-4 h-4" /> Antrean Kasir Koperasi Sekolah Spendaraja
        </span>
        <p className="text-[11px] text-slate-400 max-w-lg">
          Prinsip <strong>QUEUE (FIFO: First In, First Out)</strong>: Siswa yang datang <strong>pertama (Front/Depan)</strong> dilayani kasir <strong>paling awal</strong>, siswa baru antre di belakang (Rear).
        </p>
      </div>

      {/* Area Visualisasi Antrean Kasir */}
      <div className="w-full p-4 sm:p-5 bg-gradient-to-b from-slate-950 to-slate-900 rounded-2xl border border-cyan-500/30 min-h-[220px] flex flex-col justify-center">
        {queue.length === 0 ? (
          <div className="text-center text-slate-500 text-xs py-10 flex flex-col items-center gap-2">
            <Users className="w-8 h-8 opacity-40 text-cyan-400" />
            <span>Kasir sedang senggang! Klik tombol <strong>&ldquo;+ ENQUEUE&rdquo;</strong> di bawah untuk memasukkan siswa ke antrean.</span>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center gap-3 overflow-x-auto p-2 justify-center">
            {/* Loket Kasir (Front) */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shrink-0 shadow-lg shadow-emerald-500/20 border border-emerald-400">
              <Store className="w-5 h-5" />
              <div>
                <div>Meja Kasir 🛒</div>
                <span className="text-[9px] text-emerald-100 font-mono">FRONT (Keluar)</span>
              </div>
            </div>

            <ArrowRight className="w-5 h-5 text-emerald-400 shrink-0 hidden lg:block" />

            {/* Deretan Siswa Berantre */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full p-1">
              {queue.map((item, idx) => {
                const isFront = idx === 0;

                return (
                  <div
                    key={item.id || idx}
                    className={`p-3 rounded-xl border transition-all flex flex-col gap-1.5 shrink-0 min-w-[140px] ${
                      isFront
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/20 font-bold scale-[1.03]'
                        : 'bg-slate-900/90 border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {item.buyer || `Siswa ${idx + 1}`}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          isFront
                            ? 'bg-slate-950 text-cyan-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-black/10">
                      <span className="text-base">{item.icon || '🛍️'}</span>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold truncate">{item.name}</div>
                        <span className={`text-[9px] ${isFront ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                          {item.tag || 'Beli Alat Tulis'}
                        </span>
                      </div>
                    </div>

                    {isFront && (
                      <div className="mt-1 text-[9px] bg-slate-950/20 text-slate-950 px-2 py-0.5 rounded text-center font-bold">
                        👉 Sedang Dilayani
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Indikator Belakang (Rear) */}
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 text-center shrink-0">
              <span className="text-[9px] font-mono block">REAR (Belakang)</span>
              <span className="text-[10px] text-cyan-400 font-bold">⬅️ Siswa Baru Masuk</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
