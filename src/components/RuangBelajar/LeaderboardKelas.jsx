import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Flame,
  Search,
  Sparkles,
  X,
  Target
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

// Subkomponen Modular di folder src/components/RuangBelajar/LeaderboardKelas/
import StudentAvatar from './LeaderboardKelas/StudentAvatar';
import PodiumThree from './LeaderboardKelas/PodiumThree';
import LeaderboardTable from './LeaderboardKelas/LeaderboardTable';
import ClassFilterTabs from './LeaderboardKelas/ClassFilterTabs';
import StudentPointHistoryModal from './LeaderboardKelas/StudentPointHistoryModal';

export default function LeaderboardKelas({
  leaderboard = [],
  availableClasses = [],
  selectedClass = 'SEMUA',
  setSelectedClass,
  student
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreTimestamps, setScoreTimestamps] = useState({});
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState(null);
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

  // Handler klik siswa untuk membuka modal riwayat poin
  const handleOpenStudentHistory = (studentItem, rankNum) => {
    setSelectedStudentForHistory({
      student: studentItem,
      rank: rankNum
    });
  };

  const handleCloseStudentHistory = () => {
    setSelectedStudentForHistory(null);
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
              Akumulasi poin riil tugas & praktikum Informatika SMP Negeri 2 Singaraja. Klik pada kartu juara atau baris siswa untuk melihat rincian riwayat perolehan poinnya.
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
      <ClassFilterTabs
        grade7Classes={grade7Classes}
        selectedClass={selectedClass}
        onSelectClass={setSelectedClass}
      />

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

      {/* 4. Podium 3 Besar Juara (Klik untuk melihat riwayat skor) */}
      <PodiumThree
        topThree={topThree}
        onSelectStudent={handleOpenStudentHistory}
      />

      {/* 5. Tabel Daftar Seluruh Siswa (Daftar Peringkat Lengkap - Klik untuk melihat riwayat skor) */}
      <LeaderboardTable
        filteredList={filteredList}
        currentStudentId={currentStudentId}
        currentStudentNisn={currentStudentNisn}
        currentStudentName={currentStudentName}
        myRowRef={myRowRef}
        onSelectStudent={handleOpenStudentHistory}
        searchTerm={searchTerm}
        selectedClass={selectedClass}
        onResetSearch={() => setSearchTerm('')}
      />

      {/* 6. Modal Profil & Riwayat Perolehan Poin Siswa (Detail point_logs) */}
      {selectedStudentForHistory && (
        <StudentPointHistoryModal
          isOpen={!!selectedStudentForHistory}
          onClose={handleCloseStudentHistory}
          student={selectedStudentForHistory.student}
          rank={selectedStudentForHistory.rank}
        />
      )}
    </div>
  );
}
