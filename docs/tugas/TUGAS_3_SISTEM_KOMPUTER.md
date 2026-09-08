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
│   ├── Koordinator: HardwareExplorer.jsx
│   ├── Data & Soal: hardwareData.js (Dataset 20 Hardware, 20 Software, & 5 Soal Kuis)
│   ├── Tab 1: TabMateriVisual.jsx (Hardware Input/Process/Storage/Output/Auxiliary & OS vs Aplikasi)
│   ├── Tab 2: TabLabHardware.jsx (Lab Drag & Drop 20 Hardware Foto Asli ke 5 Kategori) (15 Poin)
│   ├── Tab 3: TabLabSoftware.jsx (Lab Drag & Drop 20 Software Logo Asli OS vs Aplikasi) (10 Poin)
│   └── Tab 4: TabKuisKomputer.jsx (Kuis Karakteristik Sistem Komputer 5 Soal) (10 Poin)
├── Misi 2: Data, Aplikasi, & Transformasi Informasi (20 Poin)
│   ├── Koordinator: DataAppPipeline.jsx
│   ├── Data & Soal: pipelineData.js (Dataset 3 Skenario Pipeline & 5 Soal Kuis Data)
│   ├── Tab 1: TabMateriPipeline.jsx (Siklus Data Mentah ➔ Aplikasi Pengolah ➔ Informasi & Prinsip GIGO)
│   ├── Tab 2: TabLabPipeline.jsx (Simulator 3 Pipeline Data Dunia Nyata: Rapor, Kasir, Smartwatch) (10 Poin)
│   └── Tab 3: TabKuisPipeline.jsx (Kuis Konsep Data & Logika Aplikasi 5 Soal) (10 Poin)
├── Misi 3: Eksplorasi 20 Aplikasi Perkakas Digital & Software (30 Poin)
│   ├── Koordinator: DigitalToolbox.jsx
│   ├── Data & Soal: toolboxData.js (Dataset 20 Aplikasi, 5 Kelompok Perkakas, & 5 Soal Kuis)
│   ├── Tab 1: TabMateriToolbox.jsx (5 Kelompok Perkakas: Komunikasi, Hiburan, Produktivitas, Edukasi, Utilitas)
│   ├── Tab 2: TabLabToolbox.jsx (Lab Drag & Drop 20 Aplikasi Logo Asli ke 5 Kelompok Perkakas Digital) (20 Poin)
│   └── Tab 3: TabKuisToolbox.jsx (Kuis Ragam Software & Lisensi Open Source 5 Soal) (10 Poin)
└── Misi 4: Dampak TIK, Netiket & Keamanan Siber (15 Poin)
    ├── Koordinator: DigitalEthicsDetective.jsx
    ├── Data & Soal: ethicsData.js (Dataset 5 Kasus Etika Digital & 5 Soal Kuis Netiket)
    ├── Tab 1: TabMateriEtika.jsx (Materi Visual: Evolusi TIK, Dua Sisi Mata Uang TIK, & Prinsip 3S Netiket)
    ├── Tab 2: TabLabDetective.jsx (Detektif Studi Kasus Etika Digital 5 Skenario Nyata) (10 Poin)
    └── Tab 3: TabKuisNetiket.jsx (Kuis Netiket, Jejak Digital & Keamanan Akun 5 Soal) (5 Poin)
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
  - **Umpan Balik Tanpa Bocoran Warna Merah/Hijau**: Saat tombol **"Cek Hasil"** ditekan pada Misi 1 (Hardware & Software) maupun Misi 3 (Aplikasi Perkakas), chip komponen yang berada di dropzone tetap mempertahankan gaya visual netral (abu-abu/slate gelap) tanpa diwarnai merah/hijau secara individual. Hal ini mencegah siswa menebak langsung mana item yang salah secara visual per-item.
  - Hasil evaluasi ditampilkan secara menyeluruh (*aggregate result*) dalam bentuk jumlah komponen yang tepat dan total perolehan poin (contoh: *"📊 Hasil Evaluasi: 17 dari 20 komponen tepat pada posisinya (+12.8/15 Poin)"*).
  - Setiap kali tombol **"Cek Hasil"** ditekan, selebrasi animasi petasan/kembang api (`celebratePointGain`) selalu dimunculkan sebagai bentuk apresiasi usaha siswa dalam menyelesaikan praktikum.
