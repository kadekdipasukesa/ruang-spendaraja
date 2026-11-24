/**
 * SOAL POOL RESMI TUGAS 7 / ULANGAN INFORMATIKA KELAS VII
 * PAKET LATIHAN PARALEL (SET B) - SMP NEGERI 2 SINGARAJA
 * 
 * Total: 50 Pilihan Ganda (PG) & 5 Esai/Uraian
 * Dilengkapi: Kunci Jawaban Resmi, Pembahasan Singkat, dan Bahan Bacaan Pendamping Asisten AI
 * Standar Schema v2.0 Ruang Spendaraja
 */

// Import Aset Gambar Diagram Soal (PNG jernih untuk Soal 02, 15, 18, 21, 36)
import imgSoal02 from './assets/soal_02_robot_grid.png';
import imgSoal14 from './assets/soal_14_arsitektur_komputer.svg';
import imgSoal15 from './assets/soal_15_komponen_hardware.png';
import imgSoal17 from './assets/soal_17_hubungan_komponen.svg';
import imgSoal18 from './assets/soal_18_ikon_software.png';
import imgSoal21 from './assets/soal_21_alur_ascii_cpu.png';
import imgSoal27 from './assets/soal_27_hierarki_folder.svg';
import imgSoal29 from './assets/soal_29_ribbon_word.svg';
import imgSoal36 from './assets/soal_36_compose_email.png';

// URL Cloudinary CDN Permanen (Mencegah kendala 404 saat redeploy/rebuild Vite di Vercel)
export const CLOUDINARY_DIAGRAM_MAP = {
  imgSoal02: 'https://res.cloudinary.com/cjt4xpst/image/upload/v1795504386/Tugas/7/assets/soal_02_robot_grid.png',
  imgSoal14: 'https://res.cloudinary.com/cjt4xpst/raw/upload/v1795504387/Tugas/7/assets/soal_14_arsitektur_komputer.svg',
  imgSoal15: 'https://res.cloudinary.com/cjt4xpst/image/upload/v1795504387/Tugas/7/assets/soal_15_komponen_hardware.png',
  imgSoal17: 'https://res.cloudinary.com/cjt4xpst/raw/upload/v1795504388/Tugas/7/assets/soal_17_hubungan_komponen.svg',
  imgSoal18: 'https://res.cloudinary.com/cjt4xpst/image/upload/v1795504389/Tugas/7/assets/soal_18_ikon_software.png',
  imgSoal21: 'https://res.cloudinary.com/cjt4xpst/image/upload/v1795504390/Tugas/7/assets/soal_21_alur_ascii_cpu.png',
  imgSoal27: 'https://res.cloudinary.com/cjt4xpst/raw/upload/v1795504390/Tugas/7/assets/soal_27_hierarki_folder.svg',
  imgSoal29: 'https://res.cloudinary.com/cjt4xpst/raw/upload/v1795504391/Tugas/7/assets/soal_29_ribbon_word.svg',
  imgSoal36: 'https://res.cloudinary.com/cjt4xpst/image/upload/v1795504392/Tugas/7/assets/soal_36_compose_email.png',
};

