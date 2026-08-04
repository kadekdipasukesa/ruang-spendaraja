import React, { useState } from 'react';

export default function ModalSelesai({ isOpen, onClose, onConfirm }) {
  // State Checklist (default false/belum dicentang)
  const [checklists, setChecklists] = useState({
    elektronik: false,
    kebersihan: false,
    kerapian: false,
  });

  const [catatanKendala, setCatatanKendala] = useState('');

  if (!isOpen) return null;

  // Toggle handler untuk checkbox
  const handleCheckboxChange = (key) => {
    setChecklists((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = () => {
    // Format JSON yang akan disimpan ke cell "Kondisi Akhir Ruangan/Fasilitas"
    const dataKondisiAkhir = JSON.stringify({
      elektronik_dimatikan: checklists.elektronik,
      ruangan_dibersihkan: checklists.kebersihan,
      kursi_dirapikan: checklists.kerapian,
    });

    // Kirim data ke fungsi callback parent
    onConfirm({
      kondisi_akhir: dataKondisiAkhir,
      catatan_kendala: catatanKendala,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-2xl">
        <h4 className="text-base font-bold text-white mb-1">
          Laporan Akhir Penggunaan Lab
        </h4>
        <p className="text-xs text-slate-400 mb-4">
          Silakan konfirmasi kondisi ruangan sebelum mengakhiri sesi.
        </p>

        <div className="space-y-4 my-3">
          {/* Checklist Kondisi Akhir */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Checklist Pengembalian Lab
            </label>
            <div className="space-y-2 bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
              
              {/* Item 1 */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={checklists.elektronik}
                  onChange={() => handleCheckboxChange('elektronik')}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/40 w-4 h-4 cursor-pointer"
                />
                <span>
                  Komputer, laptop, IFP, AC, lampu, dan peralatan elektronik
                  lainnya sudah dimatikan.
                </span>
              </label>

              {/* Item 2 */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={checklists.kebersihan}
                  onChange={() => handleCheckboxChange('kebersihan')}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/40 w-4 h-4 cursor-pointer"
                />
                <span>Ruangan sudah dibersihkan dan disapu.</span>
              </label>

              {/* Item 3 */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={checklists.kerapian}
                  onChange={() => handleCheckboxChange('kerapian')}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/40 w-4 h-4 cursor-pointer"
                />
                <span>
                  Kursi dan meja telah dirapikan kembali ke posisi semula.
                </span>
              </label>
            </div>
          </div>

          {/* Catatan Kendala */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Catatan Kendala (Opsional)
            </label>
            <textarea
              value={catatanKendala}
              onChange={(e) => setCatatanKendala(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/60 h-20 transition-colors"
              placeholder="Misal: PC 04 Monitor mati, AC 2 kurang dingin"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-lg shadow-indigo-600/20"
          >
            Simpan Laporan Jurnal
          </button>
        </div>
      </div>
    </div>
  );
}