* **Penghilangan Pola Jawaban (Anti-Pattern / Balanced Options)**:
  - Pada Misi 2 (DataAppPipeline), seluruh opsi input, aplikasi, dan output dibuat setara dalam panjang kalimat dan tingkat kerincian, menghilangkan kelemahan opsi benar yang sebelumnya "panjang sendiri".
  - Pada seluruh Kuis Pemahaman (Misi 1, 2, 3, dan 4) serta Studi Kasus Etika Misi 4, seluruh pilihan jawaban telah diseimbangkan panjang karakternya dan kunci jawaban disebar merata secara acak (A, B, C, D) sehingga tidak dapat ditebak berdasarkan pola panjang teks maupun letak posisi opsi.
* **Penyimpanan Posisi Komponen (Local Draft Persistence)**:
  - Posisi penempatan komponen di Misi 1 dan Misi 3 disimpan ke `localStorage` browser siswa (`tugas_sk_m1_hw_placements`, `tugas_sk_m1_sw_placements`, `tugas_sk_m3_app_placements`) secara otomatis.
  - Hal ini menjaga agar penempatan komponen tidak hilang saat browser tidak sengaja ter-refresh atau berpindah tab, tanpa membebani basis data Supabase dengan ratusan transaksi posisi mikro per-gerakan. Database Supabase difokuskan secara optimal untuk merekam nilai resmi dan status ketuntasan misi.
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

### A. Kebijakan Pemuatan Data: Database-Only Continuation & Isolasi Akun Siswa (User-Scoped Storage)
* **Isolasi Akun Siswa (Per-User Scoped Storage)**:
  - Seluruh kunci penyimpanan draft lokal (`localStorage`) pada Tugas 3 diisolasi secara ketat berdasarkan ID akun siswa (`tugas_sk_[item]_user_[siswaId]`).
  - Mencegah kebocoran data antar-siswa pada komputer/browser bersama di laboratorium sekolah, sehingga siswa yang baru pertama kali login tidak akan melihat sisa draft atau status penyelesaian dari siswa yang login sebelumnya.
  - Sistem secara otomatis membersihkan sisa key global peninggalan versi lama (`clearLegacySKStorage()`) dan membersihkan draft akun baru yang belum pernah mengumpulkan (`clearUserSKDrafts`).
* **Pemuatan Awal (Kebijakan Lanjutkan Wajib Database - Database-Only Continuation)**:
  - Saat siswa membuka halaman tugas atau menekan tombol **"Lanjutkan" / "Perbaiki Nilai"**, sistem secara ketat memuat data langsung dari database Supabase (`tugas_pengumpulan.detail_jawaban`).
  - **Dilarang keras memulihkan dari `localStorage` jika belum ada rekaman di database**: Jika akun siswa belum memiliki data pengumpulan resmi di tabel `tugas_pengumpulan`, siswa **wajib mulai dari awal dengan skor 0 di seluruh 4 misi dan penempatan komponen kosong**. Sisa cache lokal langsung dibersihkan secara otomatis.
  - Jika rekaman database ditemukan, snapshot yang dimuat mencakup skor per misi, status selesai (`completed`), serta data susunan/penempatan komponen (`placements`) untuk Misi 1 (Hardware & Software), Misi 2 (Data & Aplikasi), Misi 3 (Aplikasi Perkakas), dan Misi 4 (Etika Digital).
  - Snapshot database disinkronkan secara langsung ke `localStorage` khusus user tersebut pada saat pemuatan awal tanpa memicu re-render cascade atau siklus pemanggilan `useEffect` melingkar (*loop-free architecture*).
  - Hal ini menjamin progres siswa tersinkronisasi penuh saat berpindah komputer laboratorium atau berganti perangkat/peramban.
  - Komponen sub-misi membaca langsung susunan terakhir dari snapshot database yang telah dipulihkan, menjaga performa peramban tetap ringan dan responsif.
* **Indikator Centang Sub-Tab & Misi**:
  - Tab navigasi utama 4 misi (`SKMissionTabs.jsx`) dan sub-tab di dalam tiap misi (Materi Visual, Praktikum Lab Drag & Drop, dan Kuis) dilengkapi lencana centang hijau (`CheckCircle2`) dan rincian skor perolehan jika misi/sub-tab telah terselesaikan.
* **Restorasi State Interaktif**:
  - Komponen yang memiliki riwayat skor tersimpan otomatis memulihkan status pengerjaan, membaca materi (`materiRead`), dan penempatan komponen/jawaban dari database.

