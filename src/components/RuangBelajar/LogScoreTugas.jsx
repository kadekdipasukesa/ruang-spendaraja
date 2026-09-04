import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  FileText,
  Search,
  Filter,
  User,
  Users,
  ShieldCheck,
  Sparkles,
  Flame,
  Zap,
  TrendingUp,
  RefreshCw,
  Tag,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function LogScoreTugas({ student, isAdmin, submissions = [], tasks = [] }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('mine'); // 'mine' (default) | 'all'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('SEMUA');

  // Helper untuk cek apakah item log milik siswa yang login
  const isMatchCurrentStudent = useCallback((item, currentStudent) => {
    if (!currentStudent) return false;

    const sId = currentStudent.id ? String(currentStudent.id).trim() : '';
    const sNisn = currentStudent.NISN || currentStudent.nisn ? String(currentStudent.NISN || currentStudent.nisn).trim() : '';
    const sName = (currentStudent.NAMA || currentStudent.nama || '').trim().toLowerCase();

    const logSiswaId = item.siswa_id ? String(item.siswa_id).trim() : '';
    const logNisn = item.nisn_siswa ? String(item.nisn_siswa).trim() : '';
    const logName = (item.nama_siswa || '').trim().toLowerCase();

    // 1. Cocokkan berdasarkan ID
    if (sId && (logSiswaId === sId || logNisn === sId)) return true;
    // 2. Cocokkan berdasarkan NISN
    if (sNisn && (logNisn === sNisn || logSiswaId === sNisn)) return true;
    // 3. Cocokkan berdasarkan Nama Lengkap jika ID/NISN belum terhubung sempurna
    if (sName && logName && (logName === sName || logName.includes(sName) || sName.includes(logName))) return true;

    return false;
  }, []);

  // 1. Fetch & Normalize data from point_logs + fallback dari tugas_pengumpulan
  const fetchPointLogs = useCallback(async () => {
    try {
      setLoading(true);

      // Langkah 1: Ambil data dari tabel point_logs
      let pointLogsData = [];
      try {
        const { data, error } = await supabase
          .from('point_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(300);

        if (!error && data) {
          pointLogsData = data;
        } else if (error) {
          console.warn('Query point_logs fallback:', error.message);
        }
      } catch (e) {
        console.warn('Gagal query point_logs langsung:', e);
      }

      // Langkah 2: Ambil data tugas_pengumpulan dan tugas_master sebagai fallback audit trail
      let submissionsData = [];
      try {
        const { data: subsData, error: subsErr } = await supabase
          .from('tugas_pengumpulan')
          .select(`
            id,
            tugas_id,
            siswa_id,
            status,
            skor,
            catatan_guru,
            submitted_at,
            graded_at,
            created_at
          `)
          .order('submitted_at', { ascending: false })
          .limit(300);

        if (!subsErr && subsData) {
          submissionsData = subsData;
        }
      } catch (e) {
        console.warn('Gagal query tugas_pengumpulan fallback:', e);
      }

      // Ambil metadata judul tugas jika ada
      let taskMap = {};
      try {
        const { data: tMaster } = await supabase
          .from('tugas_master')
          .select('id, kode_tugas, judul, kategori, poin_maksimal');
        if (tMaster) {
          tMaster.forEach((t) => {
            taskMap[t.id] = t;
            if (t.kode_tugas) taskMap[t.kode_tugas] = t;
          });
        }
      } catch (e) {
        // Abaikan
      }

      // Map untuk data master_siswa untuk mengisi nama/kelas yang kosong
      let siswaMap = {};
      try {
        const { data: mSiswa } = await supabase
          .from('master_siswa')
          .select('id, NISN, "NAMA", "Kelas", "No Absen"');
        if (mSiswa) {
          mSiswa.forEach((s) => {
            siswaMap[s.id] = s;
            if (s.NISN) siswaMap[s.NISN] = s;
          });
        }
      } catch (e) {
        // Abaikan
      }

      // Langkah 3: Normalisasi baris dari point_logs
      const normalizedLogs = pointLogsData.map((item) => {
        const sInfo = siswaMap[item.siswa_id] || siswaMap[item.nisn_siswa] || {};
        const amountVal = Number(item.amount ?? item.point_change ?? item.poin ?? 0);
        const activityVal = (item.activity_type || item.category || 'tugas').toLowerCase();

        return {
          id: `pl_${item.id}`,
          rawId: item.id,
          source: 'point_logs',
          siswa_id: item.siswa_id,
          nisn_siswa: item.nisn_siswa || sInfo.NISN || '',
          nama_siswa: item.nama_siswa || sInfo.NAMA || 'Siswa',
          kelas_siswa: item.kelas_siswa || sInfo.Kelas || '-',
          no_absen: sInfo['No Absen'] || '-',
          amount: amountVal,
          activity_type: activityVal === 'tugas_selesai' ? 'tugas' : activityVal,
          description: item.description || 'Pencatatan Poin Pembelajaran',
          tugas_pengumpulan_id: item.tugas_pengumpulan_id,
          created_at: item.created_at || new Date().toISOString()
        };
      });

      // Langkah 4: Tambahkan data dari tugas_pengumpulan jika belum tercatat di point_logs
      const existingSubIds = new Set(
        normalizedLogs
          .filter((l) => l.tugas_pengumpulan_id)
          .map((l) => String(l.tugas_pengumpulan_id))
      );

      const synthesizedFromSubs = [];
      submissionsData.forEach((sub) => {
        // Lewati jika sudah ada di point_logs via tugas_pengumpulan_id
        if (sub.id && existingSubIds.has(String(sub.id))) {
          return;
        }

        const scoreVal = Number(sub.nilai_akhir ?? sub.skor ?? 0);
        if (scoreVal <= 0 && sub.status !== 'selesai' && sub.status !== 'graded') {
          return; // Abaikan jika belum ada nilai atau draft kosong
        }

        const sInfo = siswaMap[sub.siswa_id] || siswaMap[sub.nisn_siswa] || {};
        const tInfo = taskMap[sub.tugas_id] || taskMap[sub.id_tugas] || {};
        const taskTitle = tInfo.judul || sub.catatan_guru || 'Tugas Praktik Ruang Belajar';

        // Buat deskripsi yang informatif
        const desc = sub.catatan_guru || sub.feedback_guru || `${taskTitle} (Skor: ${scoreVal} Poin)`;

        synthesizedFromSubs.push({
          id: `sub_${sub.id}`,
          rawId: sub.id,
          source: 'tugas_pengumpulan',
          siswa_id: sub.siswa_id,
          nisn_siswa: sub.nisn_siswa || sInfo.NISN || '',
          nama_siswa: sub.nama_siswa || sInfo.NAMA || 'Siswa',
          kelas_siswa: sub.kelas_siswa || sInfo.Kelas || '-',
          no_absen: sInfo['No Absen'] || '-',
          amount: scoreVal,
          activity_type: 'tugas',
          description: desc,
          tugas_pengumpulan_id: sub.id,
          created_at: sub.submitted_at || sub.graded_at || sub.created_at || new Date().toISOString()
        });
      });

      // Gabungkan dan urutkan dari yang paling baru
      const merged = [...normalizedLogs, ...synthesizedFromSubs].sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });

      setLogs(merged);
    } catch (err) {
      console.error('Error fetch point_logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPointLogs();
  }, [fetchPointLogs]);

  // 2. Realtime listener for point_logs & tugas_pengumpulan
  useEffect(() => {
    const channel1 = supabase
      .channel(`point_logs_live_${Math.random().toString(36).substring(2, 7)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'point_logs' }, () => {
        fetchPointLogs();
      })
      .subscribe();

    const channel2 = supabase
      .channel(`tugas_pengumpulan_live_${Math.random().toString(36).substring(2, 7)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tugas_pengumpulan' }, () => {
        fetchPointLogs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel1);
      supabase.removeChannel(channel2);
    };
  }, [fetchPointLogs]);

  // 3. Filtered Logs based on viewMode ('mine' vs 'all'), selectedActivity, and searchTerm
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Filter kepemilikan siswa: 'mine' (default) hanya milik siswa yang login
      if (viewMode === 'mine' && student) {
        if (!isMatchCurrentStudent(log, student)) return false;
      }

      // Filter activity type
      if (selectedActivity !== 'SEMUA') {
        const type = (log.activity_type || '').toLowerCase();
        if (type !== selectedActivity.toLowerCase()) return false;
      }

      // Search matching (deskripsi, nama siswa, kelas)
      const sName = (log.nama_siswa || '').toLowerCase();
      const sClass = (log.kelas_siswa || '').toLowerCase();
      const desc = (log.description || '').toLowerCase();
      const actType = (log.activity_type || '').toLowerCase();
      const term = searchTerm.toLowerCase().trim();

      if (!term) return true;

      const match =
        desc.includes(term) ||
        sName.includes(term) ||
        sClass.includes(term) ||
        actType.includes(term);

      return match;
    });
  }, [logs, viewMode, student, selectedActivity, searchTerm, isMatchCurrentStudent]);

  // 4. Quick Statistics
  const myTotalPoints = useMemo(() => {
    if (!student) return 0;
    const sumFromLogs = logs
      .filter((l) => isMatchCurrentStudent(l, student))
      .reduce((sum, l) => sum + (Number(l.amount) || 0), 0);

    // Ambil nilai terbesar antara total_points di akun siswa atau total sum log
    const accountPoints = Number(student.total_points || 0);
    return Math.max(accountPoints, sumFromLogs);
  }, [logs, student, isMatchCurrentStudent]);

  const totalLogsCount = filteredLogs.length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Log Transaksi Poin Siswa (Buku Besar Poin)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Riwayat lengkap pencatatan penambahan dan pembaruan poin dari tugas, simulator, game, dan kuis pembelajaran.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchPointLogs}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all self-start sm:self-auto cursor-pointer"
            title="Refresh Data Log Poin"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            <span>Segarkan</span>
          </button>
        </div>

        {/* View Mode Toggle: Poin Saya (Default) vs Semua Siswa */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 w-fit">
            <button
              type="button"
              onClick={() => setViewMode('mine')}
              className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === 'mine'
                  ? 'bg-white text-indigo-600 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="btn-filter-log-mine"
            >
              <User className="w-3.5 h-3.5" />
              <span>Poin Saya</span>
              {student && (
                <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-black">
                  {myTotalPoints} Poin
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-white text-indigo-600 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="btn-filter-log-all"
            >
              <Users className="w-3.5 h-3.5 text-amber-500" />
              <span>Semua Log Siswa (Aktivitas Kelas)</span>
              <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-black">
                {logs.length} Log
              </span>
            </button>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 font-medium">
              Menampilkan: <strong className="text-slate-800">{totalLogsCount} catatan</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Search & Activity Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              viewMode === 'all'
                ? 'Cari deskripsi tugas, nama siswa, atau kelas...'
                : 'Cari riwayat poin tugas Anda...'
            }
            className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-200/90 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs"
          />
        </div>

        {/* Activity Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['SEMUA', 'tugas', 'game', 'ujian', 'bonus'].map((act) => {
            const isSelected = selectedActivity === act;
            return (
              <button
                key={act}
                type="button"
                onClick={() => setSelectedActivity(act)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap capitalize cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {act === 'SEMUA' ? 'Semua Tipe' : act}
              </button>
            );
          })}
        </div>
      </div>

      {/* Point Logs Feed List */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 shadow-2xs">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-xs font-medium text-slate-600">Memuat catatan poin dari database...</p>
        </div>
      ) : filteredLogs.length > 0 ? (
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const sName = log.nama_siswa || 'Siswa';
            const sClass = log.kelas_siswa || '-';
            const sAbsen = log.no_absen || '-';
            const isMyLog = student && isMatchCurrentStudent(log, student);
            const amountNum = Number(log.amount) || 0;

            const dateStr = log.created_at
              ? new Date(log.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : '-';

            return (
              <div
                key={log.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all shadow-2xs hover:shadow-xs ${
                  isMyLog
                    ? 'border-indigo-200/90 bg-gradient-to-r from-indigo-50/20 via-white to-white'
                    : 'border-slate-200/90'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Info Siswa & Deskripsi Log */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Activity Badge */}
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${
                          log.activity_type === 'tugas'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : log.activity_type === 'game'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : log.activity_type === 'ujian'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {log.activity_type || 'Tugas'}
                      </span>

                      {/* Info Siswa (Terutama jika dalam tampilan Semua Siswa) */}
                      {(viewMode === 'all' || isAdmin) && (
                        <span className="text-xs font-bold text-slate-800 bg-slate-100/90 px-2.5 py-0.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
                          <User className="w-3 h-3 text-indigo-600" />
                          <span>{sName}</span>
                          <span className="text-slate-400 font-normal">
                            (Kelas {sClass} • Absen {sAbsen})
                          </span>
                        </span>
                      )}

                      {/* Date & Time */}
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {dateStr}
                      </span>
                    </div>

                    {/* Log Description */}
                    <p className="text-xs sm:text-sm font-bold text-slate-800 break-words pt-0.5">
                      {log.description || 'Pencatatan Poin Pembelajaran'}
                    </p>
                  </div>

                  {/* Right: Point Badge */}
                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                    <div
                      className={`px-3.5 py-1.5 rounded-xl font-black text-sm sm:text-base flex items-center gap-1.5 shadow-2xs ${
                        amountNum > 0
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>+{amountNum} Poin</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 shadow-2xs">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3 stroke-[1.5]" />
          <h3 className="text-sm font-bold text-slate-700">
            {viewMode === 'mine' ? 'Belum Ada Log Poin Anda' : 'Belum Ada Data Log Poin'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {viewMode === 'mine'
              ? 'Selesaikan misi di timeline tugas untuk mendapatkan perolehan poin dan melihat riwayatnya di sini.'
              : 'Belum ada transaksi poin yang tercatat pada kriteria filter ini.'}
          </p>
        </div>
      )}
    </div>
  );
}


