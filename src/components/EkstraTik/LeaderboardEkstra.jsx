import React, { useState, useMemo } from 'react';
import { 
  Trophy, Medal, Award, Crown, Star, Sparkles, Search, 
  Filter, CheckCircle2, Calendar, User, TrendingUp, Shield
} from 'lucide-react';

export default function LeaderboardEkstra({
  user,
  anggotaList = [],
  pengumpulanList = [],
  presensiList = []
}) {
  const [filterKelas, setFilterKelas] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Daftar kelas unik
  const availableClasses = useMemo(() => {
    const list = anggotaList.map((m) => m.kelas).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [anggotaList]);

  // Hitung Skor & Peringkat per Anggota
  const leaderboardData = useMemo(() => {
    // Map pengumpulan per siswa_id
    const tugasMap = new Map();
    pengumpulanList.forEach((p) => {
      const sid = String(p.siswa_id);
      if (!tugasMap.has(sid)) {
        tugasMap.set(sid, []);
      }
      tugasMap.get(sid).push(p);
    });

    // Map presensi per siswa_id
    const presensiMap = new Map();
    presensiList.forEach((pr) => {
      const sid = String(pr.siswa_id);
      if (!presensiMap.has(sid)) {
        presensiMap.set(sid, { hadir: 0, total: 0 });
      }
      const cur = presensiMap.get(sid);
      cur.total++;
      if (pr.status_kehadiran === 'Hadir') cur.hadir++;
    });

    // Kalkulasi skor tiap anggota
    const calculated = anggotaList.map((m) => {
      const sid = String(m.siswa_id);
      const tugasSiswa = tugasMap.get(sid) || [];
      const presensiSiswa = presensiMap.get(sid) || { hadir: 0, total: 0 };

      let totalNilai = 0;
      let countDinilai = 0;
      tugasSiswa.forEach((t) => {
        if (t.nilai !== null && t.nilai !== undefined) {
          totalNilai += Number(t.nilai) || 0;
          countDinilai++;
        }
      });

      const rataRata = countDinilai > 0 ? (totalNilai / countDinilai).toFixed(1) : '0';
      // Poin XP = Total Nilai Tugas + (Kehadiran Hadir * 10 XP)
      const bonusKehadiran = presensiSiswa.hadir * 10;
      const skorTotal = totalNilai + bonusKehadiran;

      return {
        ...m,
        tugasDikumpul: tugasSiswa.length,
        tugasDinilai: countDinilai,
        totalNilai,
        rataRata,
        kehadiranHadir: presensiSiswa.hadir,
        skorTotal,
        bonusKehadiran
      };
    });

    // Urutkan berdasarkan skorTotal desc, lalu rata-rata desc, lalu kehadiran desc
    calculated.sort((a, b) => {
      if (b.skorTotal !== a.skorTotal) return b.skorTotal - a.skorTotal;
      if (Number(b.rataRata) !== Number(a.rataRata)) return Number(b.rataRata) - Number(a.rataRata);
      if (b.kehadiranHadir !== a.kehadiranHadir) return b.kehadiranHadir - a.kehadiranHadir;
      return (a.nama || '').localeCompare(b.nama || '');
    });

    // Tetapkan rank dengan tie-breaker
    return calculated.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }, [anggotaList, pengumpulanList, presensiList]);

  // Data Terfilter
  const filteredLeaderboard = useMemo(() => {
    return leaderboardData.filter((item) => {
      if (filterKelas !== 'ALL' && item.kelas !== filterKelas) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nama = (item.nama || '').toLowerCase();
        const kelas = (item.kelas || '').toLowerCase();
        if (!nama.includes(q) && !kelas.includes(q)) return false;
      }
      return true;
    });
  }, [leaderboardData, filterKelas, searchQuery]);

  // Top 3 Podium (dari data tanpa filter agar juara umum tetap konsisten)
  const top1 = leaderboardData[0] || null;
  const top2 = leaderboardData[1] || null;
  const top3 = leaderboardData[2] || null;

  // Cek apakah item adalah user login
  const isCurrentUser = (item) => {
    if (!user) return false;
    if (user.id && item.siswa_id && String(user.id) === String(item.siswa_id)) return true;
    if (user.NISN && item.nisn && String(user.NISN).trim() === String(item.nisn).trim()) return true;
    if (user.NAMA && item.nama && user.NAMA.trim().toLowerCase() === item.nama.trim().toLowerCase()) return true;
    return false;
  };

  return (
    <div className="space-y-5">
      {/* Podium Top 3 Juara */}
      <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-indigo-900/60 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-md mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Papan Klasemen Juara</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Leaderboard Ekstra TIK
          </h2>
          <p className="text-xs text-indigo-200 mt-1">
            Akumulasi nilai proyek teknologi dan keaktifan presensi mingguan
          </p>
        </div>

        {/* Podium Layout (2 - 1 - 3) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-2xl mx-auto pt-2">
          {/* Juara 2 (Perak) */}
          {top2 ? (
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-2">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-slate-300 to-slate-500 text-slate-900 flex items-center justify-center font-black text-base sm:text-xl shadow-lg border-2 border-slate-200/50">
                  {top2.nama?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -top-2.5 -right-1 w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center shadow-md border border-white font-mono">
                  2
                </div>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate w-full px-1">
                {top2.nama}
              </h4>
              <p className="text-[10px] text-slate-300 font-mono">
                {top2.kelas} • #{top2.no_absen || '-'}
              </p>
              <div className="mt-2 w-full bg-slate-800/80 rounded-xl p-2 border border-slate-700/80 text-[10px] sm:text-xs">
                <span className="font-black text-slate-200 font-mono text-xs sm:text-sm">{top2.skorTotal}</span>
                <span className="text-[9px] text-slate-400 block">Total XP</span>
              </div>
            </div>
          ) : <div />}

          {/* Juara 1 (Emas) */}
          {top1 ? (
            <div className="flex flex-col items-center text-center -translate-y-3">
              <div className="relative mb-2">
                <Crown className="w-7 h-7 sm:w-9 sm:h-9 text-amber-400 absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce" />
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-amber-950 flex items-center justify-center font-black text-xl sm:text-2xl shadow-xl shadow-amber-500/30 border-2 border-amber-200">
                  {top1.nama?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-md border-2 border-white font-mono">
                  1
                </div>
              </div>
              <h4 className="text-xs sm:text-base font-extrabold text-amber-200 truncate w-full px-1">
                {top1.nama}
              </h4>
              <p className="text-[11px] text-amber-300/80 font-mono">
                {top1.kelas} • #{top1.no_absen || '-'}
              </p>
              <div className="mt-2 w-full bg-amber-950/60 rounded-xl p-2.5 border border-amber-500/40 text-[11px] sm:text-xs shadow-inner">
                <span className="font-black text-amber-300 font-mono text-sm sm:text-base">{top1.skorTotal}</span>
                <span className="text-[9px] text-amber-300/70 block font-semibold">Total XP ⭐</span>
              </div>
            </div>
          ) : <div />}

          {/* Juara 3 (Perunggu) */}
          {top3 ? (
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-2">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100 flex items-center justify-center font-black text-base sm:text-xl shadow-lg border-2 border-amber-600/50">
                  {top3.nama?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -top-2.5 -left-1 w-6 h-6 rounded-full bg-amber-700 text-amber-100 font-black text-xs flex items-center justify-center shadow-md border border-white font-mono">
                  3
                </div>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate w-full px-1">
                {top3.nama}
              </h4>
              <p className="text-[10px] text-slate-300 font-mono">
                {top3.kelas} • #{top3.no_absen || '-'}
              </p>
              <div className="mt-2 w-full bg-slate-800/80 rounded-xl p-2 border border-slate-700/80 text-[10px] sm:text-xs">
                <span className="font-black text-amber-300 font-mono text-xs sm:text-sm">{top3.skorTotal}</span>
                <span className="text-[9px] text-slate-400 block">Total XP</span>
              </div>
            </div>
          ) : <div />}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama anggota atau kelas..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="ALL">🏫 Semua Kelas ({leaderboardData.length})</option>
            {availableClasses.map((cls) => (
              <option key={cls} value={cls}>
                Kelas {cls}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel Klasemen Seluruh Siswa */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-3 w-14 text-center">Rank</th>
                <th className="py-3 px-3">Anggota</th>
                <th className="py-3 px-3 text-center">Tugas Tuntas</th>
                <th className="py-3 px-3 text-center">Rata-rata</th>
                <th className="py-3 px-3 text-center">Kehadiran</th>
                <th className="py-3 px-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeaderboard.map((item) => {
                const isMe = isCurrentUser(item);
                const isTop3 = item.rank <= 3;

                return (
                  <tr
                    key={item.siswa_id || item.no_daftar || item.nama}
                    className={`transition ${
                      isMe
                        ? 'bg-violet-50/70 font-semibold'
                        : isTop3
                        ? 'hover:bg-amber-50/20'
                        : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <td className="py-3 px-3 text-center">
                      {item.rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-amber-100 text-amber-800 font-black text-xs border border-amber-300">
                          🥇
                        </span>
                      ) : item.rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-slate-200 text-slate-800 font-black text-xs border border-slate-300">
                          🥈
                        </span>
                      ) : item.rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-amber-800/20 text-amber-900 font-black text-xs border border-amber-700/30">
                          🥉
                        </span>
                      ) : (
                        <span className="font-mono text-slate-400 font-bold text-xs">
                          #{item.rank}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800 text-xs truncate max-w-[170px] sm:max-w-none">
                              {item.nama}
                            </span>
                            {isMe && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-violet-600 text-white shrink-0">
                                Kamu
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Kelas {item.kelas} • Absen #{item.no_absen || '-'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                        {item.tugasDikumpul} dikumpul
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center font-mono">
                      <span className="font-bold text-slate-800 text-xs">
                        {item.rataRata}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center font-mono">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {item.kehadiranHadir}x
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="font-mono font-black text-sm sm:text-base text-violet-700">
                        {item.skorTotal}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        XP
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

