# Dokumentasi Teknis - Tugas 5: Aplikasi Pengolah Kata (Ms. Word) - Pengalaman Belajar di SMPN 2 Singaraja

Modul pembelajaran interaktif pengolah kata dan literasi digital berbasis Kurikulum Merdeka (Aktivitas VII-LD-28-U & VII-LD-29-P) untuk SMP Negeri 2 Singaraja.

---

## 1. Ikhtisar & Tujuan Pembelajaran
* **Judul Tugas**: Pengalaman Belajar di SMPN 2 Singaraja (Ms. Word)
* **Topik Utama**: Pengalaman Belajar di SMPN 2 Singaraja & Ruang Spendaraja
* **Jenis Font Seluruh Dokumen**: Calibri
* **Kategori**: Literasi Digital
* **Kode Tugas**: `TUGAS-05-WORD-PENGALAMAN-BELAJAR`
* **Target Rute**: `/ruang-belajar/tugas/pengolah-kata` (alias `/tugas/pengolah-kata`, `/tugas/word-brosur`)
* **Total Poin**: 100 Poin
  - **Tahap 1: Panduan Praktik 7 Langkah & Checkpoint (14 Poin)**: Menampilkan pratinjau dokumen contoh hasil jadi terproteksi (`PENGALAMAN BELAJAR DI SMPN 2 SINGARAJA.docx`), 7 langkah panduan pembelajaran bertahap alur gulir tunggal (*single-page scrolling feed*) dengan simulasi visual interaktif, threshold membaca ~45 detik per langkah, dan pertanyaan checkpoint pemahaman singkat (+2 poin per langkah = 14 poin).
  - **Tahap 2: Kuis Fitur Microsoft Word (26 Poin)**: 5 soal kuis aplikatif fitur toolbar Word (Perataan Center & Bold [6 pt], Wrap Text Top and Bottom [5 pt], Tabel 3x5 & Shading Header [5 pt], Perataan Justify Ctrl+J [5 pt], format penyimpanan .docx [5 pt]) dengan total 26 poin. Terkunci hingga 7 langkah di Tahap 1 tuntas.
  - **Tahap 3: Praktik Proyek Dokumen .docx & Upload Cloudinary (60 Poin)**: Pembuatan naskah dokumen asli di Microsoft Word, ceklis mandiri 4 kriteria praktik (*Hybrid Auto-Grading*), dan pengumpulan berkas dokumen Word (.docx/.doc) ke Cloudinary preset `tugas_5` folder `Tugas/5`. Terkunci hingga Tahap 1 & 2 selesai.

---

## 2. Struktur File & Modul Komponen

