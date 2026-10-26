# Dokumentasi Teknis - Tugas 6: Praktik Resmi Surel (Gmail)

Modul pembelajaran komunikasi resmi digital berbasis Kurikulum Merdeka Informatika Kelas 7 (Elemen Jaringan Komputer & Internet / Literasi Digital) untuk SMP Negeri 2 Singaraja.

---

## 1. Ikhtisar & Tujuan Pembelajaran
* **Judul Tugas**: Praktik Resmi Surel (Gmail) - Surat Izin Lomba Melukis
* **Topik Utama**: Etika Berkirim Surel Formal, Anatomi To/Cc/Bcc, dan Praktik Nyata di Aplikasi Gmail Asli
* **Kasus Buku Paket (Disesuaikan)**: Murid memohon izin tidak dapat mengikuti kegiatan belajar mengajar di sekolah pada tanggal **1 November 2026** karena harus menghadiri acara penyerahan hadiah sebagai pemenang lomba melukis peringatan Hari Kemerdekaan RI di tingkat kabupaten. Surel ditujukan kepada **Wali Kelas** dan ditembuskan (Cc) kepada **Kepala Sekolah**.
* **Kategori**: Literasi Digital
* **Kode Tugas**: `TUGAS-06-SUREL-GMAIL`
* **Target Rute Siswa**: `/ruang-belajar/tugas/surel-gmail` (alias `/tugas/surel-gmail`)
* **Target Rute Galeri Admin**: `/admin/review-tugas-6`
* **Total Poin**: 100 Poin (Pending Review Admin)
* **Karakteristik Utama**:
  - **Watch & Do**: Tiap tahap memuat materi visual singkat (15–25 detik) + 1 kuis checkpoint instan.
  - **Aksi Nyata di Gmail Asli**: Murid mengoperasikan aplikasi Gmail sungguhan di perangkat masing-masing (HP/laptop), lalu mengunggah screenshot bukti per tahap.
  - **Tanpa Berkas PDF**: Pada Tahap 3 murid *tidak perlu melampirkan berkas PDF*, cukup fokus menyusun surat izin formal yang sopan dan lengkap di badan pesan.
  - **Hak Akses Nilai Khusus Admin**: Pengisian nilai dan tombol ACC 100 Poin pada Galeri Penilaian hanya dapat dilakukan oleh pengguna dengan `role: 'admin'` pada tabel `master_siswa`.
  - **Kepatuhan Schema v2.0**: Menggunakan format baku `detail_jawaban` v2.0.

---

## 2. Struktur File & Modul Komponen

```text
src/
├── data/
│   └── tugas6SurelData.js                    # Konfigurasi Tugas 6, data 3 tahap, kuis checkpoint, template surat izin (1 Nov 2026)
├── hooks/RuangBelajar/TugasKhusus/Tugas6/
│   └── useTugasSurelState.js                 # State controller, kuis, upload screenshot Cloudinary, auto-save v2.0, & submit pending
├── components/RuangBelajar/TugasKhusus/Tugas6/
│   ├── SurelHeader.jsx                       # Header tugas, profil siswa, badge status review, tombol kumpul tugas
│   ├── SurelStepTabs.jsx                     # Navigasi tab 3 tahap dengan indikator kelengkapan kuis & screenshot
│   ├── TahapWatchAndDoCard.jsx               # Kartu terpadu: video/poin penting, kuis checkpoint, tombol buka Gmail, & uploader screenshot
│   ├── ModalSubmissionSuccessSurel.jsx       # Modal konfirmasi pengerjaan berhasil dikirim ke galeri review admin
│   └── Admin/
│       └── GaleriReviewTugas6.jsx            # Panel Galeri Khusus Admin: Filter kelas, 3 thumbnail SS, zoom lightbox, 1-click ACC 100 pt, & revisi
├── utils/
│   └── cloudinaryUpload.js                   # Helper uploadTugas6ScreenshotToCloudinary (kompresi 1280px, folder Tugas/6)
└── pages/TugasKhusus/
    └── TugasSurelGmail.jsx                   # Page controller siswa untuk rute /tugas/surel-gmail
```

---

## 3. Rincian 3 Tahap Pembelajaran (Watch & Do + Screenshot)

### Tahap 1: Akun & Kotak Masuk Gmail (Bobot: 30 Poin)
* **Watch**: Konsep surel vs surat pos fisik, anatomi alamat dengan simbol `@`, dan tampilan Kotak Masuk (Inbox).
* **Kuis**: Penulisan alamat surel yang valid tanpa spasi.
* **Praktek**: Buka aplikasi Gmail di HP / `mail.google.com` di laptop.
* **Screenshot 1**: Tangkapan layar layar Kotak Masuk (Inbox) yang memperlihatkan foto/nama akun Gmail aktif murid.

### Tahap 2: Menyusun Alamat Kepada (To) & Tembusan (Cc) (Bobot: 35 Poin)
* **Watch**: Cara menekan tombol `+ Tulis`, fungsi `Kepada (To)` untuk penerima utama (Wali Kelas), dan rahasia `Cc (Carbon Copy)` untuk pihak yang berhak mengetahui surat resmi (Kepala Sekolah).
* **Kuis**: Fungsi kolom Cc untuk tembusan informasi.
* **Praktek**: Membuka jendela tulis di Gmail, mengisi alamat Wali Kelas di `To`, mengklik tombol `Cc` dan mengisi alamat Kepala Sekolah, serta menulis Subjek: `Permohonan Izin Tidak Masuk Sekolah - [Nama] [Kelas]`.
* **Screenshot 2**: Tangkapan layar jendela penulisan pesan dengan kolom To, Cc, dan Subjek yang telah terisi.

