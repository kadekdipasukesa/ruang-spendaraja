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
        String(item.code).includes(term);
      return matchCat && matchSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="bg-[#071428] border-2 border-[#254b85] rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-cyan-400" />
            <span>Tabel Kode Desimal ASCII (Karakter 33 - 126)</span>
          </h3>
          <p className="text-xs text-slate-300">
            Klik salah satu kotak karakter di bawah untuk melihat nomor kode desimalnya.
          </p>
        </div>

        {/* Input Pencarian */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari karakter atau kode desimal..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#0a1931] border border-[#254b85] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#fbbf24] transition"
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
            className={`text-[11px] px-2.5 py-1 rounded-lg border font-bold transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#fbbf24] text-slate-950 border-[#fbbf24] shadow-xs'
                : 'bg-[#0a1931] text-slate-300 border-[#1e3a6d] hover:border-[#38bdf8] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Kartu Detail Karakter Aktif Terpilih */}
      {activeItem && (
        <div className="bg-gradient-to-r from-[#0b1e3a] to-[#12284c] border border-[#38bdf8]/40 rounded-xl p-3.5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#4f46e5]/30 border border-indigo-400/50 text-[#fbbf24] font-mono font-black text-2xl flex items-center justify-center shadow-inner">
              {activeItem.char}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Karakter &lsquo;{activeItem.char}&rsquo;</span>
                <span className="text-[10px] bg-[#071326] text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {activeItem.category}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs">
                <span className="text-slate-300">
                  Kode Desimal ASCII: <strong className="text-[#fbbf24] font-mono text-base">{activeItem.code}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 bg-[#071326] px-3 py-1.5 rounded-lg border border-slate-700 max-w-sm">
            💡 <span className="text-[#fbbf24] font-bold">Petunjuk Konversi:</span> Konversikan desimal <strong className="text-white font-mono">{activeItem.code}</strong> ke biner secara mandiri dengan metode bagi 2 atau tabel bobot bit!
          </div>
        </div>
      )}

      {/* Grid Karakter */}
      <div className="max-h-60 overflow-y-auto p-2 bg-[#051124] rounded-xl border border-[#1e3a6d] grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-1.5">
        {filteredList.map((item) => {
          const isSelected = activeItem?.code === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => setActiveItem(item)}
              className={`p-2 rounded-lg border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                isSelected
                  ? 'bg-[#fbbf24]/20 border-[#fbbf24] text-[#fbbf24] ring-1 ring-[#fbbf24]'
                  : 'bg-[#0a1931] border-[#1e3a6d] hover:border-[#38bdf8] text-slate-200 hover:bg-[#112548]'
              }`}
              title={`Karakter: '${item.char}' | Kode Desimal: ${item.code}`}
            >
              <span className="text-base font-bold font-mono leading-none">{item.char}</span>
              <span className="text-[9px] text-slate-400 font-mono mt-0.5">{item.code}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
