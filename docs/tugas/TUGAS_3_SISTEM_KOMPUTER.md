# Dokumentasi Teknis: Tugas 3 - Petualangan Sistem Komputer & Perkakas Digital

Modul pembelajaran interaktif dan praktikum terpadu untuk topik **Sistem Komputer, Perkakas Digital, Siklus Data & Aplikasi, serta Perkembangan TIK dan Etika Digital** pada portal Ruang Belajar SMP Negeri 2 Singaraja.

---

## 1. Ikhtisar Tugas & Bobot Nilai

* **Kode Tugas**: `TUGAS-03-SISTEM-KOMPUTER` (Aliases: `TUGAS_SK_01`, `tugas-inf-03`)
* **Urutan Tugas**: 3
* **Bobot Poin Total**: **100 Poin** (Distribusi: M1: 35p, M2: 20p, M3: 30p, M4: 15p)
* **Tipe Modul**: `kuis` / Interaktif Multimedia Drag & Drop dengan Asset Gambar/Logo Asli
* **Rute URL**: `/tugas/sistem-komputer` atau `/ruang-belajar/tugas/sistem-komputer`
* **Controller**: `src/pages/TugasKhusus/TugasSistemKomputer.jsx`
* **Custom Hook State**: `src/hooks/RuangBelajar/TugasKhusus/Tugas3/useTugasSKState.js`
* **Asset Manager & Celebration**: `src/components/RuangBelajar/TugasKhusus/Tugas3/skAssets.jsx`

---

## 2. Struktur 4 Misi Pembelajaran Interaktif

```
TUGAS 3: SISTEM KOMPUTER & PERKAKAS DIGITAL (100 Poin)
├── Misi 1: Komponen Sistem Komputer & Klasifikasi Software (35 Poin)
│   ├── Tab 1: Materi Visual (Hardware Input/Process/Storage/Output/Auxiliary & OS vs Aplikasi)
│   ├── Tab 2: Lab Drag & Drop 20 Hardware Foto Asli ke 5 Kategori (15 Poin)
│   ├── Tab 3: Lab Drag & Drop 20 Software Logo Asli (OS vs Aplikasi) (10 Poin)
│   └── Tab 4: Kuis Karakteristik Sistem Komputer (5 Soal) (10 Poin)
├── Misi 2: Data, Aplikasi, & Transformasi Informasi (20 Poin)
│   ├── Tab 1: Materi Visual (Siklus Data Mentah ➔ Aplikasi Pengolah ➔ Informasi & Prinsip GIGO)
│   ├── Tab 2: Pabrik Alur Transformasi Data (3 Kasus Nyata: Rapor, Kasir, Smartwatch) (10 Poin)
│   └── Tab 3: Kuis Konsep Data & Logika Aplikasi (5 Soal) (10 Poin)
├── Misi 3: Eksplorasi 20 Aplikasi Perkakas Digital & Software (30 Poin)
│   ├── Tab 1: Materi Visual (5 Kelompok Perkakas: Komunikasi, Hiburan, Produktivitas, Edukasi, Utilitas)
│   ├── Tab 2: Lab Drag & Drop 20 Aplikasi Logo Asli ke 5 Kelompok Perkakas Digital (20 Poin)
│   └── Tab 3: Kuis Ragam Software & Lisensi Open Source (5 Soal) (10 Poin)
└── Misi 4: Dampak TIK, Netiket & Keamanan Siber (15 Poin)
    ├── Tab 1: Materi Visual (Evolusi TIK, Matriks Positif/Negatif, 5 Rambu Netiket)
    ├── Tab 2: Detektif Studi Kasus Etika Digital (5 Kasus Nyata) (10 Poin)
    └── Tab 3: Kuis Jejak Digital & Sandi Kuat (5 Soal) (5 Poin)
```

---

## 3. Rincian Fitur Gambar Asli, Audio/Petasan & Aturan Kuis

### A. Asset Gambar & Logo Asli (`skAssets.jsx`)
* **Hardware Misi 1**: Menggunakan gambar fotografi nyata komponen (RAM, CPU Processor, SSD, Motherboard, GPU VGA, Keyboard Mechanical, Mouse, Monitor, PSU, Heatsink Fan, dsb.).
* **Software & Perkakas Misi 1 & 3**: Menggunakan logo resmi asli dari platform global terpercaya (Windows 11, Linux Ubuntu, Android, macOS, WhatsApp, Zoom, Discord, Gmail, YouTube, Spotify, Netflix, Roblox, Google Docs, Microsoft Excel, Canva, Trello, Google Classroom, Duolingo, Scratch, Ruangguru, Google Drive, Google Maps, Smadav, 7-Zip).
* Komponen `RealAssetThumbnail` dilengkapi fallback otomatis dengan ikon Lucide jika gambar sedang dimuat atau luring.

