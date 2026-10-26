import React from 'react';
import { createPortal } from 'react-dom';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ModalSubmissionSuccessSurel({ isOpen, onClose }) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Icon Header */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-rose-950/50">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
          Tugas 6 Berhasil Dikirim
        </span>

        <h3 className="text-xl font-black text-white mt-3 mb-2">
          Menunggu Review Admin
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Hebat! Seluruh 3 bukti screenshot pengerjaan Gmail dan jawaban kuis telah tersimpan di sistem.
        </p>

        <div className="my-5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Screenshot 1: Kotak Masuk Gmail Terverifikasi</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Screenshot 2: Alamat To & Cc Terverifikasi</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Screenshot 3: Isi Surat 1 Nov 2026 Terverifikasi</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mb-6">
          Admin akan memeriksa tangkapan layarmu di Galeri Penilaian. Begitu di-ACC, nilai (hingga 100 Poin) akan otomatis masuk ke leaderboard kelasmu!
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
          >
            Tutup Dialog
          </button>
          <button
            type="button"
            onClick={() => navigate('/ruang-belajar')}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-lg shadow-rose-950/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Ruang Belajar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
