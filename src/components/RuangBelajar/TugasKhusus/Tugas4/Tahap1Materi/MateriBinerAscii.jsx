import { useState } from 'react';
import {
  Lightbulb,
  Cpu,
  Binary,
  ArrowRight,
  BookOpen,
  Sparkles,
  Zap,
  Lock,
  Unlock,
  ArrowDown,
  ArrowUp,
  Divide,
  ClipboardList,
  CheckCircle,
  HelpCircle,
  Laptop,
  CheckSquare,
  FileEdit,
  Search,
  Send,
  Code
} from 'lucide-react';
import { BIT_WEIGHTS_8 } from '../binerAsciiData';
import AsciiTableExplorer from './AsciiTableExplorer';

export default function MateriBinerAscii({
  onComplete,
  isAlreadyCompleted,
  isTaskCompleted = false,
  totalScore = 0
}) {
  // State untuk Simulator Saklar 8-Bit Interaktif (Default: desimal 97 / karakter 'a' -> 01100001)
  // Bobot: [128, 64, 32, 16, 8, 4, 2, 1]
  const [switches, setSwitches] = useState([0, 1, 1, 0, 0, 0, 0, 1]);

  const toggleBit = (index) => {
    // Mencegah kecurangan: Hanya dapat diubah saat seluruh tantangan telah selesai
    if (!isTaskCompleted) return;
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
    <div className="space-y-8 select-text">
      {/* ═══════════════════════════════════════════════════════════════
          1. HERO HEADER: SESUAI BROSUR "Yuk, Kenalan dengan Bilangan Biner"
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-b from-[#0a1b38] via-[#0f2a58] to-[#07152d] border-2 border-[#224b88] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white">
        {/* Decorative Floating Binary & Stars (Dari brosur) */}
        <div className="absolute top-3 left-1/3 text-[#38bdf8]/40 font-mono text-xl sm:text-2xl font-black pointer-events-none select-none">
          0
        </div>
        <div className="absolute top-12 left-1/2 text-[#fbbf24]/50 font-mono text-2xl sm:text-3xl font-black pointer-events-none select-none">
          1
        </div>
        <div className="absolute top-5 left-[60%] text-[#38bdf8]/30 font-mono text-3xl font-black pointer-events-none select-none">
          1
        </div>
        <div className="absolute top-16 left-[42%] text-[#38bdf8]/40 font-mono text-xl font-black pointer-events-none select-none">
          0
        </div>
        <div className="absolute top-2 right-12 text-[#38bdf8]/30 font-mono text-2xl font-black pointer-events-none select-none hidden sm:block">
          0
        </div>
        <div className="absolute bottom-6 right-24 text-[#fbbf24]/40 font-mono text-xl font-black pointer-events-none select-none hidden sm:block">
          1
        </div>
        <div className="absolute bottom-12 right-10 text-[#38bdf8]/30 font-mono text-2xl font-black pointer-events-none select-none hidden sm:block">
          0
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Kolom Kiri: Judul Utama & Pengantar */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1">
              <p className="text-white/90 text-sm sm:text-base font-semibold tracking-wide flex items-center gap-1.5 font-sans">
                <span>Yuk, Kenalan dengan</span>
              </p>

              <div className="relative inline-block">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight flex items-baseline gap-3 flex-wrap">
                  <span className="text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                    Bilangan
                  </span>
                  <span className="text-[#fbbf24] drop-shadow-[0_4px_16px_rgba(251,191,36,0.35)]">
                    Biner
                  </span>
                </h1>
                {/* Underline Swoosh Curve */}
                <svg
                  className="w-44 sm:w-56 h-3 text-[#fbbf24] mt-0.5"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9C50 3 150 3 197 9"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Badge Informatika Kelas 7 */}
            <div>
              <span className="inline-block bg-[#4f46e5] text-white text-xs sm:text-sm font-black px-4 py-1.5 rounded-full border border-indigo-400/50 shadow-md">
                Informatika – Kelas 7
              </span>
            </div>

            {/* Subtitle Box */}
            <div className="bg-[#051024]/75 border border-[#254b85] rounded-2xl p-4 sm:p-5 max-w-xl backdrop-blur-xs shadow-lg">
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                Bilangan biner adalah cara untuk menyatakan angka menggunakan dua simbol saja:{' '}
                <strong className="text-[#fbbf24] font-black text-sm sm:text-base">0 dan 1</strong>.
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Mockup Laptop Interaktif & Speech Bubble Kuning */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative pt-4 lg:pt-0">
            {/* Speech Bubble Kuning dengan Lampu (Brosur) */}
            <div className="relative mb-3 z-20 self-end lg:self-center mr-4 lg:mr-0 animate-bounce duration-1000">
              <div className="bg-[#fbbf24] text-slate-950 font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-amber-300">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-amber-600 shrink-0 shadow-xs">
                  <Lightbulb className="w-4 h-4 fill-amber-500" />
                </div>
                <span>Komputer hanya mengenal 0 dan 1!</span>
              </div>
              {/* Segitiga Ekor Balon */}
              <div className="w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[#fbbf24] ml-6" />
            </div>

            {/* Laptop Mockup dengan Layar Biner Cyan */}
            <div className="w-full max-w-xs sm:max-w-sm bg-[#162a4d] p-3 rounded-2xl border-2 border-[#2b579a] shadow-[0_15px_35px_rgba(0,0,0,0.5)] transform -rotate-1 hover:rotate-0 transition duration-300">
              {/* Layar Laptop */}
              <div className="bg-[#051124] rounded-xl p-3 sm:p-4 border border-[#1e3e70] space-y-1.5 shadow-inner">
                {/* Bar Jendela Browser / Terminal */}
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="text-[10px] font-mono text-slate-400 ml-auto">CPU Register (8-Bit)</span>
                </div>

                {/* Kode Biner Matriks Cyan (Sesuai Brosur) */}
                <div className="font-mono text-cyan-300 text-xs sm:text-sm font-bold tracking-widest leading-snug py-1">
                  <p className="hover:text-amber-300 transition">01001101</p>
                  <p className="hover:text-amber-300 transition">01110000</p>
                  <p className="hover:text-amber-300 transition">01101011</p>
                  <p className="hover:text-amber-300 transition">01101000</p>
                </div>
              </div>

              {/* Engsel & Keyboard Base */}
              <div className="mt-2 bg-[#0c1c38] rounded-lg p-1.5 border border-[#1b3a6d] flex items-center justify-between px-3 text-[9px] text-slate-400 font-mono">
                <span>[ SPENDARAJA LAB ]</span>
                <span className="w-10 h-1.5 rounded-full bg-cyan-400/40" />
                <span>8-BIT BUS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          2. KONTEN UTAMA: 3 KOLOM INFOGRAFIS PERSIS SEPERTI BROSUR
         ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ─── KOLOM KIRI (5 Kolom): 1. Apa itu Biner? & 2. Cara Kerja ─── */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* PILL 1: APA ITU BILANGAN BINER? */}
          <div className="bg-[#0b1b36] border-2 border-[#1c3c72] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            {/* Header Badge Biru #1 (Sesuai Brosur) */}
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#1d4ed8] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                1
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">
                Apa itu Bilangan Biner?
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Bilangan <strong>biner</strong> adalah sistem bilangan yang hanya menggunakan dua angka, yaitu{' '}
              <strong className="text-[#fbbf24]">0 dan 1</strong>.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Dalam komputer, semua data (di teks, gambar, suara, program) disimpan dan diolah dalam bentuk{' '}
              <strong>bilangan biner</strong>.
            </p>

            {/* Box Mini Lightbulb (Brosur) */}
            <div className="bg-[#0e2448] border border-[#254b85] rounded-2xl p-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#fbbf24]/20 text-[#fbbf24] border border-[#fbbf24]/30 flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Karena hanya ada 2 simbol, bilangan biner disebut{' '}
                <strong className="text-[#38bdf8]">sistem bilangan basis 2</strong>.
              </p>
            </div>

            {/* Fun Fact Transistor CPU (Fitur Edukatif) */}
            <div className="bg-[#081326] border border-indigo-500/30 rounded-2xl p-3.5 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Zap className="w-4 h-4" />
                <span>Kenapa Komputer Pakai Biner?</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                Di dalam prosesor (CPU) ada miliaran saklar mikroskopis bernama <strong>Transistor</strong>. 
                Transistor hanya mengenal dua kondisi listrik: <strong>Mati / Tidak Ada Arus (0)</strong> dan{' '}
                <strong>Menyala / Ada Arus (1)</strong>.
              </p>
            </div>
          </div>

          {/* PILL 2: CARA KERJA & PANGKAT 2 */}
          <div className="bg-[#0b1b36] border-2 border-[#1c3c72] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            {/* Header Badge Ungu #2 (Sesuai Brosur) */}
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#7c3aed] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                2
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">
                Cara Kerja
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Setiap posisi angka dalam bilangan biner memiliki <strong>nilai tempat</strong>, yaitu{' '}
              <strong>pangkat dari 2</strong>. Dimulai dari kanan ke kiri:{' '}
              <span className="font-mono text-[#38bdf8] font-bold">2⁰, 2¹, 2², 2³, dan seterusnya</span>.
            </p>

            {/* Box Contoh Sesuai Brosur: 1101₂ = 13 */}
            <div className="bg-[#0e2448] border border-[#254b85] rounded-2xl p-4 font-mono text-xs space-y-2 text-slate-200">
              <div className="font-bold text-[#fbbf24] text-xs uppercase tracking-wider font-sans">
                Contoh Perhitungan:
              </div>
              <div className="bg-[#071428] p-3 rounded-xl border border-slate-700 space-y-1">
                <p className="text-[#38bdf8] font-bold text-sm">
                  Bilangan biner 1101₂
                </p>
                <p className="text-slate-300">
                  = (1 × 2³) + (1 × 2²) + (0 × 2¹) + (1 × 2⁰)
                </p>
                <p className="text-slate-300">
                  = 8 + 4 + 0 + 1
                </p>
                <p className="text-white font-bold text-sm pt-1 border-t border-slate-700">
                  = <span className="text-[#fbbf24] font-black text-base">13</span> (dalam desimal)
                </p>
              </div>
            </div>

            {/* 🎛️ SIMULATOR SAKLAR 8-BIT INTERAKTIF (Fitur Asli Dipertahankan Penuh) */}
            <div className="bg-[#071428] border-2 border-[#254b85] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-[#fbbf24]" />
                    <span>Simulator Saklar 8-Bit (1 Byte)</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    {isTaskCompleted
                      ? 'Laboratorium terbuka! Klik kotak bit untuk mengubah saklar 0/1.'
                      : 'Contoh peragaan saklar untuk huruf \'a\' (desimal 97 = 01100001).'}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={!isTaskCompleted}
                  onClick={() => setSwitches([0, 1, 1, 0, 0, 0, 0, 1])}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition ${
                    isTaskCompleted
                      ? 'text-[#fbbf24] bg-[#fbbf24]/10 border-[#fbbf24]/30 hover:bg-[#fbbf24]/20 cursor-pointer'
                      : 'text-slate-500 bg-slate-900 border-slate-800 cursor-not-allowed opacity-50'
                  }`}
                >
                  Reset ke &apos;a&apos; (97)
                </button>
              </div>

              {/* Status Kunci Anti-Kecurangan */}
              {!isTaskCompleted ? (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 flex items-center gap-2 text-[11px] text-amber-300">
                  <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Saklar terkunci pada contoh 97 agar kamu berlatih mandiri. Terbuka bebas setelah tugas selesai!</span>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 flex items-center gap-2 text-[11px] text-emerald-300">
                  <Unlock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Laboratorium Terbuka Bebas! Kamu bisa bereksperimen dengan seluruh kombinasi bit.</span>
                </div>
              )}

              {/* 8 Kotak Saklar Bit */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {switches.map((bit, idx) => {
                  const weight = BIT_WEIGHTS_8[idx];
                  const isOn = bit === 1;

                  return (
                    <button
                      key={weight}
                      type="button"
                      disabled={!isTaskCompleted}
                      onClick={() => toggleBit(idx)}
                      className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-between gap-1 select-none ${
                        isOn
                          ? 'bg-[#fbbf24] text-slate-950 border-amber-300 shadow-md shadow-[#fbbf24]/25'
                          : 'bg-[#0a1b38] text-slate-400 border-[#1e3a6d]'
                      } ${isTaskCompleted ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed'}`}
                    >
                      <span className={`text-[9px] font-mono font-bold ${isOn ? 'text-slate-900' : 'text-slate-500'}`}>
                        {weight}
                      </span>
                      <span className="text-2xl font-black font-mono leading-none my-0.5">
                        {bit}
                      </span>
                      <span className={`text-[8px] font-bold px-1 py-0.2 rounded ${
                        isOn ? 'bg-slate-900 text-[#fbbf24]' : 'bg-slate-900/60 text-slate-500'
                      }`}>
                        {isOn ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Live Hasil Saklar */}
              <div className="bg-[#051124] p-3 rounded-xl border border-slate-700 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Penjumlahan:</span>
                  <span className="font-mono text-[#fbbf24] font-bold">
                    {switches.map((b, i) => (b === 1 ? BIT_WEIGHTS_8[i] : null)).filter(Boolean).join(' + ') || '0'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-sans">Desimal &bull; Huruf:</span>
                  <span className="font-mono text-white font-black text-sm">
                    {currentDecimal}{' '}
                    <span className="text-[#38bdf8] bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">
                      {currentChar}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── KOLOM KANAN (6 Kolom): 3. Konversi Bilangan & Alur LKPD ─── */}
        <div className="lg:col-span-6 space-y-6">

          {/* PILL 3: KONVERSI BILANGAN (Desimal -> Biner & Biner -> Desimal) */}
          <div className="bg-[#0b1b36] border-2 border-[#1c3c72] rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
            {/* Header Badge Hijau #3 (Sesuai Brosur) */}
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#059669] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                3
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">
                Konversi Bilangan
              </h2>
            </div>

            {/* a. Desimal -> Biner (Metode Pembagian 2 & Sisa) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  a. Desimal &rarr; Biner
                </span>
                <span className="text-xs text-slate-300 font-semibold">Metode Tangga Bagi 2:</span>
              </div>

              <div className="bg-[#071428] border border-slate-700/80 rounded-2xl p-4 text-xs space-y-2">
                <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                  <li>Bagi angka desimal dengan <strong>2</strong>, catat sisanya (0 atau 1).</li>
                  <li>Ulangi pembagian sampai hasil bagi menjadi <strong>0</strong>.</li>
                  <li><strong className="text-[#fbbf24]">Baca sisa dari bawah ke atas (&uarr;)</strong> untuk urutan biner.</li>
                </ol>

                {/* Box Contoh Brosur: 13 desimal -> 1101 */}
                <div className="bg-[#0b1e3a] p-3 rounded-xl border border-emerald-500/30 space-y-2 font-mono">
                  <div className="flex items-center justify-between text-[#fbbf24] font-bold font-sans text-xs">
                    <span>Contoh 1: 13 (desimal) &rarr; ? (biner)</span>
                    <span className="text-[10px] text-slate-400 uppercase">Sesuai Brosur</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="space-y-0.5 text-slate-300">
                      <p>13 &divide; 2 = 6 <span className="text-[#fbbf24] font-bold">sisa 1</span></p>
                      <p>6 &divide; 2 = 3 <span className="text-slate-400 font-bold">sisa 0</span></p>
                      <p>3 &divide; 2 = 1 <span className="text-[#fbbf24] font-bold">sisa 1</span></p>
                      <p>1 &divide; 2 = 0 <span className="text-[#fbbf24] font-bold">sisa 1</span></p>
                    </div>

                    <div className="flex flex-col justify-center items-center bg-[#071326] p-2 rounded-lg border border-slate-700 text-center">
                      <span className="text-[10px] text-slate-400 font-sans">Baca dari bawah (&uarr;):</span>
                      <div className="text-base sm:text-lg font-black text-emerald-400 tracking-widest mt-0.5">
                        1101₂
                      </div>
                      <span className="text-[9px] text-slate-500 font-sans">Hasil: 1101 biner</span>
                    </div>
                  </div>
                </div>

                {/* Tangga Lengkap Pembagian Karakter 97 (Fitur Interaktif Lanjutan) */}
                <details className="text-[11px] text-slate-400 group cursor-pointer pt-1">
                  <summary className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1.5 select-none">
                    <span>Lihat Contoh Lengkap 8-Bit: Desimal 97 (Huruf &apos;a&apos;)</span>
                    <ArrowDown className="w-3.5 h-3.5 group-open:rotate-180 transition" />
                  </summary>
                  <div className="mt-2 p-3 bg-[#071326] rounded-xl border border-slate-800 space-y-1 font-mono text-slate-300">
                    <p>97 &divide; 2 = 48 (sisa 1) &bull; bit-0 (kanan)</p>
                    <p>48 &divide; 2 = 24 (sisa 0)</p>
                    <p>24 &divide; 2 = 12 (sisa 0)</p>
                    <p>12 &divide; 2 = 6  (sisa 0)</p>
                    <p>6  &divide; 2 = 3  (sisa 0)</p>
                    <p>3  &divide; 2 = 1  (sisa 1)</p>
                    <p>1  &divide; 2 = 0  (sisa 1) &bull; Selesai</p>
                    <p className="pt-1 text-cyan-300 font-bold border-t border-slate-800">
                      Urutan 7 digit: 1100001 &rarr; Tambah 0 di depan (8-bit) = <span className="text-white">01100001</span>
                    </p>
                  </div>
                </details>
              </div>
            </div>

            {/* b. Biner -> Desimal (Metode Kalikan 2^n & Coret 0 Ambil 1) */}
            <div className="space-y-3 pt-2 border-t border-[#1c3c72]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  b. Biner &rarr; Desimal
                </span>
                <span className="text-xs text-slate-300 font-semibold">Metode Garis Papan Tulis:</span>
              </div>

              <p className="text-xs text-slate-300">
                Kalikan setiap angka dengan <strong>2ⁿ</strong> (n = posisi dari kanan) atau gunakan garis bobot:{' '}
                <span className="text-emerald-400 font-bold">Ambil</span> jika angka biner 1, dan{' '}
                <span className="text-rose-400 font-bold">Coret</span> jika angka biner 0.
              </p>

              {/* Box Contoh Brosur: 1010₂ = 10 */}
              <div className="bg-[#071428] border border-slate-700/80 rounded-2xl p-4 font-mono text-xs space-y-2 text-slate-200">
                <div className="flex items-center justify-between text-[#38bdf8] font-bold font-sans text-xs">
                  <span>Contoh 2: 1010₂ &rarr; ? (desimal)</span>
                  <span className="text-[10px] text-slate-400 uppercase">Sesuai Brosur</span>
                </div>
                <div className="bg-[#0b1e3a] p-3 rounded-xl border border-blue-500/30 space-y-1">
                  <p className="text-slate-300">= (1 &times; 2³) + (0 &times; 2²) + (1 &times; 2¹) + (0 &times; 2⁰)</p>
                  <p className="text-slate-300">= 8 + 0 + 2 + 0</p>
                  <p className="text-white font-bold text-sm pt-1 border-t border-slate-700">
                    = <span className="text-[#fbbf24] font-black text-base">10</span> (dalam desimal)
                  </p>
                </div>
              </div>

              {/* Visual 8 Kolom Penarikan Garis Papan Tulis (01100001) */}
              <div className="bg-[#071428] border-2 border-emerald-500/30 rounded-2xl p-3 sm:p-4 overflow-x-auto space-y-2">
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Papan Tulis: Konversi 01100001 ke Desimal</span>
                  <span className="text-slate-500 text-[10px] font-mono">8-bit</span>
                </div>

                <div className="grid grid-cols-8 gap-1 min-w-[320px] sm:min-w-0 text-center font-mono">
                  {[
                    { bit: 0, w: 128 },
                    { bit: 1, w: 64 },
                    { bit: 1, w: 32 },
                    { bit: 0, w: 16 },
                    { bit: 0, w: 8 },
                    { bit: 0, w: 4 },
                    { bit: 0, w: 2 },
                    { bit: 1, w: 1 }
                  ].map((col, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span className={`w-full py-1 rounded-lg text-xs font-black ${
                        col.bit === 1 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-[#0a1931] text-slate-500'
                      }`}>
                        {col.bit}
                      </span>
                      <ArrowDown className={`w-3 h-3 ${col.bit === 1 ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span className={`text-[10px] ${
                        col.bit === 1 ? 'text-emerald-300 font-bold' : 'line-through text-rose-400/70 text-[9px]'
                      }`}>
                        {col.w}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-right text-[11px] text-slate-300 pt-1 border-t border-slate-800 font-mono">
                  Jumlah yang TIDAK dicoret: 64 + 32 + 1 = <strong className="text-white text-xs bg-slate-900 px-2 py-0.5 rounded border border-emerald-500/40">97</strong>
                </div>
              </div>
            </div>
          </div>

          {/* ALUR PENGERJAAN LKPD & TIPS SUKSES (Kolom Tengah Brosur) */}
          <div className="bg-[#0b1b36] border-2 border-[#1c3c72] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-500/40 flex items-center justify-center">
                <ClipboardList className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Alur Pengerjaan Tugas</h3>
                <p className="text-[11px] text-slate-400">Ikuti 5 langkah berikut agar pengerjaan lebih mudah dan terarah</p>
              </div>
            </div>

            {/* 5 Langkah Vertikal Sesuai Brosur */}
            <div className="space-y-2 text-xs">
              {/* Langkah 1 */}
              <div className="p-2.5 rounded-2xl bg-[#0e2448] border border-pink-500/30 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-pink-500 text-white font-black text-[11px] flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-pink-200 block text-xs">Baca Petunjuk dan Tujuan</strong>
                  <span className="text-[11px] text-slate-300">Pahami konsep biner 0 dan 1 serta aturan nilai tempat.</span>
                </div>
              </div>

              {/* Langkah 2 */}
              <div className="p-2.5 rounded-2xl bg-[#0e2448] border border-amber-500/30 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-amber-200 block text-xs">Pelajari Materi</strong>
                  <span className="text-[11px] text-slate-300">Coba simulator saklar 8-bit dan amati tabel ASCII di bawah.</span>
                </div>
              </div>

              {/* Langkah 3 */}
              <div className="p-2.5 rounded-2xl bg-[#0e2448] border border-emerald-500/30 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-[11px] flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-emerald-200 block text-xs">Kerjakan Soal</strong>
                  <span className="text-[11px] text-slate-300">Selesaikan 3 tahap kuis (Desimal ke Biner, Biner ke Desimal, ASCII).</span>
                </div>
              </div>

              {/* Langkah 4 */}
              <div className="p-2.5 rounded-2xl bg-[#0e2448] border border-blue-500/30 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-black text-[11px] flex items-center justify-center shrink-0">
                  4
                </span>
                <div>
                  <strong className="text-blue-200 block text-xs">Periksa Kembali</strong>
                  <span className="text-[11px] text-slate-300">Pastikan perhitungan kelipatan dua dan urutan biner sudah tepat.</span>
                </div>
              </div>

              {/* Langkah 5 */}
              <div className="p-2.5 rounded-2xl bg-[#0e2448] border border-purple-500/30 flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-purple-500 text-white font-black text-[11px] flex items-center justify-center shrink-0">
                  5
                </span>
                <div>
                  <strong className="text-purple-200 block text-xs">Kumpulkan</strong>
                  <span className="text-[11px] text-slate-300">Kirim nilai ke database Spendaraja untuk tercatat di peringkat kelas.</span>
                </div>
              </div>
            </div>

            {/* Kartu Tips Sukses Brosur */}
            <div className="bg-[#071326] border border-[#fbbf24]/40 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-[#fbbf24] font-black text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Tips Sukses:</span>
              </div>
              <ul className="text-[11px] text-slate-200 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Pahami konsep, jangan hanya menghafal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Gunakan tabel nilai tempat bobot 8-bit untuk memudahkan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Latihan soal secara teratur.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Jangan ragu bertanya kepada guru jika ada langkah yang belum dipahami.</span>
                </li>
              </ul>

              {/* Banner Semangat Brosur */}
              <div className="mt-3 text-center bg-[#fbbf24] text-slate-950 font-black text-xs py-2 px-3 rounded-xl shadow-md">
                Semangat mengerjakan tugasnya! 😊
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          3. KODE ASCII & PENJELAJAH TABEL KARAKTER 33 - 126
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-[#0b1b36] border-2 border-[#1c3c72] rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">
              Apa itu Kode ASCII?
            </h2>
            <p className="text-xs text-slate-400">
              American Standard Code for Information Interchange (Standar Teks Digital Internasional)
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          ASCII adalah kamus kesepakatan internasional yang memberikan setiap karakter sebuah{' '}
          <strong>nomor identitas (kode desimal)</strong>, yang kemudian diubah ke bentuk biner 8-bit (1 Byte) agar dapat diproses oleh komputer.
        </p>

        {/* Kartu Studi Kasus Huruf 'a' */}
        <div className="bg-[#071326] border border-[#fbbf24]/40 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3 text-[#fbbf24] text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Contoh Nyata: Huruf &apos;a&apos; (Kecil) = Desimal 97</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
            <div className="bg-[#0b1e3a] p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold">1. Karakter Teks</span>
              <div className="text-3xl font-black text-[#fbbf24] font-mono mt-1">&apos;a&apos;</div>
              <span className="text-[10px] text-slate-400">Yang kamu ketik di keyboard</span>
            </div>
            <div className="bg-[#0b1e3a] p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold">2. Kode Desimal ASCII</span>
              <div className="text-3xl font-black text-white font-mono mt-1">97</div>
              <span className="text-[10px] text-slate-400">Nomor urut di kamus ASCII</span>
            </div>
            <div className="bg-[#0b1e3a] p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold">3. Kode Biner 8-Bit</span>
              <div className="text-2xl font-black text-cyan-400 font-mono mt-1.5 tracking-wider">01100001</div>
              <span className="text-[10px] text-slate-400">Yang disimpan di memori RAM</span>
            </div>
          </div>
        </div>

        {/* Komponen Penjelajah Tabel ASCII Interaktif Asli */}
        <div className="pt-2">
          <AsciiTableExplorer />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          4. BANNER BAWAH: "Dari 0 dan 1 lahir teknologi besar"
         ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-[#071326] via-[#0e254d] to-[#071326] border-2 border-[#fbbf24]/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#061020] border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg font-mono font-black text-xs tracking-tighter p-2">
              <div className="text-center leading-tight">
                <div>0101</div>
                <div className="text-amber-400">1010</div>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#fbbf24] bg-[#fbbf24]/20 px-2.5 py-0.5 rounded-full border border-[#fbbf24]/30">
                Pesan Inspiratif
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                Dari 0 dan 1 lahir teknologi besar!
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 max-w-lg">
                Kamu sudah memahami konsep biner, alur pembagian tangga, dan kode ASCII. Sekarang saatnya menguji kemampuanmu di 3 tahap tantangan!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onComplete}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#d97706] text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-[#fbbf24]/25 transition active:scale-95 flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>{isAlreadyCompleted ? 'Buka Tantangan Tahap 2' : 'Mulai Tantangan Kuis Sekarang'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
