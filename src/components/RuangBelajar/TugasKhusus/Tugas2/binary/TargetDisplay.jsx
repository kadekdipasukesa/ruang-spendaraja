export default function TargetDisplay({
  targetNumbers,
  targetIdx,
  currentTarget,
  solvedTargets,
  currentTotal,
  currentBinaryString,
}) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center w-full">
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {targetNumbers.map((num, idx) => (
          <div
            key={idx}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
              solvedTargets.includes(num)
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : targetIdx === idx
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 scale-105'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            Tantangan #{idx + 1}: Target {num}
          </div>
        ))}
      </div>

      {/* Target Besar */}
      <div>
        <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block">
          Angka Desimal yang Harus Dibentuk:
        </span>
        <div className="text-4xl sm:text-5xl font-black text-amber-400 mt-1 tracking-tight">
          {currentTarget}
        </div>
      </div>
    </div>
  );
}
