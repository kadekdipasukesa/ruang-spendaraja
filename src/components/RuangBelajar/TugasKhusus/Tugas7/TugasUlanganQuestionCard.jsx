import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Flag, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

export default function TugasUlanganQuestionCard({
  soal,
  currentIndex = 0,
  totalSoal = 50,
  selectedJawab,
  onPilih,
  isRagu = false,
  onToggleRagu,
  isBlocked = false,
  isTimeUp = false,
  cheatCount = 0,
  onReloadSoal,
}) {
  if (!soal) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center text-slate-300 font-bold space-y-4 shadow-xl">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <h4 className="text-base sm:text-lg text-white">Sedang Memuat Butir Soal Ujian...</h4>
        <p className="text-xs text-slate-400 font-normal max-w-sm mx-auto">
          Sistem sedang menyiapkan 50 butir soal CBT untuk Anda.
        </p>
        {onReloadSoal && (
          <button
            type="button"
            onClick={onReloadSoal}
            className="mt-3 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-lg shadow-blue-600/30 active:scale-98"
          >
            Muat Butir Soal Sekarang
          </button>
        )}
      </div>
    );
  }

  // Label huruf A, B, C, D untuk opsi
  const abcdLetters = ['A', 'B', 'C', 'D'];

  return (
    <motion.div
      key={soal.id}
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden text-white"
    >
      {/* Overlay Blokir jika siswa melanggar 3 kali */}
      {isBlocked && (
        <div className="absolute inset-0 bg-red-950/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center mb-4 text-white shadow-lg animate-bounce">
            <Lock size={36} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2">
            Akses Ujian Terkunci!
          </h2>
          <p className="text-red-200 text-xs sm:text-sm max-w-md leading-relaxed">
            Anda telah melakukan pelanggaran keluar dari jendela / fullscreen sebanyak <strong>{cheatCount} kali</strong>. 
            Jawaban Anda telah tersimpan otomatis di server. Hubungi Guru Pengawas untuk verifikasi.
          </p>
        </div>
      )}

      {/* Baris Atas: Badge Nomor Soal, Kategori, & Tombol Ragu */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-black text-xs sm:text-sm tracking-wide">
            Nomor {currentIndex + 1}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-[11px]">
            {soal.kategori || 'Informatika'}
          </span>
        </div>

        {/* Tombol Tandai Ragu-Ragu */}
        <button
          type="button"
          onClick={onToggleRagu}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            isRagu
              ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
              : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-amber-300 hover:border-amber-500/50'
          }`}
          title="Tandai jika Anda masih ragu dengan jawaban ini"
        >
          <Flag size={13} fill={isRagu ? 'currentColor' : 'none'} />
          <span>{isRagu ? 'Ditandai Ragu' : 'Tandai Ragu'}</span>
        </button>
      </div>

      {/* Teks Soal / Pertanyaan */}
      <div className="mb-5">
        <h3 className="text-base sm:text-lg md:text-xl font-bold leading-relaxed text-slate-100 whitespace-pre-line">
          {soal.teks}
        </h3>
      </div>

      {/* Aset Gambar Diagram Soal (Jika Ada) */}
      {soal.gambar && (
        <div className="mb-6 p-3 sm:p-4 bg-slate-950/70 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
          <img
            src={soal.gambar}
            alt={`Diagram Soal ${soal.nomor}`}
            className="w-full max-h-72 object-contain rounded-lg"
            loading="eager"
            onError={(e) => {
              if (soal.gambar_fallback && e.target.src !== soal.gambar_fallback) {
                e.target.src = soal.gambar_fallback;
              }
            }}
          />
          <span className="text-[10px] text-slate-500 font-medium mt-2">
            Perhatikan diagram di atas untuk menjawab pertanyaan.
          </span>
        </div>
      )}

      {/* Daftar Pilihan Ganda (A, B, C, D) */}
      <div className="space-y-2.5">
        {soal.opsi &&
          soal.opsi.map((opt, idx) => {
            const isSelected = selectedJawab === opt;
            const letter = abcdLetters[idx] || String.fromCharCode(65 + idx);
            const isDisabled = isBlocked || isTimeUp;

            return (
              <button
                key={idx}
                type="button"
                disabled={isDisabled}
                onClick={() => !isDisabled && onPilih(soal.id, opt)}
                className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all font-medium flex items-center gap-3.5 group cursor-pointer active:scale-99 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10'
                    : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                {/* Huruf Opsi (A, B, C, D) */}
                <div
                  className={`w-8 h-8 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center shrink-0 border transition-all ${
                    isSelected
                      ? 'bg-blue-600 border-blue-400 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-700 text-slate-400 group-hover:border-slate-500'
                  }`}
                >
                  {letter}
                </div>

                {/* Teks Opsi Jawaban */}
                <span className="flex-1 text-xs sm:text-sm leading-snug">
                  {opt}
                </span>

                {/* Indikator Checklist Kanan */}
                <div className="shrink-0">
                  {isSelected ? (
                    <CheckCircle2 size={18} className="text-blue-400" />
                  ) : (
                    <Circle size={18} className="text-slate-600 group-hover:text-slate-500" />
                  )}
                </div>
              </button>
            );
          })}
      </div>
    </motion.div>
  );
}

