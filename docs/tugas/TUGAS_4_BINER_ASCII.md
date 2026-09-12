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
├── Controller Utama: src/pages/TugasKhusus/TugasBinerAscii.jsx (< 150 baris)
├── Custom Hook State: src/hooks/RuangBelajar/TugasKhusus/Tugas4/useTugasBinerState.js (< 390 baris)
├── Dataset & Generator: src/components/RuangBelajar/TugasKhusus/Tugas4/binerAsciiData.js
├── Header & Navigasi:
│   ├── BinerHeader.jsx (Profil siswa, skor real-time / 50 pt, status cloud, tombol reset & kumpulkan)
│   └── BinerStepTabs.jsx (Navigasi 4 tahap dengan status progres & poin)
├── Tahap 1: Materi & Laboratorium Visualizer
│   ├── MateriBinerAscii.jsx (Fun fact transistor CPU, pengenalan ASCII, contoh 'a' [97 = 01100001], panduan 3 cara konversi, & simulator saklar 8-bit interaktif)
│   └── AsciiTableExplorer.jsx (Penjelajah tabel ASCII interaktif 33-126 dengan filter kategori & pencarian live)
├── Tahap 2: Tantangan Desimal ke Biner (15 Poin)
│   └── DesimalKeBinerQuiz.jsx (5 soal unik tanpa kembar, input keyboard 0 & 1, scratchpad orek-orek saklar 8-bit, evaluasi instan, & kembang api)
├── Tahap 3: Tantangan Biner ke Desimal (15 Poin)
│   └── BinerKeDesimalQuiz.jsx (5 soal unik tanpa kembar, kartu 8 bit berbobot, input angka desimal, evaluasi instan, & kembang api)
├── Tahap 4: Tantangan ASCII ke Biner (20 Poin)
│   └── AsciiKeBinerQuiz.jsx (5 soal karakter teks unik tanpa kembar, tampilan simbol besar, input biner 8-bit, evaluasi instan, & kembang api)
└── Modal Sukses & Apresiasi:
    └── ModalSubmissionSuccessBiner.jsx (Rekap perolehan skor resmi / 50 pt, rincian tiap tahap, & proteksi skor)
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

### C. Materi Interaktif & Simulator Saklar 8-Bit
* **Fun Fact Nyata**: Komputer/CPU sebenarnya tidak mengenal teks, video, atau foto, melainkan hanya miliaran transistor dengan status fisik ON (1) dan OFF (0).
* **Kamus ASCII**: Menjelaskan fungsi ASCII sebagai standardisasi internasional representasi karakter.
* **Studi Kasus Huruf `'a'`**: Menunjukkan alur huruf `'a'` ➔ kode desimal `97` ➔ kode biner `01100001` ($64 + 32 + 1$).
* **Simulator Saklar 8-Bit**: Siswa dapat mengklik 8 saklar ($128, 64, 32, 16, 8, 4, 2, 1$) untuk melihat kalkulasi live jumlah desimal dan karakter ASCII yang terbentuk seketika.
* **Penjelajah Tabel ASCII 33-126**: Dilengkapi pencarian nama/desimal/biner dan filter chip kategori (Huruf Besar, Huruf Kecil, Angka, Simbol).

---

## 4. Persistensi Supabase & Proteksi Skor

1. **Database-Only Continuation**:
   * Saat siswa membuka tugas, data riwayat dan 15 soal murni dipulihkan dari `tugas_pengumpulan` Supabase.
2. **Proteksi Skor Tertinggi (`Math.max`)**:
   * Jika siswa mencoba mengulang latihan dan memperoleh skor yang lebih rendah, nilai resmi di database tidak akan pernah turun.
3. **Audit Trail Log Poin**:
   * Saat kumpul tugas, perolehan nilai otomatis disinkronkan ke tabel `point_logs` (`kode_tugas = 'TUGAS-04-BINER-ASCII'`) dan menjumlahkan `master_siswa.total_points`.
