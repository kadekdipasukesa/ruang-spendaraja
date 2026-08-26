# Modul Teknis: Tugas 2 - Petualangan Berpikir Komputasional (BK)

Dokumen ini merangkum arsitektur, alur data, komponen interaktif, custom hooks, dan aturan penilaian untuk **Tugas 2 (Bab 1 Terpadu: Berpikir Komputasional)** pada platform **Ruang Spendaraja**.

---

## 1. Ringkasan & Konsep Utama
* **Nama Modul**: Petualangan Berpikir Komputasional
* **Kode Tugas Master**: `TUGAS_BK_01` (alias kompatibel: `TUGAS-02-KUIS-ALGO`, `tugas-inf-02`)
* **Rute Halaman**: `/tugas/berpikir-komputasional` (alias: `/tugas/kuis-algoritma`, `/ruang-belajar/tugas/kuis-algoritma`)
* **Komponen Controller Utama**: `src/pages/TugasKhusus/TugasBerpikirKomputasional.jsx`
* **Tema Visual**: Amber / Warm Glow modern dengan latar `bg-slate-950`, kartu `bg-slate-900/90`, border `border-slate-800`, dan aksen emas-amber cerah (`#f59e0b`).
* **Total Nilai Maksimal**: **100 Poin** dengan pembagian bobot:
  - **Misi 1: Algoritma (50%)** $\rightarrow$ **Maks 50 Poin** (Level 1: 15p, Level 2: 15p, Level 3: 20p)
  - **Misi 2: Penjadwalan (10%)** $\rightarrow$ **Maks 10 Poin**
  - **Misi 3: Struktur Data (20%)** $\rightarrow$ **Maks 20 Poin** (5 Soal Kuis x 4 Poin)
  - **Misi 4: Representasi Data (20%)** $\rightarrow$ **Maks 20 Poin** (5 Soal Kuis x 4 Poin)
* **Pola Desain Learning-First**:
  - Setiap misi secara otomatis membuka **"📖 Belajar Materi"** sebagai tampilan awal (*default view*).
  - Siswa membaca ringkasan materi, lalu menekan tombol **"🚀 Mulai Praktik / Kuis"** untuk masuk ke simulasi/evaluasi.
  - Terdapat tombol cepat **"📖 Materi"** di header setiap misi untuk membuka kembali materi kapan saja secara fleksibel.
* **Audio Interaktif & Animasi Perayaan**:
  - `src/utils/gameAudio.js` (Web Audio API Synthesizer): Suara langkah (*step*), sukses (*victory chime*), dan gagal (*fail buzzer*).
  - `src/utils/confettiHelper.js`: Efek partikel konfeti/petasan saat menyelesaikan level/kuis dengan nilai baik.
  - Animasi emoji sedih dan ekspresi gagal saat langkah melebihi batas atau keluar lintasan.
* **Optimasi Layar HP Portrait**:
  - Grid labirin beradaptasi secara dinamis dengan ukuran persegi responsif (`max-w-[280px] sm:max-w-sm md:max-w-md aspect-square`).
  - Panel tombol panah mudah dijangkau di layar sentuh mobile.
* **Fleksibilitas Pengumpulan**: Siswa tidak wajib mencapai 100% untuk mengumpulkan tugas. Nilai dapat dikumpulkan kapan saja dan dapat diperbaiki berulang kali kapan saja hingga mencapai 100 Poin penuh.

---

## 2. Struktur 4 Misi Interaktif

```text
[TUGAS 2: BERPIKIR KOMPUTASIONAL]
 ├── Misi 1: Algoritma (50 Poin) ───────────► Materi Awal & 3 Level Labirin (4x4, 5x5, 10x10) + Next Level
 ├── Misi 2: Optimalisasi Jadwal (10 Poin) ──► Materi Awal & Visual Gantt Scheduler Paralel
 ├── Misi 3: Struktur Data (20 Poin) ────────► Materi Awal, Simulasi List & Kuis 5 Soal
 └── Misi 4: Representasi Data (20 Poin) ───► Materi Awal, Logika Cerita & Kuis 5 Soal
```

### A. Misi 1: Algoritma Jalur Tercepat (3-Level Shortest Path Maze Runner)
* **Custom Hook**: `src/hooks/RuangBelajar/TugasKhusus/Tugas2/useAlgorithmMaze.js`
* **Komponen & Sub-Komponen**:
  - `AlgorithmMaze.jsx`
  - `learning/M1LearningMaterial.jsx` (Panduan Konsep Algoritma & Jalur Tercepat)
  - `maze/MazeGrid.jsx` (Grid responsif beranimasi Framer Motion untuk 4x4, 5x5, 10x10)
  - `maze/CommandPanel.jsx` (Panel susun langkah: Atas, Bawah, Kiri, Kanan hingga 35 slot)
* **Konsep CT**: Algoritma & Abstraksi, Efisiensi Waktu & Langkah (Shortest Path).
* **3 Tingkatan Level & Penilaian Ketat**:
  1. **Level 1: Pemula (4x4)** $\rightarrow$ **15 Poin** (Target optimal: 6 langkah)
  2. **Level 2: Menengah (5x5)** $\rightarrow$ **15 Poin** (Target optimal: 8 langkah)
  3. **Level 3: Ahli (10x10)** $\rightarrow$ **20 Poin** (Target optimal: 18 langkah)