### B. Sinkronisasi Database Supabase & Proteksi Nilai Tertinggi
* **Sinkronisasi Posisi Saat Terakhir Kumpulkan Tugas**:
  - Posisi drag & drop komponen tidak dikirim ke database pada setiap pergeseran mikro, melainkan dikonsolidasikan dan disimpan ke `tugas_pengumpulan.detail_jawaban.placements` pada saat tombol **"Kumpulkan Tugas" / "Perbaiki Nilai"** ditekan.
  - Dengan demikian, akun siswa yang sama pada perangkat/komputer berbeda dapat melanjutkan pekerjaan secara akurat.
* **Proteksi Skor Database (Tidak Di-replace Jika Nilai Baru Lebih Kecil)**:
  - Jika nilai di database sebelumnya lebih tinggi daripada percobaan saat ini (`currentAttemptScore < previousBestScore`), nilai resmi di kolom `skor` dan `nilai_akhir` **TIDAK AKAN DITIMPA / DIREPLACE** dengan nilai yang lebih kecil.
  - Skor tertinggi sebelumnya dipertahankan penuh, dan posisi komponen terbaru tetap disimpan di `detail_jawaban` agar progres pekerjaan tidak hilang.
  - Modal hasil pengumpulan (`ModalSubmissionSuccessSK.jsx`) menampilkan **Pemberitahuan Proteksi Nilai Database** yang jelas dan tegas bahwa nilai tertinggi siswa ({previousScore} Poin) tetap aman dan tidak ditimpa oleh percobaan baru ({attemptScore} Poin).
* **Peningkatan Rekor (isImproved)**:
  - Jika percobaan baru menghasilkan skor lebih tinggi (`currentAttemptScore > previousBestScore`) atau pengumpulan perdana, database akan memperbarui `skor` dengan nilai rekor baru dan trigger database `trg_sync_tugas_to_point_logs` otomatis menyinkronkan peningkatan poin ke `point_logs` dan `master_siswa.total_points`.

### C. Alur Navigasi Antar Misi & Restorasi Nilai Sebagian (Partial Progress)
* **Restorasi Nilai Parsial & Proteksi Tombol Cek Hasil**:
  - Jika siswa memiliki nilai tersimpan sebagian (misalnya Misi 1 bernilai 10 Poin dari kuis/praktikum), state kuis dan penempatan dipulihkan secara proporsional.
  - Komponen menggunakan `Math.max(Number(currentScore) || 0, calculatedScore)` sehingga nilai tersimpan tidak akan berkurang atau ter-reset menjadi 0 saat halaman dimuat maupun saat tombol evaluasi ditekan.
  - **Proteksi Tombol Cek Hasil (Anti-Reset Saat Belum Sempurna)**: Pada `HardwareExplorer.jsx`, efek sinkronisasi login pengguna diisolasi dari perubahan prop `currentScore`, dan cabang destruktif yang sebelumnya mereset penempatan menjadi kosong saat nilai belum sempurna (< 15 poin) telah dihilangkan. Handler `handleCheckHw`, `handleCheckSw`, dan `handleEvaluateQuiz` juga melakukan persistensi instan ke `localStorage` sehingga penempatan dan poin parsial siswa tetap aman dan tidak pernah ter-reset kembali ke nol.
* **Tombol Navigasi Kontinu (Direct Flow)**:
  - Pada bagian bawah setiap misi terdapat tombol navigasi langsung:
    - Misi 1 (Hardware & Software): Tombol **"Lanjut ke Misi 2 (Data & Aplikasi) →"**
    - Misi 2 (Data & Aplikasi): Tombol **"Lanjut ke Misi 3 (Perkakas Digital) →"**
    - Misi 3 (Perkakas Digital): Tombol **"Lanjut ke Misi 4 (Dampak & Etika TIK) →"**
    - Misi 4 (Etika Digital): Tombol **"Kumpulkan & Selesaikan Semua Misi ✓"**
  - Footer navigasi (`SKFooterNav.jsx`) dan tab atas (`SKMissionTabs.jsx`) juga selalu aktif sehingga siswa bebas berpindah misi kapan saja.
* **Fallback Rute Modal Tugas**:
  - `TaskDetailModal.jsx` dilengkapi *route fallback* otomatis ke `/tugas/sistem-komputer` untuk tugas berkode Sistem Komputer, menjamin tombol "Lanjutkan Petualangan" selalu membuka rute tugas yang benar.
