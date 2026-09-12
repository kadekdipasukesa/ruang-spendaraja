import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Users,
  Download,
  MessageSquare,
  Sparkles,
  UserX
} from 'lucide-react';
import { generatePresensiCsv, downloadCsvFile } from '../../services/ekstraTikService';

export default function RiwayatPresensiList({
  riwayatList = [],
  anggotaList = [],
  allPresensiList = [],
  fallbackNama = '',
  fallbackKelas = ''
}) {
  const [selectedDateFilter, setSelectedDateFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Ekstrak daftar tanggal unik dari allPresensiList
  const uniqueDates = useMemo(() => {
    const set = new Set();
    allPresensiList.forEach((p) => {
      if (p.tanggal) set.add(p.tanggal);
    });
    return Array.from(set).sort().reverse();
  }, [allPresensiList]);

  // Dataset utama: Selalu tampilkan seluruh siswa (tanpa tab pemisah siswa ini)
  const activeDataset = allPresensiList;

  // Filter dataset
  const filteredData = useMemo(() => {
    return activeDataset.filter((item) => {
      // Filter Tanggal
      if (selectedDateFilter !== 'ALL') {
        if (item.tanggal !== selectedDateFilter) return false;
      }

      // Filter Status
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'Hadir' && item.status_kehadiran !== 'Hadir') return false;
        if (statusFilter === 'Izin' && item.status_kehadiran !== 'Izin') return false;
        if (statusFilter === 'Sakit' && item.status_kehadiran !== 'Sakit') return false;
        if (statusFilter === 'Alpa' && item.status_kehadiran !== 'Alpa') return false;
      }

      // Filter Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nama = (item.nama || item.siswa?.NAMA || '').toLowerCase();
        const kelas = (item.kelas || item.siswa?.Kelas || '').toLowerCase();
        if (!nama.includes(q) && !kelas.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [activeDataset, selectedDateFilter, statusFilter, searchQuery]);

  // Hitung ringkasan statistik
  const stats = useMemo(() => {
    let hadir = 0;
    let izin = 0;
    let sakit = 0;
    let alpa = 0;

    filteredData.forEach((item) => {
      if (item.status_kehadiran === 'Hadir') hadir++;
      else if (item.status_kehadiran === 'Izin') izin++;
      else if (item.status_kehadiran === 'Sakit') sakit++;
      else if (item.status_kehadiran === 'Alpa') alpa++;
    });

    return { total: filteredData.length, hadir, izin, sakit, alpa };
  }, [filteredData]);

  // Kelompokkan data presensi per tanggal (gaya log chat WhatsApp 1 kolom terbungkus per hari)
  const groupedRiwayat = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    const map = new Map();

    // Urutkan data berdasarkan waktu/nama dalam hari yang sama
    filteredData.forEach((item) => {
      const key = item.tanggal || 'Tanggal Tidak Diketahui';
      if (!map.has(key)) {
        map.set(key, {
          tanggal: key,
          items: []
        });
      }
      map.get(key).items.push(item);
    });

    return Array.from(map.values()).sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [filteredData]);

  const handleDownloadCsv = () => {
    const csv = generatePresensiCsv(anggotaList, allPresensiList);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadCsvFile(csv, `Rekap_Presensi_Ekstra_TIK_${dateStr}.csv`);
  };

  // Format tombol pilihan tanggal: Menampilkan Hari dan Tanggal (misal: "Jumat, 12 Sep")
  const formatHariDanTanggalPill = (dStr) => {
    if (!dStr) return '';
    try {
      const parts = dStr.split('-');
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const hari = date.toLocaleDateString('id-ID', { weekday: 'long' });
        const tgl = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        return `${hari}, ${tgl}`;
      }
      const date = new Date(dStr);
      return `${date.toLocaleDateString('id-ID', { weekday: 'long' })}, ${date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`;
    } catch {
      return dStr;
    }
  };

  const formatTanggalPillWa = (dStr) => {
    if (!dStr) return '';
    try {
      const parts = dStr.split('-');
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const hari = date.toLocaleDateString('id-ID', { weekday: 'long' });
        const tgl = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        return `${hari}, ${tgl}`;
      }
      const date = new Date(dStr);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dStr;
    }
  };

  const formatWaktuItem = (waktuStr) => {
    if (!waktuStr) return '';
    try {
      const date = new Date(waktuStr);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Baris Filter & Search Kompak */}
      <div className="space-y-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
        {/* Search Bar & Tombol CSV */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa atau kelas..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder-slate-400"
            />
          </div>
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer shadow-xs"
            title="Download Rekap Presensi (.CSV)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>

        {/* Pill Filter Tanggal Pertemuan dengan Nama Hari */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-emerald-600" />
            Pilihan Hari:
          </span>

          <button
            type="button"
            onClick={() => setSelectedDateFilter('ALL')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg shrink-0 transition cursor-pointer ${
              selectedDateFilter === 'ALL'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Semua Hari ({uniqueDates.length})
          </button>

          {uniqueDates.map((tgl) => (
            <button
              key={tgl}
              type="button"
              onClick={() => setSelectedDateFilter(tgl)}
              title={`Tanggal: ${tgl}`}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg shrink-0 transition cursor-pointer ${
                selectedDateFilter === tgl
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {formatHariDanTanggalPill(tgl)}
            </button>
          ))}
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-200/60 text-[11px] flex-wrap">
          <div className="flex items-center gap-1 flex-wrap">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                statusFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Hadir')}
              className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                statusFilter === 'Hadir' ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              Hadir ({stats.hadir})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Izin')}
              className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                statusFilter === 'Izin' ? 'bg-amber-600 text-white' : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              Izin ({stats.izin})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Sakit')}
              className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                statusFilter === 'Sakit' ? 'bg-blue-600 text-white' : 'text-blue-700 hover:bg-blue-50'
              }`}
            >
              Sakit ({stats.sakit})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Alpa')}
              className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                statusFilter === 'Alpa' ? 'bg-rose-600 text-white' : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              Alpa ({stats.alpa})
            </button>
          </div>

          <span className="text-[10px] text-slate-500 font-medium">
            Total Record: <strong className="text-slate-800">{filteredData.length}</strong>
          </span>
        </div>
      </div>

      {/* Kontainer Log Pesan Gaya WhatsApp (1 Kolom dengan Bubble Per Hari) */}
      <div className="bg-[#efeae2]/40 rounded-2xl border border-slate-200/80 p-3 sm:p-4 max-h-[560px] overflow-y-auto space-y-6">
        {groupedRiwayat.length === 0 ? (
          <div className="p-8 text-center bg-white/80 backdrop-blur-xs rounded-2xl border border-dashed border-slate-300">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-80" />
            <p className="text-xs font-bold text-slate-700">Tidak ada catatan kehadiran yang sesuai</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Coba sesuaikan tanggal pertemuan atau kata kunci pencarian.
            </p>
          </div>
        ) : (
          groupedRiwayat.map((group) => (
            <div key={group.tanggal} className="space-y-2.5">
              {/* WhatsApp-Style Date Badge (Pill Melayang di Tengah) */}
              <div className="flex items-center justify-center sticky top-0 z-10 py-1">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-xs border border-slate-200 text-slate-700 text-[11px] font-bold">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{formatTanggalPillWa(group.tanggal)}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-extrabold ml-1">
                    {group.items.length} Siswa
                  </span>
                </div>
              </div>

              {/* Daftar Log Kehadiran Siswa (1 Kolom Memanjang Rapi) */}
              <div className="space-y-1.5 max-w-2xl mx-auto">
                {group.items.map((item, idx) => {
                  const isHadir = item.status_kehadiran === 'Hadir';
                  const isIzin = item.status_kehadiran === 'Izin';
                  const isSakit = item.status_kehadiran === 'Sakit';
                  const isAlpa = item.status_kehadiran === 'Alpa';

                  const namaDisplay = item.siswa?.NAMA || item.nama;
                  const kelasDisplay = item.siswa?.Kelas || item.kelas;
                  const waktuStr = formatWaktuItem(item.waktu_absen);

                  return (
                    <div
                      key={item.id || idx}
                      className="bg-white rounded-xl px-3 py-2 border border-slate-200/90 shadow-2xs hover:shadow-xs transition flex items-center justify-between gap-2.5"
                    >
                      {/* Sisi Kiri: Info Siswa */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800 truncate">
                            {namaDisplay}
                          </span>
                          <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded shrink-0">
                            Kelas {kelasDisplay}
                          </span>
                          {item.siswa_id && (
                            <span className="text-[9px] font-mono text-slate-400 hidden sm:inline">
                              #{item.siswa_id}
                            </span>
                          )}
                        </div>

                        {/* Catatan / Keterangan jika ada */}
                        {item.keterangan ? (
                          <p className="text-[11px] text-slate-600 mt-0.5 italic flex items-center gap-1 truncate">
                            <MessageSquare className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>"{item.keterangan}"</span>
                          </p>
                        ) : null}
                      </div>

                      {/* Sisi Kanan: Status & Waktu */}
                      <div className="shrink-0 flex items-center gap-2">
                        {waktuStr && (
                          <span className="text-[10px] text-slate-400 font-mono hidden xs:inline">
                            {waktuStr}
                          </span>
                        )}

                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isHadir
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isIzin
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : isSakit
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {isHadir ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : isAlpa ? (
                            <UserX className="w-3 h-3 text-rose-600" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          <span>{item.status_kehadiran}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
