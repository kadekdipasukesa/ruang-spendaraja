import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Flame,
  Trophy,
  Medal,
  Crown,
  Search,
  Users,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  X,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';

/**
 * Helper untuk inisial nama siswa (maks 2 karakter)
 */
function getInitials(fullName) {
  if (!fullName) return '?';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Palet warna gradien inisial avatar yang konsisten berdasarkan ID / nama siswa
 */
function getAvatarGradient(key) {
  const gradients = [
    'from-amber-500 to-orange-600 text-white',
    'from-blue-500 to-indigo-600 text-white',
    'from-emerald-500 to-teal-600 text-white',
    'from-purple-500 to-pink-600 text-white',
    'from-rose-500 to-red-600 text-white',
    'from-cyan-500 to-blue-600 text-white'
  ];
  const hash = (key || '').toString().split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}

/**
 * Komponen Avatar Siswa dengan penanganan gambar error & inisial
 */
function StudentAvatar({ photoUrl, name, id, size = 'md', className = '' }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [photoUrl]);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs sm:text-sm',
    lg: 'w-14 h-14 sm:w-16 sm:h-16 text-base sm:text-lg',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 text-lg sm:text-xl'
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  if (photoUrl && !hasError) {
    return (
      <div className={`relative shrink-0 rounded-full overflow-hidden bg-slate-100 ${selectedSize} ${className}`}>
        <img
          src={photoUrl}
          alt={name || 'Foto Siswa'}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      </div>
    );
  }

  const gradient = getAvatarGradient(id || name);
  return (
    <div
      className={`relative shrink-0 rounded-full flex items-center justify-center font-black select-none bg-gradient-to-br shadow-inner ${gradient} ${selectedSize} ${className}`}
    >
      <span>{getInitials(name)}</span>
    </div>
  );
}