```text
src/
├── data/
│   └── tugas5WordData.js                     # 7 langkah materi Word, checkpoint questions, 5 soal kuis, draf teks cerita, targetFormat (.docx/.doc), & rubrik
├── hooks/RuangBelajar/TugasKhusus/Tugas5/
│   └── useTugasWordState.js                  # State controller, auto-timer langkah aktif, persistensi detail_jawaban Supabase, tombol kumpul & simpan fleksibel, pemulihan state agar bisa dilanjutkan, & toast feedback
├── components/RuangBelajar/TugasKhusus/Tugas5/
│   ├── WordHeader.jsx                        # Header statis mandiri dalam alur dokumen, profil siswa, live total score, & tombol submit (Navbar global disembunyikan di rute tugas)
│   ├── WordStepTabs.jsx                      # 3 tab tahapan belajar dengan strict gating & visual status gembok (Lock)
│   ├── ModalSubmissionSuccessWord.jsx        # Dialog konfirmasi keberhasilan submit & proteksi nilai tertinggi
│   ├── DocxViewerProtected.jsx               # Pratinjau autentik multi-engine: Google Docs Viewer resmi & Lembar A4 Native (Calibri, Tabel 3x5 Shading, Komputer PNG, Anti-Copy & Anti-Download)
│   ├── Tahap1Literasi/
│   │   ├── ReadingTimerIndicator.jsx         # Indikator hitung mundur membaca & progress bar dinamis
│   │   ├── TopicCardFocused.jsx              # Kartu langkah, renderer visual interaktif, & checkpoint soal
│   │   ├── MateriWordLiterasi.jsx            # Koordinator Tahap 1: Pratinjau dokumen terproteksi di awal, scrolling feed, & lock card bertahap
│   │   └── visuals/
│   │       ├── VisualInterfaceWord.jsx       # Langkah 1: Start Screen, Blank Document, Layout A4, Font Calibri 12pt
│   │       ├── VisualJudulSubjudul.jsx        # Langkah 2: Mengetik Judul 20pt Bold Center (Ctrl+E & B) & Subjudul 12pt
│   │       ├── VisualTableIdentitas.jsx       # Langkah 3: Tabel 3x5, Header Shading & Atur Lebar Kolom No
│   │       ├── VisualCeritaPengalaman.jsx     # Langkah 4: Sub-judul Ruang Spendaraja 15pt Bold & Cerita Justify (Ctrl+J)
│   │       ├── VisualFormatKhusus.jsx         # Langkah 5: Bold nama, Italic istilah asing & Pesan Penting Center Bold
│   │       ├── VisualWrapText.jsx             # Langkah 6: Sisip Gambar Komputer PNG & Wrap Text Top and Bottom
│   │       └── VisualSaveExport.jsx          # Langkah 7: Dialog Save As ke Downloads > Kelas > Nama_NoAbsen format nama tugas 5
│   ├── Tahap2Kuis/
│   │   └── KuisMsWord.jsx                    # 5 soal kuis interaktif dengan pembahasan instan & badge skor (26 Poin)
│   └── Tahap3Proyek/
│       ├── ProyekBrosurHut.jsx               # Panduan praktik, rubrik 4 kriteria, toggle pratinjau contoh dokumen jadi, tanpa tombol salin teks
│       └── FormUploadCloudinaryTugas5.jsx    # Drag & drop upload Cloudinary khusus .docx/.doc + Ceklis 4 Verifikasi Mandiri (Hybrid Auto-Grading)
└── pages/TugasKhusus/
    └── TugasWord.jsx                         # Main page controller
```

---

## 3. Rincian 7 Langkah Panduan Praktik Microsoft Word

Setiap langkah menyajikan materi praktis, simulator interaktif visual, indikator waktu membaca aktif, dan 1 soal checkpoint pemahaman singkat (+2 poin per langkah):

1. **Langkah 1: Mengatur Ukuran Kertas & Font Default**
   - Buka Microsoft Word ➔ pilih Blank Document.
   - Klik tab Layout ➔ Size ➔ pilih A4.
   - Klik tab Home, ubah jenis huruf seluruh dokumen menjadi Calibri.
   - Atur ukuran huruf dasar ke 12 pt.
   - Checkpoint: Menu tab Layout ➔ Size ➔ A4 untuk mengubah ukuran kertas.

2. **Langkah 2: Mengetik Judul Utama & Sub-Judul Modul**
   - Atur perataan tulisan Rata Tengah dengan menekan Center (`Ctrl + E`) di tab Home.
   - Ketik judul utama: `PENGALAMAN BELAJAR DI SMPN 2 SINGARAJA`.
   - Blok teks judul, ubah ukurannya menjadi 20 pt dan beri gaya Bold (`Ctrl + B`).
   - Tekan Enter, ketik sub-judul modul: `Modul Latihan Microsoft Word Kelas 7 SMP` (12 pt).
   - Checkpoint: Shortcut `Ctrl + E` (Center) dan `Ctrl + B` (Bold).

3. **Langkah 3: Membuka Bagian 1 & Membuat Tabel Identitas**
   - Tekan Enter, ubah perataan teks kembali ke Rata Kiri (`Ctrl + L`).
   - Ketik sub-judul bagian: `1. IDENTITAS SISWA` (12 pt, di-Bold).
   - Klik tab Insert ➔ Table ➔ pilih ukuran 3 Kolom x 5 Baris (3 x 5).
   - Baris 1 (Header): Isi dengan No, Informasi Siswa, dan Keterangan (12 pt, di-Bold). Beri warna latar belakang (Shading) dari menu Table Design ➔ Shading.
   - Isi baris 2 sampai 5 (Nama Lengkap, Kelas/Absen, Mapel, Hobi).
   - Geser garis kolom No ke arah kiri agar ukurannya pas dan rapi.
   - Checkpoint: Ukuran tabel 3 Kolom x 5 Baris.

