import { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, Hash, Code } from 'lucide-react';
import { ASCII_PRINTABLE_LIST } from '../binerAsciiData';

export default function AsciiTableExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('SEMUA');
  const [activeItem, setActiveItem] = useState(ASCII_PRINTABLE_LIST.find((i) => i.code === 97) || ASCII_PRINTABLE_LIST[0]);

  const categories = ['SEMUA', 'Huruf Kecil (a-z)', 'Huruf Besar (A-Z)', 'Angka (0-9)', 'Simbol'];

  const filteredList = useMemo(() => {
    return ASCII_PRINTABLE_LIST.filter((item) => {
      const matchCat = selectedCategory === 'SEMUA' || item.category === selectedCategory;
      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        !term ||
        item.char.toLowerCase().includes(term) ||
        String(item.code).includes(term) ||
        item.biner.includes(term);
      return matchCat && matchSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-cyan-400" />
            <span>Tabel ASCII Interaktif (Karakter 33 - 126)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Klik salah satu kotak karakter di bawah untuk melihat kode desimal dan bilangan binernya.
          </p>
        </div>

        {/* Input Pencarian */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari simbol, desimal, biner..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500 transition"
          />
        </div>
      </div>

      {/* Filter Kategori Chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Kartu Detail Karakter Aktif Terpilih */}
      {activeItem && (
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950/50 border border-indigo-500/30 rounded-xl p-3.5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-amber-300 font-mono font-black text-2xl flex items-center justify-center shadow-inner">
              {activeItem.char}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Karakter &lsquo;{activeItem.char}&rsquo;</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                  {activeItem.category}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs">
                <span className="text-slate-400">
                  Desimal: <strong className="text-amber-400 font-mono text-sm">{activeItem.code}</strong>
                </span>
                <span className="text-slate-400">
                  Biner: <strong className="text-cyan-400 font-mono text-sm">{activeItem.biner}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
            Rumus: {activeItem.code} = {activeItem.biner.split('').map((bit, idx) => {
              const weights = [128, 64, 32, 16, 8, 4, 2, 1];
              return bit === '1' ? weights[idx] : null;
            }).filter(Boolean).join(' + ')}
          </div>
        </div>
      )}

      {/* Grid Karakter */}
      <div className="max-h-60 overflow-y-auto p-2 bg-slate-900/60 rounded-xl border border-slate-800/80 grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-1.5">
        {filteredList.map((item) => {
          const isSelected = activeItem?.code === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => setActiveItem(item)}
              className={`p-2 rounded-lg border text-center transition flex flex-col items-center justify-center ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200 hover:bg-slate-800'
              }`}
              title={`Karakter: '${item.char}' | Desimal: ${item.code} | Biner: ${item.biner}`}
            >
              <span className="text-base font-bold font-mono leading-none">{item.char}</span>
              <span className="text-[9px] text-slate-500 font-mono mt-0.5">{item.code}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
