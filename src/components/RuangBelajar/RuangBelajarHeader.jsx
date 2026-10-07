import {
  User,
  CheckCircle2,
  Shield,
  Flame,
  BookOpen,
  Layers,
  LogIn,
  AlertCircle,
  Trophy,
  ArrowRight,
  Crown
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
  const studentName = student?.NAMA || student?.nama || 'Pengunjung (Mode Tamu)';
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

  const handleOpenLoginModal = () => {
    window.dispatchEvent(new CustomEvent('open-login-modal'));
  };

  const handleOpenProfileModal = () => {
    if (!isGuest) {
      window.dispatchEvent(new CustomEvent('open-profile-modal'));
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

      {/* Main Header Container: Clean, Anti-AI Slop, Flexible Mobile & Desktop */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm relative overflow-hidden transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          
          {/* Sisi Kiri: Profil Siswa */}
          <div className="flex items-center gap-3.5 sm:gap-4.5 min-w-0">
            {/* Avatar Foto Profil */}
            <div className="relative shrink-0">
              <div
                onClick={handleOpenProfileModal}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black text-xl shadow-xs transition-all overflow-hidden ${
                  !isGuest ? 'cursor-pointer hover:ring-2 hover:ring-amber-500/50 hover:scale-[1.02] active:scale-95' : ''
                } ${
                  isGuest
                    ? 'bg-slate-100 text-slate-400 border border-slate-200'
                    : isTop5
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white ring-2 ring-amber-400 ring-offset-2'
                    : 'bg-gradient-to-br from-slate-800 to-slate-900 text-white ring-1 ring-slate-200'
                }`}
                title={!isGuest ? 'Klik untuk membuka profil' : undefined}
              >
                {isGuest ? (
                  <User className="w-6 h-6 text-slate-400" />
                ) : studentPhoto && !photoError ? (
                  <img
                    src={studentPhoto}
                    alt={studentName}
                    onError={() => setPhotoError(true)}
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                ) : (
                  <span className="select-none tracking-wider text-base sm:text-lg">
                    {getInitials(studentName)}
                  </span>
                )}
              </div>

              {/* Status Online Ringkas & Badge Mahkota Statis */}
              {!isGuest && (
                <>
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
                  </span>

                  {isTop5 && (
                    <span
                      className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-[10px] shadow-sm border border-white"
                      title="Siswa Top 5 Kelas"
                    >
                      👑
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Nama & Meta Identitas */}
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight truncate max-w-full">
                  {studentName}
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
                    <span className="text-slate-600 font-semibold">
                      Kelas <strong className="text-slate-900">{studentClass}</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600 font-semibold">
                      Absen <strong className="text-slate-900">{studentAbsen}</strong>
                    </span>

                    {classRank && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className={`inline-flex items-center gap-1 font-bold ${isTop5 ? 'text-amber-700' : 'text-slate-600'}`}>
                          {isTop5 && <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                          <span>Peringkat #{classRank}</span>
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Kartu Metrik Ringkas & Proporsional */}
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
              /* 3 Kolom Metrik Seimbang di Mobile & Desktop */
              <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-slate-50/80 p-2 sm:p-2.5 rounded-2xl border border-slate-200/80">
                
                {/* Metrik 1: Total Poin */}
                <div className="bg-white rounded-xl p-2.5 sm:px-4 sm:py-3 border border-slate-200/70 text-center flex flex-col justify-center min-w-[85px] sm:min-w-[105px]">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Poin
                  </span>
                  <div className="text-sm sm:text-lg font-black text-amber-700 font-mono tabular-nums leading-none flex items-center justify-center gap-0.5">
                    <span>{realTotalPoints}</span>
                    <span className="text-[10px] font-bold text-amber-600">pt</span>
                  </div>
                </div>

                {/* Metrik 2: Tugas Selesai */}
                <div className="bg-white rounded-xl p-2.5 sm:px-4 sm:py-3 border border-slate-200/70 text-center flex flex-col justify-center min-w-[85px] sm:min-w-[105px]">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Tuntas
                  </span>
                  <div className="text-sm sm:text-lg font-black text-slate-900 font-mono tabular-nums leading-none">
                    <span>{stats.completed}</span>
                    <span className="text-[10px] sm:text-xs font-normal text-slate-400">/{stats.total}</span>
                  </div>
                </div>

                {/* Metrik 3: Peringkat Kelas (Klik untuk buka tab Peringkat tanpa memicu petasan) */}
                <div
                  onClick={() => setActiveTab && setActiveTab('leaderboard')}
                  className="bg-white rounded-xl p-2.5 sm:px-4 sm:py-3 border border-slate-200/70 text-center flex flex-col justify-center min-w-[85px] sm:min-w-[105px] hover:border-amber-400 transition-all cursor-pointer group"
                  title="Lihat Papan Peringkat Kelas"
                >
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-amber-600 transition-colors block mb-0.5">
                    Rank
                  </span>
                  <div className="text-sm sm:text-lg font-black text-slate-900 font-mono tabular-nums leading-none">
                    {classRank ? (
                      <>
                        <span className={isTop5 ? 'text-amber-600' : 'text-slate-900'}>
                          #{classRank}
                        </span>
                        <span className="text-[10px] sm:text-xs font-normal text-slate-400">
                          /{totalInClass}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 font-normal">-</span>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>

      {/* Fixed Bottom Navigation (createPortal ke document.body) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pt-1.5 pb-3 sm:pb-4 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div className="max-w-md mx-auto flex items-center justify-around">
              {/* Tab 1: Timeline */}
              <button
                type="button"
                onClick={() => setActiveTab('timeline')}
                className={`flex flex-col items-center justify-center gap-0.5 py-1 px-4 rounded-2xl transition-all cursor-pointer ${
                  activeTab === 'timeline'
                    ? 'text-amber-600 font-black'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
                id="nav-bottom-timeline"
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    activeTab === 'timeline'
                      ? 'bg-amber-100 text-amber-700 shadow-2xs'
                      : 'bg-transparent text-slate-400'
                  }`}
                >
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight">Timeline</span>
              </button>

              {/* Tab 2: Log */}
              <button
                type="button"
                onClick={() => setActiveTab('log_score')}
                className={`flex flex-col items-center justify-center gap-0.5 py-1 px-4 rounded-2xl transition-all cursor-pointer ${
                  activeTab === 'log_score'
                    ? 'text-blue-600 font-black'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
                id="nav-bottom-log"
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    activeTab === 'log_score'
                      ? 'bg-blue-100 text-blue-700 shadow-2xs'
                      : 'bg-transparent text-slate-400'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight">Log</span>
              </button>

              {/* Tab 3: Peringkat */}
              <button
                type="button"
                onClick={() => setActiveTab('leaderboard')}
                className={`flex flex-col items-center justify-center gap-0.5 py-1 px-4 rounded-2xl transition-all cursor-pointer ${
                  activeTab === 'leaderboard'
                    ? 'text-orange-600 font-black'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
                id="nav-bottom-peringkat"
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    activeTab === 'leaderboard'
                      ? 'bg-orange-100 text-orange-700 shadow-2xs'
                      : 'bg-transparent text-slate-400'
                  }`}
                >
                  <Flame className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight">Peringkat</span>
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
