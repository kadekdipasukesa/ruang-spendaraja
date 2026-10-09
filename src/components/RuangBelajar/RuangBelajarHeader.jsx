import {
  User,
  Shield,
  Flame,
  BookOpen,
  Layers,
  LogIn,
  AlertCircle,
  Trophy,
  ArrowRight,
  Crown,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useClassRank } from '../../hooks/RuangBelajar/useClassRank';

export default function RuangBelajarHeader({
  student,
  stats = { completed: 0, total: 0 },
  isAdmin = false,
  activeTab = 'timeline',
  setActiveTab,
  leaderboard = []
}) {
  const isGuest = !student;
  const studentFullName = student?.NAMA || student?.nama || 'Pengunjung (Mode Tamu)';
  const firstName = studentFullName.split(' ')[0] || studentFullName;
  const studentClass = student?.Kelas || student?.KELAS || '-';
  const studentAbsen = student?.['No Absen'] || student?.no_absen || '-';

  // Custom hook untuk sinkronisasi ranking kelas, foto profil master_siswa & live points
  const {
    studentPhoto,
    photoError,
    setPhotoError,
    rank: classRank,
    totalInClass,
    isTop5,
    livePoints,
    celebrationToast,
  } = useClassRank(student, leaderboard);

  const realTotalPoints = livePoints ?? (student?.total_points ?? 0);
  const totalTasks = stats?.total || 0;
  const completedTasks = stats?.completed || 0;
  const progressPercent = totalTasks > 0 ? Math.min(100, Math.round((completedTasks / totalTasks) * 100)) : 0;

  const handleOpenLoginModal = () => {
    window.dispatchEvent(new CustomEvent('open-login-modal'));
  };

  const handleOpenProfileModal = () => {
    if (!isGuest) {
      window.dispatchEvent(new CustomEvent('open-profile-modal'));
    } else {
      handleOpenLoginModal();
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  return (
    <>
      {/* Toast Notifikasi Ringkas Top 5 (Otomatis muncul tanpa tombol spam petasan) */}
      <AnimatePresence>
        {celebrationToast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[99999] bg-slate-900/95 text-white px-4 sm:px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold border border-amber-400/40 backdrop-blur-md pointer-events-auto"
          >
            <Crown className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-100">{celebrationToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header Container: Clean Native App Channel Header Style */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs relative overflow-hidden transition-all">
        {/* Subtle Ambient Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 opacity-90" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6 pt-1">
          
          {/* Sisi Kiri: Profil Siswa + Salam + Progress Belajar */}
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0 flex-1">
            {/* Avatar Foto Profil dengan Story Ring */}
            <div className="relative shrink-0 pt-0.5 sm:pt-0">
              <div
                onClick={handleOpenProfileModal}
                className={`p-[2.5px] rounded-2xl transition-all ${
                  isTop5
                    ? 'bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 shadow-md shadow-amber-500/20'
                    : !isGuest
                    ? 'bg-gradient-to-tr from-blue-500 via-indigo-500 to-violet-500 shadow-xs'
                    : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] flex items-center justify-center font-black text-xl overflow-hidden ${
                    !isGuest ? 'cursor-pointer hover:scale-[1.02] active:scale-95 bg-white' : 'bg-slate-100 text-slate-400'
                  }`}
                  title={!isGuest ? 'Klik untuk membuka profil' : 'Klik untuk masuk akun'}
                >
                  {isGuest ? (
                    <User className="w-6 h-6 text-slate-400" />
                  ) : studentPhoto && !photoError ? (
                    <img
                      src={studentPhoto}
                      alt={studentFullName}
                      onError={() => setPhotoError(true)}
                      className="w-full h-full object-cover object-center"
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-base sm:text-lg select-none">
                      {getInitials(studentFullName)}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Online Ringkas & Badge Mahkota */}
              {!isGuest && (
                <>
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
                  </span>

                  {isTop5 && (
                    <span
                      className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-xs shadow-sm border-2 border-white"
                      title="Siswa Top 5 Kelas"
                    >
                      👑
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Nama & Meta Identitas + Progress Belajar */}
            <div className="space-y-1.5 min-w-0 flex-1">
              {/* Friendly Greeting Header ala YouTube / Mobile App */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span>{isGuest ? 'Selamat Datang' : `Halo, ${firstName}!`}</span>
                {!isGuest && <span className="inline-block animate-pulse">👋</span>}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight truncate max-w-full">
                  {studentFullName}
                </h1>

                {isAdmin && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                    <Shield className="w-3 h-3 text-amber-600" />
                    Guru
                  </span>
                )}

                {isGuest && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    Tamu
                  </span>
                )}
              </div>

              {/* Detail Kelas & Peringkat */}
              <div className="text-xs text-slate-500 font-medium flex items-center gap-2 flex-wrap">
                {isGuest ? (
                  <span className="text-slate-500 flex items-center gap-1.5 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    Mode penjelajah. Masuk untuk simpan progres & raih poin.
                  </span>
                ) : (
                  <>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200/60">
                      Kelas {studentClass}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      Absen {studentAbsen}
                    </span>

                    {classRank && (
                      <button
                        type="button"
                        onClick={() => setActiveTab && setActiveTab('leaderboard')}
                        className={`inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-md cursor-pointer transition-all ${
                          isTop5
                            ? 'bg-amber-100 text-amber-800 border border-amber-300/80 hover:bg-amber-200/80'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        title="Klik untuk lihat Leaderboard"
                      >
                        {isTop5 ? '👑' : '🔥'}
                        <span>Peringkat #{classRank}</span>
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Progres Belajar: Jembatan Visual ke Roadmap Pembelajaran */}
              {!isGuest && totalTasks > 0 && (
                <div className="pt-1 max-w-sm">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span className="flex items-center gap-1 text-slate-600">
                      <BookOpen className="w-3 h-3 text-blue-600" />
                      <span>Ketuntasan Modul</span>
                    </span>
                    <span className="text-slate-800 font-bold font-mono text-[11px]">
                      {progressPercent}% ({completedTasks}/{totalTasks} Tuntas)
                    </span>
                  </div>
                  <div className="w-full h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/70">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sisi Kanan: Kartu Metrik Ringkas & Interaktif */}
          <div className="shrink-0 w-full lg:w-auto">
            {isGuest ? (
              <button
                type="button"
                onClick={handleOpenLoginModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-98"
                id="btn-guest-header-login"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>Masuk Akun Siswa</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ) : (
              /* 3 Kolom Metrik Interaktif di Mobile & Desktop */
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 bg-slate-50/80 p-2 sm:p-2.5 rounded-2xl border border-slate-200/70">
                
                {/* Metrik 1: Total Poin (Klik menuju Log Skor) */}
                <button
                  type="button"
                  onClick={() => setActiveTab && setActiveTab('log_score')}
                  className="bg-white rounded-xl p-2 sm:px-3.5 sm:py-2.5 border border-slate-200/70 text-center flex flex-col justify-center min-w-[80px] sm:min-w-[95px] shadow-2xs hover:border-amber-400 hover:bg-amber-50/20 transition-all cursor-pointer group"
                  title="Klik untuk melihat Catatan Poin"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 group-hover:text-amber-600 transition-colors block mb-0.5">
                    Poin XP
                  </span>
                  <div className="text-sm sm:text-base font-black text-amber-700 font-mono tabular-nums leading-none flex items-center justify-center gap-0.5">
                    <span>{realTotalPoints}</span>
                    <span className="text-[10px] font-bold text-amber-600">pt</span>
                  </div>
                </button>

                {/* Metrik 2: Modul Selesai (Klik menuju Timeline) */}
                <button
                  type="button"
                  onClick={() => setActiveTab && setActiveTab('timeline')}
                  className="bg-white rounded-xl p-2 sm:px-3.5 sm:py-2.5 border border-slate-200/70 text-center flex flex-col justify-center min-w-[80px] sm:min-w-[95px] shadow-2xs hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer group"
                  title="Klik untuk melihat Roadmap Modul"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 group-hover:text-blue-600 transition-colors block mb-0.5">
                    Tuntas
                  </span>
                  <div className="text-sm sm:text-base font-black text-slate-900 font-mono tabular-nums leading-none">
                    <span>{completedTasks}</span>
                    <span className="text-[10px] font-normal text-slate-400">/{totalTasks}</span>
                  </div>
                </button>

                {/* Metrik 3: Peringkat Kelas (Klik menuju Leaderboard) */}
                <button
                  type="button"
                  onClick={() => setActiveTab && setActiveTab('leaderboard')}
                  className="bg-white rounded-xl p-2 sm:px-3.5 sm:py-2.5 border border-slate-200/70 text-center flex flex-col justify-center min-w-[80px] sm:min-w-[95px] hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer group shadow-2xs"
                  title="Klik untuk melihat Papan Peringkat Kelas"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 group-hover:text-amber-600 transition-colors block mb-0.5">
                    Rank
                  </span>
                  <div className="text-sm sm:text-base font-black text-slate-900 font-mono tabular-nums leading-none">
                    {classRank ? (
                      <>
                        <span className={isTop5 ? 'text-amber-600' : 'text-slate-900'}>
                          #{classRank}
                        </span>
                        <span className="text-[10px] font-normal text-slate-400">
                          /{totalInClass}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 font-normal">-</span>
                    )}
                  </div>
                </button>

              </div>
            )}
          </div>

        </div>
      </div>

      {/* Fixed Bottom Navigation (createPortal ke document.body) ala YouTube / Native Mobile App */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_25px_rgba(15,23,42,0.06)] pt-1.5 pb-3 sm:pb-3.5 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div className="max-w-md mx-auto flex items-center justify-around">
              {/* Tab 1: Timeline (Modul Roadmap) */}
              <button
                type="button"
                onClick={() => setActiveTab('timeline')}
                className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-2xl transition-all cursor-pointer active:scale-95 ${
                  activeTab === 'timeline'
                    ? 'text-blue-600 font-black'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
                id="nav-bottom-timeline"
                title="Roadmap Modul Tugas"
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    activeTab === 'timeline'
                      ? 'bg-blue-100 text-blue-700 shadow-2xs'
                      : 'bg-transparent text-slate-400'
                  }`}
                >
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight">Modul</span>
              </button>

              {/* Tab 2: Log Skor (Catatan Poin) */}
              <button
                type="button"
                onClick={() => setActiveTab('log_score')}
                className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-2xl transition-all cursor-pointer active:scale-95 ${
                  activeTab === 'log_score'
                    ? 'text-indigo-600 font-black'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
                id="nav-bottom-log"
                title="Riwayat Skor & Poin"
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    activeTab === 'log_score'
                      ? 'bg-indigo-100 text-indigo-700 shadow-2xs'
                      : 'bg-transparent text-slate-400'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight">Log Skor</span>
              </button>

              {/* Tab 3: Peringkat (Klasemen Kelas) */}
              <button
                type="button"
                onClick={() => setActiveTab('leaderboard')}
                className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-2xl transition-all cursor-pointer active:scale-95 ${
                  activeTab === 'leaderboard'
                    ? 'text-amber-600 font-black'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
                id="nav-bottom-peringkat"
                title="Papan Peringkat Kelas"
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    activeTab === 'leaderboard'
                      ? 'bg-amber-100 text-amber-700 shadow-2xs'
                      : 'bg-transparent text-slate-400'
                  }`}
                >
                  <Flame className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight">Peringkat</span>
              </button>

              {/* Tab 4: Profil Siswa (Ala YouTube 'You' tab / Instagram profile) */}
              <button
                type="button"
                onClick={handleOpenProfileModal}
                className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-2xl transition-all cursor-pointer active:scale-95 text-slate-400 hover:text-slate-600 font-medium"
                id="nav-bottom-profil"
                title={!isGuest ? 'Buka Profil & Portofolio Siswa' : 'Masuk Akun'}
              >
                <div className="p-1.5 rounded-xl transition-all">
                  {!isGuest && studentPhoto && !photoError ? (
                    <img
                      src={studentPhoto}
                      alt="Avatar"
                      className="w-5 h-5 rounded-full object-cover ring-1.5 ring-slate-300"
                    />
                  ) : (
                    <User className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <span className="text-[10px] tracking-tight">Profil</span>
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

