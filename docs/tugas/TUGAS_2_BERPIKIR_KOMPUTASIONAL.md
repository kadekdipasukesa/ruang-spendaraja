# Modul Teknis: Tugas 2 - Petualangan Berpikir Komputasional (BK)

Dokumen ini merangkum arsitektur, alur data, komponen interaktif, custom hooks, dan aturan penilaian untuk **Tugas 2 (Bab 1 Terpadu: Berpikir Komputasional)** pada platform **Ruang Spendaraja**.

---

## 1. Ringkasan & Konsep Utama
* **Nama Modul**: Petualangan Berpikir Komputasional
* **Kode Tugas Master**: `TUGAS_BK_01`
* **Rute Halaman**: `/tugas/berpikir-komputasional` (alias: `/tugas/kuis-algoritma`, `/ruang-belajar/tugas/kuis-algoritma`)
* **Komponen Controller Utama**: `src/pages/TugasKhusus/TugasBerpikirKomputasional.jsx`
* **Tema Visual**: Amber / Warm Glow modern dengan kartu gelap `bg-slate-900` dan aksen oranye-amber yang elegan.
* **Total Nilai Maksimal**: **100 Poin** dengan pembagian bobot:
  - **Misi 1: Algoritma (50%)** $\rightarrow$ **Maks 50 Poin** (Level 1: 15p, Level 2: 15p, Level 3: 20p)
  - **Misi 2: Penjadwalan (10%)** $\rightarrow$ **Maks 10 Poin**
  - **Misi 3: Struktur Data (20%)** $\rightarrow$ **Maks 20 Poin** (5 Soal Kuis x 4 Poin)
  - **Misi 4: Representasi Data (20%)** $\rightarrow$ **Maks 20 Poin** (5 Soal Kuis x 4 Poin)
* **Tab Pembelajaran Mandiri**: Setiap misi dilengkapi dengan tab **"📖 Belajar Materi"** agar siswa dapat membaca konsep dasar sebelum beralih ke tab praktik/kuis melalui tombol *Next/Lanjut*.
* **Fleksibilitas Pengumpulan**: Siswa tidak wajib mencapai 100% untuk mengumpulkan tugas. Nilai dapat dikumpulkan kapan saja dan dapat diperbaiki berulang kali kapan saja hingga mencapai 100 Poin penuh.

---

## 2. Struktur 4 Misi Interaktif

```text
[TUGAS 2: BERPIKIR KOMPUTASIONAL]
 ├── Misi 1: Algoritma (50 Poin) ───────────► Tab Belajar & 3 Level Labirin (4x4, 5x5, 10x10)
 ├── Misi 2: Optimalisasi Jadwal (10 Poin) ──► Tab Belajar & Visual Gantt Scheduler
 ├── Misi 3: Struktur Data (20 Poin) ────────► Tab Belajar, Simulasi List & Kuis 5 Soal
 └── Misi 4: Representasi Data (20 Poin) ───► Tab Belajar, Logika Cerita & Kuis 5 Soal
```

### A. Misi 1: Algoritma Jalur Tercepat (3-Level Shortest Path Maze Runner)
* **Custom Hook**: `src/hooks/RuangBelajar/TugasKhusus/Tugas2/useAlgorithmMaze.js`
* **Komponen & Sub-Komponen**:
  - `AlgorithmMaze.jsx`
  - `learning/M1LearningMaterial.jsx` (Tab Belajar Materi Algoritma & Jalur Tercepat)
  - `maze/MazeGrid.jsx` (Dynamic responsive grid 4x4, 5x5, 10x10)
  - `maze/CommandPanel.jsx` (Builder instruksi Up, Down, Left, Right)
* **Konsep CT**: Algoritma & Abstraksi, Efisiensi Waktu & Langkah (Shortest Path).
* **3 Tingkatan Level**:
  1. **Level 1: Pemula (4x4)** $\rightarrow$ **15 Poin** (Target optimal: 6 langkah)
  2. **Level 2: Menengah (5x5)** $\rightarrow$ **15 Poin** (Target optimal: 8 langkah)
  3. **Level 3: Ahli (10x10)** $\rightarrow$ **20 Poin** (Target optimal labirin luas)
* **Total Poin M1**: $15 + 15 + 20 = \mathbf{50\text{ Poin}}$.

### B. Misi 2: Optimalisasi Penjadwalan Waktu (Gantt Scheduler & Multitasking)
* **Custom Hook**: `src/hooks/RuangBelajar/TugasKhusus/Tugas2/useScheduleOptimizer.js`
* **Komponen & Sub-Komponen**:
  - `ScheduleOptimizer.jsx`
  - `learning/M2LearningMaterial.jsx` (Tab Belajar Materi Penjadwalan & Multitasking)
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
  - `learning/M3LearningMaterial.jsx` (Tab Belajar Materi Struktur Data List & Indeks)
  - `data-structure/ListVisualizer.jsx` (Manipulasi daftar belanja & pemecahan kata rahasia)
  - `data-structure/StructureQuizPanel.jsx` (5 Soal kuis konseptual x 4 Poin = **20 Poin**)

### D. Misi 4: Representasi Data (Logika 2 Kemungkinan Ya / Tidak)
* **Custom Hook**: `src/hooks/RuangBelajar/TugasKhusus/Tugas2/useBinaryCardGame.js`
* **Komponen & Sub-Komponen**:
  - `BinaryCardGame.jsx`
  - `learning/M4LearningMaterial.jsx` (Tab Belajar Materi Representasi Data & Logika Ya/Tidak)
  - `binary/RepresentationVisualizer.jsx` (Simulasi interaktif soal cerita)
  - `binary/RepresentationQuizPanel.jsx` (5 Soal kuis representasi x 4 Poin = **20 Poin**)

---

## 3. Desain Header Top Bar (`BKHeader.jsx`) & Modal Sukses

* Mengadopsi arsitektur bersih `SimulationTopBar.jsx` / `MisiHeader.jsx`:
  - Tombol Kembali ke Ruang Belajar.
  - Badge breadcrumb `Tugas 2 • Berpikir Komputasional`.
  - Informasi identitas siswa / badge mode tamu.
  - Badge Skor Terkumpul (`{totalScore} / 100 Poin`).
  - Tombol Reset Awal dengan modal konfirmasi.
  - Tombol Cek & Kumpulkan (aktif fleksibel untuk mengumpulkan kapan saja dan memperbaiki skor).
  - Modal Notifikasi Sukses `ModalSubmissionSuccessBK.jsx` dengan rincian perolehan poin tiap misi dan tombol navigasi ke Log Skor.

---

## 4. Alur Pengumpulan & Sinkronisasi Skor Database

1. **State Skor**:
   ```javascript
   const [scores, setScores] = useState({ m1: 0, m2: 0, m3: 0, m4: 0 });
   const totalScore = scores.m1 + scores.m2 + scores.m3 + scores.m4; // Max 100 Poin
   ```
2. **Audit Trail Log Poin**:
   - `tugas_pengumpulan` di-upsert dengan detail jawaban dan skor.
   - `point_logs` di-insert/update dengan kategori `tugas` dan deskripsi `Tugas 2: Petualangan Berpikir Komputasional (Skor: X/100 Poin)`.
   - `master_siswa.total_points` disinkronkan secara realtime.
