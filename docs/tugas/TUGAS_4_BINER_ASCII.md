# Dokumentasi Teknis: Tugas 4 - Petualangan Bilangan Biner & Kode ASCII

Modul pembelajaran interaktif dan praktikum terpadu untuk topik **Representasi Data Digital, Bilangan Biner (8-Bit), Arsitektur Transistor, dan Kamus Kode Karakter ASCII (33 - 126)** pada portal Ruang Belajar SMP Negeri 2 Singaraja.

---

## 1. Ikhtisar Tugas & Bobot Nilai

* **Kode Tugas**: `TUGAS-04-BINER-ASCII` (Alias: `tugas-inf-04`)
* **Urutan Tugas**: 4
* **Bobot Poin Total**: **50 Poin** (Distribusi: Tahap 2: 15p, Tahap 3: 15p, Tahap 4: 20p)
* **Tipe Modul**: `kuis` / Tantangan Interaktif Biner dengan Evaluasi Otomatis & Input Non-ABC
* **Rute URL**: `/tugas/biner-ascii` atau `/ruang-belajar/tugas/biner-ascii`
* **Halaman Controller**: `src/pages/TugasKhusus/TugasBinerAscii.jsx`
* **Custom Hook State & DB Sync**: `src/hooks/RuangBelajar/TugasKhusus/Tugas4/useTugasBinerState.js`
* **Dataset & Generator Soal Acak**: `src/components/RuangBelajar/TugasKhusus/Tugas4/binerAsciiData.js`

---

## 2. Struktur Arsitektur & File Modul

```
TUGAS 4: BILANGAN BINER & KODE ASCII (50 Poin)
├── Controller Utama: src/pages/TugasKhusus/TugasBinerAscii.jsx
├── Custom Hook State: src/hooks/RuangBelajar/TugasKhusus/Tugas4/useTugasBinerState.js
├── Dataset & Generator: src/components/RuangBelajar/TugasKhusus/Tugas4/binerAsciiData.js
├── Header & Navigasi:
│   ├── BinerHeader.jsx (Profil siswa, skor real-time / 50 pt, status cloud, tombol simpan draft, tombol reset & kumpulkan, safe-area top clearance anti-numpuk navbar)
│   └── BinerStepTabs.jsx (Navigasi 5 tahap responsif dengan status progres & poin)
├── Tahap 1: Materi & Laboratorium Visualizer
│   ├── MateriBinerAscii.jsx (Fun fact transistor CPU, pengenalan ASCII, contoh 'a' [97 = 01100001], panduan 3 cara konversi, & simulator saklar 8-bit interaktif)
│   └── AsciiTableExplorer.jsx (Penjelajah tabel ASCII interaktif 33-126 dengan filter kategori & pencarian live)
├── Tahap 2: Tantangan Desimal ke Biner (15 Poin)
│   └── DesimalKeBinerQuiz.jsx (5 soal unik tanpa kembar, input keyboard 0 & 1 murni tanpa kotak orek-orek saklar, evaluasi instan, & kembang api)
├── Tahap 3: Tantangan Biner ke Desimal (15 Poin)
│   └── BinerKeDesimalQuiz.jsx (5 soal unik tanpa kembar, kartu 8 bit murni tanpa angka bocoran bobot +2/+4 di atas/bawah, input angka desimal, evaluasi instan, & kembang api)
├── Tahap 4: Tantangan ASCII ke Biner (20 Poin)
│   └── AsciiKeBinerQuiz.jsx (5 soal karakter teks unik tanpa kembar, tampilan simbol murni tanpa bocoran nilai desimal, petunjuk mencari kode di tabel ASCII Tahap 1, tombol lanjut ke Tahap 5, input biner 8-bit, evaluasi instan, & kembang api)
├── Tahap 5: Bukti Orak-Orek Buku Tulis (Kamera Belakang)
│   └── FotoOrekOrekUpload.jsx (Live stream kamera belakang WebRTC facingMode: 'environment', fallback native kamera, kompresi client-side, & upload Cloudinary preset 'Tugas_4')
└── Modal Sukses & Apresiasi:
    └── ModalSubmissionSuccessBiner.jsx (Rekap perolehan skor resmi / 50 pt, rincian tiap tahap, link/status foto bukti orak-orek, & proteksi skor)
```

---

## 3. Fitur Utama & Logika Sistem

### A. Generator 15 Soal Unik Tanpa Kembar (`generate15UniqueQuestions`)
* **Rentang Bilangan**: Desimal 33 (`!`) sampai 126 (`~`), mencakup seluruh karakter *printable* ASCII standar tanpa whitespace/spasi (32) maupun control character DEL (127).
* **Algoritma Fisher-Yates**: Mengacak pool 94 karakter unik dan mengambil 15 nomor pertama.
* **Jaminan Anti-Kembar**: Seluruh 15 soal pada Tahap 2 (5 soal), Tahap 3 (5 soal), dan Tahap 4 (5 soal) dipastikan tidak ada satupun angka yang berulang.
* **Persistensi Unik Siswa**: Sekali soal di-generate untuk seorang siswa, susunan 15 soal tersebut disimpan ke dalam `tugas_pengumpulan.detail_jawaban` di Supabase. Siswa yang me-refresh browser akan tetap melanjutkan paket 15 soal unik miliknya.

