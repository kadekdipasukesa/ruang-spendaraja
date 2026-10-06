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
| `/tugas/biner-ascii` | `src/pages/TugasKhusus/TugasBinerAscii.jsx` | Petualangan 3 tahap bilangan biner & kode ASCII 33-126 (Materi simulator saklar 8-bit, Desimal ke Biner, Biner ke Desimal, ASCII ke Biner) |
| `/tugas/pengolah-kata` | `src/pages/TugasKhusus/TugasWord.jsx` | Petualangan 3 tahap aplikasi pengolah kata Ms. Word: Brosur Undangan HUT SMPN 2 Singaraja (5 topik literasi membaca fokus threshold 60s & checkpoint, kuis 5 soal fitur Word, dan upload berkas Cloudinary preset `tugas_5` ke folder `Tugas/5`) |
| `/ekstra-tik` | `src/pages/EkstraTikPage.jsx` | Portal Ekstrakurikuler TIK: Presensi kehadiran Supabase native (`ekstra_presensi`), whitelist 42 anggota (`ekstra_anggota`), tombol download rekap presensi (.CSV), pengumpulan tugas ke Cloudinary (`tugas_ekstra_tik7`) tercatat di `ekstra_tugas_pengumpulan`, live preview dokumen, dan kontrol saklar admin |
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
   - Kolom: `id`, `No Absen`, `NAMA`, `NISN` (Unique), `Kelas`, `Gender`, `Agama`, `is_registered`, `password`, `role` (siswa/guru/admin), `total_points` (integer, default 0), `total_pelanggaran`, `role_2`, `foto_profile` (text URL Cloudinary).
   - *Catatan Penting*: `total_points` adalah **Single Source of Truth** nilai siswa yang ditampilkan di Header dan Leaderboard. Foto profil siswa diambil eksklusif secara langsung menggunakan kamera (`CameraCaptureModal`, tanpa pilihan berkas/galeri) dan diunggah melalui backend terotentikasi (`/api/profile/upload` dengan `overwrite: true` pada `photo_profile/profil_${siswa.id}` menggunakan Cloudinary Signed SDK) serta dihapus permanen (`/api/profile/delete` via `cloudinary.uploader.destroy`), disinkronkan ke kolom `foto_profile`.
2. **`tugas_master`**:
   - Kolom: `id`, `kode_tugas`, `urutan`, `judul`, `deskripsi`, `petunjuk`, `kategori`, `tipe_tugas`, `custom_route`, `poin_maksimal`, `deadline`, `is_active`, `bobot_nilai`.
3. **`tugas_pengumpulan`**:
   - Kolom: `id` (uuid, default `gen_random_uuid()`), `tugas_id` (uuid references `tugas_master`), `siswa_id` (integer references `master_siswa`), `status` (text, default `'belum'`), `skor` (integer), `persentase_skor` (numeric), `tautan_tugas` (text URL berkas/Cloudinary), `catatan_siswa` (text), `nama_berkas` (text), `detail_jawaban` (jsonb, default `'{}'`), `catatan_guru` (text), `submitted_at` (timestamptz), `graded_at` (timestamptz), `created_at` (timestamptz), `updated_at` (timestamptz).
   - Constraint: `unique_siswa_per_tugas unique (tugas_id, siswa_id)`.
   - Trigger: `trg_sync_tugas_to_point_logs` dieksekusi otomatis setelah INSERT/UPDATE/DELETE.
   - *Catatan Penting*: Kolom link berkas adalah `tautan_tugas` (bukan `file_url`). Dilarang mengirim kolom non-skema seperti `file_url`, `nisn_siswa`, `nama_siswa`, `kelas_siswa`, atau `nilai_akhir` ke tabel ini agar tidak memicu error PostgREST `PGRST204: Could not find the column in the schema cache`.
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
  - Menampilkan `total_points` langsung dari `master_siswa` secara realtime.
  - Foto profil resmi sesuai data `master_siswa.foto_profile` dengan listener realtime, fallback inisial cerdas (`getInitials`), dan pembukaan modal profil saat avatar diklik (`open-profile-modal`).
  - Perhitungan peringkat siswa di kelasnya secara presisi melalui custom hook `src/hooks/RuangBelajar/useClassRank.js` dengan aturan tie-breaker konsisten (poin tertinggi, waktu pencapaian skor tercepat, alfabetis).
  - Animasi petasan & kembang api selebrasi spektakuler (`src/utils/petasanCelebration.js`) dengan sintesis suara Web Audio API saat siswa berhasil mencapai peringkat 5 besar di kelasnya (dilengkapi mahkota avatar 👑, badge peringkat berdenyut 🎆, kartu stat interaktif, dan banner toast selebrasi).
  - **Fixed Bottom Navigation Bar** yang dirender via `createPortal` langsung ke `document.body` agar menempel sempurna di bawah viewport:
    - 📑 **Timeline** (`activeTab = 'timeline'`)
    - 📖 **Log** (`activeTab = 'log_score'`)
    - 🔥 **Peringkat** (`activeTab = 'leaderboard'`)