4. **Langkah 4: Membuka Bagian 2 & Mengetik Cerita Pengalaman**
   - Tekan Enter di bawah tabel.
   - Ketik sub-judul bagian: `2. CERITA PENGALAMAN BELAJAR` (12 pt, di-Bold).
   - Ketik nama sub-judul platform: `Ruang Spendaraja` (15 pt, di-Bold).
   - Ketik Paragraf 1 dan Paragraf 2 cerita sesuai contoh draf (12 pt).
   - Blok kedua paragraf cerita, klik tombol Justify (`Ctrl + J`) di tab Home agar tulisan rata kanan dan kiri lurus sempurna.
   - Checkpoint: Tombol perataan Justify (`Ctrl + J`) untuk meratakan kedua sisi tepi.

5. **Langkah 5: Memberi Format Teks Khusus (Bold & Italic)**
   - Blok kata `SMPN 2 SINGARAJA` dan `Ruang Spendaraja`, lalu tekan Bold (`Ctrl + B`).
   - Blok istilah asing: `platform online` dan `flexible`, lalu tekan Italic (`Ctrl + I`).
   - Pesan Penting di baris paling bawah: *"Pesan Penting: Keterampilan digital dan pemahaman teknologi adalah kunci utama untuk meraih kesuksesan di masa depan!"*, ubah formatnya menjadi Bold (`Ctrl + B`) dan perataan Center (`Ctrl + E`).
   - Checkpoint: Gaya huruf miring (`Italic` / `Ctrl + I`) pada istilah bahasa asing.

6. **Langkah 6: Sisipkan Gambar Online (Komputer PNG) & Text Wrap**
   - Klik di antara Paragraf 1 dan Paragraf 2 cerita.
   - Klik tab Insert ➔ Pictures ➔ Online Pictures... (atau dari file).
   - Cari kata kunci `komputer png`, pilih 1 gambar komputer transparan (PNG), klik Insert.
   - Klik kanan pada gambar ➔ pilih Wrap Text ➔ **Top and Bottom** agar gambar berada rapi di tengah-tengah memisahkan antar paragraf.
   - Kecilkan ukuran gambar agar pas dan proporsional.
   - Checkpoint: Pengaturan Wrap Text "Top and Bottom".

7. **Langkah 7: Menyimpan Dokumen (Save File)**
   - Klik tab File ➔ pilih Save As (atau tekan F12 / `Ctrl + S`).
   - Klik Browse, cari lokasi folder penyimpanan: Masuk folder Downloads ➔ buka folder Kelas ➔ buka folder Nama_NoAbsen.
   - Pada kolom File name, beri nama dokumen: `tugas 5_nama_noAbsen_pengalaman belajar` (Contoh: `tugas 5_Made_05_pengalaman belajar.docx`).
   - Klik tombol Save.
   - Checkpoint: Format penamaan berkas resmi `tugas 5_nama_noAbsen_pengalaman belajar`.

---

## 4. Komponen `DocxViewerProtected.jsx` (Office Document Viewer Multi-Engine Anti-Copy)

Komponen `DocxViewerProtected.jsx` menyajikan dokumen asli `PENGALAMAN BELAJAR DI SMPN 2 SINGARAJA.docx` yang diunggah ke Cloudinary (`https://res.cloudinary.com/cjt4xpst/raw/upload/v1790653556/Tugas/5/uw52vcknjgpo6z65k9tz.docx`) dengan sistem viewer multi-engine seperti pada portal Ekstra TIK:
* **Pilihan Mesin Pratinjau (Engine Switcher)**:
  1. **Microsoft Office Online Viewer (Utama)**: Merender file `.docx` langsung melalui server resmi Microsoft Office Viewer (`https://view.officeapps.live.com/op/embed.aspx?src=...`) dengan warna font asli, yellow highlight color, tabel, dan gambar yang 100% identik dengan aplikasi desktop Microsoft Word.
  2. **Google Docs Viewer**: Engine alternatif Google Docs (`https://docs.google.com/viewer?url=...&embedded=true`).
  3. **Lembar A4 Terproteksi (Native)**: Pratinjau mandiri lembar kerja A4 dengan warna font `#2B579A`, `#2F5496`, `#C00000`, highlight kuning pada *SMPN 2 SINGARAJA*, tabel header shading, dan gambar komputer transparan PNG.
