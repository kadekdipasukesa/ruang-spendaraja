# Panduan Arsitektur & Aturan Sistem - Ruang Spendaraja

Dokumen ini adalah referensi utama untuk pengembang dan AI Agent agar memahami seluruh struktur aplikasi, alur kerja antar file, routing, database Supabase, dan aturan pengembangan secara cepat, efisien, serta hemat token.

---

## 1. Ringkasan Proyek & Teknologi (Tech Stack)
* **Nama Aplikasi**: Ruang Spendaraja (Platform Pembelajaran & Manajemen Terpadu SMP Negeri 2 Singaraja)
* **Frontend Framework**: React 18+ (SPA) dengan Vite & TypeScript/JSX
* **Styling**: Tailwind CSS, Lucide React (Ikon), Framer Motion (Animasi UI)
* **Backend / Database**: Supabase (PostgreSQL Realtime Database & Storage)
* **AI Engine**: Gemini API (@google/genai di sisi server)

---

## 2. Peta Routing & Halaman (`src/App.jsx`)

| URL Path | Komponen / File | Deskripsi & Fungsi Utama |
|---|---|---|
| `/` | `src/pages/Home.jsx` | Beranda portal utama, launcher aplikasi, quick login siswa |
| `/ruang-belajar` | `src/pages/RuangBelajar.jsx` | Pusat tugas TIK siswa, timeline modul, log skor, dan leaderboard kelas |
| `/tugas/simulasi-folder` | `src/pages/TugasKhusus/TugasSimulasiFolder.jsx` | Praktik interaktif simulator file system (C: drive, folder tree, create/move/rename/delete) |
| `/tugas/berpikir-komputasional` | `src/pages/TugasKhusus/TugasBerpikirKomputasional.jsx` | Petualangan 4 misi berpikir komputasional terpadu (Algoritma, Jadwal, Struktur Data, Biner) |
| `/tugas/sistem-komputer` | `src/pages/TugasKhusus/TugasSistemKomputer.jsx` | Petualangan 4 misi sistem komputer & perkakas digital (Hardware, Data/Aplikasi, Software, Etika Digital) |
| `/bee-2026` | `src/pages/bee-2026.jsx` | Expo Buleleng Education Expo 2026 (Referensi desain utama UI cerah/amber) |
| `/jurnal-lab` | `src/pages/JurnalLabPage.jsx` | Log pemakaian laboratorium komputer, cetak rekap & filter sesi |
| `/agenda-guru` | `src/pages/AgendaGuruPage.jsx` | Jurnal kerja & agenda pembelajaran harian guru |
| `/pelanggaran` | `src/pages/CatatPelanggaran.jsx` | Pencatatan poin kedisiplinan & rekap pelanggaran siswa |
| `/analisis-pelanggaran` | `src/pages/AnalisisPelanggaran.jsx` | Analisis statistik tren pelanggaran siswa |
| `/ulangan` | `src/pages/UlanganPage.jsx` | Antarmuka pengerjaan ujian online siswa dengan anti-cheat |
| `/admin-ujian` | `src/pages/AdminUjian.jsx` | Panel proctoring/pengawasan & aktivasi sesi ujian oleh guru |
| `/remidi` | `src/pages/RemidiPage.jsx` | Pengerjaan remedial tugas/ulangan |
| `/admin-remidi` | `src/pages/AdminRemidi.jsx` | Panel manajemen & verifikasi remedial guru |
| `/pengumuman-sas` | `src/pages/HalamanPengumuman.jsx` | Papan pengumuman SAS & tugas Scratch |
| `/typing-challenge` | `src/pages/typing-challenge.jsx` | Mini game latihan kecepatan mengetik 10 jari |
| `/face-absen` | `src/pages/face-absen.jsx` | Presensi wajah berbasis kamera & AI |
| `/guru` | `src/pages/DashboardGuru.jsx` | Dashboard ringkasan rekapitulasi data guru |
| `/admin/kelola-siswa` | `src/pages/Admin/KelolaSiswaPage.jsx` | Manajemen data akun siswa, reset sandi, & kelas |

---

## 3. Arsitektur Database Supabase & Sinkronisasi Poin

### A. Tabel Utama
1. **`master_siswa`**:
   - Kolom: `id`, `No Absen`, `NAMA`, `NISN` (Unique), `Kelas`, `Gender`, `Agama`, `is_registered`, `password`, `role` (siswa/guru/admin), `total_points` (integer, default 0), `total_pelanggaran`, `role_2`.
   - *Catatan Penting*: `total_points` adalah **Single Source of Truth** nilai siswa yang ditampilkan di Header dan Leaderboard.
2. **`tugas_master`**:
   - Kolom: `id`, `kode_tugas`, `urutan`, `judul`, `deskripsi`, `petunjuk`, `kategori`, `tipe_tugas`, `custom_route`, `poin_maksimal`, `deadline`, `is_active`, `bobot_nilai`.
3. **`tugas_pengumpulan`**:
   - Kolom: `id`, `id_tugas`, `nisn_siswa`, `nama_siswa`, `kelas_siswa`, `status` (`submitted`/`graded`), `nilai_akhir`, `feedback_guru`, `file_url`, `submitted_at`, `graded_at`.
