/**
 * Dataset & Konfigurasi Tugas 5: Aplikasi Pengolah Kata (Microsoft Word)
 * Topik: Pengalaman Belajar di SMPN 2 Singaraja & Ruang Spendaraja
 * Jenis Font Seluruh Dokumen: Calibri
 * 
 * Tahap 1: 7 Langkah Praktik Literasi Membaca + Checkpoint (14 Poin = 7 x 2 Poin)
 * Tahap 2: Kuis Pemahaman Fitur & Teknik Ms. Word (26 Poin = 5 Soal)
 * Tahap 3: Praktik Mandiri Dokumen Word (.docx) & Upload Cloudinary (60 Poin)
 * TOTAL = 100 Poin
 */

export const TUGAS_5_CONFIG = {
  id: "6f2a8901-4bc1-4e78-9b55-d1a8e265b489",
  kode_tugas: "TUGAS-05-WORD-BROSUR",
  alias_kode_tugas: "TUGAS-05-WORD-PENGALAMAN-BELAJAR",
  urutan: 5,
  judul: "Tugas 5: Aplikasi Pengolah Kata (Ms. Word) - Pengalaman Belajar di SMPN 2 Singaraja",
  kategori: "Literasi Digital",
  poin_maksimal: 100,
  poin_tahap1_materi: 14, // 7 langkah x 2 poin (checkpoint mudah)
  poin_tahap2_kuis: 26,   // 5 soal (6 + 5 + 5 + 5 + 5)
  poin_tahap3_proyek: 60, // Praktik proyek naskah dokumen Word .docx & upload Cloudinary
  readingThresholdSeconds: 45, // ~45 detik membaca per topik
  cloudinaryPreset: "tugas_5",
  cloudinaryFolder: "Tugas/5",
};

/**
 * 7 Langkah Materi Panduan Praktik Microsoft Word (Kelas 7 SMP)
 * Disajikan dalam 1 alur halaman (Single-page scrolling feed)
 */
