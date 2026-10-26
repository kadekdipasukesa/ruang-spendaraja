import React from 'react';
import { ArrowLeft, Send, CheckCircle2, Clock, AlertCircle, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SurelHeader({
  user,
  existingSubmission,
  completionStats,
  submitting,
  onSubmitAll,
}) {
  const navigate = useNavigate();

  const getStatusBadge = () => {
    if (existingSubmission?.skor !== null && existingSubmission?.skor !== undefined && existingSubmission.skor > 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <Award className="w-3.5 h-3.5 text-emerald-400" />
          ACC Admin: {existingSubmission.skor} Poin
        </span>
      );
    }
    if (existingSubmission?.status === 'menunggu_verifikasi') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          Menunggu Review Admin
        </span>
      );
    }
    if (existingSubmission?.status === 'revisi') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">
          <AlertCircle className="w-3.5 h-3.5 text-red-400" />
          Perlu Revisi
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
        Progres: {completionStats.completedCount}/{completionStats.totalStages} Tahap
      </span>
    );
  };

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Sisi Kiri: Navigasi & Judul */}
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate('/ruang-belajar')}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-all border border-slate-700/60"
            title="Kembali ke Ruang Belajar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Tugas 6: Gmail Resmi
              </span>
              {getStatusBadge()}
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Surat Izin Resmi Lomba Melukis (Gmail)
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Studi Kasus 1 November 2026 • Praktik Langsung di Aplikasi Gmail Asli
            </p>
          </div>
        </div>

        {/* Sisi Kanan: Profil Siswa & Tombol Kirim */}
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          {user && (
            <div className="flex items-center gap-2.5 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/50">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-700 overflow-hidden">
                {user.foto_profile ? (
                  <img src={user.foto_profile} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  (user.NAMA || user.nama || 'S').slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-200 line-clamp-1 max-w-[120px]">
                  {user.NAMA || user.nama}
                </p>
                <p className="text-[10px] text-slate-400">
                  {user.Kelas || user.kelas || 'Kelas 7'} • Absen {user['No Absen'] || user.no_absen || '-'}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={onSubmitAll}
            disabled={!completionStats.isAllComplete || submitting}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all ${
              completionStats.isAllComplete && !submitting
                ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-rose-900/40 cursor-pointer active:scale-95'
                : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-70'
            }`}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Mengirim...</span>
              </>
            ) : existingSubmission?.status === 'menunggu_verifikasi' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Perbarui Kiriman</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Kumpul Tugas</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
