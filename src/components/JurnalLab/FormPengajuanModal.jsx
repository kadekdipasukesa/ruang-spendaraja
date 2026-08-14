import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, BookOpen, User, Users, AlignLeft } from 'lucide-react';

export default function FormPengajuanModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  selectedLab,
  editData = null 
}) {
  const getInitialState = () => ({
    tanggal: new Date().toISOString().split('T')[0],
    jam_mulai: '07:30',
    jam_selesai: '09:00',
    guru_pengajar: '',
    mata_pelajaran: '',
    kelas: '',
    jumlah_siswa: 32,
    kategori_kegiatan: 'KBM',
    materi_kegiatan: '',
    kondisi_awal: 'Baik'
  });

  const [formData, setFormData] = useState(getInitialState);
  const [loading, setLoading] = useState(false);

  const parseIsoDateTime = (isoString) => {
    if (!isoString) return { date: '', time: '' };
    const dateObj = new Date(isoString);
    if (isNaN(dateObj.getTime())) return { date: '', time: '' };

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    return {
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`
    };
  };

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        const start = parseIsoDateTime(editData.waktu_mulai);
        const end = parseIsoDateTime(editData.waktu_selesai);

        setFormData({
          id: editData.id, // ID penting untuk proses UPDATE
          tanggal: start.date || editData.tanggal || new Date().toISOString().split('T')[0],
          jam_mulai: start.time || '07:30',
          jam_selesai: end.time || '09:00',
          guru_pengajar: editData.guru_pengajar || '',
          mata_pelajaran: editData.mata_pelajaran || '',
          kelas: editData.kelas || '',
          jumlah_siswa: editData.jumlah_siswa || 32,
          kategori_kegiatan: editData.kategori_kegiatan || 'KBM',
          materi_kegiatan: editData.materi_kegiatan || '',
          kondisi_awal: editData.kondisi_awal || 'Baik'
        });
      } else {
        setFormData(getInitialState());
      }
    }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.jam_selesai <= formData.jam_mulai) {
      alert('Jam selesai harus lebih akhir dari jam mulai!');
      return;
    }

    setLoading(true);

    const startDateTime = new Date(`${formData.tanggal}T${formData.jam_mulai}:00`);
    const endDateTime = new Date(`${formData.tanggal}T${formData.jam_selesai}:00`);

    // Pisahkan field temporer agar payload sesuai dengan kolom tabel public.jurnal_lab
    const { tanggal, jam_mulai, jam_selesai, ...cleanFormData } = formData;

    const payload = {
      ...cleanFormData,
      nama_lab: selectedLab,
      jumlah_siswa: Number(formData.jumlah_siswa) || 0,
      waktu_mulai: startDateTime.toISOString(),
      waktu_selesai: endDateTime.toISOString()
    };

    try {
      // Kirim payload & flag isEdit ke Parent Component
      const result = await onSubmit(payload, Boolean(editData));
      if (result?.success) {
        onClose();
      } else {
        alert('Gagal menyimpan pengajuan: ' + (result?.message || 'Terjadi kesalahan sistem.'));
      }
    } catch (err) {
      alert('Terjadi kesalahan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-1">
          {editData ? 'Edit Jurnal / Pengajuan Lab' : 'Buat Jurnal / Pengajuan Lab'}
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Peminjaman jadwal penggunaan untuk <span className="text-indigo-400 font-semibold">{selectedLab || 'Lab'}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Tanggal Praktikum
            </label>
            <input
              type="date"
              required
              value={formData.tanggal}
              onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Jam Mulai
              </label>
              <input
                type="time"
                required
                value={formData.jam_mulai}
                onChange={(e) => setFormData({ ...formData, jam_mulai: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Jam Selesai
              </label>
              <input
                type="time"
                required
                value={formData.jam_selesai}
                onChange={(e) => setFormData({ ...formData, jam_selesai: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Guru Pengajar
              </label>
              <input
                type="text"
                required
                placeholder="Nama Guru"
                value={formData.guru_pengajar}
                onChange={(e) => setFormData({ ...formData, guru_pengajar: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Mata Pelajaran
              </label>
              <input
                type="text"
                required
                placeholder="Informatika / Multimedia"
                value={formData.mata_pelajaran}
                onChange={(e) => setFormData({ ...formData, mata_pelajaran: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kelas</label>
              <input
                type="text"
                required
                placeholder="VIII A"
                value={formData.kelas}
                onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-400" /> Jml Siswa
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.jumlah_siswa}
                onChange={(e) => setFormData({ ...formData, jumlah_siswa: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori</label>
              <select
                value={formData.kategori_kegiatan}
                onChange={(e) => setFormData({ ...formData, kategori_kegiatan: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="KBM">KBM Regular</option>
                <option value="Ekskul">Ekstrakurikuler</option>
                <option value="Ujian">Ujian / Tes</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-indigo-400" /> Materi / Topik Praktikum
            </label>
            <textarea
              rows="2"
              placeholder="Uraikan topik praktikum hari ini..."
              value={formData.materi_kegiatan}
              onChange={(e) => setFormData({ ...formData, materi_kegiatan: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading 
                ? 'Mengirim...' 
                : editData ? 'Simpan Perubahan' : 'Kirim Pengajuan / Catat Jurnal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}