export const MATERI_TOPIK_WORD = [
  {
    id: 1,
    topik: "Langkah 1: Mengatur Ukuran Kertas & Font Default",
    subjudul: "Buka Word ➔ Blank Document ➔ Tab Layout Size A4 ➔ Font Calibri 12 pt",
    estimasiWaktu: "45–60 Detik Membaca",
    poin: 2,
    deskripsiSingkat: "Sebelum mulai mengetik, atur halaman dan jenis huruf (font): Buka Word, pilih Blank Document, atur ukuran kertas A4 di tab Layout, lalu ubah jenis huruf ke Calibri 12 pt di tab Home.",
    visualType: "interface_word",
    sections: [
      {
        heading: "1. Membuka Lembar Kerja Baru di Microsoft Word",
        content: `Sebelum mulai mengetik naskah, langkah pertama adalah membuka lembar kerja yang bersih:
* Buka aplikasi **Microsoft Word** pada komputer komputermu.
* Pada layar awal (Start Screen), pilih dan klik ikon **Blank Document (Dokumen Kosong)**.`
      },
      {
        heading: "2. Menentukan Ukuran Kertas A4 & Font Standar (Calibri 12 pt)",
        content: `Setelah lembar kerja terbuka, atur ukuran kertas dan jenis tulisan agar sesuai standar tugas sekolah:
1. **Mengatur Ukuran Kertas**:
   - Klik tab **Layout** pada Ribbon menu bagian atas.
   - Klik menu **Size** ➔ pilih ukuran **A4** (21 cm x 29.7 cm).
2. **Mengatur Jenis Huruf (Font) Seluruh Dokumen**:
   - Klik tab **Home**.
   - Pada kotak jenis font, ubah jenis huruf seluruh dokumen menjadi **Calibri**.
   - Atur ukuran huruf dasar ke **12 pt**.`
      }
    ],
    checkpointQuestion: {
      nomor: 1,
      poin: 2,
      pertanyaan: "Sebelum mulai mengetik, tab menu manakah di Microsoft Word yang digunakan untuk mengubah ukuran kertas menjadi A4?",
      opsi: [
        { id: "A", teks: "Tab Layout ➔ Size ➔ pilih A4" },
        { id: "B", teks: "Tab View ➔ Zoom ➔ pilih 100%" },
        { id: "C", teks: "Tab Review ➔ Translate Language" },
        { id: "D", teks: "Tab Insert ➔ Symbol" }
      ],
      jawabanBenar: "A",
      penjelasan: "Menu tab Layout ➔ Size ➔ A4 digunakan untuk menentukan dimensi lembar kerja standar sebelum mengetik naskah."
    }
  },
  {
    id: 2,
    topik: "Langkah 2: Mengetik Judul Utama & Sub-Judul Modul",
    subjudul: "Perataan Rata Tengah (Ctrl + E), Judul 20 pt Bold (Ctrl + B), Sub-judul 12 pt",
    estimasiWaktu: "45–60 Detik Membaca",
    poin: 2,
    deskripsiSingkat: "Mengatur perataan naskah menjadi Rata Tengah (Center), mengetik judul utama dengan ukuran 20 pt Bold, serta mengetik sub-judul modul berukuran 12 pt.",
    visualType: "judul_subjudul",
    sections: [
      {
        heading: "1. Mengatur Posisi Tengah (Center) & Mengetik Judul Utama",
        content: `Judul dokumen diletakkan simetris di tengah halaman:
* Atur perataan tulisan menjadi **Rata Tengah** dengan menekan tombol **Center (Ctrl + E)** di tab Home.
* Ketik judul utama dengan huruf kapital:
  **PENGALAMAN BELAJAR DI SMPN 2 SINGARAJA**
* Blok teks judul ini dengan mouse, lalu ubah ukurannya menjadi **20 pt** dan beri gaya **Bold (Ctrl + B)** agar terlihat tebal dan tegas.`
      },
      {
        heading: "2. Mengetik Sub-Judul Modul Latihan",
        content: `Setelah judul utama selesai:
* Tekan tombol **Enter** di keyboard untuk membuat baris baru.
* Ketik sub-judul modul:
  *Modul Latihan Microsoft Word Kelas 7 SMP*
* Blok teks sub-judul ini, lalu pastikan ukurannya **12 pt** (tidak perlu ditebalkan/Bold).`
      }
    ],
    checkpointQuestion: {
      nomor: 2,
      poin: 2,
      pertanyaan: "Kombinasi tombol keyboard (shortcut) apakah yang digunakan untuk mengatur posisi tulisan menjadi Rata Tengah (Center) dan menebalkan teks judul (Bold)?",
      opsi: [
        { id: "A", teks: "Ctrl + E (Center) dan Ctrl + B (Bold)" },
        { id: "B", teks: "Ctrl + L (Left) dan Ctrl + U (Underline)" },
        { id: "C", teks: "Ctrl + R (Right) dan Ctrl + I (Italic)" },
        { id: "D", teks: "Ctrl + J (Justify) dan Ctrl + S (Save)" }
      ],
      jawabanBenar: "A",
      penjelasan: "Kombinasi Ctrl + E berfungsi untuk perataan Rata Tengah (Center), sedangkan Ctrl + B berfungsi untuk menebalkan tulisan (Bold)."
    }
  },
  {
    id: 3,
    topik: "Langkah 3: Membuka Bagian 1 & Membuat Tabel Identitas",
    subjudul: "Sub-judul 1. IDENTITAS SISWA, Tabel 3x5, Shading Header & Atur Lebar Kolom",
    estimasiWaktu: "45–60 Detik Membaca",
    poin: 2,
    deskripsiSingkat: "Mengetik sub-judul bagian rata kiri (Ctrl+L), membuat tabel 3 Kolom x 5 Baris via Insert Table, memberi warna latar belakang (Shading) pada header, dan mengisi baris identitas.",
    visualType: "table_identitas",
    sections: [
      {
        heading: "1. Mengetik Sub-Judul Bagian 1",
        content: `Setelah sub-judul modul, kita buat bagian identitas:
* Tekan tombol **Enter**, lalu ubah perataan teks kembali ke **Rata Kiri (Ctrl + L)**.
* Ketik sub-judul bagian: **1. IDENTITAS SISWA** (Ukuran 12 pt, di-Bold).`
      },
      {
        heading: "2. Membuat Tabel (3 Kolom x 5 Baris) & Memberi Shading Header",
        content: `Langkah menyusun tabel identitas siswa:
1. **Membuat Tabel**:
   - Klik tab **Insert** ➔ klik tombol **Table** ➔ pilih ukuran **3 Kolom x 5 Baris (3 x 5)**.
2. **Mengisi & Merapikan Baris Header (Baris 1)**:
   - Isi sel dengan: **No**, **Informasi Siswa**, dan **Keterangan** (Ukuran 12 pt, di-Bold).
   - Blok Baris Header (Baris 1), lalu beri warna latar belakang dari menu **Table Design ➔ Shading** (pilih warna biru atau abu-abu terang).
3. **Mengisi Baris Data (Baris 2 sampai 5 - ukuran 12 pt)**:
   - Baris 2: 1 | Nama Lengkap | .................................................................
   - Baris 3: 2 | Kelas / No. Absen | 7. ..... / .....
   - Baris 4: 3 | Mata Pelajaran | Informatika
   - Baris 5: 4 | Hobi / Minat | .................................................................
4. **Merapikan Garis Kolom**:
   - Geser garis pembatas kolom No ke kiri agar ukurannya pas dan rapi.`
      }
    ],
    checkpointQuestion: {
      nomor: 3,
      poin: 2,
      pertanyaan: "Berapakah ukuran kolom dan baris tabel yang dipilih pada menu Insert ➔ Table untuk memuat identitas siswa tersebut?",
      opsi: [
        { id: "A", teks: "3 Kolom x 5 Baris (3 x 5)" },
        { id: "B", teks: "5 Kolom x 3 Baris (5 x 3)" },
        { id: "C", teks: "2 Kolom x 4 Baris (2 x 4)" },
        { id: "D", teks: "4 Kolom x 2 Baris (4 x 2)" }
      ],
      jawabanBenar: "A",
      penjelasan: "Tabel dibuat dengan ukuran 3 Kolom (No, Informasi Siswa, Keterangan) dan 5 Baris (1 baris header + 4 baris isian data)."
    }
  },
  {
    id: 4,
    topik: "Langkah 4: Membuka Bagian 2 & Mengetik Cerita Pengalaman",
    subjudul: "Sub-judul 2. CERITA PENGALAMAN BELAJAR, Ruang Spendaraja (15 pt Bold), & Paragraf Justify",
    estimasiWaktu: "45–60 Detik Membaca",
    poin: 2,
    deskripsiSingkat: "Mengetik sub-judul bagian 2, nama platform Ruang Spendaraja dengan ukuran 15 pt Bold, mengetik 2 paragraf cerita, lalu merapikan dengan format Justify (Ctrl + J).",
    visualType: "cerita_justify",
    sections: [
      {
        heading: "1. Mengetik Sub-Judul Bagian 2 & Nama Platform",
        content: `Setelah tabel selesai dibuat:
* Tekan tombol **Enter** di bawah tabel.
* Ketik sub-judul bagian: **2. CERITA PENGALAMAN BELAJAR** (Ukuran 12 pt, di-Bold).
* Tekan tombol Enter, lalu ketik nama sub-judul platform: **Ruang Spendaraja**
* Blok kata *Ruang Spendaraja* ini, lalu ubah ukurannya menjadi **15 pt** dan beri gaya **Bold (Ctrl + B)**.`
      },
      {
        heading: "2. Mengetik Paragraf Cerita & Merapikan dengan Justify (Ctrl + J)",
        content: `Ketik kedua paragraf cerita dengan ukuran 12 pt:
* **Paragraf 1**:
  "Masuk sebagai siswa baru di SMPN 2 SINGARAJA memberikan pengalaman belajar yang sangat berkesan. Salah satu pelajaran yang paling aku tunggu adalah Informatika. Di kelas ini, kami tidak hanya belajar teori saja, tetapi juga langsung mempraktikkan cara menggunakan perangkat komputer dan menyusun dokumen dengan rapi."
* **Paragraf 2**:
  "Hal yang paling menarik adalah saat guru menggunakan web interaktif Ruang Spendaraja untuk menyampaikan materi serta memberikan tugas. Melalui platform online ini, suasana belajar menjadi lebih flexible, interaktif, dan menyenangkan bagi seluruh siswa."
* **Merapikan Paragraf (Justify)**:
  - Blok kedua paragraf cerita tersebut.
  - Klik tombol **Justify (Ctrl + J)** di tab Home agar tepi kanan dan tepi kiri tulisan rata lurus rapi.`
      }
    ],
    checkpointQuestion: {
      nomor: 4,
      poin: 2,
      pertanyaan: "Untuk membuat tulisan paragraf cerita pengalaman menjadi rapi rata di sisi kanan dan sisi kiri secara bersamaan, tombol perataan apa yang digunakan?",
      opsi: [
        { id: "A", teks: "Justify (Ctrl + J)" },
        { id: "B", teks: "Align Left (Ctrl + L)" },
        { id: "C", teks: "Center (Ctrl + E)" },
        { id: "D", teks: "Align Right (Ctrl + R)" }
      ],
      jawabanBenar: "A",
      penjelasan: "Tombol Justify (Ctrl + J) di tab Home membuat tulisan lurus dan rata di kedua sisi tepi (kiri dan kanan), sehingga naskah terlihat rapi standar buku."
    }
  },
  {
    id: 5,
    topik: "Langkah 5: Memberi Format Teks Khusus (Bold & Italic)",
    subjudul: "Bold Nama Sekolah/Platform, Italic Istilah Asing, & Pesan Penting Center",
    estimasiWaktu: "45–60 Detik Membaca",
    poin: 2,
    deskripsiSingkat: "Menebalkan kata penting (SMPN 2 SINGARAJA dan Ruang Spendaraja), memiringkan istilah asing (platform online dan flexible), serta memformat Pesan Penting menjadi Bold dan Center.",
    visualType: "format_khusus",
    sections: [
      {
        heading: "1. Menebalkan Kata Penting (Bold / Ctrl + B)",
        content: `Tebalkan kata-kata kunci nama sekolah dan platform:
* Blok kata **SMPN 2 SINGARAJA** di dalam paragraf 1 cerita, lalu tekan **Bold (Ctrl + B)**.
* Blok kata **Ruang Spendaraja** di dalam paragraf 2 cerita, lalu tekan **Bold (Ctrl + B)**.`
      },
      {
        heading: "2. Memiringkan Istilah Asing (Italic / Ctrl + I) & Pesan Penting",
        content: `Beri format penulisan khusus pada istilah bahasa asing:
* Blok kata *platform online*, lalu tekan **Italic (Ctrl + I)**.
* Blok kata *flexible*, lalu tekan **Italic (Ctrl + I)**.

**Mengetik Pesan Penting di Bagian Paling Bawah (12 pt):**
* Buat baris baru di bawah cerita, lalu ketik kalimat berikut:
  *"Pesan Penting: Keterampilan digital dan pemahaman teknologi adalah kunci utama untuk meraih kesuksesan di masa depan!"*
* Blok kalimat pesan tersebut, ubah formatnya menjadi **Bold (Ctrl + B)** dan beri perataan **Center (Ctrl + E)**.`
      }
    ],
    checkpointQuestion: {
      nomor: 5,
      poin: 2,
      pertanyaan: "Format gaya tulisan apakah yang diberikan pada istilah asing seperti 'platform online' dan 'flexible' di Microsoft Word?",
      opsi: [
        { id: "A", teks: "Italic (Tulisan Miring / Ctrl + I)" },
        { id: "B", teks: "Bold (Tulisan Tebal / Ctrl + B)" },
        { id: "C", teks: "Underline (Garis Bawah / Ctrl + U)" },
        { id: "D", teks: "Strikethrough (Coret Tengah)" }
      ],
      jawabanBenar: "A",
      penjelasan: "Istilah bahasa asing atau istilah teknis pada penulisan dokumen resmi wajib diformat menggunakan huruf miring (Italic / Ctrl + I)."
    }
  },
  {
    id: 6,
    topik: "Langkah 6: Sisipkan Gambar Online (Komputer PNG) & Text Wrap",
    subjudul: "Insert Pictures 'komputer png' & Wrap Text: Top and Bottom",
    estimasiWaktu: "45–60 Detik Membaca",
    poin: 2,
    deskripsiSingkat: "Menyisipkan 1 gambar komputer transparan (PNG) di antara Paragraf 1 dan Paragraf 2, lalu mengatur posisi dengan Wrap Text 'Top and Bottom'.",
    visualType: "wrap_text",
    sections: [
      {
        heading: "1. Menyisipkan Gambar Komputer Online (Insert Pictures)",
        content: `Menyisipkan gambar komputer di antara paragraf cerita:
1. Letakkan kursor mouse dengan mengklik baris kosong di antara **Paragraf 1** dan **Paragraf 2**.
2. Klik tab **Insert** ➔ klik tombol **Pictures** ➔ pilih **Online Pictures...** (atau dari komputer jika sudah ada).
3. Ketik kata kunci pencarian: **komputer png**, lalu tekan tombol Enter.
4. Pilih 1 gambar komputer dengan latar belakang transparan (PNG) yang paling menarik sesuai kreativitasmu, lalu klik tombol **Insert**.`
      },
      {
        heading: "2. Mengatur Posisi Gambar (Wrap Text ➔ Top and Bottom)",
        content: `Agar gambar tidak merusak baris ketikan dan berada rapi memisahkan antar paragraf:
1. Klik kanan pada gambar komputer yang baru muncul ➔ arahkan ke pilihan **Wrap Text** ➔ pilih **Top and Bottom**.
2. Dengan pilihan *Top and Bottom*, teks paragraf 1 berada di atas gambar dan teks paragraf 2 berada di bawah gambar secara rapi.
3. Atur atau kecilkan ukuran gambar dengan menarik titik bulat di sudut gambar agar tidak terlalu memakan tempat.`
      }
    ],
    checkpointQuestion: {
      nomor: 6,
      poin: 2,
      pertanyaan: "Pengaturan 'Wrap Text' apakah yang dipilih agar gambar komputer berada rapi di tengah-tengah memisahkan Paragraf 1 dan Paragraf 2?",
      opsi: [
        { id: "A", teks: "Top and Bottom" },
        { id: "B", teks: "Behind Text" },
        { id: "C", teks: "In Front of Text" },
        { id: "D", teks: "Through" }
      ],
      jawabanBenar: "A",
      penjelasan: "Pilihan Wrap Text 'Top and Bottom' membatasi teks agar hanya berada di atas dan di bawah gambar, sehingga gambar berada rapi di sela antar paragraf."
    }
  },
  {
    id: 7,
    topik: "Langkah 7: Menyimpan Dokumen (Save File)",
    subjudul: "File ➔ Save As (F12 / Ctrl + S) ➔ Folder Downloads > Kelas > Nama_NoAbsen ➔ Format .docx",
    estimasiWaktu: "45–60 Detik Membaca",
    poin: 2,
    deskripsiSingkat: "Menyimpan file dokumen ke folder komputer dengan struktur Downloads > Kelas > Nama_NoAbsen menggunakan format nama 'tugas 5_nama_noAbsen_pengalaman belajar'.",
    visualType: "save_export",
    sections: [
      {
        heading: "1. Membuka Menu Penyimpanan (Save As)",
        content: `Menyimpan hasil karya naskah latihanmu ke komputer:
* Klik tab **File** pada pojok kiri atas Ribbon, lalu pilih menu **Save As** (atau tekan tombol pintas **F12** / **Ctrl + S**).
* Klik tombol **Browse** untuk membuka jendela penjelajah folder penyimpanan.`
      },
      {
        heading: "2. Menentukan Folder Penyimpanan & Format Nama Berkas",
        content: `Cari lokasi folder penyimpanan dengan urutan folder berikut:
1. Masuk ke folder **Downloads**.
2. Buka folder **Kelas** kamu (misal: Kelas 7A).
3. Buka folder **Nama_NoAbsen** kamu.
4. Pada kolom **File name**, ketik nama dokumen sesuai format berikut:
   **tugas 5_nama_noAbsen_pengalaman belajar**
   *(Contoh: tugas 5_Made_05_pengalaman belajar)*
5. Pastikan tipe file bertuliskan **Word Document (*.docx)**.
6. Klik tombol **Save**.`
      }
    ],
    checkpointQuestion: {
      nomor: 7,
      poin: 2,
      pertanyaan: "Sesuai panduan penyimpanan, bagaimana format penulisan nama berkas (File name) yang benar saat menyimpan dokumen latihan ke folder komputer?",
      opsi: [
        { id: "A", teks: "tugas 5_nama_noAbsen_pengalaman belajar (Contoh: tugas 5_Made_05_pengalaman belajar)" },
        { id: "B", teks: "dokumen_latihan_baru.txt" },
        { id: "C", teks: "tugas_tik_tanpa_nama_absen" },
        { id: "D", teks: "microsoft_word_kelas7.pdf" }
      ],
      jawabanBenar: "A",
      penjelasan: "Format penulisan nama berkas resmi adalah 'tugas 5_nama_noAbsen_pengalaman belajar' agar berkas mudah diidentifikasi saat diunggah ke sistem."
    }
  }
];