* `src/components/RuangBelajar/TimelineTugas.jsx`: Daftar modul materi & tugas dengan filter kategori.
* `src/components/RuangBelajar/TaskDetailModal.jsx` & `ModalSubmitProyek.jsx`: Modal rincian tugas & form submit yang dirender via `createPortal` langsung ke `document.body` dengan `z-[99999]` agar selalu berada di lapisan terdepan dan tidak tertutupi navbar atas maupun floating bottom navigation bar.
* `src/components/RuangBelajar/LogScoreTugas.jsx`: Riwayat poin dari tabel `point_logs`.
* `src/components/RuangBelajar/LeaderboardKelas.jsx`: Controller modular papan peringkat Kelas 7 yang dipecah rapi ke `src/components/RuangBelajar/LeaderboardKelas/` (`StudentAvatar.jsx`, `PodiumThree.jsx`, `LeaderboardTable.jsx`, `ClassFilterTabs.jsx`, `StudentPointHistoryModal.jsx`). Kartu podium Juara 1, 2, 3 dan setiap baris tabel bersifat interaktif (bisa diklik) untuk membuka modal profil lengkap siswa beserta detail riwayat perolehan nilainya langsung dari tabel `point_logs` (deskripsi tugas, jenis aktivitas, perolehan poin +X pt, dan tanggal/jam WITA) dengan penanganan kapasitas 1000+ data via pagination/chunking dan live sync tie-breaker. Modal dilengkapi penutupan stabil via backdrop click, tombol X header yang rapi, tombol "Tutup Modal" di footer, serta tombol keyboard Escape tanpa manipulasi riwayat history/popstate yang rentan bentrok dengan perutean browser.
* `src/components/RuangBelajar/TugasKhusus/Tugas1/`: Simulator Manajemen File & Folder:
  - `missionsConfig.js`: 25 misi bertingkat dengan evaluasi otomatis berbasis struktur item JSON.
  - `FloatingMissionPanel.jsx`: Panel panduan misi dengan auto-highlight `(Lokasi Target: ...)`.
  - `ModalMove.jsx`: Modal pemindahan file dengan visualisasi direktori pohon (*folder tree hierarchy*).
  - Fitur Persistensi: Kebijakan **Database-Only Continuation** (saat klik mulai/lanjutkan, progres file tree murni dipulihkan dari `tugas_pengumpulan.detail_jawaban.treeSnapshot` di Supabase. Dilarang melanjutkan dari localStorage jika belum ada data di database; jika belum ada di database, wajib mulai dari awal / `INITIAL_FILES_DATA`).
* `src/components/RuangBelajar/TugasKhusus/Tugas2/`: Petualangan 4 Misi Berpikir Komputasional:
  - Controller: `src/pages/TugasKhusus/TugasBerpikirKomputasional.jsx`
  - Sub-komponen: `BKHeader.jsx`, `BKMissionTabs.jsx`, `BKFooterNav.jsx`, `ModalSubmissionSuccessBK.jsx`, `AlgorithmMaze.jsx`, `ScheduleOptimizer.jsx`, `DataStructureVisualizer.jsx`, `BinaryCardGame.jsx`.
  - Custom Hooks: `src/hooks/RuangBelajar/TugasKhusus/Tugas2/` (`useTugasBKState.js`, dll.).
  - Fitur Persistensi & Skor: Kebijakan **Database-Only Continuation** (saat membuka tugas / klik lanjutkan, status dan skor 4 misi murni dipulihkan dari tabel `tugas_pengumpulan` di Supabase. Dilarang melanjutkan dari localStorage jika belum ada data di database; jika belum ada data di database, wajib mulai dari awal dengan skor 0). Proteksi nilai database (`Math.max`) menjamin nilai tertinggi tidak pernah ditimpa jika percobaan baru bernilai lebih kecil.
