import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Award, CheckCircle2, Clock, Search, Filter, RefreshCw, 
  FileText, Star, Eye, Edit3, LayoutGrid, Table as TableIcon, 
  Sparkles, ShieldCheck, Download, AlertCircle, ChevronDown, Check
} from 'lucide-react';
import { 
  getTugasPengumpulanEkstra, 
  getMasterTugasEkstra,
  subscribeTugasPengumpulanEkstra,
  generateTugasCsv,
  downloadCsvFile
} from '../../../services/ekstraTikService';
import PenilaianCardItem from './PenilaianCardItem';
import ModalBeriNilaiEkstra from './ModalBeriNilaiEkstra';
import ModalPreviewDokumen from '../ModalPreviewDokumen';

export default function PenilaianTugasEkstra({
  user,
  anggotaList = [],
  onOpenPreview
}) {
  const [masterTugasList, setMasterTugasList] = useState([]);
  const [pengumpulanList, setPengumpulanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTugasId, setFilterTugasId] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'UNGRADED' | 'GRADED'
  const [filterKelas, setFilterKelas] = useState('ALL');
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'table'

  // Modal Preview state
  const [previewFile, setPreviewFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleOpenPreviewInternal = (item, extra = {}) => {
    if (onOpenPreview) {
      onOpenPreview(item, extra);
      return;
    }
    setPreviewFile({
      fileName: item.file_name,
      fileUrl: item.file_url,
      previewUrl: item.file_url,
      judulTugas: item.ekstra_tugas_master?.judul_tugas || item.judul_tugas || 'Tugas Ekstra TIK',
      nama: item.nama || item.master_siswa?.NAMA,
      kelas: item.kelas || item.master_siswa?.Kelas,
      canDownload: typeof extra?.canDownload === 'boolean' ? extra.canDownload : true
    });
    setIsPreviewOpen(true);
  };

  // Modal Penilaian State
  const [selectedItemForGrading, setSelectedItemForGrading] = useState(null);
  const [isModalGradingOpen, setIsModalGradingOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // 1. Muat master tugas
  const loadMasterTugas = useCallback(async () => {
    try {
      const tugas = await getMasterTugasEkstra();
      setMasterTugasList(tugas || []);
    } catch (err) {
      console.warn('Gagal memuat master tugas:', err);
    }
  }, []);

  // 2. Muat seluruh pengumpulan tugas
  const loadPengumpulan = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTugasPengumpulanEkstra(null, null, null, null);
      setPengumpulanList(data || []);
    } catch (err) {
      console.warn('Gagal memuat pengumpulan tugas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMasterTugas();
    loadPengumpulan();
  }, [loadMasterTugas, loadPengumpulan]);

  // Realtime subscription
  useEffect(() => {
    const unsub = subscribeTugasPengumpulanEkstra(() => {
      loadPengumpulan();
    });
    return () => unsub();
  }, [loadPengumpulan]);

  // Daftar kelas unik dari anggota
  const availableClasses = useMemo(() => {
    const list = anggotaList.map((m) => m.kelas).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [anggotaList]);

  // KPI Ringkasan Statistik
  const stats = useMemo(() => {
    const total = pengumpulanList.length;
    let graded = 0;
    let ungraded = 0;
    let sumNilai = 0;

    pengumpulanList.forEach((p) => {
      if (p.nilai !== null && p.nilai !== undefined) {
        graded++;
        sumNilai += Number(p.nilai) || 0;
      } else {
        ungraded++;
      }
    });

    const avg = graded > 0 ? (sumNilai / graded).toFixed(1) : '0';
    return { total, graded, ungraded, avg };
  }, [pengumpulanList]);

  // Data Terfilter
  const filteredList = useMemo(() => {
    return pengumpulanList.filter((item) => {
      // Filter Tugas
      if (filterTugasId !== 'ALL') {
        if (item.id_tugas !== filterTugasId) return false;
      }

      // Filter Status Penilaian
      if (filterStatus === 'UNGRADED') {
        if (item.nilai !== null && item.nilai !== undefined) return false;
      } else if (filterStatus === 'GRADED') {
        if (item.nilai === null || item.nilai === undefined) return false;
      }

      // Filter Kelas
      if (filterKelas !== 'ALL') {
        const itemKelas = item.kelas || item.master_siswa?.Kelas;
        if (itemKelas !== filterKelas) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nama = (item.nama || item.master_siswa?.NAMA || '').toLowerCase();
        const fileName = (item.file_name || '').toLowerCase();
        const catatan = (item.catatan_siswa || '').toLowerCase();
        const judul = (item.ekstra_tugas_master?.judul_tugas || item.judul_tugas || '').toLowerCase();
        if (!nama.includes(q) && !fileName.includes(q) && !catatan.includes(q) && !judul.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [pengumpulanList, filterTugasId, filterStatus, filterKelas, searchQuery]);

  // Handler Buka Modal Nilai
  const handleOpenGrading = (item) => {
    setSelectedItemForGrading(item);
    setIsModalGradingOpen(true);
  };

  // Handler Berhasil Nilai
  const handleGradingSuccess = (updatedItem) => {
    setPengumpulanList((prev) =>
      prev.map((p) => (p.id === updatedItem.id ? { ...p, ...updatedItem } : p))
    );
    setToastMsg(`Nilai untuk ${updatedItem.nama || 'Siswa'} berhasil disimpan!`);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Unduh CSV Penilaian
  const handleDownloadCsv = () => {
    if (filteredList.length === 0) return;
    const csv = generateTugasCsv(filteredList);
    downloadCsvFile(csv, `Rekap_Nilai_Tugas_Ekstra_${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-4">
      {/* Toast Notifikasi Sukses */}
      {toastMsg && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-900/90 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-500/30 text-xs sm:text-sm animate-in slide-in-from-top duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* KPI Cards / Bar Metrik Ringkas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold shrink-0">
            📑
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-400 font-medium truncate">Total Masuk</p>
            <h4 className="text-base sm:text-lg font-black text-slate-800 font-mono">
              {stats.total}
            </h4>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
            ⏳
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-amber-600 font-medium truncate">Belum Dinilai</p>
            <h4 className="text-base sm:text-lg font-black text-amber-800 font-mono">
              {stats.ungraded}
            </h4>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            ✅
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-emerald-600 font-medium truncate">Sudah Dinilai</p>
            <h4 className="text-base sm:text-lg font-black text-emerald-800 font-mono">
              {stats.graded}
            </h4>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold shrink-0">
            ⭐
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-400 font-medium truncate">Rata-rata Nilai</p>
            <h4 className="text-base sm:text-lg font-black text-slate-800 font-mono">
              {stats.avg} <span className="text-xs text-slate-400 font-normal">pt</span>
            </h4>
          </div>
        </div>
      </div>

      {/* Toolbar Filter & Pencarian */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari siswa, nama file, catatan..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50/50"
            />
          </div>

          {/* Action buttons (Refresh, CSV, View mode toggle) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleDownloadCsv}
              disabled={filteredList.length === 0}
              className="inline-flex items-center gap-1 py-1.5 px-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition cursor-pointer disabled:opacity-40"
              title="Unduh Rekap Nilai CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button
              type="button"
              onClick={loadPengumpulan}
              disabled={loading}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-slate-200 transition cursor-pointer"
              title="Muat Ulang"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

            {/* View Mode Toggle: Card vs Table */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'card' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Tampilan Kartu"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Tampilan Tabel"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          {/* Filter Master Tugas */}
          <select
            value={filterTugasId}
            onChange={(e) => setFilterTugasId(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500 max-w-[200px] truncate"
          >
            <option value="ALL">📑 Semua Tugas Master</option>
            {masterTugasList.map((t) => (
              <option key={t.id} value={t.id}>
                {t.judul_tugas}
              </option>
            ))}
          </select>

          {/* Filter Status Penilaian */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="ALL">🎯 Semua Status</option>
            <option value="UNGRADED">⏳ Belum Dinilai ({stats.ungraded})</option>
            <option value="GRADED">✅ Sudah Dinilai ({stats.graded})</option>
          </select>

          {/* Filter Kelas */}
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="ALL">🏫 Semua Kelas</option>
            {availableClasses.map((cls) => (
              <option key={cls} value={cls}>
                Kelas {cls}
              </option>
            ))}
          </select>

          <span className="text-[11px] text-slate-400 ml-auto font-mono">
            {filteredList.length} dari {pengumpulanList.length} tugas
          </span>
        </div>
      </div>

      {/* Main List Section */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-violet-500 mb-2" />
          <p className="text-xs font-semibold">Memuat data pengumpulan tugas siswa...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center flex flex-col items-center justify-center text-slate-400">
          <Award className="w-12 h-12 text-slate-300 mb-2 stroke-1" />
          <h4 className="text-sm font-bold text-slate-700">Tidak Ada Tugas Ditemukan</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            {pengumpulanList.length === 0
              ? 'Belum ada siswa yang mengumpulkan tugas.'
              : 'Tidak ada tugas yang sesuai dengan filter pencarian.'}
          </p>
        </div>
      ) : viewMode === 'card' ? (
        /* MODE KARTU (Sangat nyaman di HP, Tablet, Laptop) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredList.map((item) => (
            <PenilaianCardItem
              key={item.id}
              item={item}
              onBeriNilai={handleOpenGrading}
              onPreview={handleOpenPreviewInternal}
            />
          ))}
        </div>
      ) : (
        /* MODE TABEL (Sangat efisien untuk penilaian cepat di Laptop) */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3 w-12 text-center">No</th>
                  <th className="py-3 px-3">Siswa</th>
                  <th className="py-3 px-3">Tugas & Berkas</th>
                  <th className="py-3 px-3">Waktu Kirim</th>
                  <th className="py-3 px-3 text-center">Nilai</th>
                  <th className="py-3 px-3">Catatan Evaluasi</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((item, idx) => {
                  const isGraded = item.nilai !== null && item.nilai !== undefined;
                  const namaSiswa = item.nama || item.master_siswa?.NAMA || 'Siswa';
                  const kelasSiswa = item.kelas || item.master_siswa?.Kelas || '-';
                  const noAbsen = item.no_absen || item.master_siswa?.['No Absen'] || '-';
                  const judul = item.ekstra_tugas_master?.judul_tugas || item.judul_tugas || 'Tugas Ekstra';

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition ${
                        isGraded ? '' : 'bg-amber-50/20'
                      }`}
                    >
                      <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800 text-xs">
                          {namaSiswa}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Kelas {kelasSiswa} • Absen #{noAbsen}
                        </div>
                      </td>
                      <td className="py-3 px-3 max-w-[220px]">
                        <div className="font-semibold text-slate-700 truncate text-[11px]">
                          {judul}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate flex items-center gap-1">
                          <FileText className="w-3 h-3 text-indigo-500 shrink-0" />
                          <span className="truncate">{item.file_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[10px] text-slate-400 font-mono whitespace-nowrap">
                        {item.submitted_at
                          ? new Date(item.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ' ' + new Date(item.submitted_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                          : '-'}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {isGraded ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 font-mono border border-emerald-300">
                            ⭐ {item.nilai}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            ⏳ Belum
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 max-w-[200px] text-[11px] text-slate-600 truncate italic">
                        {item.feedback_guru || '-'}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenPreviewInternal(item, { canDownload: true })}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                            title="Pratinjau Berkas"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenGrading(item)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                              isGraded
                                ? 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200'
                                : 'text-white bg-violet-600 hover:bg-violet-700 shadow-2xs'
                            }`}
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{isGraded ? 'Ubah' : 'Nilai'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Beri Nilai */}
      <ModalBeriNilaiEkstra
        isOpen={isModalGradingOpen}
        onClose={() => setIsModalGradingOpen(false)}
        item={selectedItemForGrading}
        onSuccess={handleGradingSuccess}
        onPreview={handleOpenPreviewInternal}
      />

      {/* Modal Preview Dokumen */}
      <ModalPreviewDokumen
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        fileData={previewFile}
      />
    </div>
  );
}
