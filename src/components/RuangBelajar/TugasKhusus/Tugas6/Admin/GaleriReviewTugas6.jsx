/**
 * src/components/RuangBelajar/TugasKhusus/Tugas6/Admin/GaleriReviewTugas6.jsx
 * Galeri Pemeriksaan Bukti Tangkapan Layar Tugas 6 (Khusus Role Admin)
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Eye, 
  Award, 
  Search, 
  Filter, 
  RefreshCw,
  X,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { supabase } from '../../../../../lib/supabaseClient';
import { TUGAS_6_CONFIG } from '../../../../../data/tugas6SurelData';
import { parseDetailJawaban } from '../../../../../utils/tugasSchemaHelper';

export default function GaleriReviewTugas6() {
  const [currentUser, setCurrentUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter
  const [selectedClass, setSelectedClass] = useState('SEMUA');
  const [selectedStatus, setSelectedStatus] = useState('menunggu_verifikasi');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Lightbox Gambar
  const [activeImagePreview, setActiveImagePreview] = useState(null);

  // Form State Nilai Cepat per Siswa: { [subId]: { skor: 100, catatan: '' } }
  const [gradingDraft, setGradingDraft] = useState({});
  const [savingSubId, setSavingSubId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // 1. Cek Autentikasi & Verifikasi Role Admin
  useEffect(() => {
    const raw = localStorage.getItem('user_siswa');
    if (raw) {
      try {
        const u = JSON.parse(raw);
        setCurrentUser(u);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const isAdmin = useMemo(() => {
    if (!currentUser) return false;
    const r1 = (currentUser.role || '').toLowerCase();
    const r2 = (currentUser.role_2 || '').toLowerCase();
    return r1 === 'admin' || r2 === 'admin';
  }, [currentUser]);

  // 2. Fetch Data Submisi Siswa
  const fetchSubmissions = useCallback(async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from('tugas_pengumpulan')
        .select(`
          id,
          tugas_id,
          siswa_id,
          status,
          skor,
          catatan_siswa,
          catatan_guru,
          detail_jawaban,
          submitted_at,
          graded_at,
          master_siswa:siswa_id (
            id,
            NAMA,
            Kelas,
            "No Absen",
            NISN,
            foto_profile,
            total_points,
            role
          )
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      // Filter yang merupakan Tugas 6 (berdasarkan kode_tugas atau tugas_id atau detail_jawaban)
      const filtered = (data || []).filter((row) => {
        const { data: detail } = parseDetailJawaban(row.detail_jawaban);
        const taskCode = detail?.meta?.kode_tugas || '';
        return (
          row.tugas_id === TUGAS_6_CONFIG.id ||
          taskCode === TUGAS_6_CONFIG.kode_tugas ||
          (detail?.stages?.tahap_1 && detail?.stages?.tahap_2 && detail?.stages?.tahap_3)
        );
      });

      setSubmissions(filtered);
    } catch (err) {
      console.error('Gagal mengambil data galeri Tugas 6:', err);
      showToast('Gagal memuat data galeri.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // 3. Handler ACC Cepat (100 Poin)
  const handleQuickAcc = async (submission) => {
    if (!isAdmin) {
      showToast('Hanya pengguna dengan role ADMIN yang berhak mengisi nilai!');
      return;
    }

    setSavingSubId(submission.id);
    try {
      const payload = {
        skor: 100,
        status: 'selesai',
        catatan_guru: 'Screenshot pengerjaan Gmail lengkap & terverifikasi admin.',
        graded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('tugas_pengumpulan')
        .update(payload)
        .eq('id', submission.id);

      if (error) throw error;

      // Update state lokal
      setSubmissions((prev) =>
        prev.map((s) => (s.id === submission.id ? { ...s, ...payload } : s))
      );

      showToast(`Nilai 100 poin berhasil diberikan kepada ${submission.master_siswa?.NAMA || 'Siswa'}!`);
    } catch (err) {
      console.error('Gagal ACC nilai:', err);
      showToast('Gagal menyimpan nilai: ' + err.message);
    } finally {
      setSavingSubId(null);
    }
  };

  // 4. Handler Nilai Kustom / Revisi
  const handleSaveCustomGrade = async (submission, customSkor, status = 'selesai') => {
    if (!isAdmin) {
      showToast('Hanya pengguna dengan role ADMIN yang berhak mengisi nilai!');
      return;
    }

    setSavingSubId(submission.id);
    const draft = gradingDraft[submission.id] || {};
    const finalSkor = status === 'revisi' ? null : Number(customSkor ?? draft.skor ?? 100);
    const finalNote = draft.catatan || (status === 'revisi' ? 'Harap perbaiki screenshot yang belum lengkap.' : 'Tugas terverifikasi.');

    try {
      const payload = {
        skor: finalSkor,
        status,
        catatan_guru: finalNote,
        graded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('tugas_pengumpulan')
        .update(payload)
        .eq('id', submission.id);

      if (error) throw error;

      setSubmissions((prev) =>
        prev.map((s) => (s.id === submission.id ? { ...s, ...payload } : s))
      );

      showToast(status === 'revisi' ? 'Status revisi telah dikirim ke siswa.' : `Nilai ${finalSkor} pt tersimpan.`);
    } catch (err) {
      console.error('Gagal simpan nilai kustom:', err);
      showToast('Gagal: ' + err.message);
    } finally {
      setSavingSubId(null);
    }
  };

  // Filter Submisi
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const siswa = sub.master_siswa || {};
      const kls = siswa.Kelas || siswa.kelas || '';
      const nama = (siswa.NAMA || siswa.nama || '').toLowerCase();
      const nisn = String(siswa.NISN || '');

      // Filter Kelas
      if (selectedClass !== 'SEMUA' && kls.toUpperCase() !== selectedClass.toUpperCase()) {
        return false;
      }
      // Filter Status
      if (selectedStatus !== 'SEMUA' && sub.status !== selectedStatus) {
        return false;
      }
      // Filter Pencarian
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!nama.includes(q) && !nisn.includes(q)) return false;
      }
      return true;
    });
  }, [submissions, selectedClass, selectedStatus, searchQuery]);

  // Daftar Kelas Tersedia
  const availableClasses = useMemo(() => {
    const set = new Set();
    submissions.forEach((s) => {
      const k = s.master_siswa?.Kelas || s.master_siswa?.kelas;
      if (k) set.add(k);
    });
    return ['SEMUA', ...Array.from(set).sort()];
  }, [submissions]);

  // Tampilan Jika BUKAN Admin
  if (!isAdmin && !loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white mb-2">Akses Terbatas (Admin Only)</h2>
          <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
            Halaman Galeri Penilaian Tugas 6 ini hanya dapat diakses oleh akun dengan peran <strong>Admin</strong> pada tabel <code>master_siswa</code>.
          </p>
          <a
            href="/ruang-belajar"
            className="inline-block py-2.5 px-5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          >
            Kembali ke Ruang Belajar
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-[99999] bg-slate-900 border border-amber-500/40 text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-2xl shadow-2xl animate-fade-in flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Galeri */}
      <header className="max-w-7xl mx-auto mb-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Panel Verifikasi Nilai
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Khusus Admin
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Galeri Tangkapan Layar Tugas 6 (Gmail)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Verifikasi 3 bukti pengerjaan Gmail siswa, beri nilai instan (100 Pt), atau minta revisi.
            </p>
          </div>

          <button
            onClick={fetchSubmissions}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Segarkan Data</span>
          </button>
        </div>

        {/* Bar Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-800">
          {/* Filter Kelas */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Filter Kelas:</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-rose-500"
            >
              {availableClasses.map((k) => (
                <option key={k} value={k}>
                  {k === 'SEMUA' ? 'Semua Kelas' : `Kelas ${k}`}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Status Penilaian:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="menunggu_verifikasi">🟡 Menunggu Review</option>
              <option value="selesai">🟢 Sudah Dinilai (ACC)</option>
              <option value="revisi">🔴 Perlu Revisi</option>
              <option value="SEMUA">Semua Status</option>
            </select>
          </div>

          {/* Pencarian Nama */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">Cari Nama Siswa / NISN:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ketik nama siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 placeholder-slate-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>
      </header>

      {/* Grid Galeri Submisi Siswa */}
      <main className="max-w-7xl mx-auto">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-400">Memuat galeri tangkapan layar siswa...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center my-8">
            <Eye className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">Tidak ada data pengerjaan yang cocok</h3>
            <p className="text-xs text-slate-500 mt-1">Coba sesuaikan filter kelas atau status di atas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredSubmissions.map((sub) => {
              const siswa = sub.master_siswa || {};
              const { data: detail } = parseDetailJawaban(sub.detail_jawaban);
              const stages = detail?.stages || {};

              const ss1 = stages.tahap_1?.screenshot_url || stages.tahap_1?.screenshot_info?.secureUrl;
              const ss2 = stages.tahap_2?.screenshot_url || stages.tahap_2?.screenshot_info?.secureUrl;
              const ss3 = stages.tahap_3?.screenshot_url || stages.tahap_3?.screenshot_info?.secureUrl;

              const isSaving = savingSubId === sub.id;

              return (
                <div
                  key={sub.id}
                  className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
                >
                  {/* Header Kartu: Profil Siswa */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-slate-800 overflow-hidden ring-2 ring-slate-700 shrink-0">
                          {siswa.foto_profile ? (
                            <img src={siswa.foto_profile} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-rose-400 text-sm">
                              {(siswa.NAMA || 'S').slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-white line-clamp-1">
                            {siswa.NAMA || 'Siswa Tanpa Nama'}
                          </h3>
                          <p className="text-xs text-slate-400">
                            Kelas {siswa.Kelas || '-'} • No. Absen {siswa['No Absen'] || '-'}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {sub.skor !== null && sub.skor !== undefined && sub.skor > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <Award className="w-3.5 h-3.5" />
                            {sub.skor} Poin
                          </span>
                        ) : sub.status === 'revisi' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Revisi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            Menunggu Review
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Waktu Pengiriman */}
                    <p className="text-[10px] text-slate-500 mb-4">
                      Dikirim: {sub.submitted_at ? new Date(sub.submitted_at).toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }) + ' WITA' : '-'}
                    </p>

                    {/* 3 Thumbnail Screenshot */}
                    <div className="grid grid-cols-3 gap-2.5 mb-4">
                      {/* SS 1: Inbox */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-400 truncate">1. Inbox</span>
                        {ss1 ? (
                          <button
                            type="button"
                            onClick={() => setActiveImagePreview({ url: ss1, title: 'Tahap 1: Kotak Masuk Gmail' })}
                            className="aspect-video w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-950 relative group cursor-pointer"
                          >
                            <img src={ss1} alt="SS1" className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                              <Eye className="w-4 h-4 text-white" />
                            </div>
                          </button>
                        ) : (
                          <div className="aspect-video w-full rounded-lg border border-dashed border-slate-800 flex items-center justify-center text-[10px] text-slate-600 bg-slate-950/40">
                            Belum ada
                          </div>
                        )}
                      </div>

                      {/* SS 2: To & Cc */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-400 truncate">2. To & Cc</span>
                        {ss2 ? (
                          <button
                            type="button"
                            onClick={() => setActiveImagePreview({ url: ss2, title: 'Tahap 2: Alamat To & Cc' })}
                            className="aspect-video w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-950 relative group cursor-pointer"
                          >
                            <img src={ss2} alt="SS2" className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                              <Eye className="w-4 h-4 text-white" />
                            </div>
                          </button>
                        ) : (
                          <div className="aspect-video w-full rounded-lg border border-dashed border-slate-800 flex items-center justify-center text-[10px] text-slate-600 bg-slate-950/40">
                            Belum ada
                          </div>
                        )}
                      </div>

                      {/* SS 3: Isi Surat */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-400 truncate">3. Surat 1 Nov</span>
                        {ss3 ? (
                          <button
                            type="button"
                            onClick={() => setActiveImagePreview({ url: ss3, title: 'Tahap 3: Surat Izin 1 November 2026' })}
                            className="aspect-video w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-950 relative group cursor-pointer"
                          >
                            <img src={ss3} alt="SS3" className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                              <Eye className="w-4 h-4 text-white" />
                            </div>
                          </button>
                        ) : (
                          <div className="aspect-video w-full rounded-lg border border-dashed border-slate-800 flex items-center justify-center text-[10px] text-slate-600 bg-slate-950/40">
                            Belum ada
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Catatan Guru Sebelumnya (Jika ada) */}
                    {sub.catatan_guru && (
                      <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 mb-4">
                        <strong className="text-slate-300">Catatan Guru:</strong> {sub.catatan_guru}
                      </p>
                    )}
                  </div>

                  {/* Bagian Bawah: Aksi Penilaian Admin */}
                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
                    {/* Tombol 1-Click ACC (100 Poin) */}
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleQuickAcc(sub)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-950/30 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isSaving ? 'Menyimpan...' : 'ACC 100 Poin'}</span>
                    </button>

                    {/* Tombol Minta Revisi */}
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => {
                        const note = window.prompt('Masukkan catatan revisi untuk siswa:', 'Tolong perbaiki screenshot yang belum jelas.');
                        if (note !== null) {
                          setGradingDraft((prev) => ({ ...prev, [sub.id]: { catatan: note } }));
                          handleSaveCustomGrade(sub, null, 'revisi');
                        }
                      }}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-500/40 font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      Minta Revisi
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Lightbox / Modal Zoom Screenshot */}
      {activeImagePreview && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-rose-400" />
                {activeImagePreview.title}
              </h4>
              <div className="flex items-center gap-2">
                <a
                  href={activeImagePreview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Tab Baru</span>
                </a>
                <button
                  type="button"
                  onClick={() => setActiveImagePreview(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950">
              <img
                src={activeImagePreview.url}
                alt="Preview Penuh"
                className="max-h-[75vh] w-auto object-contain rounded-xl shadow-lg border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
