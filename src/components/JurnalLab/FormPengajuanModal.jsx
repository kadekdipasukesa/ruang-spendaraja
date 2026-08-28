import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Clock, BookOpen, User, Users, AlignLeft, Sparkles, AlertTriangle } from 'lucide-react';

// Helper mendapatkan tanggal hari ini dalam zona waktu WITA (GMT+8) -> YYYY-MM-DD
const getTodayWITA = () => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Makassar',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(new Date());
};

// Helper parsing ISO ke format 24-Jam dan Tanggal WITA (GMT+8)
const parseIsoToWITA = (isoString) => {
  if (!isoString) return { date: getTodayWITA(), time: '07:30' };
  const dateObj = new Date(isoString);
  if (isNaN(dateObj.getTime())) return { date: getTodayWITA(), time: '07:30' };

  const dateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Makassar',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const hourFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Makassar',
    hour: '2-digit',
    hour12: false
  });
  const minuteFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Makassar',
    minute: '2-digit'
  });

  const hour = hourFormatter.format(dateObj).padStart(2, '0');
  const minute = minuteFormatter.format(dateObj).padStart(2, '0');

  return {
    date: dateFormatter.format(dateObj),
    time: `${hour}:${minute}`
  };
};

// Helper deteksi tabrakan waktu peminjaman di lab yang sama
const checkScheduleConflict = (targetLab, targetTanggal, targetJamMulai, targetJamSelesai, existingItems, currentEditId) => {
  if (!targetLab || !targetTanggal || !targetJamMulai || !targetJamSelesai || !existingItems || !Array.isArray(existingItems)) {
    return null;
  }

  // Validasi waktu selesai harus lebih akhir dari waktu mulai
  if (targetJamSelesai <= targetJamMulai) {
    return null;
  }

  const targetStart = new Date(`${targetTanggal}T${targetJamMulai}:00+08:00`).getTime();
  const targetEnd = new Date(`${targetTanggal}T${targetJamSelesai}:00+08:00`).getTime();

  if (isNaN(targetStart) || isNaN(targetEnd)) return null;

  for (const item of existingItems) {
    // 1. Abaikan item jika sedang dalam mode edit item tersebut
    if (currentEditId && String(item.id) === String(currentEditId)) {
      continue;
    }

    // 2. Hanya berlaku jika LAB YANG SAMA
    const itemLab = (item.nama_lab || '').trim().toLowerCase();
    const currentTargetLab = targetLab.trim().toLowerCase();
    if (itemLab && itemLab !== currentTargetLab) {
      continue;
    }

    // 3. Pengajuan yang ditolak (rejected) tidak mengunci lab
    if (item.status_pengajuan === 'rejected') {
      continue;
    }

    // 4. Hanya berlaku jika TANGGAL YANG SAMA
    const itemWita = parseIsoToWITA(item.waktu_mulai);
    if (itemWita.date !== targetTanggal) {
      continue;
    }

    // 5. Hanya berlaku jika JAM BENTROK (Overlap interval: StartA < EndB && EndA > StartB)
    const itemStart = new Date(item.waktu_mulai).getTime();
    const itemEnd = new Date(item.waktu_selesai).getTime();

    if (isNaN(itemStart) || isNaN(itemEnd)) continue;

    if (targetStart < itemEnd && targetEnd > itemStart) {
      return item;
    }
  }

  return null;
};