* `src/components/RuangBelajar/TugasKhusus/Tugas3/`: Petualangan 4 Misi Sistem Komputer & Perkakas Digital:
  - Controller: `src/pages/TugasKhusus/TugasSistemKomputer.jsx`
  - Sub-komponen: `SKHeader.jsx`, `SKMissionTabs.jsx`, `SKFooterNav.jsx`, `ModalSubmissionSuccessSK.jsx`, `HardwareExplorer.jsx` (Misi 1 Controller/Koordinator modul terpecah: `TabMateriVisual.jsx`, `TabLabHardware.jsx`, `TabLabSoftware.jsx`, `TabKuisKomputer.jsx`, dan `hardwareData.js`), `DataAppPipeline.jsx` (Misi 2 Controller/Koordinator modul terpecah: `TabMateriPipeline.jsx`, `TabLabPipeline.jsx`, `TabKuisPipeline.jsx`, dan `pipelineData.js`), `DigitalToolbox.jsx` (Misi 3 Controller/Koordinator modul terpecah: `TabMateriToolbox.jsx`, `TabLabToolbox.jsx`, `TabKuisToolbox.jsx`, dan `toolboxData.js`), `DigitalEthicsDetective.jsx` (Misi 4 Controller/Koordinator modul terpecah: `TabMateriEtika.jsx`, `TabLabDetective.jsx`, `TabKuisNetiket.jsx`, dan `ethicsData.js`).
  - Custom Hooks: `src/hooks/RuangBelajar/TugasKhusus/Tugas3/useTugasSKState.js`.
  - Fitur UI & Evaluasi: Layout berdampingan (*side-by-side single viewport*) untuk bank komponen kiri scrollable dan dropzones kanan pada Misi 1 & 3, urutan acak komponen (*randomized shuffle*), evaluasi agregat saat klik "Cek Hasil" dengan animasi petasan selebrasi tanpa bocoran warna merah/hijau pada item, opsi kuis & alur data berpanjang seimbang (*anti-pattern*), serta perlindungan nilai tertinggi (`Math.max`).
  - Fitur Persistensi & Sinkronisasi: Kebijakan **Database-Only Continuation** (saat membuka atau melanjutkan tugas, status dan penempatan komponen murni dipulihkan dari `tugas_pengumpulan.detail_jawaban` di Supabase dengan ID tugas kanonikal `595d2d95-d16f-4582-9be5-93d9db451f47`. Kueri tabel menggunakan `select('*')` guna mencegah error query kolom skema, dan seluruh komponen Misi 1–4 otomatis mengaktifkan status evaluasi serta materi selesai saat data riwayat jawaban dan skor dimuat). Proteksi nilai database menjamin nilai resmi di database tidak ditimpa/di-replace jika nilai pengerjaan baru lebih kecil, disertai dialog pemberitahuan proteksi skor yang transparan. Tombol "Cek Hasil" pada Misi 1 (`HardwareExplorer.jsx`) menerapkan proteksi anti-reset sehingga penempatan komponen dan poin parsial tidak terhapus saat siswa belum memperoleh nilai sempurna (< 15 poin).