* **Mekanisme Level Progression**:
  - Saat Level 1 selesai dengan target tepat $\rightarrow$ Mendapatkan 15 Poin, suara sukses, konfeti, dan tombol **"Lanjut Level 2"**.
  - Saat Level 2 selesai dengan target tepat $\rightarrow$ Mendapatkan 15 Poin, suara sukses, konfeti, dan tombol **"Lanjut Level 3"**.
  - Saat Level 3 selesai $\rightarrow$ Mendapatkan 20 Poin penuh (Total M1 = 50 Poin) dan notifikasi misi 1 tuntas sempurna.

### B. Misi 2: Optimalisasi Penjadwalan Waktu (Gantt Scheduler & Multitasking)
* **Custom Hook**: `src/hooks/RuangBelajar/TugasKhusus/Tugas2/useScheduleOptimizer.js`
* **Komponen & Sub-Komponen**:
  - `ScheduleOptimizer.jsx`
  - `learning/M2LearningMaterial.jsx` (Panduan Konsep Penjadwalan & Multitasking)
  - `schedule/TaskList.jsx`
  - `schedule/TimelineGrid.jsx`
* **Konsep CT**: Dekomposisi Masalah, Penjadwalan Algoritmik, dan Optimasi Paralel (*Multitasking*).
* **Mekanisme**:
  - Studi kasus "Waktu Terbatas Hari Minggu" (07:00 - 13:00 / 6 Jam).
  - Pemanfaatan jalur paralel membaca buku saat mesin cuci berputar otomatis untuk menyelesaikan 5 aktivitas sebelum pukul 13:00 (**10 Poin**).

### C. Misi 3: Logika Struktur Data (Daftar / List & Aktivitas Kata Rahasia)
* **Custom Hook**: `src/hooks/RuangBelajar/TugasKhusus/Tugas2/useDataStructureVisualizer.js`
* **Komponen & Sub-Komponen**:
  - `DataStructureVisualizer.jsx`
  - `learning/M3LearningMaterial.jsx` (Panduan Konsep Struktur Data List & Indeks)
  - `data-structure/ListVisualizer.jsx` (Manipulasi daftar belanja & pemecahan kata rahasia)
  - `data-structure/StructureQuizPanel.jsx` (5 Soal kuis konseptual x 4 Poin = **20 Poin**)

### D. Misi 4: Representasi Data (Logika 2 Kemungkinan Ya / Tidak)
* **Custom Hook**: `src/hooks/RuangBelajar/TugasKhusus/Tugas2/useBinaryCardGame.js`
* **Komponen & Sub-Komponen**:
  - `BinaryCardGame.jsx`
  - `learning/M4LearningMaterial.jsx` (Panduan Konsep Representasi Data & Logika Ya/Tidak)
  - `binary/RepresentationVisualizer.jsx` (Simulasi interaktif soal cerita & saklar biner)
  - `binary/RepresentationQuizPanel.jsx` (5 Soal kuis representasi x 4 Poin = **20 Poin**)

---

## 3. Desain Header Top Bar (`BKHeader.jsx`) & Modal Sukses

* **BKHeader.jsx**:
  - Menggunakan palet `bg-slate-950/95` dengan aksen amber/warm glow.
  - Tombol Kembali ke Ruang Belajar.
  - Badge breadcrumb `Tugas 2 • Berpikir Komputasional`.
  - Informasi identitas siswa / badge mode tamu.
  - Badge Skor Terkumpul (`{totalScore} / 100 Poin`).
  - Tombol Reset Awal dengan modal konfirmasi.
  - Tombol Cek & Kumpulkan (aktif fleksibel untuk mengumpulkan kapan saja dan memperbaiki skor).
* **ModalSubmissionSuccessBK.jsx**:
  - Modal perayaan dengan rincian perolehan poin tiap misi dan tombol langsung ke Ruang Belajar / Log Skor.

---

## 4. Alur Pengumpulan & Sinkronisasi Skor Database

1. **Penyimpanan Draft Jawaban (Persistensi Progres)**:
   - Setiap kali siswa menyelesaikan atau memodifikasi misi, status progres disimpan secara lokal ke `localStorage` berbasis akun siswa (`tugas_bk_state_user_{id}`).
   - Ketika siswa membuka kembali halaman atau me-refresh peramban, jawaban dan skor misi terakhir langsung dimuat otomatis sehingga siswa dapat melanjutkan atau memperbaiki latihannya.

2. **Kebijakan Nilai Tertinggi (Highest Score Retention - `Math.max`)**:
   - Sistem menerapkan aturan keselamatan nilai siswa: Jika siswa mengumpulkan tugas untuk kedua kalinya atau seterusnya, dan nilai percobaan saat ini ternyata lebih kecil dari nilai yang pernah diperoleh sebelumnya, sistem **tidak akan menurunkan nilai**, melainkan tetap mempertahankan dan mencatat **nilai tertinggi (terbesar)** di Supabase (`tugas_pengumpulan`, `point_logs`, dan `master_siswa`).
   - Modal sukses (`ModalSubmissionSuccessBK.jsx`) memberikan umpan balik cerdas (`isRetained` / `isImproved`) yang menjelaskan nilai resmi yang tersimpan.

3. **Audit Trail Log Poin**:
   - `tugas_pengumpulan` di-upsert dengan detail jawaban dan skor akhir tertinggi (`finalScoreToSave`).
   - `point_logs` disinkronkan dengan deskripsi `Tugas 2: Petualangan Berpikir Komputasional (Skor: X/100 Poin)`.
   - `master_siswa.total_points` diperbarui secara realtime melalui trigger dan sinkronisasi client `syncStudentPointsAfterTask`.