/**
 * 5 Soal Kuis Pemahaman Fitur & Teknik Ms. Word (Tahap 2: 26 Poin)
 * Q1: 6 Poin, Q2-Q5: masing-masing 5 Poin (6 + 5 + 5 + 5 + 5 = 26 Poin)
 */
export const KUIS_MS_WORD_QUESTIONS = [
  {
    id: "q1",
    nomor: 1,
    poin: 6,
    kategori: "Shortcut & Perataan Teks",
    pertanyaan: "Kombinasi tombol keyboard (shortcut) apakah yang digunakan untuk mengatur posisi teks menjadi Rata Tengah (Center) dan menebalkan tulisan (Bold) di Microsoft Word?",
    opsi: [
      { id: "A", teks: "Ctrl + L untuk Center dan Ctrl + I untuk Bold" },
      { id: "B", teks: "Ctrl + E untuk Center dan Ctrl + B untuk Bold" },
      { id: "C", teks: "Ctrl + R untuk Center dan Ctrl + U untuk Bold" },
      { id: "D", teks: "Ctrl + J untuk Center dan Ctrl + S untuk Bold" }
    ],
    jawabanBenar: "B",
    penjelasan: "Shortcut Ctrl + E digunakan untuk perataan Center (tengah), sedangkan Ctrl + B digunakan untuk gaya tulisan Bold (tebal)."
  },
  {
    id: "q2",
    nomor: 2,
    poin: 5,
    kategori: "Manipulasi Gambar & Wrap Text",
    pertanyaan: "Setelah memasukkan gambar komputer PNG melalui menu Insert > Pictures, pengaturan 'Wrap Text' apa yang membuat gambar berada rapi di tengah-tengah memisahkan Paragraf 1 dan Paragraf 2?",
    opsi: [
      { id: "A", teks: "In Line with Text" },
      { id: "B", teks: "Top and Bottom" },
      { id: "C", teks: "Behind Text" },
      { id: "D", teks: "Through" }
    ],
    jawabanBenar: "B",
    penjelasan: "Pilihan 'Top and Bottom' memisahkan aliran teks di sisi atas dan bawah gambar, sehingga gambar berada di sela antar paragraf dengan rapi."
  },
  {
    id: "q3",
    nomor: 3,
    poin: 5,
    kategori: "Tabel & Shading",
    pertanyaan: "Fitur apakah pada Microsoft Word yang digunakan untuk memberikan warna latar belakang (arsiran warna) pada baris judul (header) tabel identitas siswa?",
    opsi: [
      { id: "A", teks: "Table Design ➔ Shading" },
      { id: "B", teks: "Insert ➔ WordArt" },
      { id: "C", teks: "Review ➔ Spelling" },
      { id: "D", teks: "View ➔ Gridlines" }
    ],
    jawabanBenar: "A",
    penjelasan: "Menu Table Design ➔ Shading berfungsi untuk memberi warna latar belakang pada sel atau baris tabel yang sedang diblok."
  },
  {
    id: "q4",
    nomor: 4,
    poin: 5,
    kategori: "Perataan Paragraf",
    pertanyaan: "Untuk membuat tulisan paragraf cerita naskah menjadi rapi rata lurus di kedua sisi tepi (tepi kanan dan tepi kiri), fitur perataan teks apa yang digunakan?",
    opsi: [
      { id: "A", teks: "Justify (Ctrl + J)" },
      { id: "B", teks: "Align Left (Ctrl + L)" },
      { id: "C", teks: "Center (Ctrl + E)" },
      { id: "D", teks: "Align Right (Ctrl + R)" }
    ],
    jawabanBenar: "A",
    penjelasan: "Perintah Justify (Ctrl + J) meratakan susunan kata di sisi kiri dan kanan margin kertas sehingga menghasilkan paragraf yang rapi dan profesional."
  },
  {
    id: "q5",
    nomor: 5,
    poin: 5,
    kategori: "Penyimpanan & Format Berkas",
    pertanyaan: "Format berkas dokumen standar Microsoft Word yang menyimpan hasil ketikan teks, tabel identitas, dan gambar komputer agar dapat diedit kembali adalah...",
    opsi: [
      { id: "A", teks: ".mp3 (File Suara)" },
      { id: "B", teks: ".docx (Word Document)" },
      { id: "C", teks: ".jpg (Gambar)" },
      { id: "D", teks: ".zip (Arsip Kompresi)" }
    ],
    jawabanBenar: "B",
    penjelasan: "Format dokumen resmi Microsoft Word adalah .docx yang menyimpan struktur teks, tabel, dan gambar sehingga dapat dibuka dan diedit kembali."
  }
];