export const SOAL_POOL_PG = [
  // 1
  {
    id: "PG_01",
    nomor: 1,
    kategori: "Berpikir Komputasional",
    teks: "Dalam berpikir komputasional, menyarikan bagian penting dari suatu permasalahan dan mengabaikan detail yang tidak relevan agar kita lebih fokus pada solusi utama disebut ....",
    gambar: null,
    opsi: ["Dekomposisi", "Abstraksi", "Pengenalan pola", "Algoritma"],
    kunci: "Abstraksi",
    kunci_huruf: "B",
    pembahasan: "Abstraksi adalah teknik menyaring informasi inti yang paling penting dan mengabaikan detail kecil yang tidak relevan.",
    bahan_bacaan: {
      judul: "Empat Fondasi Berpikir Komputasional",
      konten: "Terdapat empat teknik utama untuk menyelesaikan masalah secara sistematis: (1) Dekomposisi, memecah masalah besar menjadi bagian-bagian kecil agar mudah dikelola; (2) Pengenalan Pola, mencari kesamaan atau tren dari masalah sejenis; (3) Abstraksi, menyaring informasi inti yang paling penting dan mengabaikan detail kecil yang tidak relevan; serta (4) Algoritma, menyusun urutan langkah logis dari awal hingga akhir."
    }
  },
  // 2
  {
    id: "PG_02",
    nomor: 2,
    kategori: "Berpikir Komputasional",
    teks: "Perhatikan gambar papan permainan Robot Manual 5x5 berikut! Robot berada di petak A1 menghadap ke Atas (↑). Agar robot dapat mengambil buah Jeruk (C2), menghindari rintangan Batu (A3 dan C1), lalu berhenti di petak FINIS (C4), urutan perintah yang tepat adalah ....",
    gambar: CLOUDINARY_DIAGRAM_MAP.imgSoal02 || imgSoal02,
    gambar_fallback: imgSoal02,
    opsi: [
      "Maju 2 langkah → Putar 90° kanan → Maju 2 langkah → Putar 90° kiri → Maju 1 langkah",
      "Maju 1 langkah → Putar 90° kanan → Maju 2 langkah → Putar 90° kiri → Maju 2 langkah",
      "Maju 1 langkah → Putar 90° kiri → Maju 2 langkah → Putar 90° kanan → Maju 2 langkah",
      "Putar 90° kanan → Maju 2 langkah → Putar 90° kiri → Maju 3 langkah → Bilang Selesai"
    ],
    kunci: "Maju 1 langkah → Putar 90° kanan → Maju 2 langkah → Putar 90° kiri → Maju 2 langkah",
    kunci_huruf: "B",
    pembahasan: "Maju 1 langkah ke A2 → Putar 90° kanan menghadap Timur → Maju 2 langkah ke C2 (ambil jeruk) → Putar 90° kiri menghadap Utara → Maju 2 langkah ke C4 (FINIS).",
    bahan_bacaan: {
      judul: "Navigasi Arah Robot pada Papan Berpetak (Grid)",
      konten: "Perintah Maju N langkah memindahkan karakter searah mata panah hadapnya saat ini. Perintah Putar 90° kanan memutar arah hadap 90 derajat searah jarum jam (misal: dari Atas menjadi Kanan), sedangkan Putar 90° kiri memutar arah hadap 90 derajat berlawanan arah jarum jam (misal: dari Kanan menjadi Atas) tanpa berpindah petak. Pastikan jalur tidak menabrak petak rintangan."
    }
  },
  // 3
  {
    id: "PG_03",
    nomor: 3,
    kategori: "Berpikir Komputasional",
    teks: "Seorang siswa memiliki beberapa aktivitas pekerjaan rumah: (1) Mencuci pakaian dengan mesin cuci otomatis (40 menit), (2) Menyapu dan mengepel lantai (20 menit), serta (3) Merapikan kamar tidur (15 menit). Apabila menyapu, mengepel, dan merapikan kamar dapat dilakukan bersamaan saat mesin cuci berputar tanpa pengawasan penuh (paralel), maka waktu paling singkat untuk menyelesaikan seluruh aktivitas tersebut adalah ....",
    gambar: null,
    opsi: ["75 menit", "40 menit", "35 menit", "60 menit"],
    kunci: "40 menit",
    kunci_huruf: "B",
    pembahasan: "Tugas lain selesai dalam 20 + 15 = 35 menit, selesai secara paralel saat mesin cuci berputar selama 40 menit. Jadi total waktu tersingkat adalah 40 menit.",
    bahan_bacaan: {
      judul: "Optimasi Penjadwalan Paralel vs Seri",
      konten: "Dalam mengelola beberapa aktivitas, pekerjaan yang bersifat otomatis atau tidak memerlukan pengawasan penuh (seperti memasak nasi di rice cooker atau mencuci dengan mesin cuci otomatis) dapat dijalankan bersamaan (paralel) dengan pekerjaan manual lainnya. Total waktu tersingkat ditentukan oleh durasi pekerjaan terpanjang jika seluruh pekerjaan pendamping muat di dalam rentang waktu tunggu tersebut."
    }
  },
  // 4
  {
    id: "PG_04",
    nomor: 4,
    kategori: "Berpikir Komputasional",
    teks: "Terdapat beberapa wadah dengan total volume air 36 liter yang harus diisi penuh. Tersedia 2 buah keran air yang masing-masing mengalirkan air dengan kecepatan debit yang sama yaitu 2 liter per menit secara bersamaan tanpa jeda. Waktu paling cepat yang dibutuhkan untuk mengisi seluruh wadah hingga penuh adalah ....",
    gambar: null,
    opsi: ["18 menit", "9 menit", "12 menit", "6 menit"],
    kunci: "9 menit",
    kunci_huruf: "B",
    pembahasan: "Total 36 liter dibagi 2 keran dengan debit total 4 liter/menit (2 × 2) = 9 menit.",
    bahan_bacaan: {
      judul: "Alokasi Sumber Daya & Kapasitas Pengisian",
      konten: "Untuk mencari waktu tercepat mengisi beberapa wadah menggunakan keran berkecepatan sama, hitunglah terlebih dahulu total volume seluruh wadah yang harus diisi, lalu bagilah dengan total kecepatan aliran seluruh keran yang bekerja secara bersamaan tanpa jeda waktu. Pastikan tidak ada keran yang menganggur selama masih ada wadah yang belum penuh."
    }
  },
  // 5
  {
    id: "PG_05",
    nomor: 5,
    kategori: "Struktur Data",
    teks: "Dalam konsep struktur data daftar (list), terdapat daftar terurut dan tidak terurut. Contoh kumpulan data berikut yang paling tepat dikategorikan sebagai daftar tidak terurut karena urutan pengambilannya tidak memengaruhi hasil akhir adalah ....",
    gambar: null,
    opsi: [
      "Urutan langkah-langkah membuat kue bolu",
      "Daftar nomor induk siswa yang disusun berdasarkan tanggal lahir",
      "Daftar barang belanjaan yang harus dibeli di pasar",
      "Urutan bab dan subbab dalam daftar isi buku cetak"
    ],
    kunci: "Daftar barang belanjaan yang harus dibeli di pasar",
    kunci_huruf: "C",
    pembahasan: "Daftar belanjaan ke pasar tidak wajib berurutan karena barang mana saja yang dibeli terlebih dahulu tidak merusak hasil akhir seluruh kebutuhan terbeli.",
    bahan_bacaan: {
      judul: "Struktur Data Daftar (List) Terurut dan Tidak Terurut",
      konten: "Di dalam Informatika, kumpulan item yang disimpan dalam bentuk daftar memiliki dua sifat: daftar tidak terurut (urutan pengambilan item tidak memengaruhi hasil akhir, seperti isi kotak pensil atau daftar belanjaan pasar) dan daftar terurut (urutan langkah atau posisi item wajib mengikuti aturan tertentu agar tidak terjadi kesalahan proses)."
    }
  },
  // 6
  {
    id: "PG_06",
    nomor: 6,
    kategori: "Struktur Data",
    teks: "Perhatikan data rantai simpul (linked list) pengiriman kode rahasia berikut!\n- Simpul Awal (Head): Raka menyimpan karakter 'S' dan menunjuk ke Tika\n- Tika menyimpan karakter 'A' dan menunjuk ke Wira\n- Wira menyimpan karakter 'N' dan menunjuk ke Vina\n- Vina menyimpan karakter 'D' dan menunjuk ke Sinta\n- Sinta menyimpan karakter 'I' dan menunjuk ke Null (ujung rantai)\nKata sandi rahasia yang terbaca dari penelusuran rantai simpul tersebut dari awal hingga akhir adalah ....",
    gambar: null,
    opsi: ["DINAS", "SANDI", "INDAS", "NASID"],
    kunci: "SANDI",
    kunci_huruf: "B",
    pembahasan: "Rantai simpul: Raka[S] → Tika[A] → Wira[N] → Vina[D] → Sinta[I] menyusun kata SANDI.",
    bahan_bacaan: {
      judul: "Penelusuran Rantai Simpul (Linked List)",
      konten: "Struktur data daftar berantai terdiri atas simpul-simpul (node) yang menyimpan dua bagian: isi data (huruf/angka) dan penunjuk (pointer) menuju simpul berikutnya. Untuk membaca pesan rahasia, mulailah dari simpul pertama (Head), catat hurufnya, lalu ikuti penunjuk ke simpul berikutnya secara berurutan hingga berhenti di simpul terakhir yang tidak menunjuk ke mana pun (Null)."
    }
  },
  // 7
  {
    id: "PG_07",
    nomor: 7,
    kategori: "Sistem Komputer",
    teks: "Data biner merepresentasikan informasi yang hanya mengenal dua kemungkinan kondisi saling berlawanan. Kalimat tanya berikut yang jawabannya paling tepat direpresentasikan langsung menggunakan satu digit biner adalah ....",
    gambar: null,
    opsi: [
      "Siapakah nama wali kelasmu di SMP Negeri 2 Singaraja?",
      "Berapa nomor telepon darurat ambulans di kotamu?",
      "Apakah kamu sudah menyelesaikan tugas Informatika hari ini?",
      "Sebutkan nama-nama perangkat keras masukan komputer!"
    ],
    kunci: "Apakah kamu sudah menyelesaikan tugas Informatika hari ini?",
    kunci_huruf: "C",
    pembahasan: "Pertanyaan tertutup 'Apakah...' dijawab dengan Ya (1) atau Tidak (0), yang langsung selaras dengan konsep biner.",
    bahan_bacaan: {
      judul: "Representasi Kondisi Biner (Ya / Tidak)",
      konten: "Data biner hanya mengenal dua kemungkinan keadaan yang saling berlawanan, seperti Ya (1) atau Tidak (0), Benar atau Salah, dan Aktif atau Nonaktif. Pertanyaan yang dapat direpresentasikan secara langsung dengan biner umumnya berupa kalimat tanya tertutup (misalnya diawali kata \"Apakah...\"), bukan pertanyaan terbuka yang meminta daftar nama atau penjelasan."
    }
  },
  // 8
  {
    id: "PG_08",
    nomor: 8,
    kategori: "Sistem Komputer",
    teks: "Sebuah sistem indikator memiliki 5 buah lampu yang diatur menggunakan kode biner 5-bit dari kiri ke kanan (Lampu 1 sampai Lampu 5). Angka 1 melambangkan lampu menyala dan angka 0 melambangkan lampu padam. Jika kode biner yang dikirimkan adalah 01101, kondisi lampu yang benar adalah ....",
    gambar: null,
    opsi: [
      "Lampu 1, 4 menyala; sedangkan Lampu 2, 3, 5 padam",
      "Lampu 2, 3, dan 5 menyala; sedangkan Lampu 1 dan 4 padam",
      "Semua lampu menyala secara bersamaan",
      "Semua lampu padam kecuali Lampu 1"
    ],
    kunci: "Lampu 2, 3, dan 5 menyala; sedangkan Lampu 1 dan 4 padam",
    kunci_huruf: "B",
    pembahasan: "Kode 01101: Posisi 1 (0/padam), Posisi 2 (1/nyala), Posisi 3 (1/nyala), Posisi 4 (0/padam), Posisi 5 (1/nyala). Maka Lampu 2, 3, dan 5 menyala; Lampu 1 dan 4 padam.",
    bahan_bacaan: {
      judul: "Pengkodean Status Perangkat dengan Bit Biner",
      konten: "Setiap posisi digit (bit) dalam deretan kode biner mewakili satu objek secara berurutan dari kiri ke kanan (misalnya posisi ke-1 untuk objek pertama, posisi ke-2 untuk objek kedua, dst.). Angka 1 melambangkan kondisi aktif/menyala, sedangkan angka 0 melambangkan kondisi nonaktif/padam."
    }
  },
  // 9
  {
    id: "PG_09",
    nomor: 9,
    kategori: "Teknologi Informasi & Komunikasi",
    teks: "Perkembangan pesat teknologi gawai modern memungkinkan satu buah smartphone menggabungkan berbagai fungsi dari peranti konvensional sekaligus. Kelompok perangkat konvensional berikut yang seluruh fungsinya kini telah digabungkan ke dalam smartphone adalah ....",
    gambar: null,
    opsi: [
      "Kamera, radio musik, mesin tik, dan kompas",
      "Kulkas dua pintu, mesin cuci, dispenser, dan oven",
      "Mesin pemotong rumput, pompa air, genset, dan traktor",
      "Papan tulis kayu, proyektor bioskop, dan turbin angin"
    ],
    kunci: "Kamera, radio musik, mesin tik, dan kompas",
    kunci_huruf: "A",
    pembahasan: "Fungsi kamera saku, pemutar radio/musik, mesin ketik teks, dan kompas penunjuk arah semuanya terintegrasi di smartphone.",
    bahan_bacaan: {
      judul: "Konvergensi Fungsi pada Perangkat Gawai Modern",
      konten: "Perkembangan teknologi memungkinkan satu buah smartphone menggabungkan fungsi berbagai perangkat konvensional sekaligus—seperti kamera saku, pemutar musik, mesin tik, surat kabar digital, dan peta navigasi—ke dalam bentuk perangkat lunak aplikasi maupun sensor digital di dalam genggaman."
    }
  },
  // 10
  {
    id: "PG_10",
    nomor: 10,
    kategori: "Teknologi Informasi & Komunikasi",
    teks: "Layanan berbasis teknologi informasi yang memungkinkan seorang pasien berkonsultasi mengenai keluhan kesehatannya dengan dokter spesialis secara daring jarak jauh tanpa harus datang langsung ke rumah sakit disebut ....",
    gambar: null,
    opsi: ["E-Commerce", "Tele-Medicine", "E-Wallet", "E-Learning"],
    kunci: "Tele-Medicine",
    kunci_huruf: "B",
    pembahasan: "Tele-medicine adalah konsultasi dan diagnosis medis jarak jauh melalui jaringan internet.",
    bahan_bacaan: {
      judul: "Ragam Layanan Digital di Berbagai Bidang",
      konten: "Kemajuan TIK melahirkan berbagai layanan spesifik: e-commerce (perdagangan daring), e-wallet (dompet elektronik berbasis aplikasi untuk transaksi pembayaran digital), e-learning (pembelajaran jarak jauh), dan tele-medicine (layanan konsultasi kesehatan dengan dokter secara daring tanpa harus datang langsung ke klinik)."
    }
  },
  // 11
  {
    id: "PG_11",
    nomor: 11,
    kategori: "Sistem Komputer",
    teks: "Urutan satuan ukuran kapasitas media penyimpanan data digital dari yang TERBESAR hingga TERKECIL yang tepat adalah ....",
    gambar: null,
    opsi: [
      "Terabyte (TB) → Gigabyte (GB) → Megabyte (MB) → Kilobyte (KB)",
      "Kilobyte (KB) → Megabyte (MB) → Gigabyte (GB) → Terabyte (TB)",
      "Gigabyte (GB) → Terabyte (TB) → Megabyte (MB) → Kilobyte (KB)",
      "Megabyte (MB) → Kilobyte (KB) → Terabyte (TB) → Gigabyte (GB)"
    ],
    kunci: "Terabyte (TB) → Gigabyte (GB) → Megabyte (MB) → Kilobyte (KB)",
    kunci_huruf: "A",
    pembahasan: "Tingkatan terbesar ke terkecil: TB (Terabyte) > GB (Gigabyte) > MB (Megabyte) > KB (Kilobyte).",
    bahan_bacaan: {
      judul: "Urutan Satuan Kapasitas Penyimpanan Data",
      konten: "Satuan kapasitas memori digital disusun secara bertingkat dari yang terkecil hingga terbesar: Bit → Byte (B) → Kilobyte (KB) → Megabyte (MB) → Gigabyte (GB) → Terabyte (TB) → Petabyte (PB). Setiap kenaikan satu tingkat besarnya setara dengan kelipatan 1.024 (atau dibulatkan 1.000 dalam perhitungan praktis)."
    }
  },
  // 12
  {
    id: "PG_12",
    nomor: 12,
    kategori: "Sistem Komputer",
    teks: "Seorang siswa merekam materi pembelajaran audio setiap hari dengan ukuran berkas rata-rata 250 MB per hari. Jika siswa tersebut merekam selama 20 hari berturut-turut, maka total kapasitas ruang penyimpanan yang dibutuhkan dalam satuan Gigabyte (GB) adalah .... (Asumsi: 1 GB = 1.000 MB)",
    gambar: null,
    opsi: ["2,5 GB", "5 GB", "25 GB", "50 GB"],
    kunci: "5 GB",
    kunci_huruf: "B",
    pembahasan: "250 MB × 20 hari = 5.000 MB = 5 GB.",
    bahan_bacaan: {
      judul: "Perhitungan Kapasitas Memori & Konversi Satuan",
      konten: "Untuk menghitung total kebutuhan ruang penyimpanan selama beberapa hari, kalikan ukuran berkas harian dengan jumlah hari pemakaian. Jika satuan hasil perkalian masih dalam Megabyte (MB) dan perlu diubah ke Gigabyte (GB), bagilah nilai total MB tersebut dengan 1.000 (atau 1.024)."
    }
  },
  // 13
  {
    id: "PG_13",
    nomor: 13,
    kategori: "Sistem Komputer",
    teks: "Dalam aplikasi pengolah angka, seorang guru mengetikkan deretan angka nilai ulangan siswa, kemudian sistem memprosesnya hingga memunculkan grafik diagram batang di layar monitor. Berdasarkan siklus kerja komputer, deretan angka nilai dan tampilan diagram batang tersebut secara berturut-turut berkedudukan sebagai ....",
    gambar: null,
    opsi: [
      "Proses dan Input",
      "Output dan Input",
      "Input dan Output",
      "Penyimpanan dan Proses"
    ],
    kunci: "Input dan Output",
    kunci_huruf: "C",
    pembahasan: "Angka nilai yang dimasukkan adalah Input, sedangkan visualisasi diagram grafik di layar adalah Output.",
    bahan_bacaan: {
      judul: "Siklus Input – Proses – Output pada Aplikasi",
      konten: "Setiap perangkat lunak bekerja berdasarkan alur pengolahan data: pengguna memasukkan bahan mentah melalui peranti masukan (Input), aplikasi mengolah/menghitung data tersebut di dalam sistem (Proses), lalu menyajikan hasilnya dalam bentuk tampilan visual, suara, atau cetakan (Output)."
    }
  },
  // 14
  {
    id: "PG_14",
    nomor: 14,
    kategori: "Sistem Komputer",
    teks: "Perhatikan diagram arsitektur dasar Sistem Komputer berikut! Komponen perangkat keras yang tepat untuk mengisi bagian [ P ] dan bagian [ Q ] secara berturut-turut adalah ....",
    gambar: CLOUDINARY_DIAGRAM_MAP.imgSoal14 || imgSoal14,
    gambar_fallback: imgSoal14,
    opsi: [
      "[P] Monitor & Printer, sedangkan [Q] Keyboard & Mouse",
      "[P] Keyboard & Scanner, sedangkan [Q] Monitor & Speaker",
      "[P] Flashdisk & Harddisk, sedangkan [Q] Power Supply & Casing",
      "[P] Speaker & Proyektor, sedangkan [Q] Mouse & Microphone"
    ],
    kunci: "[P] Keyboard & Scanner, sedangkan [Q] Monitor & Speaker",
    kunci_huruf: "B",
    pembahasan: "Bagian [P] adalah Input Device (Keyboard & Scanner) dan Bagian [Q] adalah Output Device (Monitor & Speaker).",
    bahan_bacaan: {
      judul: "Arsitektur Dasar Sistem Komputer",
      konten: "Sistem komputer memiliki empat blok utama: (1) Peranti Masukan (Input) untuk menangkap data/perintah dari pengguna (contoh: keyboard, mouse, scanner); (2) Peranti Pemroses (CPU & RAM) untuk mengeksekusi instruksi; (3) Peranti Keluaran (Output) untuk menyajikan hasil kepada pengguna (contoh: monitor, printer, speaker); serta (4) Penyimpan Sekunder (SSD/HDD) untuk menyimpan berkas secara permanen."
    }
  },
  // 15
  {
    id: "PG_15",
    nomor: 15,
    kategori: "Sistem Komputer",
    teks: "Perhatikan gambar 4 komponen perangkat keras (hardware) komputer berikut! Pasangan komponen yang berfungsi untuk memproses tampilan grafis/visual pada layar dan komponen yang berfungsi menyimpan berkas secara permanen menggunakan teknologi flash memory berkecepatan tinggi ditunjukkan oleh nomor ....",
    gambar: CLOUDINARY_DIAGRAM_MAP.imgSoal15 || imgSoal15,
    gambar_fallback: imgSoal15,
    opsi: [
      "Nomor [ 1 ] dan Nomor [ 2 ]",
      "Nomor [ 1 ] dan Nomor [ 4 ]",
      "Nomor [ 2 ] dan Nomor [ 3 ]",
      "Nomor [ 3 ] dan Nomor [ 4 ]"
    ],
    kunci: "Nomor [ 2 ] dan Nomor [ 3 ]",
    kunci_huruf: "C",
    pembahasan: "Nomor [2] adalah GPU (Kartu Grafis) untuk pemrosesan tampilan visual layar, dan Nomor [3] adalah Penyimpan SSD untuk penyimpanan berkas permanen berkecepatan tinggi.",
    bahan_bacaan: {
      judul: "Fungsi Komponen Internal Unit Sistem",
      konten: "Di dalam kotak komputer terdapat beberapa komponen fisik utama: CPU (Processor) sebagai otak pengolah instruksi; RAM sebagai memori kerja sementara; GPU (Kartu Grafis) yang dirancang khusus mengolah tampilan visual/grafis ke layar; SSD/HDD sebagai media penyimpanan permanen; dan PSU (Power Supply) sebagai penyuplai daya listrik."
    }
  },
  // 16
  {
    id: "PG_16",
    nomor: 16,
    kategori: "Sistem Komputer",
    teks: "Seorang siswa memerlukan komputer untuk belajar desain grafis dan editing video dengan kriteria minimal RAM 8 GB dan media penyimpanan SSD minimal 512 GB. Batas anggaran maksimal yang dimiliki adalah Rp6.500.000. Tersedia pilihan toko komputer:\n- Toko Maju: RAM 4 GB, SSD 256 GB, harga Rp4.500.000\n- Toko Berkah: RAM 16 GB, SSD 1 TB, harga Rp7.800.000\n- Toko Jaya: RAM 8 GB, SSD 512 GB, harga Rp6.150.000\n- Toko Sukses: RAM 8 GB, Harddisk 1 TB (tanpa SSD), harga Rp5.900.000\nPilihan komputer yang paling tepat dan sesuai dengan kebutuhan serta batas anggaran siswa adalah ....",
    gambar: null,
    opsi: ["Toko Maju", "Toko Berkah", "Toko Jaya", "Toko Sukses"],
    kunci: "Toko Jaya",
    kunci_huruf: "C",
    pembahasan: "Toko Jaya memenuhi seluruh syarat minimum (RAM 8 GB, SSD 512 GB) dengan harga Rp6.150.000 yang masih dalam batas anggaran Rp6.500.000.",
    bahan_bacaan: {
      judul: "Analisis Pemilihan Spesifikasi Komputer",
      konten: "Dalam memilih perangkat komputer, sesuaikan komponen utama dengan kebutuhan pekerjaan dan batas anggaran maksimal. Pekerjaan berat seperti desain grafis atau penyuntingan video membutuhkan kapasitas memori (RAM) yang besar serta media penyimpanan SSD yang cepat, namun harganya tetap tidak boleh melebihi dana yang tersedia."
    }
  },
  // 17
  {
    id: "PG_17",
    nomor: 17,
    kategori: "Sistem Komputer",
    teks: "Perhatikan diagram hubungan antara perangkat keras, perangkat lunak, dan pengguna berikut! Perangkat lunak siap pakai yang menempati posisi [ Y ] dan digunakan langsung oleh pengguna untuk menyelesaikan tugas tertentu (seperti mengetik surat) adalah ....",
    gambar: CLOUDINARY_DIAGRAM_MAP.imgSoal17 || imgSoal17,
    gambar_fallback: imgSoal17,
    opsi: [
      "Perangkat Lunak Aplikasi (Application Software)",
      "Memori Penyimpanan Sekunder (Harddisk)",
      "Papan Sirkuit Utama (Motherboard)",
      "Unit Catu Daya Listrik (Power Supply)"
    ],
    kunci: "Perangkat Lunak Aplikasi (Application Software)",
    kunci_huruf: "A",
    pembahasan: "Lapisan [Y] yang berada di atas Sistem Operasi dan langsung berinteraksi dengan pengguna adalah Perangkat Lunak Aplikasi (Application Software).",
    bahan_bacaan: {
      judul: "Lapisan Struktur Sistem Komputer",
      konten: "Sistem komputer tersusun atas empat lapisan yang saling berinteraksi dari bawah ke atas: lapisan fisik berupa Perangkat Keras (Hardware) → dikelola oleh Sistem Operasi (Operating System) sebagai pengendali utama → menjalankan berbagai Program Aplikasi (Application Software) siap pakai → dioperasikan langsung oleh Pengguna (Brainware/User)."
    }
  },
  // 18
  {
    id: "PG_18",
    nomor: 18,
    kategori: "Perangkat Lunak",
    teks: "Perhatikan daftar ikon perangkat lunak pada gambar berikut! Kelompok perangkat lunak yang ketiganya merupakan Program Aplikasi (Application Software) dan bukan Sistem Operasi ditunjukkan oleh nomor ....",
    gambar: CLOUDINARY_DIAGRAM_MAP.imgSoal18 || imgSoal18,
    gambar_fallback: imgSoal18,
    opsi: [
      "Nomor [1], Nomor [2], dan Nomor [3]",
      "Nomor [1], Nomor [3], dan Nomor [5]",
      "Nomor [2], Nomor [3], dan Nomor [4]",
      "Nomor [2], Nomor [4], dan Nomor [5]"
    ],
    kunci: "Nomor [1], Nomor [3], dan Nomor [5]",
    kunci_huruf: "B",
    pembahasan: "Nomor [1] (MS Excel), [3] (Chrome), dan [5] (Photoshop) adalah program aplikasi. Sedangkan [2] (Ubuntu) dan [4] (Android) adalah sistem operasi.",
    bahan_bacaan: {
      judul: "Perbedaan Sistem Operasi dan Program Aplikasi",
      konten: "Sistem Operasi adalah perangkat lunak dasar yang mengelola seluruh sumber daya komputer/ponsel agar perangkat dapat menyala dan digunakan (contoh: Windows, MacOS, Ubuntu Linux, Android, iOS). Sedangkan Program Aplikasi adalah perangkat lunak tambahan untuk tugas spesifik pengguna (contoh: pengolah angka, peramban web, dan pengolah grafis)."
    }
  },
  // 19
  {
    id: "PG_19",
    nomor: 19,
    kategori: "Perangkat Lunak",
    teks: "Pasangan yang tepat antara jenis program aplikasi dan contoh perangkat lunaknya berdasarkan buku Informatika Kelas VII adalah ....",
    gambar: null,
    opsi: [
      "Pengolah Kata (Word Processing) : Microsoft Excel, Google Sheets, dan OpenOffice Calc",
      "Pengolah Lembar Kerja (Spreadsheet) : Microsoft Excel, Google Sheets, dan LibreOffice Calc",
      "Layanan Peramban Internet (Browser) : Adobe Photoshop, CorelDraw, dan Inkscape",
      "Pemutar Multimedia (Audio/Video) : Microsoft Access, MySQL, dan PostgreSQL"
    ],
    kunci: "Pengolah Lembar Kerja (Spreadsheet) : Microsoft Excel, Google Sheets, dan LibreOffice Calc",
    kunci_huruf: "B",
    pembahasan: "Microsoft Excel, Google Sheets, dan LibreOffice Calc merupakan contoh perangkat lunak pengolah lembar kerja (spreadsheet).",
    bahan_bacaan: {
      judul: "Klasifikasi Jenis Program Aplikasi",
      konten: "Program aplikasi dikelompokkan berdasarkan fungsinya: Pengolah Kata (mengetik dokumen teks), Pengolah Lembar Kerja/Spreadsheet (mengolah tabel angka dan rumus), Pengolah Grafis (menggambar dan mengedit foto), Basis Data/Database (mengelola arsip data berskala besar), dan Peramban/Browser (menjelajahi situs web)."
    }
  },
  // 20
  {
    id: "PG_20",
    nomor: 20,
    kategori: "Sistem Bilangan",
    teks: "Sistem bilangan desimal yang kita gunakan sehari-hari merupakan sistem bilangan berbasis 10 (angka 0 sampai 9), sedangkan sistem bilangan biner pada komputer merupakan sistem bilangan berbasis 2 karena ....",
    gambar: null,
    opsi: [
      "Hanya menggunakan dua simbol digit yaitu angka 0 (arus listrik padam/OFF) dan angka 1 (arus listrik menyala/ON)",
      "Hanya dapat digunakan untuk menghitung penjumlahan dua buah angka di dalam aplikasi kalkulator",
      "Mewajibkan setiap pengguna komputer memiliki dua buah layar monitor dan dua buah papan ketik",
      "Menggunakan dua puluh simbol huruf abjad dari huruf A sampai huruf T untuk menyimpan berkas"
    ],
    kunci: "Hanya menggunakan dua simbol digit yaitu angka 0 (arus listrik padam/OFF) dan angka 1 (arus listrik menyala/ON)",
    kunci_huruf: "A",
    pembahasan: "Sistem biner berbasis 2 karena hanya terdiri atas dua digit: 0 (tegangan listrik OFF) dan 1 (tegangan listrik ON).",
    bahan_bacaan: {
      judul: "Sistem Bilangan Desimal vs Bilangan Biner",
      konten: "Manusia terbiasa menggunakan sistem bilangan desimal (basis 10: angka 0 s.d. 9), sedangkan rangkaian elektronik di dalam komputer hanya mengenali dua keadaan sinyal tegangan listrik, yaitu padam (OFF) dan menyala (ON), sehingga komputer menggunakan sistem bilangan biner (basis 2)."
    }
  },
  // 21
  {
    id: "PG_21",
    nomor: 21,
    kategori: "Sistem Bilangan & ASCII",
    teks: "Perhatikan ilustrasi pemrosesan karakter dari papan ketik (keyboard) ke layar monitor berikut! Mengapa deretan kode biner 01000010 yang telah diolah di dalam CPU harus dikonversi kembali sebelum ditampilkan ke layar monitor LCD?",
    gambar: CLOUDINARY_DIAGRAM_MAP.imgSoal21 || imgSoal21,
    gambar_fallback: imgSoal21,
    opsi: [
      "Agar pengguna manusia dapat membaca karakter huruf 'B' dengan mudah di layar monitor, bukan deretan angka 0 dan 1",
      "Karena layar monitor LCD tidak membutuhkan aliran daya listrik sama sekali saat menampilkan huruf abjad",
      "Agar ukuran kapasitas memori penyimpanan harddisk di dalam komputer berkurang menjadi setengahnya",
      "Karena tombol papan ketik (keyboard) hanya dapat ditekan sebanyak satu kali saja untuk setiap huruf"
    ],
    kunci: "Agar pengguna manusia dapat membaca karakter huruf 'B' dengan mudah di layar monitor, bukan deretan angka 0 dan 1",
    kunci_huruf: "A",
    pembahasan: "Manusia berkomunikasi dengan huruf abjad, sedangkan komputer memproses bit biner. Konversi kembali diperlukan agar tampilan dapat dipahami pengguna.",
    bahan_bacaan: {
      judul: "Alur Konversi Karakter Keyboard ke Layar LCD",
      konten: "Ketika pengguna menekan satu tombol huruf pada papan ketik, sinyal diubah menjadi kode angka standar ASCII lalu dikirim dalam bentuk deretan bit biner (0 dan 1) ke CPU. Setelah diproses, kode biner tersebut diterjemahkan kembali menjadi bentuk huruf visual di layar monitor agar dapat dipahami oleh mata manusia."
    }
  },
  // 22
  {
    id: "PG_22",
    nomor: 22,
    kategori: "Sistem Bilangan & ASCII",
    teks: "Dalam standar pengkodean karakter ASCII, huruf kapital 'A' = 65, 'B' = 66, 'C' = 67, 'D' = 68, dan seterusnya secara berurutan. Jika seorang siswa menekan tombol huruf kapital 'F' (70) pada keyboard, kode biner 8-bit yang dikirim ke komputer adalah ....",
    gambar: null,
    opsi: ["01000100", "01000101", "01000110", "01000111"],
    kunci: "01000110",
    kunci_huruf: "C",
    pembahasan: "Huruf F = 70. Konversi desimal 70 ke biner: 64 + 4 + 2 = 01000110.",
    bahan_bacaan: {
      judul: "Standar Pengkodean Karakter ASCII (8-Bit)",
      konten: "Setiap karakter pada papan ketik memiliki nilai desimal standar yang berurutan sesuai abjad (misalnya 'A' = 65, 'B' = 66, dan seterusnya). Untuk mengubah nilai desimal tersebut menjadi kode biner 8-bit, gunakan penjumlahan bobot nilai tempat biner dari kiri ke kanan: 128 – 64 – 32 – 16 – 8 – 4 – 2 – 1 (beri angka 1 pada bobot yang dipakai dan 0 pada yang tidak dipakai)."
    }
  },
  // 23
  {
    id: "PG_23",
    nomor: 23,
    kategori: "Sistem Bilangan",
    teks: "Hasil konversi bilangan desimal 25 ke dalam bilangan biner 5-bit, serta hasil konversi bilangan biner 11010 ke dalam bilangan desimal secara berturut-turut adalah ....",
    gambar: null,
    opsi: [
      "11001 dan 26",
      "10101 dan 24",
      "11001 dan 28",
      "10011 dan 26"
    ],
    kunci: "11001 dan 26",
    kunci_huruf: "A",
    pembahasan: "Desimal 25 = 16 + 8 + 1 = 11001. Biner 11010 = 16 + 8 + 2 = 26.",
    bahan_bacaan: {
      judul: "Konversi Bilangan Desimal ke Biner (5-Bit) dan Sebaliknya",
      konten: "Lima posisi digit biner dari kiri ke kanan memiliki nilai tempat 16 – 8 – 4 – 2 – 1. Untuk mengubah biner ke desimal, jumlahkan nilai tempat yang memiliki angka 1. Untuk mengubah desimal ke biner, pecah bilangan desimal tersebut menjadi penjumlahan dari angka-angka 16, 8, 4, 2, atau 1."
    }
  },
  // 24
  {
    id: "PG_24",
    nomor: 24,
    kategori: "Antarmuka Pengguna",
    teks: "Model antarmuka pengguna komputer yang mengharuskan pengguna mengetikkan baris perintah teks secara langsung melalui papan ketik (seperti Terminal atau Command Prompt) disebut ....",
    gambar: null,
    opsi: [
      "Graphical User Interface (GUI)",
      "Command Line Interface (CLI)",
      "Voice User Interface (VUI)",
      "Touch Screen Interface (TSI)"
    ],
    kunci: "Command Line Interface (CLI)",
    kunci_huruf: "B",
    pembahasan: "CLI (Command Line Interface) adalah antarmuka berbasis baris perintah teks yang diketik melalui keyboard.",
    bahan_bacaan: {
      judul: "Jenis Antarmuka Pengguna (User Interface)",
      konten: "Terdapat tiga cara utama manusia berinteraksi dengan komputer: GUI (Graphical User Interface) menggunakan ikon gambar, menu, dan klik mouse/sentuhan layar; CLI (Command Line Interface) menggunakan pengetikan baris perintah teks pada layar terminal; dan VUI (Voice User Interface) menggunakan perintah suara."
    }
  },
  // 25
  {
    id: "PG_25",
    nomor: 25,
    kategori: "Antarmuka Pengguna",
    teks: "Pada pojok kanan atas jendela aplikasi berbasis GUI (seperti File Explorer), fungsi dari tombol kontrol bertanda kotak ( □ ) atau Maximize saat diklik adalah ....",
    gambar: null,
    opsi: [
      "Menutup program aplikasi secara permanen dan mematikan layar komputer",
      "Menyembunyikan jendela aplikasi sementara waktu ke bilah tugas (taskbar)",
      "Memperbesar tampilan jendela aplikasi agar memenuhi seluruh bidang layar monitor",
      "Memindahkan seluruh berkas dokumen ke dalam keranjang sampah (Recycle Bin)"
    ],
    kunci: "Memperbesar tampilan jendela aplikasi agar memenuhi seluruh bidang layar monitor",
    kunci_huruf: "C",
    pembahasan: "Tombol kotak (Maximize) berfungsi memperbesar ukuran jendela aplikasi hingga memenuhi seluruh layar monitor.",
    bahan_bacaan: {
      judul: "Tombol Kontrol Jendela pada Antarmuka GUI",
      konten: "Pada sudut kanan atas jendela aplikasi sistem operasi Windows terdapat tiga tombol utama: tanda garis datar (Minimize) untuk menyembunyikan sementara jendela ke bilah tugas (taskbar), tanda kotak (Maximize) untuk memperbesar jendela memenuhi seluruh layar, dan tanda silang (Close) untuk menutup aplikasi."
    }
  },
  // 26
  {
    id: "PG_26",
    nomor: 26,
    kategori: "Manajemen File",
    teks: "Ekstensi file menandakan jenis berkas dan aplikasi pembukanya. Manakah pasangan nama file dan jenis berkas berikut yang BENAR?",
    gambar: null,
    opsi: [
      "Rekap_Keuangan.xlsx adalah berkas lembar kerja angka dari Microsoft Excel",
      "Surat_Resmi.jpg adalah berkas dokumen teks dari aplikasi Microsoft Word",
      "Lagu_Daerah.docx adalah berkas rekaman suara musik dari pemutar audio",
      "Video_Sekolah.pdf adalah berkas program instalasi aplikasi di Windows"
    ],
    kunci: "Rekap_Keuangan.xlsx adalah berkas lembar kerja angka dari Microsoft Excel",
    kunci_huruf: "A",
    pembahasan: ".xlsx adalah ekstensi resmi untuk berkas lembar kerja angka Microsoft Excel.",
    bahan_bacaan: {
      judul: "Ekstensi Berkas (File Extension)",
      konten: "Nama belakang setelah tanda titik pada berkas menunjukkan format datanya: .docx (dokumen pengolah kata), .xlsx (lembar kerja pengolah angka), .pptx (salindia presentasi), .pdf (dokumen portabel tetap), .jpg/.png (gambar/foto), .mp3 (suara/audio), .mp4 (video), dan .exe (program aplikasi yang dapat dijalankan)."
    }
  },
  // 27
  {
    id: "PG_27",
    nomor: 27,
    kategori: "Manajemen File",
    teks: "Perhatikan struktur hierarki folder pada tampilan File Explorer berikut! Jika folder utama Arsip_Siswa tersimpan di drive C:\\, penulisan jalur lokasi (path) yang tepat untuk membuka file Daftar_Hadir.xlsx adalah ....",
    gambar: CLOUDINARY_DIAGRAM_MAP.imgSoal27 || imgSoal27,
    gambar_fallback: imgSoal27,
    opsi: [
      "C:\\Arsip_Siswa\\Semester_2\\Administrasi\\Daftar_Hadir.xlsx",
      "C:\\Arsip_Siswa\\Semester_1\\Tugas_Harian\\Daftar_Hadir.xlsx",
      "C:\\Arsip_Siswa\\Semester_1\\Administrasi\\Daftar_Hadir.xlsx",
      "C:\\Semester_1\\Arsip_Siswa\\Administrasi\\Daftar_Hadir.xlsx"
    ],
    kunci: "C:\\Arsip_Siswa\\Semester_1\\Administrasi\\Daftar_Hadir.xlsx",
    kunci_huruf: "C",
    pembahasan: "Berdasarkan diagram hierarki, berkas Daftar_Hadir.xlsx berada di dalam folder Administrasi, yang berada di dalam folder Semester_1, di bawah Arsip_Siswa di drive C:\\.",
    bahan_bacaan: {
      judul: "Cara Membaca Jalur Lokasi Berkas (File Path)",
      konten: "Penulisan alamat lokasi sebuah berkas dimulai dari nama partisi penyimpanan (misalnya C:\\ atau D:\\), diikuti nama folder utama, lalu nama subfolder di dalamnya secara berurutan dari tingkat paling luar hingga nama berkasnya, yang masing-masing dipisahkan dengan tanda garis miring terbalik (\\)."
    }
  },
  // 28
  {
    id: "PG_28",
    nomor: 28,
    kategori: "Manajemen File",
    teks: "Untuk menyalin (menggandakan) sebuah file dari folder Dokumen ke dalam Flashdisk agar file aslinya tetap ada di folder Dokumen, pintasan keyboard yang digunakan adalah ....",
    gambar: null,
    opsi: [
      "Ctrl + C lalu Ctrl + V",
      "Ctrl + X lalu Ctrl + V",
      "Ctrl + Z lalu Ctrl + Y",
      "Ctrl + P lalu Ctrl + S"
    ],
    kunci: "Ctrl + C lalu Ctrl + V",
    kunci_huruf: "A",
    pembahasan: "Ctrl + C (Copy) menyalin berkas tanpa menghapus aslinya, lalu Ctrl + V (Paste) menempelkannya di lokasi baru.",
    bahan_bacaan: {
      judul: "Pintasan Manajemen Berkas (Copy vs Cut)",
      konten: "Untuk menyalin/menggandakan berkas tanpa menghapus berkas aslinya, gunakan kombinasi tombol Ctrl + C (Copy) lalu Ctrl + V (Paste). Sedangkan untuk memindahkan berkas sepenuhnya sehingga berkas di folder asal hilang, gunakan kombinasi Ctrl + X (Cut) lalu Ctrl + V (Paste)."
    }
  },
  // 29
  {
    id: "PG_29",
    nomor: 29,
    kategori: "Pengolah Kata (Ms. Word)",
    teks: "Perhatikan gambar menu Ribbon pada aplikasi Microsoft Word berikut! Untuk membuat teks istilah asing menjadi cetak TEBAL sekaligus cetak MIRING, pasangan tombol pada Group Font yang harus diklik adalah ....",
    gambar: CLOUDINARY_DIAGRAM_MAP.imgSoal29 || imgSoal29,
    gambar_fallback: imgSoal29,
    opsi: [
      "Nomor [1] dan Nomor [2]",
      "Nomor [1] dan Nomor [3]",
      "Nomor [2] dan Nomor [3]",
      "Nomor [3] dan Nomor [4]"
    ],
    kunci: "Nomor [1] dan Nomor [2]",
    kunci_huruf: "A",
    pembahasan: "Nomor [1] adalah ikon B (Bold/Tebal) dan Nomor [2] adalah ikon I (Italic/Miring).",
    bahan_bacaan: {
      judul: "Ikon Pemformatan Huruf (Group Font MS Word)",
      konten: "Pada tab Home kelompok Font terdapat ikon standar untuk mengubah gaya huruf: ikon B (Bold) untuk mencetak huruf tebal, ikon I (Italic) untuk mencetak huruf miring, ikon U (Underline) untuk memberi garis bawah, dan ikon A berwarna untuk mengubah warna huruf."
    }
  },
  // 30
  {
    id: "PG_30",
    nomor: 30,
    kategori: "Pengolah Kata (Ms. Word)",
    teks: "Berdasarkan bagan menu Ribbon pada soal nomor 29 di atas, ikon untuk menempatkan teks Judul Laporan agar berada tepat di tengah-tengah halaman (Center) ditunjukkan oleh nomor ....",
    gambar: CLOUDINARY_DIAGRAM_MAP.imgSoal29 || imgSoal29,
    gambar_fallback: imgSoal29,
    opsi: [
      "Nomor [5]",
      "Nomor [6]",
      "Nomor [7]",
      "Nomor [8]"
    ],
    kunci: "Nomor [6]",
    kunci_huruf: "B",
    pembahasan: "Nomor [6] adalah ikon perataan Center (rata tengah).",
    bahan_bacaan: {
      judul: "Ikon Perataan Paragraf (Group Paragraph MS Word)",
      konten: "Terdapat empat jenis perataan teks pada paragraf: Align Left (rata tepi kiri), Center (rata tengah halaman, umumnya untuk judul), Align Right (rata tepi kanan, umumnya untuk tanggal/tempat surat), dan Justify (rata tepi kiri dan kanan secara bersamaan, umumnya untuk isi paragraf)."
    }
  },
  // 31
  {
    id: "PG_31",
    nomor: 31,
    kategori: "Pengolah Kata (Ms. Word)",
    teks: "Pengaturan orientasi halaman (Orientation) pada Microsoft Word agar posisi kertas melebar secara horizontal ke samping (cocok untuk tabel lebar atau sertifikat) disebut ....",
    gambar: null,
    opsi: ["Landscape", "Portrait", "Justify", "Columns"],
    kunci: "Landscape",
    kunci_huruf: "A",
    pembahasan: "Landscape adalah tata letak kertas melebar secara horizontal ke samping.",
    bahan_bacaan: {
      judul: "Orientasi Tata Letak Halaman (Page Orientation)",
      konten: "Pengaturan posisi kertas pada aplikasi pengolah kata terbagi menjadi dua pilihan: Portrait yaitu posisi kertas berdiri memanjang secara vertikal ke bawah, dan Landscape yaitu posisi kertas tidur melebar secara horizontal ke samping."
    }
  },
  // 32
  {
    id: "PG_32",
    nomor: 32,
    kategori: "Pengolah Kata (Ms. Word)",
    teks: "Pada aplikasi Microsoft Word, fitur untuk mengatur batas tepi kertas (Margins), arah kertas (Orientation), dan ukuran kertas (Size) terletak pada tab menu ....",
    gambar: null,
    opsi: ["Tab Home", "Tab Insert", "Tab Layout", "Tab View"],
    kunci: "Tab Layout",
    kunci_huruf: "C",
    pembahasan: "Tab Layout (atau Page Layout) memuat kelompok Page Setup untuk mengatur margin, orientasi, dan ukuran kertas.",
    bahan_bacaan: {
      judul: "Fungsi Tab Menu pada Microsoft Word",
      konten: "Menu utama di bagian atas dibagi berdasarkan fungsinya: Tab Home (format huruf dan paragraf), Tab Insert (menyisipkan objek seperti tabel, gambar, bentuk/shapes, nomor halaman), Tab Layout (mengatur margin, orientasi, dan ukuran kertas), serta Tab Review (mengecek ejaan dan komentar)."
    }
  },
  // 33
  {
    id: "PG_33",
    nomor: 33,
    kategori: "Pengolah Kata (Ms. Word)",
    teks: "Saat mengetik tugas laporan di Microsoft Word, seorang siswa ingin menyimpan hasil ketikannya ke dalam komputer agar tidak hilang jika listrik padam. Pintasan keyboard (shortcut) untuk menyimpan dokumen tersebut adalah ....",
    gambar: null,
    opsi: [
      "Ctrl + S (Save)",
      "Ctrl + P (Print)",
      "Ctrl + Z (Undo)",
      "Ctrl + U (Underline)"
    ],
    kunci: "Ctrl + S (Save)",
    kunci_huruf: "A",
    pembahasan: "Ctrl + S adalah shortcut universal untuk menyimpan (Save) dokumen.",
    bahan_bacaan: {
      judul: "Pintasan Keyboard Dasar Pengolah Kata",
      konten: "Beberapa kombinasi tombol cepat yang sering dipakai saat mengetik dokumen: Ctrl + S untuk menyimpan berkas (Save), Ctrl + P untuk mencetak dokumen (Print), Ctrl + Z untuk membatalkan tindakan terakhir (Undo), dan Ctrl + Y untuk mengulangi tindakan (Redo)."
    }
  },
  // 34
  {
    id: "PG_34",
    nomor: 34,
    kategori: "Komunikasi Digital & Surel",
    teks: "Berikut ini adalah ciri-ciri dari sebuah Surat Pribadi yang membedakannya dengan Surat Resmi instansi/sekolah, yaitu ....",
    gambar: null,
    opsi: [
      "Wajib menggunakan kop surat lembaga, nomor surat resmi, dan stempel basah instansi",
      "Ditujukan untuk keperluan dinas antar-kantor pemerintah dengan bahasa baku yang kaku",
      "Tidak menggunakan kop surat maupun nomor surat serta berisi kabar atau urusan personal",
      "Selalu menyertakan tembusan resmi kepada kepala dinas dan ketua komite sekolah"
    ],
    kunci: "Tidak menggunakan kop surat maupun nomor surat serta berisi kabar atau urusan personal",
    kunci_huruf: "C",
    pembahasan: "Surat pribadi tidak memakai kop, nomor surat, maupun stempel dinas karena bersifat urusan kekeluargaan/personal.",
    bahan_bacaan: {
      judul: "Perbedaan Surat Resmi dan Surat Pribadi",
      konten: "Surat Resmi dikeluarkan oleh instansi/sekolah untuk urusan kedinasan sehingga wajib memiliki kop surat, nomor surat, lampiran, perihal, serta bahasa baku. Sebaliknya, Surat Pribadi ditulis antarindividu untuk urusan personal sehingga tidak memakai kop surat maupun nomor surat."
    }
  },
  // 35
  {
    id: "PG_35",
    nomor: 35,
    kategori: "Aplikasi Kolaboratif",
    teks: "Ketika guru membagikan tautan materi bacaan di Google Docs dan hanya mengizinkan siswa untuk membaca isinya saja tanpa bisa mengubah atau mengedit teks, maka pengaturan akses yang dipilih guru adalah ....",
    gambar: null,
    opsi: [
      "Pelihat (Viewer)",
      "Pengomentar (Commenter)",
      "Editor (Penyunting)",
      "Pemilik (Owner)"
    ],
    kunci: "Pelihat (Viewer)",
    kunci_huruf: "A",
    pembahasan: "Hak akses Viewer (Pelihat) hanya mengizinkan melihat dan membaca isi berkas tanpa izin mengubah teks.",
    bahan_bacaan: {
      judul: "Hak Akses Kolaborasi di Google Docs",
      konten: "Saat membagikan dokumen daring melalui tombol Bagikan (Share), pemilik dokumen dapat mengatur tiga tingkat izin penerima tautan: Pelihat (Viewer) hanya bisa membaca tanpa mengubah isi, Pengomentar (Commenter) dapat memberi catatan komentar, dan Editor (Penyunting) memiliki izin penuh untuk mengetik dan mengubah isi dokumen."
    }
  },
  // 36
  {
    id: "PG_36",
    nomor: 36,
    kategori: "Komunikasi Digital & Surel",
    teks: "Perhatikan gambar jendela penulisan surat elektronik (Compose Email) berikut! Bagian yang harus diisi dengan ringkasan singkat topik atau judul pesan surel agar penerima langsung mengetahui maksud surat sebelum membukanya ditunjukkan oleh huruf ....",
    gambar: CLOUDINARY_DIAGRAM_MAP.imgSoal36 || imgSoal36,
    gambar_fallback: imgSoal36,
    opsi: ["Bagian [ P ]", "Bagian [ Q ]", "Bagian [ R ]", "Bagian [ S ]"],
    kunci: "Bagian [ R ]",
    kunci_huruf: "C",
    pembahasan: "Bagian [ R ] adalah Subjek (Subject) yang berfungsi sebagai judul atau ringkasan topik isi surel.",
    bahan_bacaan: {
      judul: "Bagian-Bagian Jendela Penulisan Surel (Compose Email)",
      konten: "Saat menulis email baru terdapat beberapa kolom utama: Kepada (To) diisi alamat email tujuan utama; Cc/Bcc diisi alamat penerima tembusan; Subjek (Subject) diisi ringkasan judul/topik pesan; badan pesan untuk isi surat; dan ikon Klip Kertas (Attachment) untuk melampirkan berkas."
    }
  },
  // 37
  {
    id: "PG_37",
    nomor: 37,
    kategori: "Komunikasi Digital & Surel",
    teks: "Sebuah surat elektronik (surel) yang telah dikirim terkadang gagal sampai ke kotak masuk (Inbox) penerima. Berikut ini adalah penyebab surel gagal terkirim ke alamat tujuan, KECUALI ....",
    gambar: null,
    opsi: [
      "Pengirim salah mengetikkan ejaan alamat surel milik penerima",
      "Ukuran berkas lampiran (attachment) melebihi batas maksimum yang diizinkan",
      "Ruang penyimpanan kotak surat (mailbox) milik penerima sudah penuh",
      "Pengirim menuliskan salam pembuka menggunakan bahasa Indonesia yang baku"
    ],
    kunci: "Pengirim menuliskan salam pembuka menggunakan bahasa Indonesia yang baku",
    kunci_huruf: "D",
    pembahasan: "Menulis salam pembuka dengan bahasa baku adalah etika yang baik dan bukan penyebab kegagalan pengiriman email.",
    bahan_bacaan: {
      judul: "Penyebab Kegagalan Pengiriman Surel (Email)",
      konten: "Pesan email dapat gagal masuk ke kotak masuk (Inbox) penerima apabila terjadi kesalahan penulisan karakter pada alamat email tujuan, ukuran berkas lampiran melebihi batas kapasitas maksimum layanan email, kotak surat penerima sudah penuh, atau pesan terdeteksi sebagai Spam."
    }
  },
  // 38
  {
    id: "PG_38",
    nomor: 38,
    kategori: "Komunikasi Digital & Surel",
    teks: "Apabila kamu menerima surat elektronik (surel) dari ketua kelompok belajar mengenai pembagian tugas Informatika dan ingin langsung mengirimkan pesan balasan kepada pengirim tersebut, fitur yang harus dipilih adalah ....",
    gambar: null,
    opsi: [
      "Reply (Balas)",
      "Delete (Hapus)",
      "Spam (Sampah)",
      "Draft (Konsep)"
    ],
    kunci: "Reply (Balas)",
    kunci_huruf: "A",
    pembahasan: "Fitur Reply (Balas) digunakan untuk merespons pesan secara langsung kepada si pengirim surel.",
    bahan_bacaan: {
      judul: "Fitur Pengelolaan Pesan Masuk pada Email",
      konten: "Ketika membaca pesan di folder Inbox, pengguna dapat memilih tombol Reply (Balas) untuk membalas langsung kepada pengirim pesan, Forward (Teruskan) untuk meneruskan pesan tersebut ke alamat orang lain, atau Delete untuk memindahkan pesan ke folder sampah."
    }
  },
  // 39
  {
    id: "PG_39",
    nomor: 39,
    kategori: "Jaringan Komputer & Internet",
    teks: "Untuk menghubungkan laptop ke perangkat proyektor atau layar televisi pintar menggunakan kabel agar tampilan layar dan suara berpindah dengan kualitas definisi tinggi, jenis kabel yang tepat digunakan adalah ....",
    gambar: null,
    opsi: [
      "Kabel HDMI",
      "Bluetooth",
      "Sinyal Inframerah",
      "Kartu Memori SD"
    ],
    kunci: "Kabel HDMI",
    kunci_huruf: "A",
    pembahasan: "Kabel HDMI (High-Definition Multimedia Interface) mentransmisikan sinyal video dan audio digital berdefinisi tinggi.",
    bahan_bacaan: {
      judul: "Media Penghubung Antarperangkat (Kabel vs Nirkabel)",
      konten: "Pertukaran data atau tampilan antarperangkat dapat dilakukan tanpa kabel (nirkabel) menggunakan gelombang radio Bluetooth (jarak dekat tanpa kuota internet) atau Wi-Fi, maupun menggunakan media kabel fisik seperti kabel USB (transfer data/daya) dan kabel HDMI (transmisi gambar video dan suara definisi tinggi ke proyektor/TV)."
    }
  },
  // 40
  {
    id: "PG_40",
    nomor: 40,
    kategori: "Jaringan Komputer & Internet",
    teks: "Saat fitur Tethering (Hotspot Seluler) diaktifkan pada sebuah smartphone untuk membagikan koneksi internet ke laptop, maka smartphone tersebut berperan menggantikan fungsi perangkat jaringan yaitu sebagai ....",
    gambar: null,
    opsi: [
      "Modem / Router penghubung internet",
      "Mesin pencetak dokumen (Printer)",
      "Kamera pengawas ruangan (CCTV)",
      "Alat pemindai kertas (Scanner)"
    ],
    kunci: "Modem / Router penghubung internet",
    kunci_huruf: "A",
    pembahasan: "Smartphone bertindak sebagai modem seluler yang menerima sinyal operator dan router pemancar koneksi nirkabel.",
    bahan_bacaan: {
      judul: "Konsep Tethering (Hotspot Seluler)",
      konten: "Tethering atau Phone-as-Modem adalah fitur berbagi sambungan internet seluler dari ponsel pintar ke perangkat lain (seperti laptop atau tablet) melalui Wi-Fi, Bluetooth, atau kabel USB. Dalam proses ini, ponsel berfungsi sebagai modem sekaligus router penghubung ke internet."
    }
  },
  // 41
  {
    id: "PG_41",
    nomor: 41,
    kategori: "Teknologi Informasi & Komunikasi",
    teks: "Keunggulan utama penggunaan kamera pengawas CCTV di jalan raya dibandingkan menugaskan petugas manusia untuk mencatat kendaraan secara manual selama 24 jam penuh adalah ....",
    gambar: null,
    opsi: [
      "CCTV mampu merekam video dan waktu kejadian secara otomatis tanpa mengenal lelah sepanjang hari",
      "CCTV dapat langsung menghentikan laju kendaraan yang melanggar lampu merah menggunakan jaring besi",
      "CCTV tidak membutuhkan sumber arus listrik maupun ruang penyimpanan memori untuk merekam gambar",
      "CCTV dapat memperbaiki jalan raya yang berlubang secara otomatis setiap kali ada mobil yang lewat"
    ],
    kunci: "CCTV mampu merekam video dan waktu kejadian secara otomatis tanpa mengenal lelah sepanjang hari",
    kunci_huruf: "A",
    pembahasan: "CCTV mampu beroperasi merekam video dan catatan waktu secara non-stop 24 jam terus-menerus.",
    bahan_bacaan: {
      judul: "Cara Kerja dan Manfaat Sistem CCTV",
      konten: "Closed-Circuit Television (CCTV) merupakan sistem kamera pengawas rangkaian tertutup yang merekam kejadian dalam bentuk video secara terus-menerus beserta catatan waktunya, lalu menyalurkannya ke layar monitor pemantau dan media penyimpanan digital untuk meningkatkan keamanan lingkungan."
    }
  },
  // 42
  {
    id: "PG_42",
    nomor: 42,
    kategori: "Jaringan Komputer & Internet",
    teks: "Sistem jaringan komputer global raksasa yang menghubungkan jutaan perangkat komputer dan jaringan di seluruh dunia menggunakan protokol komunikasi TCP/IP disebut ....",
    gambar: null,
    opsi: ["Bluetooth PAN", "LAN Sekolah", "Internet", "Kabel USB"],
    kunci: "Internet",
    kunci_huruf: "C",
    pembahasan: "Internet (Interconnected Network) adalah jaringan global raksasa yang menghubungkan komputer di seluruh penjuru dunia dengan protokol TCP/IP.",
    bahan_bacaan: {
      judul: "Klasifikasi Jaringan Komputer Berdasarkan Area",
      konten: "Jaringan komputer dibedakan menurut luas jangkauannya: PAN (jarak sangat dekat antarperangkat pribadi), LAN (Local Area Network) mencakup area terbatas seperti satu ruangan, rumah, atau gedung sekolah, MAN mencakup satu kota metropolitan, dan Internet merupakan jaringan komputer global seluruh dunia berbasis protokol TCP/IP."
    }
  },
  // 43
  {
    id: "PG_43",
    nomor: 43,
    kategori: "Jaringan Komputer & Internet",
    teks: "Agar komputer di rumah atau ponsel pintar dapat terhubung ke jaringan internet, pengguna harus berlangganan layanan akses internet melalui perusahaan penyedia jasa layanan internet yang disingkat dengan istilah ....",
    gambar: null,
    opsi: [
      "ISP (Internet Service Provider)",
      "CPU (Central Processing Unit)",
      "GUI (Graphical User Interface)",
      "URL (Uniform Resource Locator)"
    ],
    kunci: "ISP (Internet Service Provider)",
    kunci_huruf: "A",
    pembahasan: "ISP (Internet Service Provider) adalah perusahaan atau badan yang menyediakan jasa sambungan internet bagi masyarakat.",
    bahan_bacaan: {
      judul: "Akses Internet dan Penyedia Layanan (ISP)",
      konten: "Untuk dapat terhubung ke jaringan internet global, perangkat komputer atau jaringan lokal di rumah/sekolah memerlukan perangkat penghubung (seperti Modem dan Router) serta berlangganan paket koneksi data melalui perusahaan penyedia jasa layanan internet yang disebut ISP (Internet Service Provider)."
    }
  },
  // 44
  {
    id: "PG_44",
    nomor: 44,
    kategori: "Jaringan Komputer & Internet",
    teks: "Dalam dunia jaringan komputer dan internet, ukuran kemampuan maksimum transfer data atau kecepatan pengiriman data pada suatu koneksi internet dalam periode waktu tertentu dikenal dengan istilah ....",
    gambar: null,
    opsi: [
      "Bandwidth (Lebar pita)",
      "Bookmark (Markah)",
      "Hyperlink (Tautan)",
      "Spreadsheet (Tabel)"
    ],
    kunci: "Bandwidth (Lebar pita)",
    kunci_huruf: "A",
    pembahasan: "Bandwidth adalah kapasitas maksimum transfer data per detik pada suatu saluran transmisi jaringan.",
    bahan_bacaan: {
      judul: "Kecepatan Transfer Data (Bandwidth) & Keamanan Jaringan",
      konten: "Kemampuan maksimum saluran jaringan dalam mengirimkan data per detik diukur menggunakan satuan Bandwidth (Lebar pita). Selain itu, jaringan nirkabel (Wi-Fi) perlu diamankan menggunakan enkripsi dan kata sandi agar tidak diakses oleh pihak yang tidak berwenang."
    }
  },
  // 45
  {
    id: "PG_45",
    nomor: 45,
    kategori: "Literasi Digital",
    teks: "Segala bentuk materi digital (baik berupa teks artikel, gambar poster, rekaman audio, maupun video edukasi) yang dibuat dan disebarkan melalui media daring untuk memberikan informasi atau hiburan kepada pengguna disebut ....",
    gambar: null,
    opsi: ["Konten digital", "Perangkat keras", "Kabel jaringan", "Sistem biner"],
    kunci: "Konten digital",
    kunci_huruf: "A",
    pembahasan: "Konten digital adalah segala bentuk informasi berupa teks, gambar, audio, atau video yang disimpan dan disebarkan dalam format digital.",
    bahan_bacaan: {
      judul: "Perbedaan Data, Informasi, dan Konten Digital",
      konten: "Data adalah kumpulan fakta mentah (angka, kata, simbol) yang belum diolah. Informasi adalah hasil pengolahan data yang telah diberi konteks dan makna sehingga berguna untuk mengambil keputusan. Sedangkan Konten Digital adalah segala materi (teks, gambar, audio, video) yang dikemas dan disebarkan melalui media digital."
    }
  },
  // 46
  {
    id: "PG_46",
    nomor: 46,
    kategori: "Teknologi Informasi & Komunikasi",
    teks: "Layanan penyimpanan awan (Cloud Storage) di internet yang memungkinkan pengguna mengunggah dan menyimpan berkas dokumen secara daring agar dapat diakses dari perangkat mana saja adalah ....",
    gambar: null,
    opsi: [
      "Google Drive, OneDrive, dan Dropbox",
      "Paint, Calculator, dan Notepad",
      "WinRAR, Antivirus, dan Disk Cleanup",
      "Mouse, Keyboard, dan Flashdisk"
    ],
    kunci: "Google Drive, OneDrive, dan Dropbox",
    kunci_huruf: "A",
    pembahasan: "Google Drive, Microsoft OneDrive, dan Dropbox adalah contoh layanan penyimpanan cloud terkemuka.",
    bahan_bacaan: {
      judul: "Cara Menyimpan Konten dan Tautan dari Internet",
      konten: "Berbagai cara menyimpan temuan dari internet antara lain: menggunakan fitur Bookmark (Markah) pada peramban untuk menyimpan alamat tautan halaman web; mengunggah berkas ke layanan penyimpanan awan (Cloud Storage seperti Google Drive, OneDrive, Dropbox) agar bisa diakses dari mana saja; atau mengunduh (download) berkas ke penyimpanan lokal."
    }
  },
  // 47
  {
    id: "PG_47",
    nomor: 47,
    kategori: "Literasi Digital",
    teks: "Perhatikan tiga kalimat berikut!\n(1) Menurut pendapat saya, pelajaran Informatika jauh lebih mudah dan seru dibandingkan pelajaran lainnya.\n(2) Indonesia memproklamasikan kemerdekaannya pada tanggal 17 Agustus 1945 di Jakarta.\n(3) Membagikan pesan berantai ini ke 10 grup WhatsApp akan langsung menambah saldo tabungan otomatis.\nUrutan kategori yang tepat untuk kalimat (1), (2), dan (3) di atas adalah ....",
    gambar: null,
    opsi: [
      "(1) Fakta, (2) Opini, dan (3) Hoaks",
      "(1) Opini, (2) Fakta, dan (3) Hoaks",
      "(1) Hoaks, (2) Fakta, dan (3) Opini",
      "(1) Opini, (2) Hoaks, dan (3) Fakta"
    ],
    kunci: "(1) Opini, (2) Fakta, dan (3) Hoaks",
    kunci_huruf: "B",
    pembahasan: "(1) adalah Opini (subjektif), (2) adalah Fakta sejarah nyata, (3) adalah Hoaks penipuan pesan berantai.",
    bahan_bacaan: {
      judul: "Membedakan Fakta, Opini, dan Hoaks",
      konten: "Fakta adalah pernyataan tentang kejadian nyata yang benar-benar terjadi dan dapat dibuktikan kebenarannya (memuat data waktu, tempat, atau ukuran objektif). Opini adalah pendapat, penilaian, atau perasaan subjektif seseorang. Sedangkan Hoaks adalah informasi palsu atau berita bohong yang sengaja dibuat menyesatkan tanpa dasar bukti ilmiah/nyata."
    }
  },
  // 48
  {
    id: "PG_48",
    nomor: 48,
    kategori: "Jaringan Komputer & Internet",
    teks: "Untuk mengakses halaman situs web atau mesin pencari di internet, perangkat lunak khusus yang wajib dibuka terlebih dahulu oleh pengguna pada komputer maupun ponsel pintar adalah ....",
    gambar: null,
    opsi: [
      "Aplikasi Peramban Web (Browser) seperti Google Chrome, Mozilla Firefox, atau Microsoft Edge",
      "Aplikasi Pengolah Angka (Spreadsheet) seperti Microsoft Excel atau LibreOffice Calc",
      "Aplikasi Pemutar Musik Luring seperti Windows Media Player atau Winamp",
      "Aplikasi Kompresi Berkas seperti WinRAR atau 7-Zip File Manager"
    ],
    kunci: "Aplikasi Peramban Web (Browser) seperti Google Chrome, Mozilla Firefox, atau Microsoft Edge",
    kunci_huruf: "A",
    pembahasan: "Web Browser (Peramban) adalah aplikasi khusus untuk membuka, merender kode HTML, dan menavigasi situs di internet.",
    bahan_bacaan: {
      judul: "Perangkat Lunak untuk Mengakses Internet",
      konten: "Untuk membuka halaman situs web (World Wide Web) dan menggunakan layanan mesin pencari di internet, pengguna membutuhkan perangkat lunak khusus penerjemah dokumen HTML yang disebut Peramban Web (Web Browser), contohnya Google Chrome, Mozilla Firefox, Microsoft Edge, dan Safari."
    }
  },
  // 49
  {
    id: "PG_49",
    nomor: 49,
    kategori: "Jaringan Komputer & Internet",
    teks: "Pada cara kerja mesin pencari, tahapan ketika program robot (spider) menjelajahi situs-situs web untuk mengambil informasi baru, serta tahapan ketika mesin pencari mengurutkan hasil pencarian berdasarkan relevansi dan kualitas konten secara berturut-turut disebut ....",
    gambar: null,
    opsi: [
      "Indexing (Pengindeksan) dan Browsing (Penjelajahan)",
      "Crawling (Perayapan) dan Ranking (Pemeringkatan)",
      "Ranking (Pemeringkatan) dan Downloading (Pengunduhan)",
      "Uploading (Pengunggahan) dan Streaming (Penyiaran)"
    ],
    kunci: "Crawling (Perayapan) dan Ranking (Pemeringkatan)",
    kunci_huruf: "B",
    pembahasan: "Crawling (Perayapan) adalah fase robot menjelajah web, dan Ranking (Pemeringkatan) adalah fase mengurutkan hasil berdasarkan relevansi.",
    bahan_bacaan: {
      judul: "Tiga Tahapan Kerja Mesin Pencari (Search Engine)",
      konten: "Mesin pencari bekerja melalui tiga tahap berurutan: (1) Crawling (Perayapan), program robot (spider) menjelajahi berbagai situs web untuk mengumpulkan data halaman; (2) Indexing (Pengindeksan), menyimpan dan mengelompokkan kata-kata yang ditemukan ke dalam basis data; dan (3) Ranking (Pemeringkatan), mengurutkan hasil pencarian berdasarkan relevansi dan kualitas konten."
    }
  },
  // 50
  {
    id: "PG_50",
    nomor: 50,
    kategori: "Jaringan Komputer & Internet",
    teks: "Seorang siswa ingin mencari informasi mengenai \"Kurikulum Merdeka\" di mesin pencari Google, namun ia ingin membatasi agar hasil pencarian hanya berasal dari situs resmi kementerian (kemdikbud.go.id). Penulisan kata kunci (keyword) yang tepat adalah ....",
    gambar: null,
    opsi: [
      "site:kemdikbud.go.id Kurikulum Merdeka",
      "filetype:pdf Kurikulum Merdeka",
      "images:kemdikbud Kurikulum Merdeka",
      "sound:mp3 Kurikulum Merdeka"
    ],
    kunci: "site:kemdikbud.go.id Kurikulum Merdeka",
    kunci_huruf: "A",
    pembahasan: "Operator 'site:' digunakan untuk membatasi ruang lingkup pencarian hanya di dalam nama domain tertentu.",
    bahan_bacaan: {
      judul: "Teknik Pencarian Spesifik dengan Operator Pencarian",
      konten: "Pengguna dapat mempersempit hasil pencarian di mesin pencari menggunakan operator khusus: tanda kutip \"...\" untuk mencari frasa kata yang persis sama, site:nama_domain untuk membatasi pencarian hanya di dalam situs web tertentu saja, dan filetype:ekstensi (misalnya filetype:pdf) untuk mencari jenis berkas dokumen tertentu."
    }
  }
];

