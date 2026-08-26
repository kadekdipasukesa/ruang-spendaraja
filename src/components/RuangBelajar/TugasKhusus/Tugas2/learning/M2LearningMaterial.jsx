import { Calendar, Clock, ArrowRight, CheckCircle2, Zap, Layers, Sparkles } from 'lucide-react';

export default function M2LearningMaterial({ onStartPractice }) {
  return (
    <div className="space-y-6 text-slate-200">
      {/* Hero Intro Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-slate-900 border border-amber-500/30 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-lg shadow-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-[11px] font-bold text-amber-300">
              <Sparkles className="w-3 h-3" /> Modul Belajar Bab 1 • Berpikir Komputasional
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Optimalisasi Penjadwalan Waktu (Gantt Scheduler & Multitasking)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pelajari bagaimana mengatur urutan aktivitas sekuensial dan aktivitas paralel agar seluruh target kegiatan selesai tepat waktu.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Key Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Concept 1 */}
        <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-4 space-y-2 hover:border-amber-500/40 transition">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Calendar className="w-4 h-4" />
            <span>1. Apa Itu Penjadwalan?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Penjadwalan (<em>Scheduling</em>) adalah proses merencanakan dan mengalokasikan urutan waktu untuk berbagai pekerjaan agar sumber daya dan durasi waktu dimanfaatkan seefisien mungkin.
          </p>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200">
            💡 Komputer menggunakan penjadwalan CPU untuk menjalankan banyak aplikasi sekaligus tanpa lag!
          </div>
        </div>

        {/* Concept 2 */}
        <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-4 space-y-2 hover:border-amber-500/40 transition">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Layers className="w-4 h-4" />
            <span>2. Sekuensial vs Paralel</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Sekuensial:</strong> Pekerjaan yang harus diselesaikan satu per satu secara berurutan. <br />
            <strong>Paralel:</strong> Pekerjaan otomatis yang bisa berjalan bersamaan dengan aktivitas manusia (multitasking).
          </p>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            👕 Contoh: Menunggu mesin cuci berputar adalah proses otomatis, kita bisa membaca buku sambil menunggu!
          </div>
        </div>

        {/* Concept 3 */}
        <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-4 space-y-2 hover:border-amber-500/40 transition">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Zap className="w-4 h-4" />
            <span>3. Studi Kasus Hari Minggu</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Jika dikerjakan satu per satu tanpa paralel, total durasi adalah <strong>7 Jam</strong> (lewat jam 13:00). Dengan jalur paralel, seluruh kegiatan selesai sebelum pukul 13:00!
          </p>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
            🎯 Target: Pukul 07:00 s.d 13:00 (Total 10 Poin).
          </div>
        </div>
      </div>

      {/* CTA Button to Switch to Practice */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20">
        <div className="text-xs text-slate-300">
          Siap menata 5 aktivitas ke dalam timeline dan memanfaatkan jalur multitasking?
        </div>
        <button
          type="button"
          onClick={onStartPractice}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition cursor-pointer flex-shrink-0 w-full sm:w-auto"
          id="btn-start-m2-practice"
        >
          <span>Mulai Susun Jadwal Optimal (10 Poin)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