### B. Format Input Non-ABC & Evaluasi Realtime
* Siswa tidak disuguhi pilihan ganda (ABC) agar tidak menebak secara spekulatif.
* Pada Tahap 2 & 4, input difilter secara langsung (`replace(/[^01]/g, '')`) sehingga keyboard hanya menerima karakter biner `0` dan `1`.
* Evaluasi jawaban berjalan otomatis:
  * Jawaban benar langsung memicu animasi petasan/kembang api (`triggerConfetti()`).
  * Sistem memberikan skor bertingkat (*tiered attempts*): 
    * Percobaan 1: Poin Penuh (3 pt pada Tahap 2 & 3, 4 pt pada Tahap 4).
    * Percobaan 2: Poin Berkurang 1 pt.
    * Percobaan 3+: Tetap diberi apresiasi 1 pt agar siswa tidak patah semangat.

### C. Desain Visual Brosur Informatika & Materi Interaktif
* **Hero Header "Yuk, Kenalan dengan Bilangan Biner"**:
  * Mengadopsi palet Royal Navy Blue (`#0a1b38` - `#0f2a58`) dengan aksen kuning emas cerah (`#fbbf24`), cyan elektrik, dan ungu.
  * Dilengkapi tipografi judul bercabang *"Bilangan"* (putih 3D) dan *"Biner"* (kuning bercahaya dengan underline swoosh curve).
  * Menampilkan badge resmi `Informatika – Kelas 7`.
  * Ilustrasi mockup laptop 8-bit bus dengan layar biner cyan matriks (`01001101`, `01110000`, `01101011`, `01101000`) dan speech bubble kuning ikon lampu: *"Komputer hanya mengenal 0 dan 1!"*.