export default function FormPengajuanModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  selectedLab,
  editData = null,
  currentUser = null,
  existingJurnals = []
}) {
  const [formData, setFormData] = useState({
    tanggal: getTodayWITA(),
    jam_mulai: '07:30',
    jam_selesai: '09:00',
    guru_pengajar: currentUser?.NAMA || currentUser?.nama || '',
    mata_pelajaran: '',
    kelas: '',
    jumlah_siswa: 32,
    kategori_kegiatan: 'KBM',
    materi_kegiatan: '',
    kondisi_awal: 'Baik'
  });
  const [loading, setLoading] = useState(false);

  // Deteksi tabrakan waktu secara real-time
  const conflictingItem = useMemo(() => {
    return checkScheduleConflict(
      selectedLab,
      formData.tanggal,
      formData.jam_mulai,
      formData.jam_selesai,
      existingJurnals,
      editData?.id
    );
  }, [selectedLab, formData.tanggal, formData.jam_mulai, formData.jam_selesai, existingJurnals, editData?.id]);

  const conflictTimeRange = useMemo(() => {
    if (!conflictingItem) return '';
    const s = parseIsoToWITA(conflictingItem.waktu_mulai);
    const e = parseIsoToWITA(conflictingItem.waktu_selesai);
    return `${s.time} - ${e.time} WITA`;
  }, [conflictingItem]);

  // Lock scroll background saat modal terbuka & pasang handler tombol ESC
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        const start = parseIsoToWITA(editData.waktu_mulai);
        const end = parseIsoToWITA(editData.waktu_selesai);

        setFormData({
          id: editData.id,
          tanggal: start.date || editData.tanggal || getTodayWITA(),
          jam_mulai: start.time || '07:30',
          jam_selesai: end.time || '09:00',
          guru_pengajar: editData.guru_pengajar || currentUser?.NAMA || currentUser?.nama || '',
          mata_pelajaran: editData.mata_pelajaran || '',
          kelas: editData.kelas || '',
          jumlah_siswa: editData.jumlah_siswa || 32,
          kategori_kegiatan: editData.kategori_kegiatan || 'KBM',
          materi_kegiatan: editData.materi_kegiatan || '',
          kondisi_awal: editData.kondisi_awal || 'Baik'
        });
      } else {
        setFormData({
          tanggal: getTodayWITA(),
          jam_mulai: '07:30',
          jam_selesai: '09:00',
          guru_pengajar: currentUser?.NAMA || currentUser?.nama || '',
          mata_pelajaran: '',
          kelas: '',
          jumlah_siswa: 32,
          kategori_kegiatan: 'KBM',
          materi_kegiatan: '',
          kondisi_awal: 'Baik'
        });
      }
    }
  }, [isOpen, editData, currentUser]);

  if (!isOpen) return null;

  const applyPreset = (start, end) => {
    setFormData(prev => ({
      ...prev,
      jam_mulai: start,
      jam_selesai: end
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.jam_selesai <= formData.jam_mulai) {
      alert('Jam selesai harus lebih akhir dari jam mulai!');
      return;
    }

    if (conflictingItem) {
      alert(`Jadwal tidak dapat diajukan karena bertabrakan dengan kegiatan "${conflictingItem.mata_pelajaran || conflictingItem.materi_kegiatan || 'Kegiatan'}" oleh ${conflictingItem.guru_pengajar} pada pukul ${conflictTimeRange}! Silakan pilih jam atau tanggal lain.`);
      return;
    }

    setLoading(true);

    // Format ISO 8601 dengan offset timezone WITA (+08:00) agar tepat zona waktu Makassar/Bali
    const startDateTime = new Date(`${formData.tanggal}T${formData.jam_mulai}:00+08:00`);
    const endDateTime = new Date(`${formData.tanggal}T${formData.jam_selesai}:00+08:00`);

    const { 
      tanggal, 
      jam_mulai, 
      jam_selesai, 
      ...cleanFormData 
    } = formData;

    const payload = {
      ...cleanFormData,
      nama_lab: selectedLab,
      jumlah_siswa: Number(formData.jumlah_siswa) || 0,
      waktu_mulai: startDateTime.toISOString(),
      waktu_selesai: endDateTime.toISOString()
    };

    try {
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

  const modalContent = (
    <div 
      className="fixed inset-0 z-[250] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        // Klik di backdrop gelap otomatis menutup modal
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 md:p-8 max-w-lg w-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal & Tombol Close X yang Selalu Berada di Paling Depan */}
        <div className="flex items-start justify-between gap-3 mb-5 sticky top-0 bg-slate-900/95 backdrop-blur-sm pt-1 pb-2 z-20 border-b border-slate-800/80">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {editData ? 'Edit Jurnal / Pengajuan Lab' : 'Buat Jurnal / Pengajuan Lab'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Peminjaman jadwal untuk <span className="text-cyan-400 font-semibold">{selectedLab || 'Lab'}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="flex-shrink-0 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 hover:border-slate-500 transition-all cursor-pointer shadow-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Tanggal Praktikum
              </span>
              <span className="text-[10px] text-indigo-400/90 font-medium">Zona WITA (GMT+8)</span>
            </label>
            <input
              type="date"
              required
              value={formData.tanggal}
              onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors [color-scheme:dark]"
            />
          </div>

          {/* Sesi Jam Input Format 24 Jam dengan Pemilih Waktu Jam Lingkaran/Clock Picker */}
          <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 space-y-2.5">
            <div className="grid grid-cols-2 gap-3">
              {/* Jam Mulai */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> Jam Mulai (24 Jam)
                </label>
                <input
                  type="time"
                  required
                  value={formData.jam_mulai}
                  onChange={(e) => setFormData({ ...formData, jam_mulai: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors [color-scheme:dark]"
                />
              </div>

              {/* Jam Selesai */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> Jam Selesai (24 Jam)
                </label>
                <input
                  type="time"
                  required
                  value={formData.jam_selesai}
                  onChange={(e) => setFormData({ ...formData, jam_selesai: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono font-bold text-indigo-300 focus:outline-none focus:border-indigo-500 transition-colors [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Quick Presets Sesi Pembelajaran */}
            <div className="pt-1">
              <span className="block text-[10px] text-slate-400 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Preset Sesi Praktikum:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '07:30 - 09:00', start: '07:30', end: '09:00' },
                  { label: '09:00 - 10:30', start: '09:00', end: '10:30' },
                  { label: '10:45 - 12:15', start: '10:45', end: '12:15' },
                  { label: '13:00 - 14:30', start: '13:00', end: '14:30' },
                  { label: '15:00 - 16:30', start: '15:00', end: '16:30' }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset.start, preset.end)}
                    className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:border-slate-600 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Peringatan Merah Kedip-Kedip Jika Jadwal Bertabrakan */}
            {conflictingItem && (
              <div className="mt-2 p-3.5 bg-rose-950/90 border-2 border-rose-500 rounded-2xl shadow-[0_0_25px_rgba(244,63,94,0.45)] animate-pulse space-y-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-90"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,1)]"></span>
                  </span>
                  <span className="text-xs font-black text-rose-200 uppercase tracking-wide">
                    Jadwal Bertabrakan / Lab Sedang Digunakan!
                  </span>
                </div>
                <div className="text-[11px] text-rose-100/95 leading-relaxed pl-5 space-y-1">
                  <p>
                    Jam ini sudah terisi untuk kegiatan <strong className="text-white font-bold underline decoration-rose-400">{conflictingItem.mata_pelajaran || conflictingItem.materi_kegiatan || 'Kegiatan'}</strong> oleh <strong className="text-amber-300 font-bold">{conflictingItem.guru_pengajar}</strong> ({conflictingItem.kelas || 'Umum'}) pukul <strong className="text-amber-300 font-mono font-bold">{conflictTimeRange}</strong>.
                  </p>
                  <p className="text-[10px] text-rose-300 font-semibold flex items-center gap-1.5 mt-1.5 pt-1 border-t border-rose-800/60">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>Tombol pengajuan <strong>dikunci otomatis</strong>. Silakan ubah jam atau pilih tanggal lain.</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Nama Peminjam
              </label>
              <input
                type="text"
                required
                placeholder="Nama Lengkap Peminjam"
                value={formData.guru_pengajar}
                onChange={(e) => setFormData({ ...formData, guru_pengajar: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Mata Pelajaran / Kegiatan
              </label>
              <input
                type="text"
                required
                placeholder="Informatika / Rapat / Pelatihan"
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
                placeholder="VIII A / Guru"
                value={formData.kelas}
                onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-400" /> Jml Peserta
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
              <AlignLeft className="w-3.5 h-3.5 text-indigo-400" /> Materi / Uraian Kegiatan
            </label>
            <textarea
              rows="2"
              placeholder="Uraikan topik praktikum / agenda kegiatan..."
              value={formData.materi_kegiatan}
              onChange={(e) => setFormData({ ...formData, materi_kegiatan: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Tombol Aksi Bawah: Batal & Simpan */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium py-3 rounded-xl text-xs border border-slate-700 transition-colors cursor-pointer text-center"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || Boolean(conflictingItem) || formData.jam_selesai <= formData.jam_mulai}
              title={
                conflictingItem
                  ? 'Jadwal bertabrakan! Ganti jam untuk mengaktifkan tombol.'
                  : formData.jam_selesai <= formData.jam_mulai
                  ? 'Jam selesai harus lebih akhir dari jam mulai'
                  : ''
              }
              className={`w-2/3 font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 ${
                conflictingItem
                  ? 'bg-rose-950/80 border border-rose-500/70 text-rose-300 cursor-not-allowed shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse select-none'
                  : formData.jam_selesai <= formData.jam_mulai
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 cursor-pointer disabled:opacity-50'
              }`}
            >
              {loading ? (
                'Menyimpan...'
              ) : conflictingItem ? (
                <>
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-90"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  <span>Jadwal Bertabrakan (Terkunci)</span>
                </>
              ) : editData ? (
                'Simpan Perubahan'
              ) : (
                'Kirim Pengajuan'
              )}
            </button>
          </div>

          {/* Keterangan Kecil Blinking Merah Saat Tombol Terkunci */}
          {conflictingItem && (
            <div className="flex items-center justify-center gap-1.5 pt-1 text-center animate-pulse">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-90"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,1)]"></span>
              </span>
              <span className="text-[11px] font-bold text-rose-400">
                Tidak bisa melakukan pengajuan: Jadwal di tanggal, lab, dan jam ini sudah terisi.
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
