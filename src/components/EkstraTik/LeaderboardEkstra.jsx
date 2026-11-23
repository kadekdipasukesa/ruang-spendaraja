import React, { useState, useMemo } from 'react';
import { 
  Trophy, Medal, Award, Crown, Star, Sparkles, Search, 
  Filter, CheckCircle2, Calendar, User, TrendingUp, Shield,
  X, Eye, FileText, Clock, MessageSquare, AlertCircle, 
  AlertTriangle, BookOpen, ChevronRight, Layers, UserCheck
} from 'lucide-react';
import ModalPreviewDokumen from './ModalPreviewDokumen';

// Helper Avatar Siswa dengan Gambar Foto Profil & Fallback Inisial Cerdas
function StudentAvatar({ fotoProfile, nama, size = 'md', className = '' }) {
  const [imgErr, setImgErr] = useState(false);
  const initials = (nama || '?').trim().charAt(0).toUpperCase();

  const sizeStyles = {
    sm: 'w-7 h-7 text-xs rounded-lg',
    md: 'w-9 h-9 text-xs rounded-xl',
    lg: 'w-14 h-14 sm:w-16 sm:h-16 text-lg sm:text-xl rounded-2xl',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 text-xl sm:text-2xl rounded-2xl'
  };

  if (fotoProfile && !imgErr) {
    return (
      <img
        src={fotoProfile}
        alt={nama}
        onError={() => setImgErr(true)}
        className={`${sizeStyles[size] || sizeStyles.md} object-cover shadow-xs border border-white/40 shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeStyles[size] || sizeStyles.md} flex items-center justify-center font-black select-none shadow-xs shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
}

export default function LeaderboardEkstra({
  user,
  anggotaList = [],
  pengumpulanList = [],
  presensiList = []
}) {
  const [filterKelas, setFilterKelas] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Detail Siswa & Modal Pratinjau Dokumen
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalTab, setModalTab] = useState('tugas'); // 'tugas' | 'presensi'
  const [previewFile, setPreviewFile] = useState(null);

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

      // ATURAN 2: Nilai Kehadiran maksimal bobotnya 100 XP (10 XP per kehadiran, max 100 XP)
      const bonusKehadiran = Math.min(100, (presensiSiswa.hadir || 0) * 10);
      const skorTotal = totalNilai + bonusKehadiran;

      return {
        ...m,
        foto_profile: m.foto_profile || m.raw_siswa?.foto_profile || null,
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

  // Tugas & Presensi khusus siswa yang sedang dibuka di modal
  const studentTasks = useMemo(() => {
    if (!selectedStudent) return [];
    return pengumpulanList.filter(
      (p) => String(p.siswa_id) === String(selectedStudent.siswa_id)
    );
  }, [selectedStudent, pengumpulanList]);

  const studentPresensiList = useMemo(() => {
    if (!selectedStudent) return [];
    return presensiList
      .filter((pr) => String(pr.siswa_id) === String(selectedStudent.siswa_id))
      .sort((a, b) => (b.tanggal || '').localeCompare(a.tanggal || ''));
  }, [selectedStudent, presensiList]);

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
            Klik pada nama/kartu siswa untuk melihat detail log nilai &amp; tugas proyek
          </p>
        </div>

        {/* Podium Layout (2 - 1 - 3) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-2xl mx-auto pt-2">
          {/* Juara 2 (Perak) */}
          {top2 ? (
            <div 
              onClick={() => {
                setSelectedStudent(top2);
                setModalTab('tugas');
              }}
              className="flex flex-col items-center text-center cursor-pointer group transition-transform hover:-translate-y-1"
              title="Klik untuk melihat detail profil & tugas"
            >
              <div className="relative mb-2">
                <StudentAvatar
                  fotoProfile={top2.foto_profile}
                  nama={top2.nama}
                  size="lg"
                  className="bg-gradient-to-br from-slate-300 to-slate-500 text-slate-900 border-2 border-slate-200/60 shadow-lg group-hover:scale-105 transition-transform"
                />
                <div className="absolute -top-2.5 -right-1 w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center shadow-md border border-white font-mono">
                  2
                </div>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate w-full px-1 group-hover:text-amber-300 transition">
                {top2.nama}
              </h4>
              <p className="text-[10px] text-slate-300 font-mono">
                {top2.kelas} • #{top2.no_absen || '-'}
              </p>
              <div className="mt-2 w-full bg-slate-800/80 rounded-xl p-2 border border-slate-700/80 text-[10px] sm:text-xs group-hover:border-slate-500 transition">
                <span className="font-black text-slate-200 font-mono text-xs sm:text-sm">{top2.skorTotal}</span>
                <span className="text-[9px] text-slate-400 block">Total XP</span>
              </div>
            </div>
          ) : <div />}

          {/* Juara 1 (Emas) */}
          {top1 ? (
            <div 
              onClick={() => {
                setSelectedStudent(top1);
                setModalTab('tugas');
              }}
              className="flex flex-col items-center text-center -translate-y-3 cursor-pointer group transition-transform hover:-translate-y-4"
              title="Klik untuk melihat detail profil & tugas"
            >
              <div className="relative mb-2">
                <Crown className="w-7 h-7 sm:w-9 sm:h-9 text-amber-400 absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce" />
                <StudentAvatar
                  fotoProfile={top1.foto_profile}
                  nama={top1.nama}
                  size="xl"
                  className="bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-amber-950 border-3 border-amber-300 shadow-xl shadow-amber-500/30 group-hover:scale-105 transition-transform"
                />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-md border-2 border-white font-mono">
                  1
                </div>
              </div>
              <h4 className="text-xs sm:text-base font-extrabold text-amber-200 truncate w-full px-1 group-hover:text-amber-100 transition">
                {top1.nama}
              </h4>
              <p className="text-[11px] text-amber-300/80 font-mono">
                {top1.kelas} • #{top1.no_absen || '-'}
              </p>
              <div className="mt-2 w-full bg-amber-950/70 rounded-xl p-2.5 border border-amber-500/50 text-[11px] sm:text-xs shadow-inner group-hover:border-amber-400 transition">
                <span className="font-black text-amber-300 font-mono text-sm sm:text-base">{top1.skorTotal}</span>
                <span className="text-[9px] text-amber-300/80 block font-semibold">Total XP ⭐</span>
              </div>
            </div>
          ) : <div />}

          {/* Juara 3 (Perunggu) */}
          {top3 ? (
            <div 
              onClick={() => {
                setSelectedStudent(top3);
                setModalTab('tugas');
              }}
              className="flex flex-col items-center text-center cursor-pointer group transition-transform hover:-translate-y-1"
              title="Klik untuk melihat detail profil & tugas"
            >
              <div className="relative mb-2">
                <StudentAvatar
                  fotoProfile={top3.foto_profile}
                  nama={top3.nama}
                  size="lg"
                  className="bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100 border-2 border-amber-600/60 shadow-lg group-hover:scale-105 transition-transform"
                />
                <div className="absolute -top-2.5 -left-1 w-6 h-6 rounded-full bg-amber-700 text-amber-100 font-black text-xs flex items-center justify-center shadow-md border border-white font-mono">
                  3
                </div>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate w-full px-1 group-hover:text-amber-300 transition">
                {top3.nama}
              </h4>
              <p className="text-[10px] text-slate-300 font-mono">
                {top3.kelas} • #{top3.no_absen || '-'}
              </p>
              <div className="mt-2 w-full bg-slate-800/80 rounded-xl p-2 border border-slate-700/80 text-[10px] sm:text-xs group-hover:border-slate-500 transition">
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
                <th className="py-3 px-3 text-center">Kehadiran (Max 100 XP)</th>
                <th className="py-3 px-4 text-right">Total XP</th>
                <th className="py-3 px-3 w-12 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeaderboard.map((item) => {
                const isMe = isCurrentUser(item);
                const isTop3 = item.rank <= 3;

                return (
                  <tr
                    key={item.siswa_id || item.no_daftar || item.nama}
                    onClick={() => {
                      setSelectedStudent(item);
                      setModalTab('tugas');
                    }}
                    className={`transition cursor-pointer group ${
                      isMe
                        ? 'bg-violet-50/70 font-semibold'
                        : isTop3
                        ? 'hover:bg-amber-50/30'
                        : 'hover:bg-slate-50/80'
                    }`}
                    title="Klik untuk membuka log nilai & tugas"
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
                      <div className="flex items-center gap-2.5">
                        {/* Avatar Foto Profil Siswa */}
                        <StudentAvatar
                          fotoProfile={item.foto_profile}
                          nama={item.nama}
                          size="md"
                          className="bg-slate-100 text-slate-700 border border-slate-200/80 group-hover:scale-105 transition-transform"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800 text-xs truncate max-w-[170px] sm:max-w-none group-hover:text-violet-700 transition">
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
                      <span 
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60"
                        title={`Kehadiran: +${item.bonusKehadiran} XP (Maksimal 100 XP)`}
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{item.kehadiranHadir}x</span>
                        <span className="text-[10px] text-emerald-600 font-normal">
                          (+{item.bonusKehadiran} XP)
                        </span>
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

                    <td className="py-3 px-3 text-center">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-violet-100 text-slate-400 hover:text-violet-700 flex items-center justify-center transition mx-auto">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETAIL LOG NILAI & PRATINJAU TUGAS ANGGOTA */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            {/* Header Profil Modal */}
            <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between gap-3 shrink-0 border-b border-indigo-900/60">
              <div className="flex items-center gap-3.5 min-w-0">
                <StudentAvatar
                  fotoProfile={selectedStudent.foto_profile}
                  nama={selectedStudent.nama}
                  size="lg"
                  className="bg-indigo-500/30 text-indigo-200 border-2 border-indigo-400/40 shadow-md"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-extrabold text-white truncate">
                      {selectedStudent.nama}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-amber-950 shadow-xs">
                      {selectedStudent.rank === 1 ? '🥇 Juara 1' : selectedStudent.rank === 2 ? '🥈 Juara 2' : selectedStudent.rank === 3 ? '🥉 Juara 3' : `Peringkat #${selectedStudent.rank}`}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-200 font-mono mt-0.5">
                    Kelas {selectedStudent.kelas} • No. Absen #{selectedStudent.no_absen || '-'}
                    {selectedStudent.nisn ? ` • NISN: ${selectedStudent.nisn}` : ''}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrik KPI Skor Siswa */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Skor</span>
                <span className="font-mono font-black text-lg text-violet-700">{selectedStudent.skorTotal} XP</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nilai Tugas</span>
                <span className="font-mono font-black text-lg text-indigo-700">{selectedStudent.totalNilai} pt</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kehadiran (Max 100)</span>
                <span className="font-mono font-black text-lg text-emerald-700">+{selectedStudent.bonusKehadiran} XP</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rata-Rata</span>
                <span className="font-mono font-black text-lg text-amber-600">{selectedStudent.rataRata}</span>
              </div>
            </div>

            {/* Tab Navigasi Modal: Daftar Tugas vs Riwayat Presensi */}
            <div className="px-5 pt-3 pb-2 flex items-center gap-2 border-b border-slate-200 shrink-0 bg-white">
              <button
                type="button"
                onClick={() => setModalTab('tugas')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  modalTab === 'tugas'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Tugas Dikumpulkan ({studentTasks.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab('presensi')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  modalTab === 'presensi'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Riwayat Kehadiran ({studentPresensiList.length})</span>
              </button>
            </div>

            {/* Isi Konten Tab Modal */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1 bg-slate-50/50">
              {modalTab === 'tugas' && (
                <div className="space-y-3">
                  {studentTasks.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                      <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-600">Belum Ada Tugas yang Dikumpulkan</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Siswa ini belum mengunggah berkas tugas di portal Ekstra TIK.
                      </p>
                    </div>
                  ) : (
                    studentTasks.map((tugas, idx) => {
                      const judul =
                        tugas.ekstra_tugas_master?.judul_tugas ||
                        tugas.judul_tugas ||
                        `Tugas Ekstra TIK #${idx + 1}`;
                      const fileName = tugas.file_name || 'Berkas Tugas';
                      const isGraded = tugas.nilai !== null && tugas.nilai !== undefined;

                      return (
                        <div
                          key={tugas.id || idx}
                          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:shadow-xs transition space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs sm:text-sm font-extrabold text-slate-800">
                                {judul}
                              </h4>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                                <span className="text-slate-600 font-semibold">{fileName}</span>
                                {tugas.submitted_at && (
                                  <>
                                    <span>•</span>
                                    <span>{new Date(tugas.submitted_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WITA</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Badge Nilai Tugas */}
                            <div className="shrink-0 flex items-center gap-2">
                              {isGraded ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs border border-emerald-300">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Nilai: {tugas.nilai} / 100</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs border border-amber-300">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Belum Dinilai</span>
                                </span>
                              )}

                              {/* Tombol Lihat Tugas (Anti-Download Protected Preview) */}
                              {tugas.file_url && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPreviewFile({
                                      fileUrl: tugas.file_url,
                                      fileName: fileName,
                                      nama: selectedStudent.nama,
                                      kelas: selectedStudent.kelas,
                                      judulTugas: judul,
                                      canDownload: false // DILARANG DOWNLOAD
                                    })
                                  }
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                                  title="Pratinjau Berkas Tugas (Mode Terproteksi)"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Lihat Tugas</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Catatan Siswa */}
                          {tugas.catatan_siswa && (
                            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                              <span className="font-bold text-slate-700 mr-1">Catatan Siswa:</span>
                              <span>"{tugas.catatan_siswa}"</span>
                            </div>
                          )}

                          {/* Catatan / Feedback Guru */}
                          {tugas.feedback_guru && (
                            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-800">
                              <span className="font-bold text-emerald-900 mr-1">Feedback Guru:</span>
                              <span className="italic">"{tugas.feedback_guru}"</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {modalTab === 'presensi' && (
                <div className="space-y-2">
                  {studentPresensiList.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                      <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-600">Belum Ada Riwayat Presensi</p>
                    </div>
                  ) : (
                    studentPresensiList.map((pr, idx) => {
                      const isHadir = pr.status_kehadiran === 'Hadir';
                      const isIzin = pr.status_kehadiran === 'Izin';
                      const isSakit = pr.status_kehadiran === 'Sakit';

                      return (
                        <div
                          key={pr.id || idx}
                          className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5">
                            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-slate-800">
                                {pr.tanggal}
                              </p>
                              {pr.keterangan && (
                                <p className="text-[11px] text-slate-500 italic mt-0.5">
                                  "{pr.keterangan}"
                                </p>
                              )}
                            </div>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              isHadir
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : isIzin
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : isSakit
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            {pr.status_kehadiran}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400 font-medium">
                Ekstrakurikuler TIK • SMP Negeri 2 Singaraja
              </span>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pratinjau Dokumen (Terproteksi Anti-Download) */}
      <ModalPreviewDokumen
        isOpen={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
        fileData={previewFile}
      />
    </div>
  );
}