export const SOAL_POOL_ESAI = [
  {
    id: "ESAI_01",
    nomor: 1,
    kategori: "Algoritma & Optimasi",
    teks: "Kibo memiliki persediaan beberapa gulung pita hias yang panjangnya 12 meter per gulung. Koko meminta bantuan Kibo untuk menyediakan potongan pita berukuran 5 meter sebanyak 4 buah dan berukuran 4 meter sebanyak 4 buah. Berapakah jumlah minimal gulungan pita 12 meter yang harus dipotong oleh Kibo agar semua kebutuhan Koko terpenuhi? Tuliskan cara pembagian potongannya!",
    skor_maks: 4,
    pedoman_penskoran: "Kebutuhan Koko = 4 potong × 5 m (20 m) dan 4 potong × 4 m (16 m), total 36 m.\nRincian pemotongan optimal per gulung (12 m):\n• Gulung ke-1 (12 m) = 4 m + 4 m + 4 m = 12 m (sisa 0 m) — terpenuhi 3 potong 4 m.\n• Gulung ke-2 (12 m) = 5 m + 5 m = 10 m (sisa 2 m) — terpenuhi 2 potong 5 m.\n• Gulung ke-3 (12 m) = 5 m + 5 m = 10 m (sisa 2 m) — terpenuhi 2 potong 5 m.\n• Gulung ke-4 (12 m) = 4 m (sisa 8 m) — terpenuhi 1 potong 4 m terakhir.\nKesimpulan: Minimal 4 gulung pita.",
    bahan_bacaan: {
      judul: "Strategi Pemotongan Bahan Optimal (Algoritma & Optimasi)",
      konten: "Untuk meminimalkan jumlah bahan utuh yang terpakai, susunlah kombinasi ukuran potongan pada setiap batang/gulung utuh sedemikian rupa sehingga total panjangnya mendekati atau sama persis dengan panjang bahan utuh tersebut (sisa potongan sekecil mungkin), lalu pastikan jumlah total potongan masing-masing ukuran sesuai dengan yang diminta."
    }
  },
  {
    id: "ESAI_02",
    nomor: 2,
    kategori: "Sistem Komputer",
    teks: "Kelompokkanlah 6 perangkat keras (hardware) berikut ke dalam kategori Peranti Masukan (Input), Peranti Pemroses (Process), atau Peranti Keluaran (Output) dengan tepat: Scanner, Speaker, Kartu Grafis (GPU), Proyektor, Microphone, dan Processor (CPU)!",
    skor_maks: 6,
    pedoman_penskoran: "• Peranti Masukan (Input): Scanner dan Microphone (Skor 2)\n• Peranti Pemroses (Process): Kartu Grafis (GPU) dan Processor (CPU) (Skor 2)\n• Peranti Keluaran (Output): Speaker dan Proyektor (Skor 2)",
    bahan_bacaan: {
      judul: "Klasifikasi Perangkat Keras (Input – Process – Output)",
      konten: "Kelompokkan setiap perangkat keras berdasarkan arah aliran datanya: alat yang memasukkan data/suara/gambar dari luar ke dalam komputer termasuk Input Device; komponen di dalam unit sistem yang mengolah data/instruksi/grafis termasuk Process Device; dan alat yang menampilkan hasil olahan ke layar, kertas, atau suara termasuk Output Device."
    }
  },
  {
    id: "ESAI_03",
    nomor: 3,
    kategori: "Sistem Bilangan & ASCII",
    teks: "Dalam standar kode karakter ASCII, huruf kapital 'A' memiliki nilai desimal 65, 'B' = 66, 'C' = 67, dan seterusnya secara berurutan. Apabila seorang siswa menekan tombol huruf kapital 'P' (urutan huruf ke-16 dalam abjad) pada keyboard, berapakah nilai desimal ASCII dari huruf 'P' tersebut dan tuliskan kode bilangan biner 8-bit yang dikirimkan ke komputer beserta langkah perhitungannya!",
    skor_maks: 4,
    pedoman_penskoran: "• Nilai desimal ASCII huruf kapital 'P' (urutan ke-16): karena 'A' (ke-1) = 65, maka 'P' = 65 + (16 − 1) = 65 + 15 = 80 (Skor 1).\n• Konversi desimal 80 ke biner 8-bit (bobot: 128, 64, 32, 16, 8, 4, 2, 1): 80 = 64 + 16 (Skor 2).\n• Kode biner 8-bit yang dikirim ke komputer: 01010000 (Skor 1).",
    bahan_bacaan: {
      judul: "Langkah Konversi Karakter ASCII ke Biner 8-Bit",
      konten: "Pertama, tentukan nilai desimal ASCII karakter tersebut dengan menghitung selisih urutan hurufnya dari huruf 'A' = 65 (rumus: 65 + [urutan huruf − 1]). Kedua, ubah nilai desimal tersebut ke dalam format biner 8-bit menggunakan bobot nilai tempat 128 – 64 – 32 – 16 – 8 – 4 – 2 – 1."
    }
  },
  {
    id: "ESAI_04",
    nomor: 4,
    kategori: "Manajemen File",
    teks: "Seorang siswa mengelompokkan 4 berkas di dalam komputer, yaitu: (1) Makalah_Sejarah.pdf, (2) Lagu_Wajib.mp3, (3) Video_Tari_Bali.mp4, dan (4) Surat_Izin.docx. Sebutkan jenis isi berkas dan nama program aplikasi yang tepat untuk membuka keempat berkas tersebut!",
    skor_maks: 4,
    pedoman_penskoran: "• (1) Makalah_Sejarah.pdf : Dokumen portabel tetap, dibuka dengan Adobe Acrobat Reader / Browser (Skor 1).\n• (2) Lagu_Wajib.mp3 : Berkas suara/audio musik, dibuka dengan Windows Media Player / Spotify / VLC (Skor 1).\n• (3) Video_Tari_Bali.mp4 : Berkas gambar bergerak/video, dibuka dengan VLC Media Player / Windows Media Player (Skor 1).\n• (4) Surat_Izin.docx : Berkas dokumen teks pengolah kata, dibuka dengan Microsoft Word / Google Docs (Skor 1).",
    bahan_bacaan: {
      judul: "Identifikasi Ekstensi Berkas dan Aplikasi Pembukanya",
      konten: "Perhatikan huruf ekstensi di bagian paling belakang nama berkas setelah tanda titik: .docx (dokumen pengolah kata), .pdf (dokumen portabel tetap), .mp3 (berkas audio/musik), dan .mp4 (berkas video/gambar bergerak), lalu sebutkan contoh aplikasi yang sesuai untuk membuka masing-masing format tersebut."
    }
  },
  {
    id: "ESAI_05",
    nomor: 5,
    kategori: "Sistem Komputer",
    teks: "Komang sedang mengetik tugas makalah sebanyak 5 halaman di aplikasi Microsoft Word selama dua jam tanpa pernah menekan tombol simpan (Save). Tiba-tiba aliran listrik di rumahnya padam sehingga komputer PC miliknya langsung mati. Saat listrik kembali menyala, Komang mendapati ketikannya hilang karena tadi masih berada di memori sementara. Berdasarkan cara kerja komponen Sistem Komputer, komponen memori manakah yang sifatnya sementara (volatile/hilang saat listrik mati) tersebut, dan apa kebiasaan yang harus diterapkan Komang di kemudian hari agar datanya tersimpan permanen di SSD/Harddisk?",
    skor_maks: 2,
    pedoman_penskoran: "• Komponen memori sementara: RAM (Random Access Memory), karena seluruh data ketikan yang belum disimpan hanya berada di RAM dan akan hilang ketika arus listrik terputus (Skor 1).\n• Kebiasaan yang harus diterapkan: Segera menyimpan dokumen (menekan Ctrl + S atau menu Save) sejak awal mulai mengetik dan melakukannya secara berkala ke penyimpanan permanen (SSD/Harddisk), atau mengaktifkan fitur AutoSave (Skor 1).",
    bahan_bacaan: {
      judul: "Sifat Memori Sementara (Volatile) vs Penyimpanan Permanen",
      konten: "Data yang sedang diketik dan belum disimpan hanya berada di dalam memori kerja sementara yang bergantung pada aliran listrik (volatile), sehingga seluruh isinya otomatis terhapus ketika komputer mati mendadak. Agar data tersimpan secara permanen (non-volatile) di SSD/Harddisk, dokumen wajib disimpan secara berkala."
    }
  }
];

