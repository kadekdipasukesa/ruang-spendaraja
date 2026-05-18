import React from 'react';
import { ShieldAlert, X, Loader2, Save } from 'lucide-react';

export default function PreviewModal({ siswa, mapel, hasilPG, skorEssay, jawabanEssay, onClose, onConfirm, loading }) {
  const rataEssay = (Object.values(skorEssay).reduce((a, b) => Number(a) + Number(b), 0)) / Object.keys(skorEssay).length;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Kepala Modal */}
        <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-amber-500" size={20} />
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-800">Preview Data Kualifikasi</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Konten Utama */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Struktur Identitas</p>
            <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1 font-bold text-slate-700">
              <p>Nama Lengkap: <span className="text-slate-900 font-black">{siswa.NAMA}</span></p>
              <p>Ruang Kelas: <span className="text-slate-900 font-black">{siswa.Kelas}</span></p>
              <p>Mata Pelajaran: <span className="text-slate-900 font-black">{mapel}</span></p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rekap Akurasi Score</p>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="border border-slate-200/80 p-3.5 rounded-xl">
                <p className="text-[9px] font-black text-slate-400 uppercase">Nilai Pilihan Ganda</p>
                <p className="text-xl font-black text-slate-900 mt-1">{hasilPG.nilai.toFixed(0)}</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-0.5">({hasilPG.benar} Benar)</p>
              </div>
              <div className="border border-slate-200/80 p-3.5 rounded-xl">
                <p className="text-[9px] font-black text-slate-400 uppercase">Rata-Rata Essay</p>
                <p className="text-xl font-black text-slate-900 mt-1">{rataEssay.toFixed(0)}</p>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">({Object.keys(skorEssay).length} Butir Soal)</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 text-center">
            <p className="text-[10px] text-slate-400 font-medium italic">
              "Data akan tersimpan dalam 1 baris baris di Supabase dengan format JSON untuk optimasi space database."
            </p>
          </div>
        </div>

        {/* Kaki Tombol Aksi */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-white text-slate-700 font-black text-xs uppercase tracking-wider py-3.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-amber-500/10 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Konfirmasi & Simpan</>}
          </button>
        </div>

      </div>
    </div>
  );
}