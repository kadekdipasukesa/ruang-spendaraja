import React from 'react';
import { Cpu, User, UserCheck, Shield, Sparkles, LogIn, Lock, Unlock, Clock } from 'lucide-react';

export default function EkstraHeader({ user, isLocked, onOpenLogin }) {
  const isAdmin = user?.role === 'admin' || user?.role === 'guru' || user?.role_2 === 'admin';

  return (
    <div className="relative overflow-hidden bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-violet-100 shadow-sm">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-violet-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-400/10 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Badge */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-violet-500/20 shrink-0 border border-white/30">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-100 text-violet-800 border border-violet-200">
                Ekstrakurikuler TIK
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                SMPN 2 Singaraja
              </span>
              {/* Status Absensi Badge */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  isLocked
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {isLocked ? (
                  <>
                    <Lock className="w-3 h-3 text-rose-500" />
                    <span>Absen Ditutup</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Absen Dibuka</span>
                  </>
                )}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-1">
              Portal Ekstra Informatika & TIK
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-xl">
              Presensi kehadiran digital, modul kegiatan, dan pengumpulan tugas mandiri terintegrasi langsung ke Google Spreadsheet & Google Drive.
            </p>
          </div>
        </div>

        {/* User Card */}
        <div className="shrink-0">
          {user ? (
            <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-violet-50/70 border border-violet-200/70 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-violet-600/20 shrink-0">
                {user.role === 'admin' ? (
                  <Shield className="w-5 h-5 text-amber-300" />
                ) : (
                  user.NAMA?.charAt(0) || 'S'
                )}
              </div>
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[170px]">
                    {user.NAMA}
                  </p>
                  {isAdmin && (
                    <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-violet-200 text-violet-800 rounded">
                      GURU/ADMIN
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  Kelas {user.Kelas || '-'} • No. Absen {user['No Absen'] || '-'}
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 transition shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Login Siswa / Guru</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
