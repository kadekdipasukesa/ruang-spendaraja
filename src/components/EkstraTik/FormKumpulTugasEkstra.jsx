import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  UploadCloud, FileText, CheckCircle2, AlertCircle, File, Eye, ExternalLink, 
  RefreshCw, X, FolderCheck, Database, Image, Check, Users, Search, 
  Download, Filter, ShieldCheck, UserCheck, Star, Lock, Award
} from 'lucide-react';
import { 
  kumpulTugasEkstraSupabase, 
  getMasterTugasEkstra, 
  getTugasPengumpulanEkstra,
  subscribeTugasPengumpulanEkstra,
  generateTugasCsv,
  downloadCsvFile,
  formatFileSize 
} from '../../services/ekstraTikService';
import ModalPreviewDokumen from './ModalPreviewDokumen';
import RiwayatTugasItem from './RiwayatTugasItem';

export default function FormKumpulTugasEkstra({ user, anggotaList = [], onOpenLogin }) {
  const [masterTugasList, setMasterTugasList] = useState([]);
  const [selectedTugasId, setSelectedTugasId] = useState('');
  const [catatan, setCatatan] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [loadingRiwayat, setLoadingRiwayat] = useState(false);
  const [successItem, setSuccessItem] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [riwayatTugas, setRiwayatTugas] = useState([]);

  // Filter & Pencarian Riwayat Pengumpulan
  const [viewScope, setViewScope] = useState('all'); // 'all' (Semua Tugas Siswa) | 'selected' (Siswa Terpilih)
  const [filterKelas, setFilterKelas] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTugasId, setFilterTugasId] = useState('');

  // Modal Preview state
  const [previewFile, setPreviewFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Anggota terpilih dari 42 anggota resmi
  const [selectedAnggota, setSelectedAnggota] = useState(null);

  const fileInputRef = useRef(null);

  const isAdmin =
    user?.role === 'admin' ||
    user?.role === 'guru' ||
    user?.role_2 === 'admin' ||
    user?.role_2 === 'guru';

  // Deteksi otomatis jika user login terdaftar di 42 anggota
  const loggedInMember = useMemo(() => {
    if (!user) return null;
    if (user?.id) {
      const byId = anggotaList.find((m) => String(m.siswa_id) === String(user.id));
      if (byId) return byId;
    }
    return anggotaList.find(
      (m) =>
        (user.NISN && m.nisn && String(m.nisn).trim() === String(user.NISN).trim()) ||
        (user.NAMA && m.nama && m.nama.toLowerCase().trim() === user.NAMA.toLowerCase().trim() && m.kelas === user.Kelas) ||
        (user.NAMA && m.nama && m.nama.toLowerCase().trim() === user.NAMA.toLowerCase().trim())
    );
  }, [anggotaList, user]);

  // Sinkronkan selectedAnggota default dari data login jika belum memilih
  useEffect(() => {
    if (loggedInMember && !selectedAnggota) {
      setSelectedAnggota(loggedInMember);
    }
  }, [loggedInMember, selectedAnggota]);

  const activeAnggota = selectedAnggota || loggedInMember || null;
  const activeNama = activeAnggota?.nama || (user?.role === 'siswa' ? user?.NAMA : '') || '';
  const activeKelas = activeAnggota?.kelas || (user?.role === 'siswa' ? user?.Kelas : '') || '';
  const activeNisn = activeAnggota?.nisn || (user?.role === 'siswa' ? user?.NISN : '') || '';
  const activeNoAbsen = activeAnggota?.no_absen || (user?.role === 'siswa' ? user?.['No Absen'] : '') || '';
  const activeSiswaId = activeAnggota?.siswa_id || (user?.role === 'siswa' ? user?.id : null) || null;

  // 1. Muat master tugas dari Supabase
  const loadMasterTugas = useCallback(async () => {
    try {
      const tugas = await getMasterTugasEkstra();
      setMasterTugasList(tugas || []);
      if (tugas && tugas.length > 0 && !selectedTugasId) {
        setSelectedTugasId(tugas[0].id);
      }
    } catch (err) {
      console.warn('Gagal memuat master tugas:', err);
    }
  }, [selectedTugasId]);

  // 2. Muat riwayat pengumpulan tugas dari Supabase
  // Jika viewScope === 'all', query mengambil SELURUH pengumpulan tugas siswa (null)
  // Jika viewScope === 'selected', query difilter untuk activeSiswaId
  const loadRiwayatTugas = useCallback(async () => {
    setLoadingRiwayat(true);
    try {
      const targetSiswaId = viewScope === 'selected' ? (activeSiswaId || null) : null;
      const targetNisn = viewScope === 'selected' ? (activeNisn || null) : null;
      const targetNama = viewScope === 'selected' ? (activeNama || null) : null;

      const data = await getTugasPengumpulanEkstra(
        filterTugasId || null,
        targetSiswaId,
        targetNisn,
        targetNama
      );
      setRiwayatTugas(data || []);
    } catch (e) {
      console.warn('Gagal memuat riwayat tugas Supabase:', e);
    } finally {
      setLoadingRiwayat(false);
    }
  }, [viewScope, activeSiswaId, activeNisn, activeNama, filterTugasId]);

  useEffect(() => {
    loadMasterTugas();
  }, [loadMasterTugas]);

  useEffect(() => {
    loadRiwayatTugas();
  }, [loadRiwayatTugas]);

  // Realtime subscription untuk tugas baru masuk
  useEffect(() => {
    const unsubscribe = subscribeTugasPengumpulanEkstra(() => {
      loadRiwayatTugas();
    });
    return () => unsubscribe();
  }, [loadRiwayatTugas]);

  const handleSelectMember = (member) => {
    setSelectedAnggota(member);
    setErrorMsg('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        setErrorMsg('Ukuran file maksimal adalah 25MB');
        return;
      }
      setSelectedFile(file);
      setErrorMsg('');
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        setErrorMsg('Ukuran file maksimal adalah 25MB');
        return;
      }
      setSelectedFile(file);
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessItem(null);
    setUploadProgress(0);

    if (!activeAnggota && !activeNama.trim()) {
      setErrorMsg('Silakan pilih data siswa dari 42 anggota Ekstra TIK terlebih dahulu.');
      return;
    }
    if (!selectedTugasId) {
      setErrorMsg('Silakan pilih tugas yang ingin dikumpulkan');
      return;
    }
    if (isSelectedTugasGraded) {
      setErrorMsg('Tugas ini sudah dinilai oleh guru/pengurus lab dan telah dikunci. Berkas tidak dapat diubah.');
      return;
    }
    if (!selectedFile) {
      setErrorMsg('Silakan pilih berkas tugas yang ingin dikumpulkan');
      return;
    }

    setSubmitting(true);
    try {
      const res = await kumpulTugasEkstraSupabase({
        id_tugas: selectedTugasId,
        nama: activeNama,
        kelas: activeKelas,
        nisn: activeNisn || null,
        siswa_id: activeSiswaId || null,
        file: selectedFile,
        catatan_siswa: catatan,
        onUploadProgress: (pct) => setUploadProgress(pct)
      });

      setSuccessItem(res);
      setSelectedFile(null);
      setCatatan('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadRiwayatTugas();
    } catch (err) {
      console.error('Gagal mengunggah tugas:', err);
      setErrorMsg(err.message || 'Gagal mengunggah tugas ke Cloudinary');
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleOpenPreview = (item, extra = {}) => {
    setPreviewFile({
      fileName: item.file_name || item.fileName,
      fileUrl: item.file_url || item.fileUrl,
      previewUrl: item.file_url || item.fileUrl,
      judulTugas: item.ekstra_tugas_master?.judul_tugas || item.judul_tugas || item.judulTugas || 'Tugas Ekstra TIK',
      nama: item.nama || item.master_siswa?.NAMA,
      kelas: item.kelas || item.master_siswa?.Kelas,
      canDownload: typeof extra?.canDownload === 'boolean' ? extra.canDownload : undefined
    });
    setIsPreviewOpen(true);
  };

  const availableClasses = useMemo(() => {
    const list = anggotaList.map((m) => m.kelas).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [anggotaList]);

  const filteredRiwayat = useMemo(() => {
    return riwayatTugas.filter((item) => {
      if (filterKelas && item.kelas !== filterKelas) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchNama = (item.nama || '').toLowerCase().includes(q);
        const matchFile = (item.file_name || '').toLowerCase().includes(q);
        const matchCatatan = (item.catatan_siswa || '').toLowerCase().includes(q);
        const matchJudul = (item.ekstra_tugas_master?.judul_tugas || item.judul_tugas || '').toLowerCase().includes(q);
        if (!matchNama && !matchFile && !matchCatatan && !matchJudul) return false;
      }
      return true;
    });
  }, [riwayatTugas, filterKelas, searchQuery]);

  const handleDownloadCsv = () => {
    if (!isAdmin || filteredRiwayat.length === 0) return;
    const csv = generateTugasCsv(filteredRiwayat);
    downloadCsvFile(csv, `Rekap_Tugas_Ekstra_TIK_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const existingSubmissionForSelectedTugas = useMemo(() => {
    if (!selectedTugasId) return null;
    return riwayatTugas.find((item) => {
      if (item.id_tugas !== selectedTugasId) return false;
      if (activeSiswaId && item.siswa_id && String(item.siswa_id) === String(activeSiswaId)) return true;
      if (activeNisn && item.nisn && String(item.nisn).trim() === String(activeNisn).trim()) return true;
      if (activeNama && item.nama && activeNama.trim().toLowerCase() === item.nama.trim().toLowerCase()) return true;
      return false;
    });
  }, [riwayatTugas, selectedTugasId, activeSiswaId, activeNisn, activeNama]);

  const isSelectedTugasGraded = Boolean(
    existingSubmissionForSelectedTugas &&
    existingSubmissionForSelectedTugas.nilai !== null &&
    existingSubmissionForSelectedTugas.nilai !== undefined
  );

  const currentSelectedTugasObj = masterTugasList.find((t) => t.id === selectedTugasId);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Form Upload Tugas */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between gap-2.5 mb-5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-800">
                  Unggah Berkas Tugas Ekstra TIK
                </h2>
                <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <span>Penyimpanan Cloudinary Cloud:</span>
                  <strong className="font-mono text-indigo-600 bg-indigo-50 px-1 rounded">
                    tugas_ekstra_tik7
                  </strong>
                </p>
              </div>
            </div>

            {/* Badge Anggota Resmi */}
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>{anggotaList.length || 42} Anggota</span>
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pilihan Siswa dari 42 Anggota Ekstra TIK */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Pilih dari 42 Anggota Ekstra TIK</span>
                </span>
                {activeAnggota && (
                  <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Anggota #{activeAnggota.no_daftar}
                  </span>
                )}
              </label>
              <select
                value={activeAnggota ? (activeAnggota.siswa_id || activeAnggota.id || String(activeAnggota.no_daftar)) : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) {
                    setSelectedAnggota(null);
                    return;
                  }
                  const found = anggotaList.find(
                    (m) => String(m.siswa_id) === val || String(m.id) === val || String(m.no_daftar) === val
                  );
                  if (found) {
                    handleSelectMember(found);
                  }
                }}
                className="w-full text-xs sm:text-sm px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium cursor-pointer"
              >
                <option value="">-- Klik untuk Memilih Siswa (42 Anggota Resmi) --</option>
                {anggotaList.map((m) => (
                  <option
                    key={m.id || m.siswa_id || m.no_daftar}
                    value={m.siswa_id || m.id || String(m.no_daftar)}
                  >
                    #{m.no_daftar}. {m.nama} — Kelas {m.kelas} (Absen {m.no_absen ?? '-'})
                  </option>
                ))}
              </select>
            </div>

            {/* Nama & Kelas Siswa: Terisi Otomatis & Terkunci (Tanpa Isi Manual) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Nama Lengkap Siswa</span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Otomatis
                  </span>
                </label>
                <input
                  type="text"
                  value={activeNama}
                  readOnly
                  placeholder="Pilih nama dari 42 anggota di atas..."
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-100/90 border border-slate-200 rounded-xl text-slate-800 font-semibold cursor-not-allowed select-none"
                  required
                />
                {activeAnggota ? (
                  <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <Check className="w-3 h-3" />
                    <span>Terdaftar Anggota #{activeAnggota.no_daftar} • NISN: {activeAnggota.nisn || '-'}</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-amber-600 font-medium mt-1">
                    ⚠️ Silakan pilih nama siswa dari 42 Anggota di atas agar data terisi otomatis.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Kelas</span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Otomatis
                  </span>
                </label>
                <input
                  type="text"
                  value={activeKelas ? `Kelas ${activeKelas}` : ''}
                  readOnly
                  placeholder="Otomatis"
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-100/90 border border-slate-200 rounded-xl text-slate-800 font-semibold cursor-not-allowed text-center select-none"
                />
                {activeAnggota?.no_absen && (
                  <div className="text-[10px] text-slate-500 font-medium text-center mt-1">
                    No Absen: {activeAnggota.no_absen}
                  </div>
                )}
              </div>
            </div>

            {/* Pilihan Tugas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pilih Tugas yang Dikumpulkan
              </label>
              {masterTugasList.length === 0 ? (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 border border-slate-200">
                  Memuat daftar tugas...
                </div>
              ) : (
                <select
                  value={selectedTugasId}
                  onChange={(e) => setSelectedTugasId(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
                >
                  {masterTugasList.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.judul_tugas}
                    </option>
                  ))}
                </select>
              )}
              {currentSelectedTugasObj?.deskripsi && (
                <div className="p-2.5 bg-indigo-50/70 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 mt-2">
                  <strong className="block font-bold mb-0.5">Petunjuk Tugas:</strong>
                  <span>{currentSelectedTugasObj.deskripsi}</span>
                </div>
              )}
            </div>

            {/* Area Status Tugas Terkunci vs Unggah File */}
            {isSelectedTugasGraded ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200/90 shadow-2xs space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tugas Telah Dinilai & Dikunci</span>
                  </span>
                  <span className="p-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-700 shadow-2xs">
                    <Lock className="w-4 h-4" />
                  </span>
                </div>

                <div className="flex items-center gap-3.5 bg-white p-3 sm:p-4 rounded-xl border border-emerald-100">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex flex-col items-center justify-center shadow-md shadow-amber-500/20 shrink-0 font-mono">
                    <Star className="w-4 h-4 text-amber-100 fill-amber-100" />
                    <span className="text-base font-black leading-none mt-0.5">{existingSubmissionForSelectedTugas.nilai}</span>
                    <span className="text-[8px] text-amber-100 uppercase tracking-wider font-sans font-bold">Poin</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                      {existingSubmissionForSelectedTugas.file_name}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 font-mono mt-0.5">
                      <FileText className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span>{existingSubmissionForSelectedTugas.submitted_at ? new Date(existingSubmissionForSelectedTugas.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenPreview(existingSubmissionForSelectedTugas, { canDownload: true })}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Berkas Saya</span>
                      </button>
                    </div>
                  </div>
                </div>

                {existingSubmissionForSelectedTugas.feedback_guru && (
                  <div className="p-3 rounded-xl bg-white/95 border border-emerald-100 text-[11px] text-emerald-950 space-y-1">
                    <span className="font-bold text-emerald-800 flex items-center gap-1 text-[11px]">
                      💬 Catatan Evaluasi Guru:
                    </span>
                    <p className="italic text-slate-700 pl-1 leading-relaxed">"{existingSubmissionForSelectedTugas.feedback_guru}"</p>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1 pt-1">
                  <Lock className="w-3 h-3" />
                  <span>Nilai resmi telah tercatat. Tugas ini tidak dapat diunggah ulang atau diperbaiki.</span>
                </div>
              </div>
            ) : (
              <>
                {/* Area Unggah File Drag & Drop */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Berkas Tugas (Word, PDF, Scratch .sb3, Gambar)
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".doc,.docx,.pdf,.sb3,.png,.jpg,.jpeg,.zip,.rar"
                  />

                  {!selectedFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition ${
                        isDragging
                          ? 'border-indigo-500 bg-indigo-50/50'
                          : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <UploadCloud className="w-10 h-10 text-indigo-500 mx-auto mb-2 opacity-80" />
                      <p className="text-xs sm:text-sm font-bold text-slate-700 mb-1">
                        Tarik & Lepas berkas di sini, atau{' '}
                        <span className="text-indigo-600 underline">Pilih File</span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Mendukung Word (.docx), PDF, Scratch (.sb3), Canva, Gambar. Maksimal 25MB.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {formatFileSize(selectedFile.size)} • Siap diunggah ke Cloudinary
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Batal pilih file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Pesan Siswa */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catatan Siswa (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Contoh: Pak, ini tugas surat resmi Microsoft Word saya..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Progress Bar Upload */}
                {submitting && uploadProgress > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-indigo-700 font-bold">
                      <span>Mengunggah ke Cloudinary ({uploadProgress}%)...</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-2 transition-all duration-200" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Success Message */}
                {successItem && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Tugas Berhasil Terunggah!</strong>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        Berkas telah disimpan di Cloudinary dan tercatat di database Supabase.
                      </p>
                    </div>
                  </div>
                )}

                {/* Tombol Submit */}
                <button
                  type="submit"
                  disabled={submitting || !selectedFile}
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Mengunggah ke Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Kirim Tugas ke Cloudinary</span>
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        </div>

        {/* Kolom Kanan: Riwayat Pengumpulan Tugas */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col">
          {/* Header Panel Riwayat */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                <FolderCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                    Riwayat Tugas Terkumpul
                  </h3>
                  {isAdmin && (
                    <span className="hidden sm:inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  {isAdmin ? 'Melihat seluruh pengumpulan tugas 42 anggota' : 'Data dari tabel ekstra_tugas_pengumpulan'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  disabled={filteredRiwayat.length === 0}
                  className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg border border-slate-200 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Unduh Rekap Tugas (.CSV)"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                </button>
              )}

              <button
                type="button"
                onClick={loadRiwayatTugas}
                disabled={loadingRiwayat}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg border border-slate-200 transition cursor-pointer"
                title="Muat Ulang Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingRiwayat ? 'animate-spin text-indigo-600' : ''}`} />
              </button>

              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                {filteredRiwayat.length}
              </span>
            </div>
          </div>

          {/* Toggle Cakupan: Semua Siswa vs Siswa Terpilih */}
          <div className="mt-3 flex items-center p-1 bg-slate-100 rounded-xl gap-1 text-xs">
            <button
              type="button"
              onClick={() => setViewScope('all')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center justify-center gap-1.5 ${
                viewScope === 'all'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Semua Siswa ({riwayatTugas.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setViewScope('selected')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center justify-center gap-1.5 ${
                viewScope === 'selected'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="truncate">
                {activeNama ? activeNama.split(' ')[0] : 'Siswa Terpilih'}
              </span>
            </button>
          </div>

          {/* Filter Bar: Pencarian & Kelas & Tugas */}
          <div className="mt-2.5 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari siswa atau nama berkas..."
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                className="flex-1 py-1 px-2 text-[11px] font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Semua Kelas</option>
                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>Kelas {cls}</option>
                ))}
              </select>

              <select
                value={filterTugasId}
                onChange={(e) => setFilterTugasId(e.target.value)}
                className="flex-1 py-1 px-2 text-[11px] font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 truncate"
              >
                <option value="">Semua Tugas</option>
                {masterTugasList.map((t) => (
                  <option key={t.id} value={t.id}>{t.judul_tugas}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Daftar Tugas Terkumpul */}
          <div className="mt-3 flex-1 overflow-hidden flex flex-col">
            {loadingRiwayat ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-500 mb-2" />
                <p className="text-xs">Memuat data pengumpulan tugas...</p>
              </div>
            ) : filteredRiwayat.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 my-2">
                <File className="w-10 h-10 mb-2 stroke-1 opacity-50 text-indigo-400" />
                <p className="text-xs font-semibold text-slate-600">
                  {riwayatTugas.length === 0 ? 'Belum ada tugas yang dikumpulkan.' : 'Tidak ada tugas yang sesuai filter.'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {viewScope === 'selected' 
                    ? 'Coba ganti ke tab "Semua Siswa" untuk melihat tugas dari seluruh anggota.' 
                    : 'Tugas yang dikirim siswa akan langsung muncul di sini.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[480px] pr-1 mt-1">
                {filteredRiwayat.map((item) => (
                  <RiwayatTugasItem
                    key={item.id}
                    item={item}
                    user={user}
                    activeSiswaId={activeSiswaId}
                    activeNama={activeNama}
                    activeKelas={activeKelas}
                    isAdmin={isAdmin}
                    onPreview={handleOpenPreview}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Preview Dokumen */}
      <ModalPreviewDokumen
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        fileData={previewFile}
      />
    </>
  );
}
