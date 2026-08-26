export default function BitCardList({
  bitCards,
  switches,
  onToggleSwitch,
  currentTotal,
  currentTarget,
  currentBinaryString,
}) {
  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      {/* 5 Bit Cards Switches */}
      <div className="grid grid-cols-5 gap-2 sm:gap-4 w-full max-w-xl">
        {bitCards.map((card, idx) => {
          const isActive = switches[idx];

          return (
            <button
              key={idx}
              onClick={() => onToggleSwitch(idx)}
              className={`p-3 sm:p-4 rounded-2xl border flex flex-col items-center justify-between gap-2 transition-all active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-b from-amber-500 to-orange-500 border-amber-300 text-slate-950 shadow-lg shadow-amber-500/30 scale-105'
                  : 'bg-slate-900 hover:bg-slate-800/80 border-slate-700 text-slate-400'
              }`}
            >
              <span className={`text-[10px] font-bold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                {card.power}
              </span>

              <div className="text-lg sm:text-2xl font-black">{card.label}</div>

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-sm shadow-inner ${
                  isActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {isActive ? '1' : '0'}
              </div>

              <span className={`text-[9px] font-bold uppercase ${isActive ? 'text-slate-950' : 'text-slate-500'}`}>
                {isActive ? 'HIDUP' : 'MATI'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Current Total & Binary Code Output */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Hasil Nilai Saklar</span>
          <span
            className={`text-2xl font-black ${
              currentTotal === currentTarget ? 'text-emerald-400' : 'text-slate-200'
            }`}
          >
            {currentTotal}
          </span>
        </div>

        <div className="h-8 w-px bg-slate-800 hidden sm:block" />

        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Kode Biner yang Dihasilkan</span>
          <span className="text-2xl font-mono font-black text-amber-400 tracking-widest">
            {currentBinaryString}₂
          </span>
        </div>
      </div>
    </div>
  );
}