export default function LeaderboardKelas({
  leaderboard = [],
  availableClasses = [],
  selectedClass = 'SEMUA',
  setSelectedClass,
  student
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreTimestamps, setScoreTimestamps] = useState({});
  const myRowRef = useRef(null);

  const currentStudentId = student?.id;
  const currentStudentName = (student?.NAMA || student?.nama || '').toLowerCase();
  const currentStudentNisn = student?.NISN;

  // 1. Sinkronisasi timestamp perolehan skor dari point_logs untuk tie-breaker
  useEffect(() => {
    let isMounted = true;

    async function fetchScoreTimestamps() {
      try {
        let from = 0;
        const step = 1000;
        let hasMore = true;
        const timestampsMap = {};

        while (hasMore) {
          const { data, error } = await supabase
            .from('point_logs')
            .select('siswa_id, created_at')
            .range(from, from + step - 1);

          if (error) {
            console.warn('Gagal memuat point_logs leaderboard:', error.message);
            break;
          }

          if (data && data.length > 0) {
            data.forEach((log) => {
              if (!log.siswa_id) return;
              const time = new Date(log.created_at).getTime();
              // Catat waktu perolehan skor (saat mencapai skor kumulatif terkini)
              if (!timestampsMap[log.siswa_id] || time > timestampsMap[log.siswa_id]) {
                timestampsMap[log.siswa_id] = time;
              }
            });
            from += step;
            if (data.length < step) hasMore = false;
          } else {
            hasMore = false;
          }
        }

        if (isMounted) {
          setScoreTimestamps(timestampsMap);
        }
      } catch (err) {
        console.warn('Error sinkronisasi waktu skor leaderboard:', err);
      }
    }

    fetchScoreTimestamps();

    // Listener realtime pembaruan poin
    const channelId = `lb_pts_${Math.random().toString(36).substring(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'point_logs' }, () => {
        fetchScoreTimestamps();
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [leaderboard]);

  // 2. Normalisasi & Filter Siswa Kelas 7 dengan total_points > 0
  const activeLeaderboard = useMemo(() => {
    const list = leaderboard.filter((item) => {
      const points = Number(item.total_points) || 0;
      if (points <= 0) return false;

      const k = (item.Kelas || item.KELAS || '').toString().trim();
      const isGrade7 = k.startsWith('7') || k.startsWith('VII') || k.startsWith('7.');
      if (!isGrade7) return false;

      // Filter by selectedClass
      if (selectedClass && selectedClass !== 'SEMUA') {
        const itemClassClean = k.replace(/^Kelas\s+/i, '').trim().toUpperCase();
        const selectedClean = selectedClass.replace(/^Kelas\s+/i, '').trim().toUpperCase();
        if (itemClassClean !== selectedClean) return false;
      }

      return true;
    });

    // Aturan Pengurutan Tie-Breaker:
    // 1. total_points terbesar lebih tinggi
    // 2. Jika skor sama: yang duluan memperoleh skor (timestamp lebih awal) di atas
    // 3. Jika sama persis: urutkan alfabetis nama
    return list.sort((a, b) => {
      const ptsA = Number(a.total_points) || 0;
      const ptsB = Number(b.total_points) || 0;

      if (ptsB !== ptsA) {
        return ptsB - ptsA;
      }

      const timeA = scoreTimestamps[a.id] || Infinity;
      const timeB = scoreTimestamps[b.id] || Infinity;
      if (timeA !== timeB) {
        return timeA - timeB;
      }

      return (a.NAMA || '').localeCompare(b.NAMA || '');
    });
  }, [leaderboard, selectedClass, scoreTimestamps]);

  // 3. Tab Kelas 7 (SEMUA, 7.1 hingga 7.10)
  const grade7Classes = useMemo(() => {
    const defaultClasses = ['SEMUA', '7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '7.9', '7.10'];
    const dynamicClasses = availableClasses.filter(
      (c) => c === 'SEMUA' || c.toString().startsWith('7') || c.toString().startsWith('VII')
    );
    return Array.from(new Set([...defaultClasses, ...dynamicClasses]));
  }, [availableClasses]);

  // 4. Pencarian Berdasarkan Nama atau NISN
  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return activeLeaderboard;
    const term = searchTerm.toLowerCase().trim();
    return activeLeaderboard.filter((item) => {
      const name = (item.NAMA || item.nama || '').toLowerCase();
      const nisn = (item.NISN || '').toString();
      return name.includes(term) || nisn.includes(term);
    });
  }, [activeLeaderboard, searchTerm]);

  // 5. Posisi siswa saat ini
  const myPosition = useMemo(() => {
    if (!currentStudentId && !currentStudentName) return null;
    const index = activeLeaderboard.findIndex((item) => {
      return (
        Number(item.id) === Number(currentStudentId) ||
        (currentStudentNisn && item.NISN === currentStudentNisn) ||
        (currentStudentName && (item.NAMA || '').toLowerCase() === currentStudentName)
      );
    });

    if (index === -1) return null;
    return {
      rank: index + 1,
      data: activeLeaderboard[index]
    };
  }, [activeLeaderboard, currentStudentId, currentStudentNisn, currentStudentName]);

  const topThree = filteredList.slice(0, 3);

  const scrollToMyPosition = () => {
    if (myRowRef.current) {
      myRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Stat Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs relative overflow-hidden">
        {/* Soft Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Peringkat Resmi Siswa Kelas 7</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Papan Peringkat Pembelajaran</span>
              <span className="text-amber-500">🏆</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Akumulasi poin riil tugas & praktikum Informatika SMP Negeri 2 Singaraja. Diurutkan berdasarkan skor tertinggi dan kecepatan penyelesaian.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Siswa Aktif
              </span>
              <span className="text-base sm:text-lg font-black text-slate-800 font-mono tabular-nums">
                {activeLeaderboard.length}
              </span>
            </div>

            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl px-3.5 py-2.5 text-left">
              <span className="text-[10px] uppercase font-bold text-amber-700 block tracking-wider">
                Skor Tertinggi
              </span>
              <span className="text-base sm:text-lg font-black text-amber-700 font-mono tabular-nums">
                {activeLeaderboard[0]?.total_points || 0} <span className="text-xs font-semibold">pt</span>
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar & Status */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama atau NISN siswa..."
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
            <span>Filter Kelas: <strong className="text-slate-700">{selectedClass === 'SEMUA' ? 'Semua Kelas 7' : `Kelas ${selectedClass}`}</strong></span>
            <span>·</span>
            <span>Menampilkan {filteredList.length} siswa</span>
          </div>
        </div>
      </div>

      {/* 2. Class Filter Segmented Control */}
      <div className="relative">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {grade7Classes.map((cls) => {
            const isSelected = selectedClass === cls;
            return (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(cls)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
                }`}
              >
                {cls === 'SEMUA' ? 'Semua Kelas 7' : `Kelas ${cls}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Banner Posisi Siswa yang Sedang Login (Jika Terdaftar & Memiliki Poin) */}
      {myPosition && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-3.5 sm:p-4 text-white shadow-md shadow-amber-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <StudentAvatar
              photoUrl={myPosition.data.foto_profile || student?.foto_profile}
              name={myPosition.data.NAMA}
              id={myPosition.data.id}
              size="md"
              className="ring-2 ring-white/80 shadow-xs"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
                  Posisi Peringkat Anda
                </span>
                <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.2 rounded-full">
                  Peringkat #{myPosition.rank}
                </span>
              </div>
              <p className="text-sm font-extrabold truncate">
                {myPosition.data.NAMA}
                <span className="text-xs font-medium text-amber-100 ml-2">
                  (Kelas {myPosition.data.Kelas || '-'} · Absen {myPosition.data['No Absen'] || '-'})
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            <div className="text-right">
              <span className="text-base sm:text-lg font-black font-mono tabular-nums leading-none block">
                {myPosition.data.total_points || 0} pt
              </span>
              <span className="text-[10px] text-amber-100">dari {activeLeaderboard.length} siswa</span>
            </div>

            <button
              type="button"
              onClick={scrollToMyPosition}
              className="bg-white text-amber-700 hover:bg-amber-50 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Lihat di Tabel</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Podium 3 Besar Juara (Tampil jika >= 2 siswa dan tidak sedang mencari) */}
      {topThree.length >= 2 && !searchTerm && (
        <div className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 items-end">
            {/* JUARA 2 (Perak - Tampil di Kiri pada Desktop) */}
            {topThree[1] && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col items-center text-center order-2 md:order-1 relative overflow-hidden group hover:border-slate-300 transition-all"
              >
                {/* Silver Pedestal Indicator */}
                <div className="w-full flex justify-between items-center mb-3">
                  <span className="text-xs font-black text-slate-600 flex items-center gap-1">
                    <Medal className="w-4 h-4 text-slate-400" />
                    <span>Peringkat 2</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    🥈 Perak
                  </span>
                </div>

                {/* Avatar Siswa */}
                <div className="relative my-2">
                  <StudentAvatar
                    photoUrl={topThree[1].foto_profile}
                    name={topThree[1].NAMA}
                    id={topThree[1].id}
                    size="lg"
                    className="ring-3 ring-slate-300 ring-offset-2 shadow-sm"
                  />
                  <div className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-slate-200 text-slate-700 border-2 border-white flex items-center justify-center font-black text-[11px] shadow-xs">
                    2
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-2 line-clamp-1 w-full" title={topThree[1].NAMA}>
                  {topThree[1].NAMA}
                </h3>

                <p className="text-xs text-slate-500 mt-0.5">
                  Kelas {topThree[1].Kelas} · No. Absen {topThree[1]['No Absen'] || '-'}
                </p>

                <div className="mt-4 w-full py-2 px-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">Skor Akhir</span>
                  <span className="text-sm font-black text-slate-800 font-mono tabular-nums">
                    {topThree[1].total_points || 0} <span className="text-xs font-medium text-slate-500">pt</span>
                  </span>
                </div>
              </motion.div>
            )}

            {/* JUARA 1 (Emas - Podium Tengah Lebih Tinggi) */}
            {topThree[0] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="bg-gradient-to-b from-amber-500/10 via-amber-50/20 to-white rounded-3xl border-2 border-amber-400/90 p-6 shadow-md shadow-amber-500/10 flex flex-col items-center text-center order-1 md:order-2 relative overflow-hidden group hover:shadow-lg hover:shadow-amber-500/15 transition-all"
              >
                {/* Crown Banner */}
                <div className="w-full flex justify-between items-center mb-2">
                  <span className="text-xs font-black text-amber-800 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span>Juara 1</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200">
                    🥇 Emas
                  </span>
                </div>

                {/* Avatar Siswa Juara 1 */}
                <div className="relative my-2">
                  <StudentAvatar
                    photoUrl={topThree[0].foto_profile}
                    name={topThree[0].NAMA}
                    id={topThree[0].id}
                    size="xl"
                    className="ring-4 ring-amber-400 ring-offset-2 shadow-md"
                  />
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-400 text-amber-900 flex items-center justify-center shadow-sm">
                    <Crown className="w-4 h-4 text-yellow-950 fill-yellow-950" />
                  </div>
                  <div className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white border-2 border-white flex items-center justify-center font-black text-xs shadow-xs">
                    1
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-2 line-clamp-1 w-full" title={topThree[0].NAMA}>
                  {topThree[0].NAMA}
                </h3>

                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  Kelas {topThree[0].Kelas} · No. Absen {topThree[0]['No Absen'] || '-'}
                </p>

                <div className="mt-4 w-full py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-100">Skor Juara</span>
                  <span className="text-base font-black font-mono tabular-nums">
                    {topThree[0].total_points || 0} <span className="text-xs font-semibold">pt</span>
                  </span>
                </div>
              </motion.div>
            )}

            {/* JUARA 3 (Perunggu - Tampil di Kanan pada Desktop) */}
            {topThree[2] && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs flex flex-col items-center text-center order-3 md:order-3 relative overflow-hidden group hover:border-amber-200 transition-all"
              >
                {/* Bronze Pedestal Indicator */}
                <div className="w-full flex justify-between items-center mb-3">
                  <span className="text-xs font-black text-amber-900/80 flex items-center gap-1">
                    <Medal className="w-4 h-4 text-amber-600" />
                    <span>Peringkat 3</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-amber-800">
                    🥉 Perunggu
                  </span>
                </div>

                {/* Avatar Siswa */}
                <div className="relative my-2">
                  <StudentAvatar
                    photoUrl={topThree[2].foto_profile}
                    name={topThree[2].NAMA}
                    id={topThree[2].id}
                    size="lg"
                    className="ring-3 ring-amber-600/50 ring-offset-2 shadow-sm"
                  />
                  <div className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-100 text-amber-800 border-2 border-white flex items-center justify-center font-black text-[11px] shadow-xs">
                    3
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-2 line-clamp-1 w-full" title={topThree[2].NAMA}>
                  {topThree[2].NAMA}
                </h3>

                <p className="text-xs text-slate-500 mt-0.5">
                  Kelas {topThree[2].Kelas} · No. Absen {topThree[2]['No Absen'] || '-'}
                </p>

                <div className="mt-4 w-full py-2 px-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-800">Skor Akhir</span>
                  <span className="text-sm font-black text-amber-900 font-mono tabular-nums">
                    {topThree[2].total_points || 0} <span className="text-xs font-medium text-amber-700">pt</span>
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* 5. Tabel Daftar Seluruh Siswa (Daftar Peringkat Lengkap) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Header List */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight">
              Daftar Skor Siswa ({filteredList.length})
            </h3>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            Poin Tertinggi & Kecepatan Waktu
          </div>
        </div>

        {/* Rows */}
        {filteredList.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredList.map((item, index) => {
              const rankNumber = index + 1;
              const isMe =
                Number(item.id) === Number(currentStudentId) ||
                (currentStudentNisn && item.NISN === currentStudentNisn) ||
                (currentStudentName && (item.NAMA || '').toLowerCase() === currentStudentName);

              return (
                <div
                  key={item.id || item.NISN || index}
                  ref={isMe ? myRowRef : null}
                  className={`px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 sm:gap-4 transition-all ${
                    isMe
                      ? 'bg-amber-50/90 border-l-4 border-amber-500 shadow-2xs'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Bagian Kiri: Nomor Peringkat, Foto Siswa & Data */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {/* Badge Nomor Peringkat */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                        rankNumber === 1
                          ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                          : rankNumber === 2
                          ? 'bg-slate-200 text-slate-800 ring-1 ring-slate-300'
                          : rankNumber === 3
                          ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rankNumber === 1 ? '🥇' : rankNumber === 2 ? '🥈' : rankNumber === 3 ? '🥉' : rankNumber}
                    </div>

                    {/* Foto Profil Siswa Resmi */}
                    <StudentAvatar
                      photoUrl={item.foto_profile}
                      name={item.NAMA}
                      id={item.id}
                      size="md"
                      className={`shrink-0 ring-1 ${isMe ? 'ring-amber-400' : 'ring-slate-200'}`}
                    />

                    {/* Identitas Siswa */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs sm:text-sm font-bold truncate ${
                            isMe ? 'text-amber-950 font-black' : 'text-slate-900'
                          }`}
                          title={item.NAMA}
                        >
                          {item.NAMA}
                        </span>

                        {isMe && (
                          <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-amber-500 text-white shrink-0">
                            Kamu
                          </span>
                        )}

                        {rankNumber <= 3 && (
                          <span className="hidden sm:inline text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                            Top 3
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                        <span>Kelas <strong className="text-slate-600 font-semibold">{item.Kelas || '-'}</strong></span>
                        <span>·</span>
                        <span>Absen <strong className="text-slate-600 font-semibold">{item['No Absen'] || '-'}</strong></span>
                        {item.NISN && (
                          <>
                            <span className="hidden md:inline">·</span>
                            <span className="hidden md:inline font-mono">NISN: {item.NISN}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bagian Kanan: Poin */}
                  <div className="text-right shrink-0">
                    <span
                      className={`text-sm sm:text-base font-black font-mono tabular-nums tracking-tight ${
                        rankNumber === 1
                          ? 'text-amber-600'
                          : isMe
                          ? 'text-amber-700 font-black'
                          : 'text-slate-900'
                      }`}
                    >
                      {item.total_points || 0}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">Poin</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-14 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">
              Belum Ada Data Siswa Ditemukan
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchTerm
                ? `Tidak ada siswa yang cocok dengan kata kunci "${searchTerm}". Silakan periksa kembali ejaan nama atau NISN.`
                : `Belum ada siswa di ${selectedClass === 'SEMUA' ? 'semua kelas 7' : `Kelas ${selectedClass}`} yang memiliki akumulasi poin tugas.`}
            </p>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="mt-3 text-xs font-bold text-amber-700 hover:text-amber-800 underline cursor-pointer"
              >
                Reset Pencarian
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
