import { useState } from 'react';
import {
  HardDrive,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  FileText,
  FileImage,
  FileCode,
  Music,
  Trash2,
  Bookmark,
  Layers
} from 'lucide-react';

export default function ExplorerSidebar({
  items,
  currentFolderId,
  navigateToFolder,
  isSidebarOpen,
  onCloseMobileSidebar
}) {
  const [expandedFolders, setExpandedFolders] = useState({});

  // Toggle folder tree expansion
  const toggleExpand = (folderId, e) => {
    e.stopPropagation();
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  // Get children folders of a parent
  const getSubFolders = (parentId) => {
    return items.filter((it) => it.type === 'folder' && it.parentId === parentId);
  };

  // Count items inside a folder
  const getItemCount = (folderId) => {
    return items.filter((it) => it.parentId === folderId).length;
  };

  // Recursive folder tree item renderer
  const renderFolderNode = (folder, depth = 0) => {
    const isSelected = currentFolderId === folder.id;
    const subFolders = getSubFolders(folder.id);
    const hasSubFolders = subFolders.length > 0;
    const isExpanded = Boolean(expandedFolders[folder.id] ?? true);
    const count = getItemCount(folder.id);

    return (
      <div key={folder.id} className="select-none">
        <div
          onClick={() => {
            navigateToFolder(folder.id);
            if (window.innerWidth < 1024 && onCloseMobileSidebar) {
              onCloseMobileSidebar();
            }
          }}
          className={`flex items-center justify-between gap-1 py-1.5 px-2 rounded-xl text-xs font-medium cursor-pointer transition ${
            isSelected
              ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {hasSubFolders ? (
              <button
                type="button"
                onClick={(e) => toggleExpand(folder.id, e)}
                className="p-0.5 text-slate-400 hover:text-slate-700 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
            ) : (
              <span className="w-3.5 h-3.5 inline-block" />
            )}

            {isSelected || isExpanded ? (
              <FolderOpen className="w-3.5 h-3.5 text-amber-500 fill-amber-400 flex-shrink-0" />
            ) : (
              <Folder className="w-3.5 h-3.5 text-amber-500 fill-amber-300 flex-shrink-0" />
            )}

            <span className="truncate">{folder.name}</span>
          </div>

          <span className="text-[10px] text-slate-400 font-normal px-1">
            {count}
          </span>
        </div>

        {/* Render child subfolders */}
        {hasSubFolders && isExpanded && (
          <div className="space-y-0.5 mt-0.5">
            {subFolders.map((sub) => renderFolderNode(sub, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = getSubFolders(null);

  return (
    <div
      className={`bg-slate-50/90 border-r border-slate-200 flex flex-col transition-all duration-300 ${
        isSidebarOpen ? 'block' : 'hidden md:flex'
      } w-full md:w-56 lg:w-64 flex-shrink-0`}
    >
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          Pohon Direktori
        </span>
        <span className="text-[10px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
          {items.filter((i) => i.type === 'folder').length} Folder
        </span>
      </div>

      {/* Navigation Tree Container */}
      <div className="p-2.5 space-y-3 overflow-y-auto flex-1 max-h-[500px]">
        {/* Drive Utama C: Root Shortcut */}
        <div
          onClick={() => {
            navigateToFolder(null);
            if (window.innerWidth < 1024 && onCloseMobileSidebar) {
              onCloseMobileSidebar();
            }
          }}
          className={`flex items-center justify-between py-2 px-2.5 rounded-xl text-xs font-bold cursor-pointer transition ${
            currentFolderId === null
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-700 bg-white hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <HardDrive className={`w-4 h-4 ${currentFolderId === null ? 'text-white' : 'text-indigo-600'}`} />
            <span>Drive Utama (C:)</span>
          </div>
          <span className={`text-[10px] font-normal ${currentFolderId === null ? 'text-indigo-100' : 'text-slate-400'}`}>
            {items.filter((i) => i.parentId === null).length} item
          </span>
        </div>

        {/* Folders Tree Hierarchy */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
            Folder Anda
          </div>
          {rootFolders.length > 0 ? (
            <div className="space-y-0.5">
              {rootFolders.map((rf) => renderFolderNode(rf, 0))}
            </div>
          ) : (
            <div className="p-3 bg-white rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
              Belum ada folder di root. Buat folder pertama Anda!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
