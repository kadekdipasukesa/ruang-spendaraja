import {
  User,
  CheckCircle2,
  Shield,
  Flame,
  BookOpen,
  Layers,
  LogIn,
  AlertCircle,
  Sparkles,
  Zap,
  Trophy,
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom'; // 1. Import createPortal

export default function RuangBelajarHeader({ student, stats, isAdmin, activeTab, setActiveTab }) {
  const isGuest = !student;
  const studentName = student?.NAMA || student?.nama || 'Pengunjung (Mode Tamu)';
  const studentClass = student?.Kelas || student?.KELAS || '-';
  const studentAbsen = student?.['No Absen'] || student?.no_absen || '-';
  const realTotalPoints = student?.total_points ?? 0;

  const handleOpenLoginModal = () => {
    window.dispatchEvent(new CustomEvent('open-login-modal'));
  };

  return (
    <>
      {/* Compact Main Header Card */}
      <div className="relative bg-white rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-7 border border-slate-200 shadow-sm hover:shadow-lg hover:shadow-amber-200/20 transition-all duration-300 overflow-hidden">
        {/* Soft Ambient Glows as seen in BEE-2026 */}
        <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-amber-200/20 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 bg-blue-200/20 blur-[70px] sm:blur-[90px] rounded-full pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          {/* Profile Details */}
          <div className="flex items-center gap-3 sm:gap-4.5 min-w-0">
            <div className="relative flex-shrink-0">
              <div
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[1.5rem] flex items-center justify-center font-black text-lg sm:text-2xl shadow-md transition-all ${
                  isGuest
                    ? 'bg-slate-100 text-slate-400 border border-slate-200'
                    : 'bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 text-white shadow-orange-500/20 ring-2 sm:ring-4 ring-amber-100/90'
                }`}
              >
                {isGuest ? <User className="w-6 h-6 text-slate-400" /> : studentName.charAt(0)}
              </div>

              {!isGuest && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-emerald-500 border-2 border-white shadow-2xs" />
                </span>
              )}
            </div>

            <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
              <div className="inline-flex items-center gap-1 bg-white border border-amber-200 px-2 sm:px-2.5 py-0.5 rounded-full shadow-2xs">
                <Sparkles size={11} className="text-amber-500" />
                <span className="text-[9px] sm:text-[10px] font-black text-amber-700 uppercase tracking-wider">
                  Ruang Belajar Digital
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-base sm:text-2xl font-black text-slate-900 tracking-tight truncate max-w-full">
                  {studentName}
                </h1>

                {isAdmin && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    <Shield className="w-3 h-3 text-amber-600" />
                    Guru
                  </span>
                )}

                {isGuest && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    Tamu
                  </span>
                )}
              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 font-medium flex items-center gap-1.5 flex-wrap">
                {isGuest ? (
                  <span className="text-slate-500 flex items-center gap-1 truncate text-[11px]">
                    <AlertCircle className="w-3 h-3 text-amber-500 flex-shrink-0" />
                    Masuk akun siswa untuk rekam poin otomatis.
                  </span>
                ) : (
                  <>
                    <span className="bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-lg font-bold text-amber-900 text-[10px] sm:text-xs">
                      Kelas <strong className="text-amber-700 font-black">{studentClass}</strong>
                    </span>
                    <span className="bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-lg font-bold text-blue-900 text-[10px] sm:text-xs">
                      Absen <strong className="text-blue-700 font-black">{studentAbsen}</strong>
                    </span>
                    <span className="text-slate-400 font-medium hidden sm:inline">•</span>
                    <span className="text-slate-600 font-bold hidden sm:flex items-center gap-1 text-xs">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                      Informatika SPENDA
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-2 sm:gap-3.5 flex-shrink-0">
            {isGuest ? (
              <button
                type="button"
                onClick={handleOpenLoginModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-black text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                id="btn-guest-header-login"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Akun Siswa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/30 to-white border border-amber-200/90 p-2.5 sm:p-3.5 rounded-2xl sm:rounded-[1.6rem] flex items-center gap-2.5 min-w-[125px] sm:min-w-[145px] shadow-2xs hover:shadow-xs transition-all">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-[1.1rem] bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-black shadow-xs flex-shrink-0">
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse fill-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] uppercase font-black tracking-wider text-amber-700 truncate">
                      <Trophy className="w-2.5 h-2.5 text-amber-500 flex-shrink-0" />
                      <span>Poin Master</span>
                    </div>
                    <div className="text-base sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 tracking-tight flex items-baseline gap-1">
                      <span>{realTotalPoints}</span>
                      <span className="text-[10px] sm:text-xs font-bold text-amber-600">Poin</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/30 to-white border border-blue-200/90 p-2.5 sm:p-3.5 rounded-2xl sm:rounded-[1.6rem] flex items-center gap-2.5 min-w-[125px] sm:min-w-[145px] shadow-2xs hover:shadow-xs transition-all">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-[1.1rem] bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black shadow-xs flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] uppercase font-black tracking-wider text-blue-700 truncate">
                      <Zap className="w-2.5 h-2.5 text-blue-500 flex-shrink-0" />
                      <span>Tuntas</span>
                    </div>
                    <div className="text-base sm:text-xl font-black text-slate-800 tracking-tight">
                      {stats.completed}{' '}
                      <span className="text-[10px] sm:text-xs font-normal text-slate-400">
                        / {stats.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Guest Alert Banner */}
        {isGuest && (
          <div className="mt-3 p-3 bg-amber-50/90 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 min-w-0">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span className="truncate">
                Mode penjelajah. Masuk untuk mengumpulkan tugas & simpan poin.
              </span>
            </div>
            <button
              type="button"
              onClick={handleOpenLoginModal}
              className="text-xs font-black text-amber-700 hover:text-amber-900 underline ml-auto flex-shrink-0"
            >
              Masuk &rarr;
            </button>
          </div>
        )}
      </div>

      {/* 2. Membungkus Bottom Nav dengan createPortal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] pt-1.5 pb-3 sm:pb-4 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div className="max-w-md mx-auto flex items-center justify-around">
              {/* Tab 1: Timeline */}
              <button
                type="button"
                onClick={() => setActiveTab('timeline')}
                className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3.5 rounded-2xl transition-all ${
                  activeTab === 'timeline'
                    ? 'text-amber-600 font-black scale-105'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
                id="nav-bottom-timeline"
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    activeTab === 'timeline'
                      ? 'bg-amber-100 text-amber-600 shadow-2xs'
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
                className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3.5 rounded-2xl transition-all ${
                  activeTab === 'log_score'
                    ? 'text-blue-600 font-black scale-105'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
                id="nav-bottom-log"
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    activeTab === 'log_score'
                      ? 'bg-blue-100 text-blue-600 shadow-2xs'
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
                className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3.5 rounded-2xl transition-all ${
                  activeTab === 'leaderboard'
                    ? 'text-orange-600 font-black scale-105'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
                id="nav-bottom-peringkat"
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    activeTab === 'leaderboard'
                      ? 'bg-orange-100 text-orange-600 shadow-2xs'
                      : 'bg-transparent text-slate-400'
                  }`}
                >
                  <Flame className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight">Peringkat</span>
              </button>
            </div>
          </div>,
          document.body // Merender elemen ini langsung ke <body> utama
        )}
    </>
  );
}