4. **`point_logs`**:
   - Kolom: `id`, `nisn_siswa`, `nama_siswa`, `kelas_siswa`, `point_change`, `category` (misal: `tugas_selesai`), `description`, `created_at`.

### B. Alur Trigger Otomatis Nilai & Log
```text
Siswa / Guru Menyelesaikan / Menilai Tugas
          │
          ▼
   [tugas_pengumpulan] (INSERT / UPDATE)
          │
          ▼
   Trigger DB: `trg_sync_tugas_to_point_logs`
          │ (Membuat / mengupdate 1 baris log unik per tugas)
          ▼
   [point_logs] (Audit Trail Log Poin)
          │
          ▼
   Trigger DB: `trg_update_master_siswa_total_points`
          │ (Menghitung SUM(point_change) dari point_logs)
          ▼
   [master_siswa.total_points] (Nilai Resmi Siswa)
```

---

## 4. Modul Khusus: Ruang Belajar (`/ruang-belajar`)

### A. Struktur Komponen
* `src/pages/RuangBelajar.jsx`: Controller utama ruang belajar. Memiliki bottom padding (`pb-32 sm:pb-36`) agar tidak terhalang oleh fixed navigation bar.
* `src/components/RuangBelajar/RuangBelajarHeader.jsx`:
  - Kartu profil siswa kompak (mode mobile-friendly, palet amber/orange gaya `bee-2026.jsx`).
  - Menampilkan `total_points` langsung dari `master_siswa`.
  - **Fixed Bottom Navigation Bar** yang dirender via `createPortal` langsung ke `document.body` agar menempel sempurna di bawah viewport:
    - 📑 **Timeline** (`activeTab = 'timeline'`)
    - 📖 **Log** (`activeTab = 'log_score'`)
    - 🔥 **Peringkat** (`activeTab = 'leaderboard'`)
* `src/components/RuangBelajar/TimelineTugas.jsx`: Daftar modul materi & tugas dengan filter kategori.
* `src/components/RuangBelajar/TaskDetailModal.jsx` & `ModalSubmitProyek.jsx`: Modal rincian tugas & form submit yang dirender via `createPortal` langsung ke `document.body` dengan `z-[99999]` agar selalu berada di lapisan terdepan dan tidak tertutupi navbar atas maupun floating bottom navigation bar.
* `src/components/RuangBelajar/LogScoreTugas.jsx`: Riwayat poin dari tabel `point_logs`.
* `src/components/RuangBelajar/LeaderboardKelas.jsx`: Peringkat siswa per kelas 7A-7K dengan filter siswa yang memiliki poin > 0.
* `src/components/RuangBelajar/TugasKhusus/Tugas1/`: Simulator Manajemen File & Folder:
  - `missionsConfig.js`: 25 misi bertingkat dengan evaluasi otomatis berbasis struktur item JSON.
  - `FloatingMissionPanel.jsx`: Panel panduan misi dengan auto-highlight `(Lokasi Target: ...)`.
  - `ModalMove.jsx`: Modal pemindahan file dengan visualisasi direktori pohon (*folder tree hierarchy*).
* `src/components/RuangBelajar/TugasKhusus/Tugas2/`: Petualangan 4 Misi Berpikir Komputasional:
  - Controller: `src/pages/TugasKhusus/TugasBerpikirKomputasional.jsx`
  - Sub-komponen: `BKHeader.jsx`, `BKMissionTabs.jsx`, `BKFooterNav.jsx`, `ModalSubmissionSuccessBK.jsx`, `AlgorithmMaze.jsx`, `ScheduleOptimizer.jsx`, `DataStructureVisualizer.jsx`, `BinaryCardGame.jsx`.
  - Custom Hooks: `src/hooks/RuangBelajar/TugasKhusus/Tugas2/` (`useTugasBKState.js`, dll.).
  - Fitur Persistensi & Skor: Kebijakan **Database-First Priority** (mengutamakan snapshot data dari database Supabase saat membuka tugas / klik lanjutkan sehingga sinkron saat pindah komputer). `localStorage` digunakan sebagai cache/scratchpad sesi aktif. Proteksi nilai database (`Math.max`) menjamin nilai tertinggi tidak pernah ditimpa jika percobaan baru bernilai lebih kecil.
