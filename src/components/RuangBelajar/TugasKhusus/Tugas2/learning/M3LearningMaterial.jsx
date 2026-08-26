import { ListOrdered, Key, ArrowRight, CheckCircle2, Sparkles, Database, Layers } from 'lucide-react';

export default function M3LearningMaterial({ onStartPractice }) {
  return (
    <div className="space-y-6 text-slate-200">
      {/* Hero Intro Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-slate-900 border border-amber-500/30 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-lg shadow-amber-500/20">
            <ListOrdered className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-[11px] font-bold text-amber-300">
              <Sparkles className="w-3 h-3" /> Modul Belajar Bab 1 • Berpikir Komputasional
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Struktur Data: Daftar (List) & Aktivitas Kata Rahasia
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pelajari bagaimana data disimpan dalam bentuk kumpulan berurutan (Daftar / List), operasi manipulasi data, dan teknik pemecahan kode rahasia.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Key Concepts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Concept 1 */}
        <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-4 space-y-2 hover:border-amber-500/40 transition">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Database className="w-4 h-4" />
            <span>1. Apa Itu Struktur Data Daftar (List)?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Daftar (<em>List</em>) adalah struktur data yang menyimpan sekumpulan elemen data secara berurutan. Setiap elemen memiliki posisi tertentu yang disebut <strong>indeks</strong> (nomor urut).
          </p>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200">
            📋 Contoh: Daftar belanja Ibu ke pasar, urutan nomor absen siswa di kelas (1, 2, 3, ...).
          </div>
        </div>

        {/* Concept 2 */}
        <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-4 space-y-2 hover:border-amber-500/40 transition">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Layers className="w-4 h-4" />
            <span>2. Operasi Dasar pada List</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Kita dapat melakukan berbagai manipulasi pada list:
          </p>
          <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
            <li><strong>Menambah item (Insert/Append):</strong> Menaruh data baru di awal/akhir.</li>
            <li><strong>Menghapus item (Remove):</strong> Mengeluarkan data dari daftar.</li>
            <li><strong>Menukar urutan (Swap):</strong> Mengubah posisi elemen list.</li>
          </ul>
        </div>

        {/* Concept 3 */}
        <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-4 space-y-2 hover:border-amber-500/40 transition">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Key className="w-4 h-4" />
            <span>3. Aktivitas Kata Rahasia</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dalam pemecahan kode, kita mengakses data berdasarkan nomor indeks. Contoh: mengambil huruf ke-1 dari kata pertama, huruf ke-2 dari kata kedua, dan merangkainya menjadi <strong>KATA RAHASIA</strong>.
          </p>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300">
            🎯 Target: Praktik simulasi & Jawab 5 Kuis Konseptual (20 Poin).
          </div>
        </div>
      </div>

      {/* CTA Button to Switch to Practice */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20">
        <div className="text-xs text-slate-300">
          Sudah memahami konsep list dan indeks? Mari uji kemampuanmu di kuis interaktif!
        </div>
        <button
          type="button"
          onClick={onStartPractice}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition cursor-pointer flex-shrink-0 w-full sm:w-auto"
          id="btn-start-m3-practice"
        >
          <span>Mulai Kuis & Praktik List (20 Poin)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
