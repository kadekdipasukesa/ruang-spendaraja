import {
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  HardDrive,
  Folder,
  Sidebar,
  Menu
} from 'lucide-react';

export default function ExplorerBreadcrumb({
  breadcrumbs,
  currentFolderId,
  navigateToFolder,
  navigateBack,
  navigateForward,
  navigateUp,
  historyIndex,
  historyLength,
  totalItems,
  onToggleSidebar,
  isSidebarOpen
}) {
  return (
    <div className="px-3 sm:px-4 py-2 bg-slate-100/70 border-b border-slate-200/90 flex items-center justify-between gap-2 text-xs">
      {/* Navigation Buttons & Address Bar */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        {/* Mobile Sidebar Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className={`p-1.5 rounded-lg border transition lg:hidden ${
            isSidebarOpen
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
          title="Buka / Tutup Panel Direktori"
          id="btn-toggle-sidebar-mobile"
        >
          <Menu className="w-3.5 h-3.5" />
        </button>

        {/* Back / Forward / Up Controls */}
        <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={navigateBack}
            disabled={historyIndex <= 0}
            className="p-1 text-slate-600 hover:text-indigo-600 disabled:opacity-30 transition rounded"
            title="Kembali (Alt + Panah Kiri)"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={navigateForward}
            disabled={historyIndex >= historyLength - 1}
            className="p-1 text-slate-600 hover:text-indigo-600 disabled:opacity-30 transition rounded"
            title="Maju (Alt + Panah Kanan)"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={navigateUp}
            disabled={!currentFolderId}
            className="p-1 text-slate-600 hover:text-indigo-600 disabled:opacity-30 transition rounded"
            title="Naik Satu Folder"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Breadcrumb Path Bar */}
        <div className="flex-1 min-w-0 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 flex items-center gap-1 overflow-x-auto shadow-2xs">
          <HardDrive className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
          {breadcrumbs.map((crumb, idx, arr) => (
            <div key={crumb.id || 'root'} className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => navigateToFolder(crumb.id)}
                className={`hover:text-indigo-600 font-semibold transition px-1 py-0.5 rounded hover:bg-slate-100 ${
                  idx === arr.length - 1
                    ? 'text-slate-900 font-bold bg-slate-50'
                    : 'text-slate-500'
                }`}
              >
                {crumb.name}
              </button>
              {idx < arr.length - 1 && (
                <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Item Counter */}
      <div className="text-[11px] text-slate-500 font-semibold whitespace-nowrap hidden sm:block bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
        {totalItems} item
      </div>
    </div>
  );
}