* `src/components/RuangBelajar/TugasKhusus/Tugas3/`: Petualangan 4 Misi Sistem Komputer & Perkakas Digital:
  - Controller: `src/pages/TugasKhusus/TugasSistemKomputer.jsx`
  - Sub-komponen: `SKHeader.jsx`, `SKMissionTabs.jsx`, `SKFooterNav.jsx`, `ModalSubmissionSuccessSK.jsx`, `HardwareExplorer.jsx` (Misi 1: Materi Sistem Komputer + Drag & Drop 20 Komponen Hardware + Drag & Drop 20 Software OS vs Aplikasi + Kuis), `DataAppPipeline.jsx` (Misi 2: Materi Transformasi Data + Simulator 3 Pipeline Data Mentah/Aplikasi/Informasi + Kuis Data), `DigitalToolbox.jsx` (Misi 3: Materi 5 Kelompok Perkakas + Drag & Drop 20 Aplikasi ke Kelompoknya + Kuis Software), `DigitalEthicsDetective.jsx` (Misi 4: Materi Netiket + Detektif 5 Studi Kasus Etika + Kuis Keamanan).
  - Custom Hooks: `src/hooks/RuangBelajar/TugasKhusus/Tugas3/useTugasSKState.js`.
  - Fitur UI & Evaluasi: Layout berdampingan (*side-by-side single viewport*) untuk bank komponen kiri scrollable dan dropzones kanan pada Misi 1 & 3, urutan acak komponen (*randomized shuffle*), evaluasi agregat saat klik "Cek Hasil" dengan animasi petasan selebrasi tanpa bocoran warna merah/hijau pada item, opsi kuis & alur data berpanjang seimbang (*anti-pattern*), serta perlindungan nilai tertinggi (`Math.max`).
  - Fitur Persistensi & Sinkronisasi: Kebijakan **Database-First Priority** dengan sinkronisasi ke tabel `tugas_pengumpulan`, `point_logs`, dan `master_siswa.total_points`. Posisi draft penempatan komponen dicadangkan ke `localStorage` agar tidak hilang saat reload tanpa membebani database Supabase.

---

## 5. Aturan Penting Pengembang & AI Agent (*Rules of Engagement*)

1. **Prinsip Lingkup Ketat (Strict Scope Discipline)**:
   - Jangan pernah mengubah, merombak, atau menghapus kode di luar apa yang secara eksplisit diminta oleh pengguna.
   - Hindari menambahkan tab/fitur yang tidak diminta.
2. **Kewajiban Sinkronisasi Dokumentasi `.md` Otomatis**:
   - Setiap kali ada penambahan fitur, perubahan alur, refaktorisasi file/komponen, routing baru, atau modifikasi skema database, AI Agent **WAJIB LANGSUNG MEMPERBARUI** berkas `AGENTS.md` dan berkas modul terkait di `/docs/` pada turn yang sama tanpa harus diminta ulang oleh pengguna.
   - Dokumentasi harus selalu menjadi cerminan akurat dari kondisi kode terkini (*live source of truth*).
3. **Koneksi Database Nyata**:
   - Seluruh sinkronisasi data siswa menggunakan klien Supabase asli (`src/lib/supabaseClient.js`).
   - Dilarang keras mengganti logika database dengan mock dummy jika tabel Supabase sudah tersedia.
4. **Standar Desain & UI**:
   - Gunakan palet cerah, bersih, modern (berbasis `src/pages/bee-2026.jsx` dengan aksen amber/orange/indigo yang elegan).
   - Pastikan touch target mobile ramah sentuhan (minimal 44px) dan tidak terjadi overflow teks pada pill/badge.

---

## 6. Indeks Dokumentasi Modul & Komponen (`/docs/`)

Untuk memahami alur kerja lebih spesifik dan mendalam pada setiap modul, silakan baca dokumentasi pendukung berikut:
1. **[`/docs/DESIGN_SYSTEM.md`](/docs/DESIGN_SYSTEM.md)**: Standar desain 4 arketipe halaman (Siswa, Praktikum, Portal, Admin) & aturan komponen mobile.
2. **[`/docs/HOME_DAN_KOMPONEN_GLOBAL.md`](/docs/HOME_DAN_KOMPONEN_GLOBAL.md)**: Arsitektur Home App Launcher, Navbar, Floating Online Presence, dan Live Chat Realtime.
3. **[`/docs/RUANG_BELAJAR.md`](/docs/RUANG_BELAJAR.md)**: Master Hub modul Ruang Belajar, Timeline, Log Skor, dan Leaderboard Kelas.
4. **[`/docs/tugas/TUGAS_1_SIMULATOR_FOLDER.md`](/docs/tugas/TUGAS_1_SIMULATOR_FOLDER.md)**: Rincian teknis virtual file system & 25 misi Tugas 1.
5. **[`/docs/tugas/TUGAS_2_BERPIKIR_KOMPUTASIONAL.md`](/docs/tugas/TUGAS_2_BERPIKIR_KOMPUTASIONAL.md)**: Rincian teknis 4 misi terpadu Bab 1 (Algoritma, Jadwal, Struktur Data, Biner).
6. **[`/docs/tugas/TUGAS_3_SISTEM_KOMPUTER.md`](/docs/tugas/TUGAS_3_SISTEM_KOMPUTER.md)**: Rincian teknis 4 misi terpadu Bab 2 (Hardware Komputer, Data & Aplikasi, Perkakas Digital, Dampak & Etika TIK).
7. **[`/docs/DATABASE_TRIGGERS.md`](/docs/DATABASE_TRIGGERS.md)**: Dokumentasi fungsi & trigger PostgreSQL aktif di Supabase.
8. **[`/docs/JURNAL_LAB.md`](/docs/JURNAL_LAB.md)**: Dokumentasi arsitektur, algoritma penjadwalan, validasi waktu WITA, dan skema database Jurnal Laboratorium.

