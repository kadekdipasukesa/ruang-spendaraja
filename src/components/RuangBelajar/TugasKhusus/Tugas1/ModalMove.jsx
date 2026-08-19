import { useState, useMemo } from 'react';
import { MoveRight, HardDrive, Folder, FolderOpen, ChevronRight, ChevronDown, X } from 'lucide-react';
import { motion } from 'framer-motion';

// Komponen Rekursif untuk Menampilkan Item Folder dalam Bentuk Tree (Pohon)
function FolderTreeNode({
  folder,
  folderMap,
  selectedFolderId,
  onSelectFolder,
  targetItemId,
  expandedFolders,
  toggleExpand,
  level = 0
}) {
  // Jangan tampilkan folder target itu sendiri (tidak bisa memindahkan folder ke dirinya sendiri)
  if (folder.id === targetItemId) return null;

  const children = folderMap[folder.id] || [];
  const isExpanded = expandedFolders[folder.id] ?? true; // Default terbuka
  const isSelected = selectedFolderId === folder.id;
  const hasChildren = children.length > 0;

  return (
    <div className="space-y-1">
      <div
        className={`group flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
          isSelected
            ? 'bg-indigo-50 border-indigo-500 text-indigo-950 ring-2 ring-indigo-500/20'
            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
        }`}
        style={{ marginLeft: `${level * 16}px` }}
        onClick={() => onSelectFolder(folder.id)}
      >
        <div className="flex items-center gap-2 min-w-0">
          {/* Tombol Toggle Expand / Collapse */}
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(folder.id);
              }}
              className="p-0.5 rounded hover:bg-slate-200 text-slate-500 transition"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <span className="w-3.5 h-3.5 inline-block" />
          )}

          {/* Ikon Folder */}
          {isSelected || isExpanded ? (
            <FolderOpen className="w-4 h-4 text-amber-500 fill-amber-400 flex-shrink-0" />
          ) : (
            <Folder className="w-4 h-4 text-amber-500 fill-amber-400 flex-shrink-0" />
          )}

          {/* Nama Folder */}
          <span className="truncate">{folder.name}</span>
        </div>

        {/* Indicator Dipilih */}
        {isSelected && (
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
            Dipilih
          </span>
        )}
      </div>

      {/* Render Subfolder (Child Nodes) secara Rekursif */}
      {hasChildren && isExpanded && (
        <div className="border-l-2 border-indigo-100/80 ml-3.5 pl-1 space-y-1">
          {children.map((child) => (
            <FolderTreeNode
              key={child.id}
              folder={child}
              folderMap={folderMap}
              selectedFolderId={selectedFolderId}
              onSelectFolder={onSelectFolder}
              targetItemId={targetItemId}
              expandedFolders={expandedFolders}
              toggleExpand={toggleExpand}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ModalMove({
  isOpen,
  targetItem,
  allFolders,
  onClose,
  onSubmit
}) {
  const [selectedFolderId, setSelectedFolderId] = useState('root');
  const [expandedFolders, setExpandedFolders] = useState({});

  // 1. Memetakan folder berdasarkan parentId untuk membentuk struktur Pohon (Tree)
  const { rootFolders, folderMap } = useMemo(() => {
    const map = {};
    const roots = [];

    // Filter folder agar targetItem dan anak-anaknya tidak muncul
    const validFolders = allFolders.filter((f) => {
      if (f.id === targetItem?.id) return false;
      return true;
    });

    validFolders.forEach((folder) => {
      const pId = folder.parentId || 'root';
      if (!map[pId]) map[pId] = [];
      map[pId].push(folder);
    });

    roots.push(...(map['root'] || []));

    return { rootFolders: roots, folderMap: map };
  }, [allFolders, targetItem]);

  if (!isOpen || !targetItem) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(targetItem, selectedFolderId);
  };

  const toggleExpand = (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <MoveRight className="w-4 h-4 text-indigo-600" />
            Pindahkan "{targetItem.name}"
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Pilih lokasi folder tujuan untuk memindahkan item ini:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {/* Root Drive Utama */}
            <div
              onClick={() => setSelectedFolderId('root')}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                selectedFolderId === 'root'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-950 ring-2 ring-indigo-500/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>Drive Utama (Root C:)</span>
              </div>
              {selectedFolderId === 'root' && (
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                  Dipilih
                </span>
              )}
            </div>

            {/* Tree Folder Bertingkat */}
            <div className="border-l-2 border-slate-200 ml-3 pl-1 space-y-1 pt-1">
              {rootFolders.map((folder) => (
                <FolderTreeNode
                  key={folder.id}
                  folder={folder}
                  folderMap={folderMap}
                  selectedFolderId={selectedFolderId}
                  onSelectFolder={setSelectedFolderId}
                  targetItemId={targetItem.id}
                  expandedFolders={expandedFolders}
                  toggleExpand={toggleExpand}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs transition"
            >
              Pindahkan Sekarang
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}