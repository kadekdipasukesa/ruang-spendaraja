import { useState } from 'react';
import { MoveRight, HardDrive, Folder, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ModalMove({
  isOpen,
  targetItem,
  allFolders,
  onClose,
  onSubmit
}) {
  const [selectedFolderId, setSelectedFolderId] = useState('root');

  if (!isOpen || !targetItem) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(targetItem, selectedFolderId);
  };

  // Filter out self and its children if target is folder
  const availableFolders = allFolders.filter((f) => f.id !== targetItem.id);

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
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {/* Root Drive */}
            <button
              type="button"
              onClick={() => setSelectedFolderId('root')}
              className={`w-full text-left p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition ${
                selectedFolderId === 'root'
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-950 ring-2 ring-indigo-500/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-4 h-4 text-indigo-600" />
                <span>Drive Utama (Root C:)</span>
              </div>
              {selectedFolderId === 'root' && (
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                  Dipilih
                </span>
              )}
            </button>

            {/* Folder List */}
            {availableFolders.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFolderId(f.id)}
                className={`w-full text-left p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition ${
                  selectedFolderId === f.id
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-950 ring-2 ring-indigo-500/20'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Folder className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span className="truncate">{f.name}</span>
                </div>
                {selectedFolderId === f.id && (
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                    Dipilih
                  </span>
                )}
              </button>
            ))}
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
