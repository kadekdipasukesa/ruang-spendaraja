import { Trash2, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModalDelete({
  isOpen,
  targetItem,
  onClose,
  onConfirm
}) {
  if (!isOpen || !targetItem) return null;

  const isFolder = targetItem.type === 'folder';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4 relative"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Trash2 className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Hapus {isFolder ? 'Folder' : 'Berkas'}?
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong className="text-slate-800">"{targetItem.name}"</strong>
              {isFolder ? ' beserta seluruh berkas di dalamnya' : ''}? Tindakan ini akan menghapus item dari simulasi.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => onConfirm(targetItem)}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition"
              id="btn-confirm-delete-item"
            >
              Ya, Hapus
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
