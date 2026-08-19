import {
  FolderPlus,
  FilePlus,
  Edit3,
  MoveRight,
  Trash2,
  LayoutGrid,
  List,
  Search,
  X
} from 'lucide-react';

export default function ExplorerToolbar({
  selectedItem,
  onOpenNewFolder,
  onOpenNewFile,
  onRename,
  onMove,
  onDelete,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  totalCurrentItems
}) {
  return (
    <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Action Buttons Group */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Create Folder */}
        <button
          type="button"
          onClick={onOpenNewFolder}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-2xs transition select-none"
          id="btn-toolbar-new-folder"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>Folder Baru</span>
        </button>

        {/* Create File */}
        <button
          type="button"
          onClick={onOpenNewFile}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-2xs transition select-none"
          id="btn-toolbar-new-file"
        >
          <FilePlus className="w-3.5 h-3.5 text-indigo-600" />
          <span>Berkas Baru</span>
        </button>

        {/* Action items if item selected */}
        {selectedItem && (
          <div className="flex items-center gap-1.5 pl-1 border-l border-slate-300">
            <button
              type="button"
              onClick={onRename}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition shadow-2xs"
              title="Ganti Nama Item"
              id="btn-toolbar-rename"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Ganti Nama</span>
            </button>

            <button
              type="button"
              onClick={onMove}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition shadow-2xs"
              title="Pindahkan ke Folder Lain"
              id="btn-toolbar-move"
            >
              <MoveRight className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Pindah</span>
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl transition shadow-2xs"
              title="Hapus Item"
              id="btn-toolbar-delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hapus</span>
            </button>
          </div>
        )}
      </div>

      {/* Search & View Mode Switcher */}
      <div className="flex items-center gap-2 justify-between md:justify-end">
        {/* Search in Current Folder */}
        <div className="relative flex-1 md:w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari di folder ini..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition ${
              viewMode === 'grid'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Tampilan Grid / Ikon Besar"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Tampilan Tabel / Rincian"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
