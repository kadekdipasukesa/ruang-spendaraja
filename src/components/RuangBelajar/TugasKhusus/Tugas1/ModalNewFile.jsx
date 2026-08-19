import { useState } from 'react';
import { FilePlus, X, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { FILE_TYPE_OPTIONS } from '../../../../hooks/RuangBelajar/TugasKhusus/Tugas1/missionsConfig';

export default function ModalNewFile({
  isOpen,
  onClose,
  onSubmit,
  currentFolderName
}) {
  const [selectedType, setSelectedType] = useState(FILE_TYPE_OPTIONS[0]);
  const [fileName, setFileName] = useState(FILE_TYPE_OPTIONS[0].defaultName);

  if (!isOpen) return null;

  const handleSelectPreset = (opt) => {
    setSelectedType(opt);
    setFileName(opt.defaultName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    onSubmit({
      fileName: fileName.trim(),
      fileType: selectedType.type,
      ext: selectedType.ext,
      size: selectedType.size
    });
  };

  const missionFileSuggestions = [
    { name: 'rangkuman_hardware.docx', opt: FILE_TYPE_OPTIONS[0] },
    { name: 'data_nilai_informatika.xlsx', opt: FILE_TYPE_OPTIONS[1] },
    { name: 'presentasi_jaringan.pptx', opt: FILE_TYPE_OPTIONS[2] },
    { name: 'panduan_praktik.pdf', opt: FILE_TYPE_OPTIONS[3] },
    { name: 'karakter_kucing.png', opt: FILE_TYPE_OPTIONS[5] },
    { name: 'suara_game.mp3', opt: FILE_TYPE_OPTIONS[6] },
    { name: 'game_labirin.sb3', opt: FILE_TYPE_OPTIONS[7] },
    { name: 'backup_minggu1.zip', opt: FILE_TYPE_OPTIONS[8] }
  ];

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
            <FilePlus className="w-4 h-4 text-indigo-600" />
            Buat Berkas / File Baru
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
          Lokasi penyimpanan:{' '}
          <strong className="text-slate-800">{currentFolderName || 'Drive Utama (C:)'}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pilih Format / Ekstensi Berkas:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-40 overflow-y-auto pr-1">
              {FILE_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.ext}
                  type="button"
                  onClick={() => handleSelectPreset(opt)}
                  className={`p-2 rounded-xl text-left border text-[11px] font-semibold transition ${
                    selectedType.ext === opt.ext
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold">{opt.ext}</div>
                  <div className="text-[10px] text-slate-400 font-normal truncate">{opt.label.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* File Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Berkas:
            </label>
            <input
              type="text"
              required
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder={`Contoh: ${selectedType.defaultName}`}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Mission File Suggestions */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Saran Target Misi:
            </span>
            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
              {missionFileSuggestions.map((m) => (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => {
                    setSelectedType(m.opt);
                    setFileName(m.name);
                  }}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                >
                  {m.name}
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
              Buat Berkas
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
