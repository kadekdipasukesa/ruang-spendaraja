import { HardDrive, Info, CheckCircle2 } from 'lucide-react';

export default function ExplorerStatusBar({
  totalItems,
  selectedItem,
  currentFolderId,
  items
}) {
  const currentFolderName = currentFolderId
    ? items.find((i) => i.id === currentFolderId)?.name || 'Folder Aktif'
    : 'Drive Utama (C:)';

  return (
    <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 select-none">
      {/* Left: Item count & Selected info */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <span>
          <strong>{totalItems}</strong> item di <span className="text-slate-800 font-semibold">{currentFolderName}</span>
        </span>

        {selectedItem && (
          <span className="text-indigo-600 font-semibold border-l border-slate-300 pl-3">
            Dipilih: {selectedItem.name} ({selectedItem.type === 'folder' ? 'Folder' : selectedItem.size || 'Berkas'})
          </span>
        )}
      </div>

      {/* Right: Simulated Disk Space & Hint */}
      <div className="flex items-center gap-3 text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <HardDrive className="w-3 h-3 text-slate-400" />
          <span>Drive C: 42.8 GB Tersedia dari 120 GB</span>
        </div>
      </div>
    </div>
  );
}
