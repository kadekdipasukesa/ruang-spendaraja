import { BookOpen, Zap, ArrowRight, CheckCircle2, Compass, Cpu, Target, Sparkles, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function M1LearningMaterial({ onStartPractice }) {
  return (
    <div className="space-y-6 text-slate-200">
      {/* Hero Intro Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-slate-900 border border-amber-500/30 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-lg shadow-amber-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-[11px] font-bold text-amber-300">
              <Sparkles className="w-3 h-3" /> Modul Belajar Bab 1 • Berpikir Komputasional
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Mengenal Algoritma & Jalur Tercepat (Shortest Path)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pelajari bagaimana instruksi terstruktur dapat menggerakkan robot melewati labirin dengan langkah yang paling efisien.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Key Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Concept 1 */}
        <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-4 space-y-2 hover:border-amber-500/40 transition">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Cpu className="w-4 h-4" />
            <span>1. Apa Itu Algoritma?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Algoritma adalah <strong>urutan langkah-langkah logis dan terstruktur</strong> yang disusun secara sistematis untuk menyelesaikan suatu masalah atau mencapai tujuan tertentu.
          </p>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200">
            💡 <em>Contoh:</em> Robot tidak bisa menebak pikiran manusia, ia hanya mematuhi urutan perintah: <strong>Maju Atas, Bawah, Kiri, Kanan</strong>.
          </div>
        </div>

        {/* Concept 2 */}
        <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-4 space-y-2 hover:border-amber-500/40 transition">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Compass className="w-4 h-4" />
            <span>2. Karakteristik Instruksi</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Instruksi komputer harus <strong>jelas (tidak ambigu)</strong>, terurut secara presisi, dan memiliki kondisi berhenti (titik <strong>FINISH</strong>).
          </p>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
            ⛔ Jika menabrak tembok bata atau keluar jalur, robot akan berhenti dan dianggap gagal!
          </div>
        </div>

        {/* Concept 3 */}
        <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-4 space-y-2 hover:border-amber-500/40 transition">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Target className="w-4 h-4" />
            <span>3. Efisiensi Jalur Tercepat</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Algoritma yang baik bukan hanya berhasil mencapai tujuan, tetapi juga <strong>efisien</strong>—menggunakan jumlah langkah paling minimal tanpa langkah berputar-putar yang sia-sia.
          </p>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
            ✨ Menemukan langkah optimal memberi poin penuh di setiap level!
          </div>
        </div>
      </div>

      {/* 3 Level Overview in Practice */}
      <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-amber-400" /> Tantangan 3 Level Labirin pada Misi Ini:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">Level 1: Pemula (4x4)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300">15 Poin</span>
            </div>
            <p className="text-[11px] text-slate-400">Labirin dasar 4x4 untuk memahami arah gerak robot & rute 6 langkah.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">Level 2: Menengah (5x5)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300">15 Poin</span>
            </div>
            <p className="text-[11px] text-slate-400">Labirin 5x5 dengan dinding bata bertingkat dan rute optimal 8 langkah.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">Level 3: Ahli (10x10)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300">20 Poin</span>
            </div>
            <p className="text-[11px] text-slate-400">Arena labirin luas 10x10 dengan jalur berlika-liku penuh tantangan.</p>
          </div>
        </div>
      </div>

      {/* CTA Button to Switch to Practice */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20">
        <div className="text-xs text-slate-300">
          Sudah memahami konsep algoritma & instruksi robot? Mari langsung coba praktikkan di labirin!
        </div>
        <button
          type="button"
          onClick={onStartPractice}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition cursor-pointer flex-shrink-0 w-full sm:w-auto"
          id="btn-start-m1-practice"
        >
          <span>Mulai Praktik Labirin (3 Level)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