* **Perlindungan Hak Cipta & Anti-Plagiarisme**:
  - `user-select: none` (`select-none` CSS) dan `pointer-events-none` pada teks konten.
  - `onContextMenu={e => e.preventDefault()}` memblokir klik kanan simpan/copy.
  - `onCopy={e => e.preventDefault()}` dan `onCut={e => e.preventDefault()}` memblokir salin clipboard.
  - Tanpa tombol download berkas naskah.
  - Watermark diagonal samar *"CONTOH RESMI SPENDARAJA • DOKUMEN TERPROTEKSI"*.
* **Fitur Viewer**:
  - Simulasi ribbon & status bar Microsoft Word ("Halaman 1 dari 1 | 185 kata | Bahasa Indonesia").
  - Mode Pratinjau Layar Penuh (*Fullscreen Modal*).

---

## 5. Ringkasan Format Font (Calibri) & Tampilan Bebas Karakter Mentah
* **Judul Utama**: 20 pt (Bold & Center, Warna `#2B579A`)
* **Sub-Judul "Ruang Spendaraja"**: 15 pt (Bold, Warna `#2B579A`)
* **Teks Lainnya (Sub-judul bagian, isi tabel, cerita, pesan)**: 12 pt
* **Highlight Warna Kuning**: Diterapkan pada kata *SMPN 2 SINGARAJA* di paragraf 1.
* **Pesan Penting**: 12 pt Bold Center dengan warna teks merah `#C00000`.
* **Renderer Teks Tanpa `**` Mentah**: Seluruh deskripsi materi pada `TopicCardFocused.jsx` diproses melalui parser `renderFormattedContent` sehingga format tebal (`**...**`), miring (`*...*`), kode, penomoran langkah, dan bullet list tampil dalam elemen visual yang rapi dan mudah dibaca tanpa ada simbol markdown mentah.
* **Integrasi Header Anti-Ketumpuk**: `WordHeader.jsx` dikonfigurasikan dengan `sticky top-14 sm:top-16 z-30` serta `pt-16 sm:pt-20` pada halaman `TugasWord.jsx` agar posisi bar navigasi tugas selalu tampak jelas di bawah navbar portal utama.

---

## 6. Integrasi Database Supabase & Skema `tugas_pengumpulan`

Pengumpulan dan penyimpanan progres pengerjaan Tugas 5 diatur melalui custom hook `useTugasWordState.js` dengan kepatuhan skema tabel resmi PostgreSQL:
* **Tabel Target**: `public.tugas_pengumpulan`
* **Kolom Skema Database yang Digunakan**:
  - `tugas_id` (`uuid`, Foreign Key ke `tugas_master.id`)
  - `siswa_id` (`integer`, Foreign Key ke `master_siswa.id`)
  - `status` (`text`: `'submitted'` jika lengkap atau `'sedang'`)
  - `skor` (`integer`: nilai akumulasi tahap 1, 2, dan 3)
  - `persentase_skor` (`numeric(5,2)`: persentase perolehan nilai)
  - `tautan_tugas` (`text`: tautan berkas dokumen Word di Cloudinary, **bukan `file_url`**)
  - `nama_berkas` (`text`: nama dokumen Word asli siswa)
  - `catatan_siswa` (`text`: catatan opsional dari siswa)
  - `detail_jawaban` (`jsonb`: log lengkap progres checkpoint, waktu baca, jawaban kuis, dan file info)
  - `catatan_guru` (`text`: status/evaluasi otomatis atau catatan guru)
  - `submitted_at` (`timestamptz`: waktu pengiriman pertama)
  - `updated_at` (`timestamptz`: waktu pembaruan terakhir)
* **Kepatuhan Anti-Error PGRST204**: Seluruh payload dibatasi secara ketat hanya pada kolom yang ada di skema database. Dilarang menyertakan kolom non-skema seperti `file_url`, `nisn_siswa`, `nama_siswa`, `kelas_siswa`, atau `nilai_akhir` yang dapat memicu error PostgREST.
* **Mekanisme Penyimpanan**: Menggunakan `upsert` dengan constraint `onConflict: 'tugas_id,siswa_id'` dan fallback `update` per `id` pengumpulan yang sudah tercatat.
* **Sinkronisasi Skor & Poin**: Perubahan baris pada `tugas_pengumpulan` secara otomatis memicu database trigger `trg_sync_tugas_to_point_logs` ➔ `trg_update_master_siswa_total_points`, disinkronkan kembali ke frontend melalui `syncStudentPointsAfterTask`.
