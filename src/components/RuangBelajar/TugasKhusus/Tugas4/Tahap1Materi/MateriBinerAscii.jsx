import { useState } from 'react';
import {
  Lightbulb,
  Cpu,
  Binary,
  ArrowRight,
  BookOpen,
  Sparkles,
  Zap,
  Layers,
  HelpCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { BIT_WEIGHTS_8, ASCII_MAP_BY_CODE } from '../binerAsciiData';
import AsciiTableExplorer from './AsciiTableExplorer';

export default function MateriBinerAscii({ onComplete, isAlreadyCompleted }) {
  // State untuk Simulator Saklar 8-Bit Interaktif (Default: desimal 97 / karakter 'a' -> 01100001)
  // Bobot: [128, 64, 32, 16, 8, 4, 2, 1]
  const [switches, setSwitches] = useState([0, 1, 1, 0, 0, 0, 0, 1]);

  const toggleBit = (index) => {
    setSwitches((prev) => {
      const next = [...prev];
      next[index] = next[index] === 1 ? 0 : 1;
      return next;
    });
  };

  // Hitung Nilai Desimal dari Saklar Aktif
  const currentDecimal = switches.reduce((acc, bit, idx) => {
    return acc + (bit === 1 ? BIT_WEIGHTS_8[idx] : 0);
  }, 0);

  const currentChar =
    currentDecimal >= 33 && currentDecimal <= 126
      ? String.fromCharCode(currentDecimal)
      : currentDecimal === 32
      ? '(Spasi)'
      : '(Kontrol / Khusus)';

  return (
    <div className="space-y-6">
      {/* 🌟 1. FUN FACT: Komputer Tidak Mengenal Apapun Selain Biner */}
      <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-lg">
            <Zap className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Fun Fact Informatika
              </span>
              <span className="text-xs text-slate-400">Arsitektur Digital</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Komputer Sebenarnya Tidak Tahu Huruf, Foto, Maupun Video!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Di dalam prosesor (CPU), terdapat miliaran saklar mikroskopis bernama <strong>Transistor</strong>. 
              Transistor hanya memiliki dua kondisi fisik: <strong>Mati / Tanpa Arus (0)</strong> dan <strong>Menyala / Ada Arus (1)</strong>. 
              Karena itu, semua hal yang kamu lihat di layar—mulai dari game, video YouTube, hingga ketikan chat WhatsApp—semuanya diubah menjadi deretan angka biner <span className="font-mono text-cyan-400 font-bold bg-slate-950/60 px-1.5 py-0.5 rounded">0</span> dan <span className="font-mono text-cyan-400 font-bold bg-slate-950/60 px-1.5 py-0.5 rounded">1</span>!
            </p>
          </div>
        </div>
      </div>

      {/* 📚 2. APA ITU KODE ASCII? */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">Apa itu Kode ASCII?</h2>
            <p className="text-xs text-slate-400">American Standard Code for Information Interchange</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Jika komputer hanya paham angka 0 dan 1, bagaimana komputer bisa menampilkan huruf <strong>&apos;A&apos;</strong> saat kamu menekan tombol di keyboard? 
          Jawabannya adalah <strong>ASCII</strong>, yaitu kamus kesepakatan internasional yang memberikan setiap karakter sebuah nomor identitas (angka desimal), yang kemudian diubah ke bentuk biner 8-bit (1 Byte).
        </p>

        {/* Kartu Studi Kasus Karakter 'a' */}
        <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3 text-amber-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Contoh Nyata: Huruf &apos;a&apos; (Kecil) = Desimal 97</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">1. Karakter Teks</span>
              <div className="text-3xl font-black text-amber-300 font-mono mt-1">&apos;a&apos;</div>
              <span className="text-[10px] text-slate-500">Yang kamu ketik di keyboard</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">2. Kode Desimal ASCII</span>
              <div className="text-3xl font-black text-white font-mono mt-1">97</div>
              <span className="text-[10px] text-slate-500">Nomor urut di kamus ASCII</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">3. Kode Biner 8-Bit</span>
              <div className="text-2xl font-black text-cyan-400 font-mono mt-1.5 tracking-wider">01100001</div>
              <span className="text-[10px] text-slate-500">Yang disimpan di memori RAM</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🎛️ 3. SIMULATOR INTERAKTIF SAKLAR 8-BIT */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              <span>Simulator Laboratorium Saklar 8-Bit (1 Byte)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Klik kotak bit di bawah untuk menyalakan (1) atau mematikan (0). Perhatikan perubahan nilai desimal dan karakter ASCII secara langsung!
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSwitches([0, 1, 1, 0, 0, 0, 0, 1])}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20 transition shrink-0"
          >
            Reset ke Huruf &apos;a&apos; (97)
          </button>
        </div>

        {/* Deretan 8 Saklar Bit */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {switches.map((bit, idx) => {
            const weight = BIT_WEIGHTS_8[idx];
            const isOn = bit === 1;

            return (
              <button
                key={weight}
                type="button"
                onClick={() => toggleBit(idx)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-1 select-none active:scale-95 ${
                  isOn
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <span className={`text-[10px] font-mono font-bold ${isOn ? 'text-slate-900' : 'text-slate-500'}`}>
                  Bobot {weight}
                </span>
                <span className="text-3xl font-black font-mono leading-none my-1">
                  {bit}
                </span>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  isOn ? 'bg-slate-900 text-amber-400' : 'bg-slate-900 text-slate-500'
                }`}>
                  {isOn ? 'ON (1)' : 'OFF (0)'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Hasil Kalkulasi Live Simulator */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Perhitungan Penjumlahan Bobot:</span>
            <div className="text-xs font-mono text-slate-300">
              {switches.map((b, i) => (b === 1 ? BIT_WEIGHTS_8[i] : null)).filter(Boolean).join(' + ') || '0'} = <strong className="text-amber-400 text-sm font-bold">{currentDecimal}</strong>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Hasil Desimal</span>
              <span className="text-2xl font-black font-mono text-white">{currentDecimal}</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-left">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Karakter ASCII</span>
              <span className="text-2xl font-black font-mono text-cyan-400 bg-cyan-950/40 px-3 py-0.5 rounded-lg border border-cyan-800/40">
                {currentChar}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 📝 4. CARA KONVERSI (PANDUAN 3 LANGKAH) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* A. Biner ke Desimal */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Binary className="w-4 h-4 text-emerald-400" />
            <span>Cara Konversi: Biner ➔ Desimal</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Jumlahkan bobot pangkat dua ($128, 64, 32, 16, 8, 4, 2, 1$) hanya pada posisi bit yang bernilai <strong>1</strong>.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1 text-slate-300">
            <div className="text-cyan-400">Contoh biner: 01000001</div>
            <div>Bit aktif ada di posisi bobot 64 dan 1.</div>
            <div className="text-emerald-400 font-bold">➔ 64 + 1 = 65 (Karakter &apos;A&apos;)</div>
          </div>
        </div>

        {/* B. Desimal ke Biner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Cara Konversi: Desimal ➔ Biner</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Kurangkan angka dengan bobot terbesar yang muat. Jika muat beri angka <strong>1</strong>, jika tidak muat beri angka <strong>0</strong>.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1 text-slate-300">
            <div className="text-amber-400">Contoh desimal: 97</div>
            <div>97 - 64 = sisa 33 (Bit 64 = 1)</div>
            <div>33 - 32 = sisa 1 (Bit 32 = 1)</div>
            <div>1 - 1 = sisa 0 (Bit 1 = 1)</div>
            <div className="text-cyan-400 font-bold">➔ Hasil: 01100001 (Karakter &apos;a&apos;)</div>
          </div>
        </div>
      </div>

      {/* 🔍 5. TABEL ASCII INTERAKTIF 33 - 126 */}
      <AsciiTableExplorer />

      {/* 🚀 TOMBOL MULAI TANTANGAN */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 text-center space-y-3">
        <h2 className="text-base font-black text-white">Sudah Paham Cara Kerjanya?</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Kamu akan menghadapi 3 tahap tantangan acak (Desimal ke Biner, Biner ke Desimal, dan ASCII ke Biner). Nilai maksimal adalah 50 Poin!
        </p>

        <button
          type="button"
          onClick={onComplete}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition active:scale-95 cursor-pointer"
        >
          <span>{isAlreadyCompleted ? 'Buka Tantangan Tahap 2' : 'Tandai Selesai Baca & Mulai Tantangan'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