* **Struktur 3 Kolom Infografis Brosur**:
  * **Bagian 1 (Badge Biru #1)**: *Apa itu Bilangan Biner?*, definisi bilangan biner sistem basis 2, serta Fun Fact miliaran transistor CPU (status on 1 dan off 0).
  * **Bagian 2 (Badge Ungu #2)**: *Cara Kerja*, nilai tempat perpangkatan 2 ($2^0, 2^1, 2^2, 2^3$), contoh perhitungan $1101_2 = 13$, serta Simulator Saklar 8-Bit Interaktif (1 Byte) dengan proteksi anti-kecurangan.
  * **Bagian 3 (Badge Hijau #3)**: *Konversi Bilangan*, memuat metode Desimal ke Biner (metode tangga bagi 2, catat sisa, baca bawah ke atas) dan Biner ke Desimal (metode garis papan tulis coret 0 ambil 1).
  * **Panduan LKPD & Tips Sukses**: 5 langkah vertikal terarah (Baca Petunjuk, Pelajari Materi, Kerjakan Soal, Periksa Kembali, Kumpulkan) dan kartu Tips Sukses.
  * **Banner Inspiratif**: *"Dari 0 dan 1 lahir teknologi besar"* dengan ringkasan digital matriks `0101 1010` dan tombol CTA mulai kuis.
* **Simulator Saklar 8-Bit (Proteksi Anti-Kecurangan)**:
  * Selama pengerjaan tugas (belum selesai / belum mengumpulkan / nilai belum maksimal), saklar 8-bit berada dalam **Mode Terkunci (Read-Only)** dengan peragaan statis huruf 'a' (01100001) agar tidak dapat dijadikan kalkulator contekan.
  * Begitu siswa menuntaskan dan mengumpulkan tugas (skor 50/50), simulator otomatis terbuka penuh menjadi playground laboratorium interaktif bebas.
* **Metode Konversi Papan Tulis**:
  * **Biner ➔ Desimal (Metode Garis Papan Tulis & Coret 0)**: 8 digit biner ditarik garis ke bawah menuju bobot kelipatan dua ($128, 64, 32, 16, 8, 4, 2, 1$). Jika bit bernilai 0 bobot dicoret ($<s>128</s>$), jika 1 bobot diambil. Hasilnya didapat dengan menjumlahkan bobot yang tidak dicoret ($64 + 32 + 1 = 97$).
  * **Desimal ➔ Biner (Metode Tangga Pembagian 2 & Sisa)**: Desimal dibagi 2 secara bertingkat, hasil bagi ditulis di bawahnya dan sisa pembagian (0 atau 1) dicatat di kanan hingga hasil bagi mencapai 0. Angka biner dibaca dari **bawah ke atas** (↑), lalu digenapkan 8-bit dengan menambahkan angka 0 di depan ($01100001$).
* **Penjelajah Tabel ASCII 33-126 (Tanpa Kode Biner)**:
  * Hanya menampilkan simbol karakter dan kode desimal ASCII.
  * Kolom, pencarian, dan tooltip kode biner dinonaktifkan agar siswa tidak dapat langsung menyalin jawaban biner pada Tahap 4 (ASCII ke Biner). Siswa diarahkan mengonversi kode desimal ke biner secara mandiri menggunakan metode bagi 2 atau penjumlahan bobot.

---

## 4. Persistensi Supabase & Proteksi Skor

1. **Kepatuhan Skema Tabel `public.tugas_pengumpulan`**:
   * Seluruh operasi INSERT / UPDATE menggunakan `.upsert(payload, { onConflict: 'tugas_id,siswa_id' })`.
   * Kolom payload строго mematuhi skema:
     - `tugas_id`: UUID (`93e18a4d-71b5-4b0d-9b16-e5c26b9a2c91`)
     - `siswa_id`: Integer ID siswa dari `master_siswa`
     - `status`: `'sedang'` (draft progres) atau `'submitted'` (pengumpulan resmi)
     - `skor`: Integer 0 - 50
     - `persentase_skor`: Numeric(5, 2) (0.00 - 100.00%)
     - `detail_jawaban`: JSONB snapshot pengerjaan lengkap
     - `catatan_guru`: Catatan otomatis status/skor
     - `submitted_at`: Timestamp jika status `'submitted'`
     - `updated_at`: Timestamp waktu simpan
   * Tidak ada pengiriman kolom non-skema (`nisn_siswa`, `nama_siswa`, `kelas_siswa`, `nilai_akhir`) sehingga bebas dari error PostgREST `PGRST204`.

2. **Struktur JSONB `detail_jawaban` (Database Continuation)**:
   * Menyimpan snapshot lengkap:
     ```json
     {
       "taskName": "Tugas 4: Petualangan Bilangan Biner & Kode ASCII",
       "activeStage": 2,
       "stage1Completed": true,
       "stage2Questions": [...],
       "stage3Questions": [...],
       "stage4Questions": [...],
       "scores": { "stage2": 15, "stage3": 15, "stage4": 20 },
       "totalScore": 50,
       "currentAttemptScore": 50,
       "previousBestScore": 50,
       "allAnswered": true,
       "updatedAt": "2026-10-15T...",
       "submittedAt": "2026-10-15T..."
     }
     ```
   * Saat siswa membuka kembali halaman atau login di perangkat lain, 15 paket soal unik beserta jawaban, percobaan (*attempts*), feedback, dan status tahapan dipulihkan utuh dari database tanpa reset.

3. **Mekanisme Auto-Save & Manual Save**:
   * **Auto-Save**: Otomatis menyimpan perubahan ke Supabase pada saat siswa menyelesaikan materi Tahap 1 dan saat menjawab setiap butir soal pada Tahap 2, 3, dan 4.
   * **Tombol Simpan Manual**: Tombol "Simpan" pada `BinerHeader.jsx` memungkinkan siswa menyimpan draft sewaktu-waktu dengan notifikasi toast visual.

4. **Proteksi Skor Tertinggi (`Math.max`)**:
   * Jika siswa mengulang latihan dan perolehan baru lebih kecil dari riwayat di database, nilai tersimpan tetap dipertahankan pada skor tertinggi sebelumnya (`Math.max(previousBestScore, currentScore)`).

5. **Sinkronisasi Trigger Poin Realtime**:
   * Trigger PostgreSQL `trg_sync_tugas_to_point_logs` otomatis mencatat log ke `point_logs`.
   * Utilitas `syncStudentPointsAfterTask(studentId)` menyinkronkan `total_points` resmi ke `master_siswa` dan sesi lokal siswa.

6. **Tahap 5: Pengambilan Foto Orak-Orek Buku Tulis & Upload ke Cloudinary**:
   * Siswa dapat mengambil foto lembar catatan/perhitungan manual konversi biner langsung dari buku tulisnya menggunakan kamera belakang HP (`facingMode: { ideal: 'environment' }`) atau opsi kamera aplikasi bawaan (`capture="environment"`).
   * Gambar dikompresi otomatis di sisi browser menggunakan `compressImage` untuk mempercepat proses transmisi.
   * Diunggah ke Cloudinary unsigned upload preset **`Tugas_4`** (folder: `Tugas/4`), dan URL foto disimpan di kolom `tautan_tugas` serta metadata berkas di `nama_berkas` dan `detail_jawaban.uploadedPhotoInfo`.
   * Foto yang berhasil diunggah langsung tersimpan di cloud Supabase dan dapat dilihat kembali melalui pratinjau modal maupun tautan langsung.