* `src/components/RuangBelajar/TugasKhusus/Tugas4/`: Petualangan 3 Tahap Bilangan Biner & Kode ASCII (50 Poin):
  - Controller: `src/pages/TugasKhusus/TugasBinerAscii.jsx` (< 150 baris) dengan tema warna Royal Navy Blue (`#061022`), ambient glow biru & emas.
  - Desain & Tema Infografis Brosur: Mengadopsi visual brosur pembelajaran Informatika Kelas 7 dengan Hero Header *"Yuk, Kenalan dengan Bilangan Biner"* (aksen kuning emas `#fbbf24`, swoosh underline, badge ungu *Informatika – Kelas 7*, mockup laptop interaktif dengan layar cyan biner `01001101`, floating digits 0 dan 1, serta speech bubble lampu *"Komputer hanya mengenal 0 dan 1!"*).
  - Sub-komponen: `BinerHeader.jsx` (Royal Navy header dengan profil, skor, dan tombol aksi), `BinerStepTabs.jsx` (Navigasi 4 tahap berpita gradien aktif), `ModalSubmissionSuccessBiner.jsx`, `MateriBinerAscii.jsx` (Struktur 3 kolom infografis brosur: [1] Apa itu Bilangan Biner & Fun fact CPU transistor, [2] Cara Kerja nilai tempat pangkat 2 & Simulator Saklar 8-bit interaktif dengan proteksi anti-kecurangan, [3] Konversi Bilangan desimal <-> biner dengan metode tangga bagi 2 dan garis papan tulis coret 0 ambil 1, Alur Pengerjaan 5 langkah vertikal LKPD & Tips Sukses, serta Banner inspiratif "Dari 0 dan 1 lahir teknologi besar"), `AsciiTableExplorer.jsx` (Penjelajah tabel kode desimal ASCII interaktif desimal 33-126 berfilter kategori tanpa bocoran biner), `DesimalKeBinerQuiz.jsx` (Tahap 2: 5 soal unik desimal ke biner, 15 pt), `BinerKeDesimalQuiz.jsx` (Tahap 3: 5 soal unik biner ke desimal, 15 pt), `AsciiKeBinerQuiz.jsx` (Tahap 4: 5 soal unik karakter ASCII ke biner, 20 pt).
  - Generator & Dataset: `binerAsciiData.js` (Generator 15 soal unik acak anti-kembar rentang 33-126 dengan algoritma Fisher-Yates).
  - Custom Hooks: `src/hooks/RuangBelajar/TugasKhusus/Tugas4/useTugasBinerState.js` (< 390 baris).
  - Fitur Persistensi & Evaluasi: Kebijakan **Database-Only Continuation** (soal unik per siswa tersimpan di `detail_jawaban` Supabase, keyboard filter khusus `0` dan `1`, evaluasi instan dengan animasi kembang api, kesempatan mencoba bertingkat, dan proteksi nilai tertinggi `Math.max`).
