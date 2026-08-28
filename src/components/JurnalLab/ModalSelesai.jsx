import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, FileEdit, ShieldCheck, Sparkles } from 'lucide-react';

export default function ModalSelesai({ isOpen, onClose, onConfirm, item }) {
  const [kondisiAwal, setKondisiAwal] = useState('Baik');
  const [checklists, setChecklists] = useState({
    elektronik: false,
    kebersihan: false,
    kerapian: false,
  });
  const [catatanKendala, setCatatanKendala] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasExistingJournal = Boolean(
    (item?.status_pengajuan === 'completed') ||
    (item?.kondisi_akhir && 
     String(item.kondisi_akhir).trim() !== '' && 
     String(item.kondisi_akhir).trim() !== '{}' &&
     String(item.kondisi_akhir).trim().toLowerCase() !== 'baik' &&
     String(item.kondisi_akhir).trim().toLowerCase() !== 'null')
  );

  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Parse existing data if available
    let initialChecklists = { elektronik: false, kebersihan: false, kerapian: false };
    if (item?.kondisi_akhir) {
      try {
        const parsed = typeof item.kondisi_akhir === 'string' 
          ? JSON.parse(item.kondisi_akhir) 
          : item.kondisi_akhir;

        if (parsed && typeof parsed === 'object') {
          initialChecklists = {
            elektronik: Boolean(parsed.elektronik_dimatikan),
            kebersihan: Boolean(parsed.ruangan_dibersihkan),
            kerapian: Boolean(parsed.kursi_dirapikan),
          };
        }
      } catch (e) {
        // format non-json fallback
      }
    }

    setChecklists(initialChecklists);
    setKondisiAwal(item?.kondisi_awal || 'Baik');
    setCatatanKendala(item?.catatan_kendala || '');

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, item]);

  if (!isOpen) return null;

  // Toggle handler untuk checkbox
  const handleCheckboxChange = (key) => {
    setChecklists((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    // Format JSON yang akan disimpan ke kolom kondisi_akhir
    const dataKondisiAkhir = JSON.stringify({
      elektronik_dimatikan: checklists.elektronik,
      ruangan_dibersihkan: checklists.kebersihan,
      kursi_dirapikan: checklists.kerapian,
    });

    try {
      await onConfirm({
        kondisi_awal: kondisiAwal || 'Baik',
        kondisi_akhir: dataKondisiAkhir,
        catatan_kendala: catatanKendala || '',
      });
      onClose();
    } catch (err) {
      console.error('Gagal menyimpan jurnal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[250] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-start justify-between gap-3 mb-4 sticky top-0 bg-slate-900/95 backdrop-blur-sm pt-1 pb-2 z-20 border-b border-slate-800/80">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              {hasExistingJournal ? (
                <>
                  <FileEdit className="w-5 h-5 text-indigo-400" />
                  Lihat / Edit Jurnal Lab
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Pengisian Jurnal Penggunaan Lab
                </>
              )}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Peminjam: <strong className="text-slate-200">{item?.guru_pengajar || '-'}</strong> ({item?.mata_pelajaran || 'Kegiatan'}, Kelas {item?.kelas || '-'})
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex-shrink-0 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Kondisi Awal Fasilitas */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 space-y-2">
            <label className="block text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Kondisi Awal Fasilitas / Ruangan Lab
            </label>
            <p className="text-[11px] text-slate-400">
              Kondisi perangkat dan kebersihan lab saat Anda pertama kali masuk/memulai kegiatan:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {[
                { label: 'Baik & Siap Pakai', val: 'Baik' },
                { label: 'Cukup Baik', val: 'Cukup Baik' },
                { label: 'Ada Kendala Awal', val: 'Ada Kerusakan/Kendala Awal' }
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setKondisiAwal(opt.val)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    kondisiAwal === opt.val
                      ? 'bg-cyan-950/50 border-cyan-500/80 text-cyan-200 font-bold shadow-sm'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Atau ketik keterangan kondisi awal lainnya..."
              value={kondisiAwal}
              onChange={(e) => setKondisiAwal(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 mt-2 transition-colors"
            />
          </div>

          {/* Checklist Kondisi Akhir Pengembalian */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Checklist Kondisi Akhir Pengembalian Lab
            </label>
            <div className="space-y-2.5 bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl">
              {/* Item 1 */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={checklists.elektronik}
                  onChange={() => handleCheckboxChange('elektronik')}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/40 w-4 h-4 cursor-pointer"
                />
                <span>
                  Komputer, laptop, IFP, AC, lampu, dan peralatan elektronik lainnya sudah <strong>dimatikan</strong>.
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
                <span>Ruangan sudah <strong>dibersihkan dan disapu</strong>.</span>
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
                  Kursi dan meja telah <strong>dirapikan kembali</strong> ke posisi semula.
                </span>
              </label>
            </div>
          </div>

          {/* Catatan Kendala */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Catatan Kendala / Kerusakan (Opsional)
            </label>
            <textarea
              rows="2"
              value={catatanKendala}
              onChange={(e) => setCatatanKendala(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Misal: PC 04 monitor berkedip, AC unit 2 kurang dingin..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium py-2.5 rounded-xl text-xs border border-slate-700 transition-colors cursor-pointer text-center"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              {isSubmitting 
                ? 'Menyimpan...' 
                : hasExistingJournal ? 'Perbarui Jurnal Lab' : 'Simpan Jurnal Lab'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
