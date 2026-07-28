import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminSiswa from '../../hooks/Admin/useAdminSiswa';
import PreviewCSV from '../../components/Admin/PreviewCSV';
import StatistikKelas from '../../components/Admin/StatistikKelas';
import ValidasiSiswaModal from '../../components/Admin/ValidasiSiswaModal';
import { Upload, Search, ShieldAlert, FileText, UserCheck, RefreshCcw, AlertTriangle } from 'lucide-react';

export default function KelolaSiswaPage() {
  const navigate = useNavigate();
  const { loading, listSiswa, previewData, errorMsg, setPreviewData, fetchAllSiswa, processCSV, commitBatchChanges } = useAdminSiswa();

  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [selectedKelas, setSelectedKelas] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [showValidasiModal, setShowValidasiModal] = useState(false);

  // 1. Verifikasi Akses Admin
  useEffect(() => {
    const savedUser = localStorage.getItem('user_siswa');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (e) {
        console.error('Auth error', e);
      }
    }
    setCheckingAuth(false);
  }, []);

  // 2. Fetch Data Siswa saat pertama masuk
  useEffect(() => {
    if (isAdmin) {
      fetchAllSiswa();
    }
  }, [isAdmin, fetchAllSiswa]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processCSV(file);
      e.target.value = ''; // Reset input
    }
  };

  const handleCommit = async () => {
    const res = await commitBatchChanges();
    alert(res.message);
  };

  // 3. Filter Data Siswa
  const filteredSiswa = listSiswa.filter((s) => {
    const matchKelas = selectedKelas ? (s.Kelas || '').toString().trim() === selectedKelas : true;
    const matchSearch =
      (s.NAMA || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.NISN || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchKelas && matchSearch;
  });

  if (checkingAuth) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-mono">Memeriksa hak akses...</div>;
  }

  // Tampilan jika BUKAN Admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 bg-rose-500/10 text-rose-500 rounded-full border border-rose-500/20">
          <ShieldAlert size={48} />
        </div>
        <h1 className="text-xl font-black uppercase tracking-wider">Akses Ditolak!</h1>
        <p className="text-xs text-slate-400 max-w-md">
          Halaman ini khusus untuk administrator untuk mengelola database master siswa dan kelas.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 pt-24 sm:p-8 sm:pt-28 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Kelola Master Data Siswa
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload CSV untuk pembaruan kelas massal, kenaikan kelas, maupun penambahan data Alumni.
          </p>
        </div>

        {/* Area Tombol Aksi */}
        <div className="flex items-center gap-3">
          {/* Tombol Audit / Validasi Data */}
          <button
            type="button"
            onClick={() => setShowValidasiModal(true)}
            className="px-4 py-3 bg-amber-600/20 border border-amber-500/30 hover:bg-amber-600/30 text-amber-300 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95"
          >
            <AlertTriangle size={16} /> Cek Data Ganda / Kosong
          </button>

          {/* Input File CSV */}
          <label className="cursor-pointer px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95">
            <Upload size={16} /> Upload Berkas CSV
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl font-mono">
          {errorMsg}
        </div>
      )}

      {/* Tampilan Preview CSV jika user baru upload file */}
      {previewData.length > 0 && (
        <PreviewCSV
          previewData={previewData}
          onCommit={handleCommit}
          onCancel={() => setPreviewData([])}
          loading={loading}
        />
      )}

      {/* Ringkasan Jumlah Siswa Per Kelas */}
      <StatistikKelas
        listSiswa={listSiswa}
        selectedKelas={selectedKelas}
        onSelectKelas={setSelectedKelas}
      />

      {/* Modal Validasi Data */}
      <ValidasiSiswaModal
        isOpen={showValidasiModal}
        onClose={() => setShowValidasiModal(false)}
        listSiswa={listSiswa}
        onRefresh={fetchAllSiswa}
      />

      {/* Filter & Daftar Siswa */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Cari nama atau NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2.5 pl-9 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <button
            onClick={fetchAllSiswa}
            disabled={loading}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
            title="Refresh Data"
          >
            <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Tabel Master Siswa */}
        <div className="max-h-[500px] overflow-y-auto rounded-xl border border-white/5 no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 sticky top-0 uppercase text-[10px] font-mono tracking-wider">
              <tr>
                <th className="p-3">No. Absen</th>
                <th className="p-3">Nama Siswa</th>
                <th className="p-3">NISN</th>
                <th className="p-3">Kelas</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Agama</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredSiswa.length > 0 ? (
                filteredSiswa.map((siswa) => {
                  const isAlumni = (siswa.Kelas || '').toLowerCase().includes('alumni');
                  return (
                    <tr key={siswa.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono text-slate-500">{siswa['No Absen'] || '-'}</td>
                      <td className="p-3 font-bold text-slate-200">{siswa.NAMA}</td>
                      <td className="p-3 font-mono text-slate-400">{siswa.NISN}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${isAlumni ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-300'
                            }`}
                        >
                          {siswa.Kelas || 'Tanpa Kelas'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{siswa.Gender || '-'}</td>
                      <td className="p-3 text-slate-400">{siswa.Agama || '-'}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 italic">
                    {loading ? 'Memuat data...' : 'Tidak ada data siswa ditemukan.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}