### B. Sound Effect, Animasi Petasan & Posisi Komponen Acak (Randomized List)
* **Daftar Komponen Diacak (Randomized Shuffle)**:
  - Urutan daftar komponen hardware, software, dan aplikasi perkakas digital diacak (*shuffled*) setiap kali halaman dibuka maupun saat tombol *Reset Semua* ditekan agar tidak memicu tebak-tebakan berpola.
* **Evaluasi Hasil Pengelompokan & Audio Feedback**:
  - Petasan *tidak lagi* muncul per setiap komponen yang dipindahkan (mencegah *spoiler* jawaban benar secara instan).
  - Evaluasi skor penuh diberikan saat siswa menekan tombol **"Cek Hasil"**:
    - **Jika Berhasil (≥ 70% Benar)**: Memunculkan selebrasi kembang api/petasan (`celebratePointGain` / `playCelebrationFirework`) dengan banner sukses bernuansa hijau *emerald*.
    - **Jika Belum Tepat / Banyak Salah (< 70% Benar)**: Memainkan efek suara nada gagal (*sad descending buzz* dari `soundEffects.playFail()`) dengan banner peringatan bernuansa *rose* yang berkedip, mengarahkan siswa untuk meninjau kembali komponen yang keliru.
* **Interaktivitas Mobile & Layout Berdampingan (Side-by-Side Viewport)**:
  - Pada Misi 1 (Hardware & Software) dan Misi 3 (Aplikasi Digital), antarmuka menggunakan **tata letak berdampingan (*side-by-side layout*)**:
    - **Kolom Kiri**: Bank komponen scrollable 1-kolom yang ringkas dan *sticky*, menampilkan item yang tersisa beserta tombol *Reset*.
    - **Kolom Kanan**: Kotak-kotak kategori/dropzone pengelompokan yang responsif.
    - Tata letak ini memungkinkan siswa menyelesaikan seluruh tugas dalam 1 layar (*single viewport*) tanpa perlu bolak-balik scroll ke atas dan bawah.
  - Komponen yang sudah berhasil dikelompokkan otomatis dibuat redup/reduksi visual di daftar sumber dengan label `✓ Terpasang`, dan dapat dibatalkan sewaktu-waktu melalui tombol silang (`×`) di kotak tujuan.
  - Mode *Tap-to-Assign* (banner pemilih) tetap aktif untuk kemudahan navigasi perangkat seluler / layar sentuh.
  - Pada Misi 2: Label petunjuk/clue tipe data (Data Mentah, Pengolah Data, Informasi) telah dihilangkan dari opsi dropdown agar siswa benar-benar menganalisis fungsi data secara mandiri.

### C. Logika Kuis Tanpa Bocoran Jawaban (Strict Quiz Engine)
* Siswa memilih opsi jawaban tanpa langsung diberitahu benar/salah atau pembahasan per soal.
* Nilai dievaluasi serentak saat menekan **"Kumpulkan & Cek Nilai Kuis"**.
* Kuis terkunci setelah dinilai, dan siswa dapat mencoba perbaikan dengan menekan tombol **"🔄 Ulangi Kuis dari Awal (Reset)"** seperti pada Tugas 2 Berpikir Komputasional.

---

## 4. Mekanisme Pengumpulan, Persistensi & Sistem Perbaikan Nilai

### A. Persistensi Draft Lokal (`localStorage`)
* Kunci penyimpanan draft terikat ID siswa: `tugas_sk_state_user_{studentId}` (atau `tugas_sk_state_guest` untuk tamu).
* Menyimpan skor tiap misi (`m1`, `m2`, `m3`, `m4`) dan status penyelesaian misi secara realtime sehingga siswa dapat menutup peramban dan melanjutkan kapan saja tanpa kehilangan progres.

### B. Sinkronisasi Database Supabase
Saat siswa menekan tombol **"Kumpulkan Tugas"**:
1. Menghitung `totalScore = scores.m1 + scores.m2 + scores.m3 + scores.m4` (Maksimal 100 Poin).
2. Mengambil data pengumpulan sebelumnya dari tabel `tugas_pengumpulan` untuk mendeteksi apakah siswa sedang melakukan **perbaikan nilai**.
3. **Logika Proteksi Nilai Tertinggi (`Math.max`)**:
   ```javascript
   const finalOfficialScore = Math.max(currentAttemptScore, previousBestScore);
   ```
   Siswa tidak perlu khawatir nilai resminya turun saat mencoba mengulang misi.
4. Melakukan `upsert` ke tabel `tugas_pengumpulan`.
5. Trigger database `trg_sync_tugas_to_point_logs` membuat/mengupdate entri di `point_logs`.
6. Trigger database `trg_update_master_siswa_total_points` secara otomatis menyinkronkan `master_siswa.total_points` yang menjadi sumber data Header dan Papan Peringkat (Leaderboard).
7. Memicu dentuman petasan selebrasi besar (`celebratePointGain(true)`) dan menampilkan modal kelulusan (`ModalSubmissionSuccessSK.jsx`).
