import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle2, XCircle, AlertCircle, ArrowRight, Sparkles, X, Edit3, RotateCcw, AlertTriangle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TugasUlanganSelesaiModal({
  isOpen = false,
  hasil = {
    skor: 0,
    benar: 0,
    salah: 0,
    kosong: 0,
    totalSoal: 50,
    persentase: 0
  },
  siswa,
  attemptCount = 1,
  isTimeUp = false,
  allowRevision = true,
  onClose,
  onPerbaikiJawaban,
}) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const effectiveAttempt = hasil?.attemptCount || attemptCount || 1;
  const isLulus = hasil.skor >= 75;
  const handleActionPerbaiki = onPerbaikiJawaban || onClose;
  const canPerbaiki = !isTimeUp && allowRevision && Boolean(handleActionPerbaiki);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden text-white"
        >
          {/* Tombol Tutup X jika diperbolehkan revisi / periksa */}
          {canPerbaiki && (
            <button
              type="button"
              onClick={handleActionPerbaiki}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/80 transition cursor-pointer"
              title="Tutup dan periksa jawaban"
            >
              <X size={18} />
            </button>
          )}

          {/* Ambient Glow */}
          <div className={`absolute top-0 inset-x-0 h-32 blur-3xl opacity-20 pointer-events-none ${isLulus ? 'bg-emerald-500' : 'bg-amber-500'}`} />

          {/* Icon Trophy */}
          <div className="relative mb-4 mx-auto w-20 h-20 flex items-center justify-center">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg ${
              isLulus 
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/30' 
                : 'bg-gradient-to-tr from-amber-600 to-yellow-500 shadow-amber-500/30'
            }`}>
              <Trophy size={40} className="text-white" />
            </div>
          </div>

          {/* Chips Status Kelulusan & Jumlah Percobaan */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              isLulus ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
            }`}>
              <Sparkles size={12} /> {isLulus ? 'Tuntas & Lulus KKTP' : 'Perlu Pendalaman'}
            </span>

            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              effectiveAttempt > 5
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800/90 border-slate-700 text-sky-300'
            }`}>
              <RotateCcw size={12} className={effectiveAttempt > 5 ? 'text-amber-400' : 'text-sky-400'} />
              <span>Percobaan Ke-{effectiveAttempt}</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isTimeUp ? 'Waktu Ujian Telah Habis!' : 'Ujian Telah Selesai!'}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {isTimeUp
              ? 'Waktu pengerjaan telah habis. Jawaban Anda telah otomatis dikumpulkan dan dinilai oleh sistem.'
              : 'Jawaban Anda telah berhasil dikirim dan dinilai oleh sistem.'}
          </p>

          {/* Banner Peringatan Waktu Habis */}
          {isTimeUp && (
            <div className="mt-4 mb-2 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs text-left flex items-start gap-2.5">
              <Clock size={16} className="text-red-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-0.5">
                <p className="font-bold text-red-300">Ujian Telah Terkunci</p>
                <p className="text-[11px] text-red-200/90 leading-relaxed">
                  Sesi ulangan telah berakhir. Jawaban yang telah dikirim bersifat final dan tidak dapat diperbaiki lagi.
                </p>
              </div>
            </div>
          )}

          {/* Peringatan Batas Maksimal 75 pt jika percobaan > 5 */}
          {effectiveAttempt > 5 && !isTimeUp && (
            <div className="mt-4 mb-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs text-left flex items-start gap-2.5">
              <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-amber-300">
                  Ketentuan Nilai Percobaan &gt; 5 Kali
                </p>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  Telah dilakukan <strong>{effectiveAttempt} kali percobaan</strong>. Skor maksimal setelah lebih dari 5 kali percobaan dibatasi menjadi <strong>75 poin</strong>.
                  {typeof hasil?.rawScore === 'number' && hasil.rawScore > 75 && (
                    <span className="block mt-1 font-semibold text-amber-300">
                      Nilai murni: {hasil.rawScore} pt &rarr; Disesuaikan: {hasil.skor} pt.
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Nilai Besar Card */}
          <div className="my-5 p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Perolehan Skor Akhir
            </span>
            <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white flex items-center justify-center gap-1">
              <span className={isLulus ? 'text-emerald-400' : 'text-amber-400'}>{hasil.skor}</span>
              <span className="text-xl text-slate-600 font-sans">/ 100</span>
            </div>
          </div>

          {/* Ringkasan Benar, Salah, Kosong */}
          <div className="grid grid-cols-3 gap-2.5 mb-6 text-xs">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold mb-0.5">
                <CheckCircle2 size={13} /> Benar
              </div>
              <span className="text-lg font-black text-white">{hasil.benar}</span>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
              <div className="flex items-center justify-center gap-1 text-red-400 font-bold mb-0.5">
                <XCircle size={13} /> Salah
              </div>
              <span className="text-lg font-black text-white">{hasil.salah}</span>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 font-bold mb-0.5">
                <AlertCircle size={13} /> Kosong
              </div>
              <span className="text-lg font-black text-white">{hasil.kosong}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mb-6 leading-relaxed">
            Poin nilai resmi telah disinkronkan ke rekap portofolio akun Anda di <strong>Ruang Belajar</strong>.
          </p>

          <button
            type="button"
            onClick={() => navigate('/ruang-belajar')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-4 rounded-2xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98 text-sm"
          >
            <span>KEMBALI KE RUANG BELAJAR</span>
            <ArrowRight size={16} />
          </button>

          {canPerbaiki && (
            <button
              type="button"
              onClick={handleActionPerbaiki}
              className="w-full mt-3 bg-slate-800/90 hover:bg-slate-700 active:scale-98 text-slate-300 hover:text-white font-bold py-3.5 px-4 rounded-2xl transition border border-slate-700 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm shadow-md"
            >
              <Edit3 size={15} className="text-amber-400" />
              <span>Periksa &amp; Perbaiki Jawaban</span>
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