* `src/components/RuangBelajar/TugasKhusus/Tugas5/`: Petualangan 3 Tahap Aplikasi Pengolah Kata Ms. Word - Pengalaman Belajar di SMPN 2 Singaraja (100 Poin):
  - Controller: `src/pages/TugasKhusus/TugasWord.jsx`
  - Sub-komponen: `WordHeader.jsx` (Header statis mandiri dalam alur dokumen, non-floating & anti-tumpuk dengan navigasi kembali ke Ruang Belajar, profil siswa, skor live, dan tombol submit terpadu tanpa Navbar global di rute tugas), `WordStepTabs.jsx` (Gating ketat & ikon gembok jika materi/kuis belum tuntas), `ModalSubmissionSuccessWord.jsx`, `DocxViewerProtected.jsx` (Pratinjau autentik multi-engine: Google Docs Viewer resmi via Cloudinary docx publik dan Lembar A4 Native lengkap dengan warna font `#2B579A`, `#2F5496`, `#C00000`, highlight kuning SMPN 2 Singaraja, mode terproteksi anti-copy & anti-download, dan layar penuh modal), `MateriWordLiterasi.jsx` (Pratinjau dokumen terproteksi di awal, alur gulir tunggal *single-page scrolling feed*, 7 kartu langkah terkunci bertahap, auto-scroll mulus, seleksi kelulusan materi, dan tombol aksi transisi ke kuis `onGoToQuiz`/`onGoToStage2`), `ReadingTimerIndicator.jsx` (Timer membaca aktif ~45 detik threshold per langkah), `TopicCardFocused.jsx` (Tampilan fokus per langkah, parser markdown teks `renderFormattedContent` anti-tampil karakter `**` mentah dengan styling bullet, penomoran, sub-bullet, dan inline bold rapi, renderer simulasi visual interaktif, & soal checkpoint berbobot 2 pt/langkah = 14 pt), modul visual `visuals/` (`VisualInterfaceWord.jsx` [Langkah 1: Start Screen, Blank Document, Layout A4, Font Calibri 12pt], `VisualJudulSubjudul.jsx` [Langkah 2: Mengetik Judul 20pt Bold Center Ctrl+E & B, Subjudul 12pt], `VisualTableIdentitas.jsx` [Langkah 3: Tabel 3x5, Header Shading & Atur Lebar Kolom No], `VisualCeritaPengalaman.jsx` [Langkah 4: Sub-judul Ruang Spendaraja 15pt Bold & Cerita Justify Ctrl+J], `VisualFormatKhusus.jsx` [Langkah 5: Bold nama, Italic istilah asing & Pesan Penting Center Bold], `VisualWrapText.jsx` [Langkah 6: Sisip Gambar Komputer PNG & Wrap Text Top and Bottom], `VisualSaveExport.jsx` [Langkah 7: Save As F12/Ctrl+S ke Downloads > Kelas > Nama_NoAbsen format nama tugas 5_nama_noAbsen_pengalaman belajar.docx]), `KuisMsWord.jsx` (Tahap 2: 5 soal kuis aplikatif fitur toolbar Word berbobot 26 pt dengan pembahasan instan, seleksi opsi interaktif `handleSelectAnswer = onAnswerQuiz || onSelectOption`, opsi ulang kuis `handleResetQuiz` untuk perbaikan nilai, dan transisi ke tahap proyek), `ProyekBrosurHut.jsx` (Tahap 3: Panduan skenario Pengalaman Belajar & Ruang Spendaraja, rubrik 4 kriteria 60 pt, ketentuan font Calibri [Judul 20pt Bold, Sub-judul 15pt Bold, teks 12pt], toggle pratinjau contoh dokumen jadi, tanpa tombol salin teks), `FormUploadCloudinaryTugas5.jsx` (Area upload khusus dokumen Word `.docx` / `.doc` minimal 15 KB ke Cloudinary unsigned upload preset `tugas_5` folder `Tugas/5`, penolakan gambar/PDF, tombol "Preview Berkas" multi-engine interaktif berdampingan dengan "Lihat Berkas", ceklis verifikasi praktik mandiri 4 kriteria *Hybrid Auto-Grading*, dan pengiriman ke Supabase).
  - Dataset: `src/data/tugas5WordData.js` (7 langkah panduan praktik Microsoft Word Kelas 7, checkpoint questions mudah 2 pt/langkah, 5 soal kuis [26 pt], draf teks cerita, targetFormat: ['.docx', '.doc'], & rubrik).
  - Custom Hooks: `src/hooks/RuangBelajar/TugasKhusus/Tugas5/useTugasWordState.js` (Manajemen timer 45s per langkah aktif, validasi sesi login `user_siswa`, auto-save latar belakang per checkpoint/kuis/upload, tombol simpan progres & kumpul tugas responsif di header tanpa blokir gating kaku, pemulihan data pengerjaan utuh dari Supabase `tugas_pengumpulan.detail_jawaban` agar siswa dapat melanjutkan kapan saja, in-app toast notification, efek suara petasan & kembang api Web Audio API interaktif [`soundEffects.playCelebrationFirework()`, `playMissionSuccessSound()`, `triggerMissionFireworkAnimation()`, dan `triggerGrandConfetti()`] saat checkpoint benar, seluruh 7 langkah tuntas, submit kuis, upload berkas, simpan progres, dan pengumpulan akhir, kepatuhan ketat skema database `tugas_pengumpulan` [kolom `tautan_tugas`, `siswa_id`, `skor`, `nama_berkas`, `catatan_siswa`, tanpa kolom non-skema `file_url`/`nisn_siswa`], dan proteksi skor tertinggi `Math.max`).
  - Helper Cloudinary: `uploadTugas5ToCloudinary` di `src/utils/cloudinaryUpload.js` dengan konfigurasi Unsigned Upload murni (folder: `Tugas/5`, tags, dan fallback multi-preset `tugas_5` -> `tugas_ekstra_tik7` -> `jurnal_lab_preset`).

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
5. **Keamanan Tipe Data Kolom UUID Supabase (Anti-Error 22P02)**:
   - Kolom `tugas_id` pada tabel `tugas_pengumpulan` bertipe data `UUID`. Saat membuat kueri `.in('tugas_id', candidateTaskIds)` atau `.eq('tugas_id', id)`, seluruh kandidat ID wajib disaring menggunakan regex validator UUID (`/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`).
   - Dilarang keras menyertakan string non-UUID seperti kode teks tugas (misal `'TUGAS-01-SIMULASI-FOLDER'`) ke dalam array filter kolom UUID, karena PostgreSQL akan membatalkan kueri dengan error `22P02: invalid input syntax for type uuid` sehingga data riwayat/state pengerjaan siswa gagal termuat.
