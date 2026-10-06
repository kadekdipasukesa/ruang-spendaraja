import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Trophy,
  Crown,
  Medal,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  Search,
  Sparkles,
  TrendingUp,
  Award,
  Layers,
  ChevronDown,
  Loader2,
  ExternalLink,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabaseClient';
import StudentAvatar from './StudentAvatar';

/**
 * Format tanggal Indonesia lengkap dengan jam (WITA)
 */
function formatIndonesianDateTime(dateString) {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';

    const dateFormatted = d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const timeFormatted = d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    return `${dateFormatted} · ${timeFormatted} WITA`;
  } catch {
    return dateString;
  }
}

export default function StudentPointHistoryModal({
  isOpen,
  onClose,
  student,
  rank
}) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(25);

  const studentId = student?.id || student?.ID || student?.siswa_id;
  const studentNisn = student?.NISN;
  const studentName = student?.NAMA || student?.nama || 'Siswa';
  const studentClass = student?.Kelas || student?.KELAS || '-';
  const studentAbsen = student?.['No Absen'] || student?.no_absen || '-';
  const totalPoints = student?.total_points ?? 0;
  const studentPhoto = student?.foto_profile;

  // Tutup modal via tombol Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Fetch riwayat perolehan nilai dari tabel point_logs
  // Menggunakan siswa_id yang sah serta mampu menangani hingga 1000+ baris data
  useEffect(() => {
    if (!isOpen || !student) {
      setLogs([]);
      setSearchTerm('');
      setVisibleCount(25);
      return;
    }

    let isMounted = true;

    async function fetchStudentLogs() {
      try {
        setLoading(true);

        // 1. Dapatkan target ID siswa yang valid
        let targetId = Number(studentId);

        // Fallback pencocokan jika ID belum tersedia di objek student
        if (!targetId || isNaN(targetId)) {
          if (studentNisn) {
            const { data: sNisn } = await supabase
              .from('master_siswa')
              .select('id')
              .eq('NISN', studentNisn)
              .maybeSingle();
            if (sNisn?.id) targetId = Number(sNisn.id);
          }

          if ((!targetId || isNaN(targetId)) && (student?.NAMA || student?.nama)) {
            const rawName = student?.NAMA || student?.nama || '';
            const { data: sNama } = await supabase
              .from('master_siswa')
              .select('id')
              .ilike('NAMA', rawName.trim())
              .maybeSingle();
            if (sNama?.id) targetId = Number(sNama.id);
          }
        }

        if (!targetId || isNaN(targetId)) {
          console.warn('ID Siswa tidak ditemukan untuk kueri point_logs:', student);
          if (isMounted) setLogs([]);
          return;
        }

        // 2. Query point_logs dengan filter siswa_id
        // Menggunakan mekanisme paginasi range 1.000 data agar aman saat data bertambah banyak
        let allLogs = [];
        let from = 0;
        const step = 1000;
        let hasMore = true;

        while (hasMore) {
          const { data, error } = await supabase
            .from('point_logs')
            .select('id, siswa_id, amount, activity_type, description, created_at, tugas_pengumpulan_id')
            .eq('siswa_id', targetId)
            .order('created_at', { ascending: false })
            .range(from, from + step - 1);

          if (error) {
            console.warn('Gagal mengambil point_logs siswa:', error.message);
            break;
          }

          if (data && data.length > 0) {
            allLogs = [...allLogs, ...data];
            from += step;
            if (data.length < step) hasMore = false;
          } else {
            hasMore = false;
          }
        }

        if (isMounted) {
          setLogs(allLogs);
        }
      } catch (err) {
        console.error('Error memuat point_logs siswa:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchStudentLogs();

    return () => {
      isMounted = false;
    };
  }, [isOpen, student, studentId, studentNisn]);

  // Filter logs berdasarkan pencarian deskripsi / aktivitas
  const filteredLogs = useMemo(() => {
    if (!searchTerm.trim()) return logs;
    const term = searchTerm.toLowerCase().trim();
    return logs.filter((log) => {
      const desc = (log.description || log.keterangan || '').toLowerCase();
      const act = (log.activity_type || log.category || '').toLowerCase();
      return desc.includes(term) || act.includes(term);
    });
  }, [logs, searchTerm]);

  // Hitung akumulasi poin dari data logs yang diambil
  const calculatedSum = useMemo(() => {
    return logs.reduce((acc, curr) => {
      const amt = Number(curr.amount ?? 0);
      return acc + (isNaN(amt) ? 0 : amt);
    }, 0);
  }, [logs]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-white rounded-3xl sm:rounded-[2rem] border border-slate-200/90 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col z-10"
        >
          {/* Tombol X Tutup Modal di Header */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer z-30 flex items-center justify-center"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 1. Header Profil Siswa */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white p-5 sm:p-6 pb-6 shrink-0 overflow-hidden">
            {/* Ambient Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl pointer-events-none -ml-12 -mb-12" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 pr-10 sm:pr-12">
              {/* Avatar Profil */}
              <div className="relative shrink-0 self-start sm:self-center">
                <StudentAvatar
                  photoUrl={studentPhoto}
                  name={studentName}
                  id={studentId}
                  size="xl"
                  className="ring-4 ring-white/30 shadow-xl"
                />

                {/* Badge Rank Icon pada Avatar */}
                {rank && (
                  <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shadow-md border-2 border-white ${
                    rank === 1
                      ? 'bg-amber-400 text-amber-950'
                      : rank === 2
                      ? 'bg-slate-300 text-slate-800'
                      : rank === 3
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 text-white'
                  }`}>
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                  </div>
                )}
              </div>

              {/* Detail Identitas */}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {rank && (
                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      rank === 1
                        ? 'bg-amber-400/90 text-amber-950 border border-amber-300'
                        : rank === 2
                        ? 'bg-slate-200 text-slate-900 border border-slate-300'
                        : rank === 3
                        ? 'bg-amber-700/80 text-white border border-amber-600'
                        : 'bg-white/15 text-white border border-white/20'
                    }`}>
                      {rank === 1 ? <Crown className="w-3 h-3 fill-amber-950" /> : <Trophy className="w-3 h-3" />}
                      <span>{rank === 1 ? 'Juara 1 Emas' : rank === 2 ? 'Juara 2 Perak' : rank === 3 ? 'Juara 3 Perunggu' : `Peringkat #${rank}`}</span>
                    </span>
                  )}

                  <span className="text-[11px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded-md">
                    Kelas {studentClass}
                  </span>
                  <span className="text-[11px] font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded-md">
                    Absen {studentAbsen}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight truncate" title={studentName}>
                  {studentName}
                </h3>

                <p className="text-xs text-slate-300 flex items-center gap-2 flex-wrap font-medium">
                  {studentNisn && <span>NISN: <strong className="text-white font-mono">{studentNisn}</strong></span>}
                  <span>·</span>
                  <span>SMP Negeri 2 Singaraja</span>
                </p>
              </div>

              {/* Kartu Skor Total */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-3.5 text-right shrink-0 self-start sm:self-center min-w-[110px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200 block">
                  Total Nilai
                </span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums leading-none">
                  {totalPoints} <span className="text-xs font-semibold text-amber-300">pt</span>
                </span>
              </div>
            </div>
          </div>

          {/* 2. Quick Metrics Bar */}
          <div className="bg-slate-50 border-b border-slate-200/80 px-5 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap shrink-0">
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-bold">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>{logs.length} Catatan Riwayat</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Akumulasi: <strong className="text-slate-800 font-mono">{calculatedSum || totalPoints} pt</strong></span>
              </span>
            </div>

            {/* Input Filter Riwayat */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari tugas / materi..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* 3. Daftar Detail Riwayat Perolehan Nilai (Scrollable Feed) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center text-slate-400 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                <p className="text-xs font-semibold text-slate-600">Memuat riwayat perolehan skor dari database...</p>
              </div>
            ) : filteredLogs.length > 0 ? (
              <>
                <div className="space-y-2.5">
                  {filteredLogs.slice(0, visibleCount).map((log, idx) => {
                    const amount = Number(log.amount ?? 0);
                    const description = log.description || 'Menyelesaikan Tugas Pembelajaran';
                    const activityType = log.activity_type || 'tugas';
                    const createdAt = log.created_at;

                    const isPositive = amount > 0;

                    return (
                      <div
                        key={log.id || `${idx}-${createdAt}`}
                        className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-300/80 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all flex items-start justify-between gap-3 group"
                      >
                        {/* Informasi Tugas & Waktu */}
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60">
                              {activityType.replace(/_/g, ' ')}
                            </span>

                            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{formatIndonesianDateTime(createdAt)}</span>
                            </span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-amber-900 transition-colors">
                            {description}
                          </h4>

                          {log.tugas_pengumpulan_id && (
                            <p className="text-[10px] text-slate-400 font-mono">
                              Ref: {log.tugas_pengumpulan_id.substring(0, 8)}...
                            </p>
                          )}
                        </div>

                        {/* Nilai Poin yang Diperoleh */}
                        <div className="text-right shrink-0">
                          <div
                            className={`px-3 py-1.5 rounded-xl font-black font-mono tabular-nums text-sm sm:text-base flex items-center gap-1 ${
                              isPositive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            <span>{isPositive ? `+${amount}` : amount}</span>
                            <span className="text-[10px] font-bold">pt</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tombol Muat Lebih Banyak jika data > 25 */}
                {filteredLogs.length > visibleCount && (
                  <div className="pt-3 text-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 25)}
                      className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer active:scale-95"
                    >
                      <ChevronDown className="w-4 h-4" />
                      <span>Tampilkan Lebih Banyak ({filteredLogs.length - visibleCount} tersisa)</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-14 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-700">
                  {searchTerm ? 'Tidak Ditemukan Riwayat' : 'Belum Ada Riwayat Perolehan Nilai'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {searchTerm
                    ? `Tidak ditemukan catatan yang cocok dengan kata kunci "${searchTerm}".`
                    : 'Siswa belum memiliki rekaman perolehan poin yang tersimpan di sistem.'}
                </p>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="mt-3 text-xs font-bold text-amber-700 hover:text-amber-800 underline cursor-pointer"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 4. Footer Modal */}
          <div className="bg-slate-50 border-t border-slate-200/80 p-3 sm:p-4 px-5 sm:px-6 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-400">
              Audit resmi tabel <code className="font-mono text-slate-600 bg-slate-200/70 px-1 py-0.5 rounded">point_logs</code>
            </span>

            <button
              type="button"
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Tutup Modal
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
