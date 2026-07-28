import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { AlertTriangle, Trash2, Edit3, Save, X, CheckCircle, Filter } from 'lucide-react';

export default function ValidasiSiswaModal({ isOpen, onClose, listSiswa, onRefresh }) {
  const [activeTab, setActiveTab] = useState('duplikat'); // 'duplikat' atau 'kosong'
  const [selectedKelasFilter, setSelectedKelasFilter] = useState('ALL');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loadingAction, setLoadingAction] = useState(false);

  // Daftar kelas unik untuk filter
  const daftarKelas = Array.from(new Set(listSiswa.map((s) => s.Kelas || 'Tanpa Kelas'))).sort();

  // A. Deteksi Siswa dengan Nomor Absen Ganda dalam 1 Kelas
  const getDuplicateAbsenList = () => {
    const map = {};
    listSiswa.forEach((s) => {
      const kelas = (s.Kelas || 'Tanpa Kelas').trim();
      const absen = s['No Absen'];
      if (!absen) return; // Abaikan jika absen kosong (masuk ke tab kosong)
      const key = `${kelas}_${absen}`;
      if (!map[key]) map[key] = [];
      map[key].push(s);
    });

    const duplicates = [];
    Object.values(map).forEach((group) => {
      if (group.length > 1) {
        duplicates.push(...group);
      }
    });
    return duplicates;
  };

  // B. Deteksi Siswa yang Datanya Masih Kosong (NISN, No Absen, Gender, atau Agama kosong)
  const getIncompleteList = () => {
    return listSiswa.filter((s) => {
      return (
        !s.NISN ||
        s['No Absen'] === null ||
        s['No Absen'] === undefined ||
        !s.Gender ||
        !s.Agama ||
        !s.Kelas
      );
    });
  };

  const rawDataList = activeTab === 'duplikat' ? getDuplicateAbsenList() : getIncompleteList();

  // Filter berdasarkan kelas yang dipilih di modal
  const displayedList = rawDataList.filter((s) => {
    const kelas = (s.Kelas || 'Tanpa Kelas').trim();
    if (selectedKelasFilter === 'ALL') return true;
    return kelas === selectedKelasFilter;
  });

  // Urutkan per kelas, lalu berdasarkan No Absen
  const sortedList = [...displayedList].sort((a, b) => {
    const kelasA = (a.Kelas || 'Tanpa Kelas').toString();
    const kelasB = (b.Kelas || 'Tanpa Kelas').toString();
    if (kelasA !== kelasB) return kelasA.localeCompare(kelasB);
    return (a['No Absen'] || 0) - (b['No Absen'] || 0);
  });

  const handleStartEdit = (siswa) => {
    setEditingId(siswa.id);
    setEditForm({
      NAMA: siswa.NAMA || '',
      NISN: siswa.NISN || '',
      Kelas: siswa.Kelas || '',
      'No Absen': siswa['No Absen'] || '',
      Gender: siswa.Gender || '',
      Agama: siswa.Agama || '',
    });
  };

  const handleSaveEdit = async (id) => {
    setLoadingAction(true);
    try {
      const { error } = await supabase
        .from('master_siswa')
        .update({
          NAMA: editForm.NAMA,
          NISN: editForm.NISN,
          Kelas: editForm.Kelas,
          'No Absen': editForm['No Absen'] !== '' ? parseInt(editForm['No Absen']) : null,
          Gender: editForm.Gender,
          Agama: editForm.Agama,
        })
        .eq('id', id);

      if (error) throw error;
      alert('Berhasil memperbarui data siswa!');
      setEditingId(null);
      onRefresh(); // Refresh data utama
    } catch (err) {
      alert('Gagal menyimpan: ' + err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async (id, nama) => {
    if (!window.confirm(`Yakin ingin menghapus siswa "${nama}" dari database?`)) return;

    setLoadingAction(true);
    try {
      const { error } = await supabase.from('master_siswa').delete().eq('id', id);
      if (error) throw error;
      alert('Siswa berhasil dihapus.');
      onRefresh();
    } catch (err) {
      alert('Gagal menghapus: ' + err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Modal */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-950">
          <div>
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <AlertTriangle className="text-amber-400" size={20} />
              Validasi & Audit Data Siswa
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Periksa siswa dengan nomor absen ganda atau data yang belum lengkap.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigasi Tab & Filter Kelas */}
        <div className="p-4 bg-slate-900/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('duplikat')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'duplikat'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              ⚠️ Absen Ganda ({getDuplicateAbsenList().length})
            </button>
            <button
              onClick={() => setActiveTab('kosong')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'kosong'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              📋 Data Masih Kosong ({getIncompleteList().length})
            </button>
          </div>

          {/* Filter Kelas */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select
              value={selectedKelasFilter}
              onChange={(e) => setSelectedKelasFilter(e.target.value)}
              className="bg-slate-950 border border-white/10 text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 font-mono"
            >
              <option value="ALL">Semua Kelas</option>
              {daftarKelas.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabel Konten */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {sortedList.length > 0 ? (
            <div className="border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono tracking-wider">
                  <tr>
                    <th className="p-3">Kelas</th>
                    <th className="p-3">No. Absen</th>
                    <th className="p-3">Nama Siswa</th>
                    <th className="p-3">NISN</th>
                    <th className="p-3">Gender</th>
                    <th className="p-3">Agama</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sortedList.map((siswa) => {
                    const isEditing = editingId === siswa.id;
                    return (
                      <tr key={siswa.id} className="hover:bg-slate-800/40 transition-colors">
                        {/* Kolom Kelas */}
                        <td className="p-3 font-bold text-indigo-400">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.Kelas}
                              onChange={(e) => setEditForm({ ...editForm, Kelas: e.target.value })}
                              className="w-full bg-slate-950 border border-white/20 p-1.5 rounded text-white font-mono text-xs"
                            />
                          ) : (
                            siswa.Kelas || <span className="text-rose-400 italic">Kosong</span>
                          )}
                        </td>

                        {/* Kolom No Absen */}
                        <td className="p-3 font-mono">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editForm['No Absen']}
                              onChange={(e) => setEditForm({ ...editForm, 'No Absen': e.target.value })}
                              className="w-16 bg-slate-950 border border-white/20 p-1.5 rounded text-white text-xs font-mono"
                            />
                          ) : (
                            <span className={!siswa['No Absen'] ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                              {siswa['No Absen'] !== null && siswa['No Absen'] !== undefined ? siswa['No Absen'] : '❌ Kosong'}
                            </span>
                          )}
                        </td>

                        {/* Kolom Nama */}
                        <td className="p-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.NAMA}
                              onChange={(e) => setEditForm({ ...editForm, NAMA: e.target.value })}
                              className="w-full bg-slate-950 border border-white/20 p-1.5 rounded text-white text-xs font-bold"
                            />
                          ) : (
                            <span className="font-bold text-slate-100">{siswa.NAMA}</span>
                          )}
                        </td>

                        {/* Kolom NISN */}
                        <td className="p-3 font-mono">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.NISN}
                              onChange={(e) => setEditForm({ ...editForm, NISN: e.target.value })}
                              className="w-full bg-slate-950 border border-white/20 p-1.5 rounded text-white text-xs font-mono"
                            />
                          ) : (
                            <span className={!siswa.NISN ? 'text-rose-400 italic' : 'text-slate-400'}>
                              {siswa.NISN || '❌ Belum Ada'}
                            </span>
                          )}
                        </td>

                        {/* Kolom Gender */}
                        <td className="p-3">
                          {isEditing ? (
                            <select
                              value={editForm.Gender}
                              onChange={(e) => setEditForm({ ...editForm, Gender: e.target.value })}
                              className="bg-slate-950 border border-white/20 p-1.5 rounded text-white text-xs"
                            >
                              <option value="">Pilih</option>
                              <option value="L">L</option>
                              <option value="P">P</option>
                            </select>
                          ) : (
                            <span className={!siswa.Gender ? 'text-rose-400' : 'text-slate-300'}>
                              {siswa.Gender || '❌'}
                            </span>
                          )}
                        </td>

                        {/* Kolom Agama */}
                        <td className="p-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.Agama}
                              onChange={(e) => setEditForm({ ...editForm, Agama: e.target.value })}
                              className="w-full bg-slate-950 border border-white/20 p-1.5 rounded text-white text-xs"
                            />
                          ) : (
                            <span className={!siswa.Agama ? 'text-rose-400 italic' : 'text-slate-300'}>
                              {siswa.Agama || '❌'}
                            </span>
                          )}
                        </td>

                        {/* Kolom Aksi */}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSaveEdit(siswa.id)}
                                  disabled={loadingAction}
                                  className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all"
                                  title="Simpan"
                                >
                                  <Save size={14} />
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-all"
                                  title="Batal"
                                >
                                  <X size={14} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleStartEdit(siswa)}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg transition-all"
                                  title="Edit"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDelete(siswa.id, siswa.NAMA)}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg transition-all"
                                  title="Hapus"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 space-y-3">
              <CheckCircle size={48} className="mx-auto text-emerald-500/60" />
              <p className="text-sm font-bold text-slate-300">Semua Data Bersih!</p>
              <p className="text-xs text-slate-500">
                Tidak ada data {activeTab === 'duplikat' ? 'nomor absen ganda' : 'yang masih kosong'} pada kategori ini.
              </p>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="p-4 bg-slate-950 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}