// Alias default untuk kompatibilitas
export const SOAL_POOL = SOAL_POOL_PG;

/**
 * Acak array soal menggunakan algoritma Fisher-Yates
 * @param {Array} array 
 * @returns {Array} Array teracak baru
 */
export function shuffleSoal(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Acak urutan pilihan jawaban (A, B, C, D)
 * @param {Array} opsi 
 * @returns {Array} Pilihan teracak
 */
export function shuffleOpsi(opsi) {
  const result = [...opsi];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Evaluasi skor siswa untuk 50 soal PG (Skala 0 - 100)
 * Setiap soal bernilai 2 poin (50 x 2 = 100)
 * 
 * @param {Object} jawabanSiswa - Map { [soalId]: teksJawabanDipilih }
 * @param {Array} soalList - Pool soal yang diujikan
 * @returns {{ skor: number, persentase: number, benar: number, salah: number, kosong: number, rincian: Object }}
 */
export function hitungNilaiSiswa(jawabanSiswa = {}, soalList = SOAL_POOL_PG) {
  let benar = 0;
  let salah = 0;
  let kosong = 0;
  const rincian = {};

  soalList.forEach((soal) => {
    const jawabanUser = jawabanSiswa[soal.id];
    if (!jawabanUser) {
      kosong++;
      rincian[soal.id] = { status: 'kosong', jawaban: null, kunci: soal.kunci };
    } else if (jawabanUser === soal.kunci) {
      benar++;
      rincian[soal.id] = { status: 'benar', jawaban: jawabanUser, kunci: soal.kunci };
    } else {
      salah++;
      rincian[soal.id] = { status: 'salah', jawaban: jawabanUser, kunci: soal.kunci };
    }
  });

  const totalSoal = soalList.length || 50;
  // Skor skala 100: (benar / totalSoal) * 100
  const skor = Math.round((benar / totalSoal) * 100);
  const persentase = Number(((benar / totalSoal) * 100).toFixed(2));

  return {
    skor,
    persentase,
    benar,
    salah,
    kosong,
    totalSoal,
    rincian
  };
}

