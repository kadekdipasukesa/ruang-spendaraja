import { useState } from 'react';
import { FolderPlus, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ModalNewFolder({
  isOpen,
  onClose,
  onSubmit,
  currentFolderName
}) {
  const [folderName, setFolderName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    onSubmit(folderName.trim());
    setFolderName('');
  };

  const suggestions = [
    'TUGAS_INFORMATIKA_7',
    '01_DOKUMEN',
    '02_GAMBAR',
    '03_PROYEK_SCRATCH',
    '04_AUDIO_VIDEO',
    'MATERI',
    'TUGAS_HARIAN',
    'ASSET_SPRITE',
    'DIAGRAM',
    'BACKUP'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <FolderPlus className="w-4 h-4 text-indigo-600" />
            Buat Folder Baru
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
          Lokasi pembuatan:{' '}
          <strong className="text-slate-800">{currentFolderName || 'Drive Utama (C:)'}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Folder:
            </label>
            <input
              type="text"
              autoFocus
              required
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Contoh: TUGAS_INFORMATIKA_7"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Quick Suggestions Pills */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Saran Nama Misi:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {suggestions.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setFolderName(sug)}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition"
                >
                  {sug}
                </button>
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
              Buat Folder
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
