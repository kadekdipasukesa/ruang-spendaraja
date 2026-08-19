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
  Tag
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function LogScoreTugas({ student, isAdmin }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('mine'); // 'mine' (default) | 'all'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('SEMUA');

  const currentStudentId = student?.id;

  // 1. Fetch data from point_logs joined with master_siswa
  const fetchPointLogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('point_logs')
        .select(`
          id,
          siswa_id,
          amount,
          activity_type,
          description,
          created_at,
          tugas_pengumpulan_id,
          master_siswa (
            id,
            "NAMA",
            "Kelas",
            "No Absen"
          )
        `)
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) {
        console.warn('Gagal memuat point_logs:', error);
      } else {
        setLogs(data || []);
      }
    } catch (err) {
      console.error('Error fetch point_logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPointLogs();
  }, [fetchPointLogs]);

  // 2. Realtime listener for point_logs
  useEffect(() => {
    const channel = supabase
      .channel(`point_logs_live_${Math.random().toString(36).substring(2, 7)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'point_logs' }, () => {
        fetchPointLogs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPointLogs]);

  // 3. Filtered Logs based on viewMode ('mine' vs 'all'), selectedActivity, and searchTerm
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Filter kepemilikan siswa: 'mine' (default) hanya milik siswa yang login
      if (viewMode === 'mine' && currentStudentId) {
        if (log.siswa_id !== currentStudentId) return false;
      }

      // Filter activity type
      if (selectedActivity !== 'SEMUA') {
        const type = (log.activity_type || '').toLowerCase();
        if (type !== selectedActivity.toLowerCase()) return false;
      }

      // Search matching (deskripsi, nama siswa, kelas)
      const studentObj = log.master_siswa;
      const sName = (studentObj?.NAMA || '').toLowerCase();
      const sClass = (studentObj?.Kelas || '').toLowerCase();
      const desc = (log.description || '').toLowerCase();
      const actType = (log.activity_type || '').toLowerCase();
      const term = searchTerm.toLowerCase();

      const match =
        desc.includes(term) ||
        sName.includes(term) ||
        sClass.includes(term) ||
        actType.includes(term);

      return match;
    });
  }, [logs, viewMode, currentStudentId, selectedActivity, searchTerm]);

  // 4. Quick Statistics
  const myTotalPoints = useMemo(() => {
    if (!currentStudentId) return 0;
    return logs
      .filter((l) => l.siswa_id === currentStudentId)
      .reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
  }, [logs, currentStudentId]);

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
              Riwayat lengkap pencatatan penambahan dan pembaruan poin dari tugas, game, dan kuis pembelajaran.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchPointLogs}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all self-start sm:self-auto"
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
              className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                viewMode === 'mine'
                  ? 'bg-white text-indigo-600 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="btn-filter-log-mine"
            >
              <User className="w-3.5 h-3.5" />
              <span>Poin Saya</span>
              {currentStudentId && (
                <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-black">
                  {myTotalPoints} Poin
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap capitalize ${
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
            const studentObj = log.master_siswa;
            const sName = studentObj?.NAMA || 'Siswa';
            const sClass = studentObj?.Kelas || '-';
            const sAbsen = studentObj?.['No Absen'] || '-';
            const isMyLog = currentStudentId && log.siswa_id === currentStudentId;
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
                      {(viewMode === 'all' || isAdmin) && studentObj && (
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

