import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { CATEGORIES } from '../../data/dummyTugas';

export default function TaskFilterBar({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  stats
}) {
  const tabs = [
    { id: 'semua', label: 'Semua Tugas', count: stats.total },
    { id: 'belum', label: 'Perlu Dikerjakan', count: stats.pending + stats.inProgress },
    { id: 'selesai', label: 'Selesai', count: stats.completed }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 mb-6 shadow-2xs space-y-4" id="task-filter-bar">
      {/* Top row: Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-lg overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
              id={`tab-filter-${tab.id}`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search input & Sort */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul tugas, materi..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder-slate-400 transition"
              id="input-search-tugas"
            />
          </div>

          <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-xs text-slate-600">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
              id="select-sort-tugas"
            >
              <option value="deadline">Deadline Terdekat</option>
              <option value="points">Poin Tertinggi</option>
              <option value="priority">Prioritas Utama</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bottom row: Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100 text-xs">
        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mr-1 flex-shrink-0">
          <Filter className="w-3 h-3" /> Topik:
        </span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-800'
            }`}
            id={`chip-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
