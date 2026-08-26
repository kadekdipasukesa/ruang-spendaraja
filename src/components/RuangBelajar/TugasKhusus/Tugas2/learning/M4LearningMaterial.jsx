import { HelpCircle, ToggleLeft, ArrowRight, CheckCircle2, Sparkles, BrainCircuit, Binary } from 'lucide-react';

export default function M4LearningMaterial({ onStartPractice }) {
  return (
    <div className="space-y-6 text-slate-200">
      {/* Hero Intro Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-slate-900 border border-amber-500/30 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-lg shadow-amber-500/20">
            <ToggleLeft className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-[11px] font-bold text-amber-300">
              <Sparkles className="w-3 h-3" /> Modul Belajar Bab 1 • Berpikir Komputasional
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Representasi Data: Logika 2 Kemungkinan (Ya / Tidak)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pelajari bagaimana komputer memproses data dan kondisi menggunakan logika biner 2 kemungkinan (Ya/Tidak, Hidup/Mati, Benar/Salah, 1/0).
            </p>
          </div>
        </div>
      </div>

      {/* 3 Key Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Concept 1 */}
        <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-4 space-y-2 hover:border-amber-500/40 transition">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Binary className="w-4 h-4" />
            <span>1. Apa Itu Representasi Data?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Representasi data adalah cara menyajikan informasi nyata (kata, angka, status, gambar) ke dalam bentuk kode atau simbol yang dipahami oleh sistem komputer.
          </p>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200">
            ⚡ Komputer pada dasarnya hanya mengenali sinyal listrik: <strong>ON (1)</strong> atau <strong>OFF (0)</strong>.
          </div>
        </div>

        {/* Concept 2 */}
        <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-4 space-y-2 hover:border-amber-500/40 transition">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <BrainCircuit className="w-4 h-4" />
            <span>2. Dua Jenis Pertanyaan</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dalam berpikir komputasional, kita membedakan:
          </p>
          <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
            <li><strong>Banyak Kemungkinan:</strong> "Berapa umurmu?", "Apa warna bajumu?"</li>
            <li><strong>2 Kemungkinan (Biner):</strong> "Apakah kamu memakai kacamata?" (Ya/Tidak), "Apakah lampu menyala?" (Ya/Tidak).</li>
          </ul>
        </div>

        {/* Concept 3 */}
        <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-4 space-y-2 hover:border-amber-500/40 transition">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <ToggleLeft className="w-4 h-4" />
            <span>3. Efisiensi Pengambilan Keputusan</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dengan menyusun pertanyaan berlogika 2 kemungkinan (Ya/Tidak) secara tepat, kita dapat menebak objek rahasia atau mengambil keputusan komputer dengan sangat cepat!
          </p>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
            🎯 Target: Praktik & Selesaikan 5 Soal Cerita Representasi Data (20 Poin).
          </div>
        </div>
      </div>

      {/* CTA Button to Switch to Practice */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20">
        <div className="text-xs text-slate-300">
          Siap membedakan pertanyaan banyak kemungkinan vs 2 kemungkinan dalam soal cerita?
        </div>
        <button
          type="button"
          onClick={onStartPractice}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition cursor-pointer flex-shrink-0 w-full sm:w-auto"
          id="btn-start-m4-practice"
        >
          <span>Mulai Kuis & Logika Representasi (20 Poin)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