6. **Larangan Mengubah Database Tanpa Konfirmasi Terlebih Dahulu (Wajib Konfirmasi)**:
   - AI Agent **DILARANG KERAS** mengubah, menambah, menghapus, atau merestrukturisasi skema database Supabase/PostgreSQL (termasuk tabel, kolom, constraint, trigger, function, RLS policies, maupun manipulasi/update data massal) tanpa meminta dan mendapatkan konfirmasi eksplisit terlebih dahulu dari pengguna.
   - Jika teridentifikasi kendala pada database atau diperlukan penyesuaian/perbaikan data/trigger, AI Agent wajib memaparkan analisis dan rencananya secara transparan serta meminta konfirmasi terlebih dahulu sebelum mengeksekusi tindakan apapun pada database.

---

## 6. Indeks Dokumentasi Modul & Komponen (`/docs/`)

Untuk memahami alur kerja lebih spesifik dan mendalam pada setiap modul, silakan baca dokumentasi pendukung berikut:
1. **[`/docs/DESIGN_SYSTEM.md`](/docs/DESIGN_SYSTEM.md)**: Standar desain 4 arketipe halaman (Siswa, Praktikum, Portal, Admin) & aturan komponen mobile.
2. **[`/docs/HOME_DAN_KOMPONEN_GLOBAL.md`](/docs/HOME_DAN_KOMPONEN_GLOBAL.md)**: Arsitektur Home App Launcher, Navbar Modular (`NavbarBrand`, `NavbarPointsBadge`, `NavbarUserSection`, `ModalLogin`, `ModalProfilUser`, `ModalGantiPassword`, `CameraCaptureModal`), Manajemen Sesi Komputer Lab vs Perangkat Pribadi (`authStorage.js`), Handshake Verifikasi Sandi Database Supabase, integrasi Foto Profil Cloudinary via Kamera Langsung & Supabase Realtime, Floating Online Presence, dan Live Chat Realtime.
3. **[`/docs/RUANG_BELAJAR.md`](/docs/RUANG_BELAJAR.md)**: Master Hub modul Ruang Belajar, Timeline, Log Skor, dan Leaderboard Kelas.
4. **[`/docs/tugas/TUGAS_1_SIMULATOR_FOLDER.md`](/docs/tugas/TUGAS_1_SIMULATOR_FOLDER.md)**: Rincian teknis virtual file system & 25 misi Tugas 1.
5. **[`/docs/tugas/TUGAS_2_BERPIKIR_KOMPUTASIONAL.md`](/docs/tugas/TUGAS_2_BERPIKIR_KOMPUTASIONAL.md)**: Rincian teknis 4 misi terpadu Bab 1 (Algoritma, Jadwal, Struktur Data, Biner).
6. **[`/docs/tugas/TUGAS_3_SISTEM_KOMPUTER.md`](/docs/tugas/TUGAS_3_SISTEM_KOMPUTER.md)**: Rincian teknis 4 misi terpadu Bab 2 (Hardware Komputer, Data & Aplikasi, Perkakas Digital, Dampak & Etika TIK).
7. **[`/docs/tugas/TUGAS_4_BINER_ASCII.md`](/docs/tugas/TUGAS_4_BINER_ASCII.md)**: Rincian teknis petualangan bilangan biner & kode ASCII 33-126 (Simulator 8-bit, Desimal ke Biner, Biner ke Desimal, ASCII ke Biner).
8. **[`/docs/DATABASE_TRIGGERS.md`](/docs/DATABASE_TRIGGERS.md)**: Dokumentasi fungsi & trigger PostgreSQL aktif di Supabase.
9. **[`/docs/JURNAL_LAB.md`](/docs/JURNAL_LAB.md)**: Dokumentasi arsitektur, algoritma penjadwalan, validasi waktu WITA, skema database Jurnal Laboratorium, stabilitas state anti-reset `ModalSelesai.jsx`, serta alur kompresi gambar client-side (1280px WebP) dan integrasi upload Cloudinary untuk dokumentasi foto kegiatan/ruangan lab.
10. **[`/docs/FLOATING_ONLINE.md`](/docs/FLOATING_ONLINE.md)**: Dokumentasi teknis & arsitektur `FloatingOnline.jsx` (Supabase Presence, pelacakan kehadiran siswa realtime, drawer UI samping, dan jembatan notifikasi unread).
11. **[`/docs/LIVE_CHAT.md`](/docs/LIVE_CHAT.md)**: Dokumentasi teknis & arsitektur `LiveChat.jsx` (skema ternormalisasi relasional `sender_id` terhubung `master_siswa`, arsitektur modular `ChatHeader` dengan badge jumlah online ikon `Users`, `ChatMessageItem`, `ChatInputForm`, `chatHelpers`, `LinkPreviewCard`, Supabase Realtime Postgres Changes, moderasi sensor kata kasar, sistem pemisahan 2 ruang terisolasi [Ruang Siswa vs. Ruang Guru], tab switcher & 3 lapis proteksi anti-salah kamar untuk Admin, kontrol kunci chat kelas, fitur hapus riwayat obrolan per-kamar & hapus pesan per-item untuk Admin, audio SFX, smart auto-scroll, rendering tautan anti-tembus, sistem kartu link preview modular ala WhatsApp dengan oEmbed TikTok & Instagram embed scraper tanpa login, serta mekanisme *Exclusive Video Playback* anti-tumpang tindih suara).
12. **[`/docs/EKSTRA_TIK.md`](/docs/EKSTRA_TIK.md)**: Dokumentasi teknis portal Ekstrakurikuler TIK (`/ekstra-tik`), integrasi database Supabase ternormalisasi total (Opsi 2: relasi foreign key murni `siswa_id` ke `master_siswa` pada `ekstra_anggota`, `ekstra_presensi`, `ekstra_tugas_pengumpulan`), resolusi identitas `resolveStudentId` otomatis anti-error `column ekstra_presensi.nama does not exist`, penyimpanan berkas tugas ke Cloudinary via preset `tugas_ekstra_tik7`, alur pengumpulan tugas dengan dropdown pemilihan 42 anggota resmi terpadu dan kolom nama serta kelas yang terisi otomatis terkunci (`read-only`) anti-ketik manual, panel pengawasan admin dengan filter "Semua Siswa" vs "Siswa Terpilih", filter kelas & tugas, unduh rekap berkas tugas (.CSV), realtime sync `subscribeTugasPengumpulanEkstra`, in-app multi-engine live document preview modal (Microsoft Office Online & Google Docs Viewer dengan manual switch & direct tab fallback), fitur unduh rekap kehadiran matriks berformat `.CSV` untuk Excel, proteksi presensi harian per siswa dengan pembatasan hak akses status (siswa hanya dapat Hadir, status Izin/Sakit eksklusif untuk Admin/Guru), kontrol saklar buka/tutup sesi absensi realtime hari Jumat oleh Guru/Admin, fitur konfirmasi penandaan Alpa massal otomatis/manual untuk anggota yang belum hadir, serta tampilan log kehadiran WhatsApp-style 1 kolom per baris terkelompok per hari dengan pencantuman nama hari.
13. **[`/docs/tugas/TUGAS_5_PENGOLAH_KATA.md`](/docs/tugas/TUGAS_5_PENGOLAH_KATA.md)**: Rincian teknis petualangan 3 tahap aplikasi pengolah kata Ms. Word (Brosur HUT Spendaraja, 5 topik literasi membaca fokus threshold ~60s & checkpoint soal, kuis 5 soal fitur Word, dan integrasi upload Cloudinary preset `tugas_5` ke folder `Tugas/5`).

