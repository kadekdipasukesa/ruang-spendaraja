import React, { useState } from 'react';

export default function ModalReject({ isOpen, onClose, onConfirm }) {
  const [alasan, setAlasan] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full shadow-2xl">
        <h4 className="text-base font-bold text-white mb-1">Tolak Pengajuan</h4>
        <p className="text-xs text-slate-400 mb-3">Berikan alasan penolakan jadwal ini:</p>
        <textarea
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 mb-3 h-20"
          placeholder="Misal: Bentrok dengan jadwal Ujian Sekolah"
        />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer">
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(alasan);
              onClose();
            }}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Confirm Tolak
          </button>
        </div>
      </div>
    </div>
  );
}