/**
 * Petunjuk Praktik Proyek Dokumen Word: Pengalaman Belajar di SMPN 2 Singaraja (Tahap 3: 60 Poin)
 */
export const PROYEK_BROSUR_DATA = {
  judulProyek: "Proyek Praktik Microsoft Word: Pengalaman Belajar di SMPN 2 Singaraja & Ruang Spendaraja",
  deskripsi: "Praktikkan 7 langkah panduan Microsoft Word yang telah kamu pelajari (mengatur kertas A4, font Calibri, membuat tabel identitas 3x5, mengetik cerita Justify, format Bold/Italic, menyisipkan gambar komputer PNG dengan Wrap Text Top & Bottom, dan menyimpan file .docx).",
  aktivitasRef: "Aktivitas VII-LD-28-U & VII-LD-29-P (Praktik Microsoft Word)",
  targetFormat: [".docx", ".doc"],
  ringkasanFont: [
    { target: "Judul Utama", ukuran: "20 pt", style: "Bold & Center (Ctrl + B & Ctrl + E)" },
    { target: "Sub-Judul Platform 'Ruang Spendaraja'", ukuran: "15 pt", style: "Bold (Ctrl + B)" },
    { target: "Teks Lainnya (Sub-judul bagian, isi tabel, cerita, pesan)", ukuran: "12 pt", style: "Calibri Standar" }
  ],
  rubrikPenilaian: [
    { kriteria: "Ukuran Kertas & Judul Utama", bobot: "15 Poin", desc: "Halaman berukuran A4, seluruh font Calibri, judul 20 pt Bold Center, dan sub-judul modul 12 pt." },
    { kriteria: "Tabel Identitas Siswa 3x5", bobot: "15 Poin", desc: "Tabel 3 kolom x 5 baris tersusun rapi, baris header memiliki Shading warna, dan garis kolom disesuaikan." },
    { kriteria: "Cerita Pengalaman & Format Khusus", bobot: "15 Poin", desc: "Sub-judul 15 pt Bold, paragraf Justify, Bold pada nama sekolah/platform, Italic istilah asing, dan Pesan Penting Center." },
    { kriteria: "Sisip Gambar Komputer PNG & File .docx", bobot: "15 Poin", desc: "Gambar komputer PNG disisipkan dengan Wrap Text Top and Bottom, berkas disimpan dengan format nama tugas 5_nama_noAbsen_pengalaman belajar.docx." }
  ],
  drafTeksDokumen: `PENGALAMAN BELAJAR DI SMPN 2 SINGARAJA
Modul Latihan Microsoft Word Kelas 7 SMP

1. IDENTITAS SISWA
[Tabel 3 Kolom x 5 Baris: No | Informasi Siswa | Keterangan]

2. CERITA PENGALAMAN BELAJAR
Ruang Spendaraja

Masuk sebagai siswa baru di SMPN 2 SINGARAJA memberikan pengalaman belajar yang sangat berkesan. Salah satu pelajaran yang paling aku tunggu adalah Informatika. Di kelas ini, kami tidak hanya belajar teori saja, tetapi juga langsung mempraktikkan cara menggunakan perangkat komputer dan menyusun dokumen dengan rapi.

[Sisipkan Gambar Komputer PNG - Wrap Text: Top and Bottom]

Hal yang paling menarik adalah saat guru menggunakan web interaktif Ruang Spendaraja untuk menyampaikan materi serta memberikan tugas. Melalui platform online ini, suasana belajar menjadi lebih flexible, interaktif, dan menyenangkan bagi seluruh siswa.

"Pesan Penting: Keterampilan digital dan pemahaman teknologi adalah kunci utama untuk meraih kesuksesan di masa depan!"`
};
