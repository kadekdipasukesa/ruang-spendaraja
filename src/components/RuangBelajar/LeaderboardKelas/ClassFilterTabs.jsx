export default function ClassFilterTabs({
  grade7Classes = [],
  selectedClass = 'SEMUA',
  onSelectClass
}) {
  return (
    <div className="relative">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {grade7Classes.map((cls) => {
          const isSelected = selectedClass === cls;
          return (
            <button
              key={cls}
              type="button"
              onClick={() => onSelectClass && onSelectClass(cls)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
              }`}
            >
              {cls === 'SEMUA' ? 'Semua Kelas 7' : `Kelas ${cls}`}
            </button>
          );
        })}
      </div>
    </div>
  );
}