### Tahap 3: Menulis Isi Surat Izin Formal (Kasus 1 November 2026) (Bobot: 35 Poin)
* **Watch**: Etika penulisan surat formal (salam pembuka resmi, identitas, alasan jelas tanggal 1 November 2026 karena penyerahan hadiah lomba melukis, salam penutup & ucapan terima kasih). Penegasan: *TIDAK PERLU melampirkan file PDF*.
* **Kuis**: Larangan menggunakan huruf kapital semua (CAPSLOCK) dalam surat formal.
* **Praktek**: Menuliskan badan surat izin (murid dapat menyalin draf teks yang telah disediakan di platform ke Gmail).
* **Screenshot 3**: Tangkapan layar badan surat izin lengkap yang siap dikirim atau yang sudah masuk ke folder Terkirim (Sent).

---

## 4. Format Data `detail_jawaban` (Standar Schema v2.0)

Data pengerjaan Tugas 6 disimpan secara terstandar di kolom `detail_jawaban` tabel `tugas_pengumpulan`:

```json
{
  "schema_version": "2.0",
  "tipe_tugas": "multi_stage",
  "meta": {
    "kode_tugas": "TUGAS-06-SUREL-GMAIL",
    "judul_tugas": "Tugas 6: Praktik Resmi Surel (Gmail) - Surat Izin Lomba Melukis",
    "active_stage": 3,
    "total_stages": 3,
    "time_spent_seconds": 380,
    "attempt_count": 1,
    "last_saved_at": "2026-10-26T10:45:00.000Z",
    "is_completed": true
  },
  "ringkasan_skor": {
    "skor_maksimal": 100,
    "skor_diperoleh": 0,
    "skor_tertinggi_disimpan": 0,
    "breakdown": [
      { "id": "tahap_1", "label": "Akun & Inbox Gmail", "skor": 0, "skor_maks": 30, "status": "sebagian" },
      { "id": "tahap_2", "label": "Alamat To & Cc", "skor": 0, "skor_maks": 35, "status": "sebagian" },
      { "id": "tahap_3", "label": "Isi Surat Izin Formal", "skor": 0, "skor_maks": 35, "status": "sebagian" }
    ]
  },
  "stages": {
    "tahap_1": {
      "status": "completed",
      "quiz_answer": "B",
      "screenshot_url": "https://res.cloudinary.com/cjt4xpst/image/upload/v12345/Tugas/6/tugas6_tahap1_7A_Budi.jpg",
      "completed_at": "2026-10-26T10:35:00.000Z"
    },
    "tahap_2": {
      "status": "completed",
      "quiz_answer": "B",
      "screenshot_url": "https://res.cloudinary.com/cjt4xpst/image/upload/v12345/Tugas/6/tugas6_tahap2_7A_Budi.jpg",
      "completed_at": "2026-10-26T10:40:00.000Z"
    },
    "tahap_3": {
      "status": "completed",
      "quiz_answer": "C",
      "screenshot_url": "https://res.cloudinary.com/cjt4xpst/image/upload/v12345/Tugas/6/tugas6_tahap3_7A_Budi.jpg",
      "completed_at": "2026-10-26T10:45:00.000Z"
    }
  },
  "berkas": {
    "tipe": "gambar",
    "format": "jpg",
    "url": "https://res.cloudinary.com/cjt4xpst/image/upload/v12345/Tugas/6/tugas6_tahap3_7A_Budi.jpg",
    "nama_file": "tugas6_tahap3_7A_Budi.jpg"
  },
  "auto_grading": {
    "is_auto_graded": false,
    "kriteria_terpenuhi": ["3_screenshot_terunggah", "kuis_terjawab"],
    "kriteria_kurang": [],
    "catatan_sistem": "Semua bukti screenshot berhasil dikirim. Menunggu verifikasi nilai oleh Admin."
  },
  "custom_state": {
    "needs_teacher_review": true,
    "submitted_screenshots_count": 3
  }
}
```

---

## 5. Alur Penilaian & Keamanan Hak Akses Admin

1. **Pengiriman oleh Siswa**:
   * Saat siswa mengklik tombol "Kumpul Tugas", sistem mencatat baris di `tugas_pengumpulan` dengan `status: 'menunggu_verifikasi'` dan `skor: null`.
   * Karena `skor` bernilai `null`, database trigger `sync_tugas_to_point_logs` **TIDAK** mendistribusikan poin ke leaderboard sebelum disetujui.
2. **Pemeriksaan oleh Admin di `/admin/review-tugas-6`**:
   * Sistem memeriksa `master_siswa.role === 'admin'`. Jika bukan admin, halaman otomatis diblokir.
   * Admin dapat memfilter berdasarkan kelas (misal: 7A, 7B, dst.) dan status pengerjaan.
   * Admin melihat 3 gambar tangkapan layar siswa berdampingan dan dapat mengklik gambar untuk memperbesar (*Lightbox Modal*).
3. **Pemberian Nilai (ACC)**:
   * **1-Click ACC (100 Poin)**: Admin mengklik tombol hijau untuk langsung memberikan nilai 100, mengubah status menjadi `'selesai'`, dan mencatat `graded_at`.
   * Trigger PostgreSQL `sync_tugas_to_point_logs` otomatis aktif, menambahkan audit log ke `point_logs`, dan memperbarui `master_siswa.total_points`.
   * **Minta Revisi**: Jika tangkapan layar buram/salah, admin dapat mengklik tombol "Minta Revisi" dan menulis catatan perbaikan. Siswa dapat mengunggah ulang tahap yang perlu diperbaiki.
