import { useState, useMemo } from 'react';
import {
  Flame,
  Trophy,
  Medal,
  Award,
  Crown,
  Search,
  Users,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeaderboardKelas({
  leaderboard = [],
  availableClasses = [],
  selectedClass = 'SEMUA',
  setSelectedClass,
  student
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const currentStudentId = student?.id;
  const currentStudentName = (student?.NAMA || student?.nama || '').toLowerCase();

  // Filter only Grade 7 (Kelas 7) students AND total_points > 0
  const activeLeaderboard = useMemo(() => {
    return leaderboard.filter((item) => {
      const points = Number(item.total_points) || 0;
      if (points <= 0) return false; // Filter siswa dengan 0 poin

      const k = (item.Kelas || item.KELAS || '').toString().trim();
      const isGrade7 = k.startsWith('7') || k.startsWith('VII') || k.startsWith('7.');
      if (!isGrade7) return false;

      // Filter by selectedClass
      if (selectedClass && selectedClass !== 'SEMUA') {
        const itemClassClean = k.replace(/^Kelas\s+/i, '').trim();
        const selectedClean = selectedClass.replace(/^Kelas\s+/i, '').trim();
        if (itemClassClean !== selectedClean) return false;
      }

      return true;
    });
  }, [leaderboard, selectedClass]);

  // Filter available classes to only Grade 7 tabs (SEMUA, 7.1 to 7.10)
  const grade7Classes = useMemo(() => {
    const defaultClasses = ['SEMUA', '7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '7.9', '7.10'];
    const dynamicClasses = availableClasses.filter(
      (c) => c === 'SEMUA' || c.toString().startsWith('7') || c.toString().startsWith('VII')
    );
    const combined = Array.from(new Set([...defaultClasses, ...dynamicClasses]));
    return combined;
  }, [availableClasses]);

  // Search filtered list
  const filteredList = useMemo(() => {
    return activeLeaderboard.filter((item) => {
      const name = (item.NAMA || item.nama || '').toLowerCase();
      const nisn = (item.NISN || '').toString();
      return name.includes(searchTerm.toLowerCase()) || nisn.includes(searchTerm);
    });
  }, [activeLeaderboard, searchTerm]);

  const topThree = filteredList.slice(0, 3);
  const remainingList = filteredList.slice(3);

  return (
    <div className="space-y-6">
      {/* Header & Class Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span>Papan Peringkat Kelas 7 (Leaderboard)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Peringkat akumulasi skor tugas pembelajaran siswa Kelas 7 SMP Negeri 2 Singaraja.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama siswa kelas 7..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Class Filter Tabs - Grade 7 only */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-2xs flex items-center gap-1.5 overflow-x-auto">
        <span className="text-xs font-bold text-slate-400 px-3 uppercase tracking-wider whitespace-nowrap">
          Pilih Kelas 7:
        </span>
        {grade7Classes.map((cls) => {
          const isSelected = selectedClass === cls;
          return (
            <button
              key={cls}
              type="button"
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cls === 'SEMUA' ? 'Semua Kelas 7' : `Kelas ${cls}`}
            </button>
          );
        })}
      </div>

      {/* Top 3 Podium (If more than 2 items) */}
      {topThree.length >= 2 && !searchTerm && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* 2nd Place */}
          {topThree[1] && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs text-center flex flex-col items-center justify-between order-2 md:order-1 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center font-extrabold text-lg mb-2 shadow-xs border border-slate-200">
                <Medal className="w-6 h-6 text-slate-400" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mb-2">
                Peringkat 2
              </span>
              <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                {topThree[1].NAMA}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelas {topThree[1].Kelas} • No. {topThree[1]['No Absen'] || '-'}
              </p>
              <div className="mt-4 px-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-extrabold text-sm text-slate-700">
                {topThree[1].total_points || 0} Poin
              </div>
            </motion.div>
          )}

          {/* 1st Place (Crown) */}
          {topThree[0] && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-b from-amber-500/10 via-amber-50/20 to-white rounded-3xl border-2 border-amber-300 p-6 shadow-md text-center flex flex-col items-center justify-between order-1 md:order-2 relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-extrabold text-xl mb-2 shadow-md">
                <Crown className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full mb-2 border border-amber-200 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-600" /> Juara 1
              </span>
              <h4 className="text-base font-extrabold text-slate-900 line-clamp-1">
                {topThree[0].NAMA}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelas {topThree[0].Kelas} • No. {topThree[0]['No Absen'] || '-'}
              </p>
              <div className="mt-4 px-5 py-2 rounded-2xl bg-amber-500 text-white font-extrabold text-base shadow-sm">
                {topThree[0].total_points || 0} Poin
              </div>
            </motion.div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs text-center flex flex-col items-center justify-between order-3 md:order-3 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-extrabold text-lg mb-2 shadow-xs border border-amber-200">
                <Medal className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded-full mb-2">
                Peringkat 3
              </span>
              <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
                {topThree[2].NAMA}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelas {topThree[2].Kelas} • No. {topThree[2]['No Absen'] || '-'}
              </p>
              <div className="mt-4 px-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-extrabold text-sm text-slate-700">
                {topThree[2].total_points || 0} Poin
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Leaderboard Table List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-600" />
            Daftar Skor Siswa ({filteredList.length})
          </h3>
          <span className="text-xs text-slate-400">
            Urutan berdasarkan Total Poin tertinggi
          </span>
        </div>

        {filteredList.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredList.map((item, index) => {
              const isMe =
                item.id === currentStudentId ||
                (currentStudentName && (item.NAMA || '').toLowerCase() === currentStudentName);

              return (
                <div
                  key={item.id || index}
                  className={`px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 transition ${
                    isMe
                      ? 'bg-indigo-50/70 border-l-4 border-indigo-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Rank Number */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${
                        index === 0
                          ? 'bg-amber-100 text-amber-800'
                          : index === 1
                          ? 'bg-slate-200 text-slate-700'
                          : index === 2
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                          {item.NAMA}
                        </span>
                        {isMe && (
                          <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-indigo-600 text-white">
                            Anda
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Kelas: <strong className="text-slate-600">{item.Kelas || '-'}</strong> • Absen: <strong className="text-slate-600">{item['No Absen'] || '-'}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Points Badge */}
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm sm:text-base font-extrabold text-indigo-600">
                      {item.total_points || 0}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">Poin</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">
            Tidak ada data siswa ditemukan untuk filter ini.
          </div>
        )}
      </div>
    </div>
  );
}
