/**
 * DATABASE SOAL TERSTRUKTUR (50 SOAL)
 * Komposisi: Semester 1 (25% / 12 Soal) & Semester 2 (75% / 38 Soal)
 * Level: Campuran LOTS, MOTS, HOTS
 */

export const SOAL_POOL = [
  // === SEMESTER 1 (12 SOAL) ===
  // 1. Berpikir Komputasional (BK) - 3 Soal
  { id: "BK01", semester: 1, materi: "Berpikir Komputasional", kunci: "Dekomposisi", opsi: ["Dekomposisi", "Abstraksi", "Algoritma", "Pengenalan Pola"], teks: "Memecah masalah kompleks menjadi bagian-bagian kecil yang lebih mudah dikelola disebut..." },
  { id: "BK02", semester: 1, materi: "Berpikir Komputasional", kunci: "Abstraksi", opsi: ["Abstraksi", "Dekomposisi", "Sorting", "Searching"], teks: "Menghilangkan detail yang tidak relevan dan fokus pada karakteristik esensial adalah prinsip..." },
  { id: "BK03", semester: 1, materi: "Berpikir Komputasional", kunci: "Algoritma", opsi: ["Algoritma", "Variabel", "Looping", "Debugging"], teks: "Urutan langkah logis untuk menyelesaikan masalah secara sistematis disebut..." },

  // 2. MS Excel & Organisasi Data - 3 Soal
  { id: "EX01", semester: 1, materi: "Excel", kunci: "=SUM(A1:A10)", opsi: ["=SUM(A1:A10)", "=ADD(A1:A10)", "=TOTAL(A1:A10)", "=COUNT(A1:A10)"], teks: "Rumus Excel yang benar untuk menjumlahkan data dari sel A1 sampai A10 adalah..." },
  { id: "EX02", semester: 1, materi: "Excel", kunci: "Cell", opsi: ["Cell", "Range", "Sheet", "Column"], teks: "Pertemuan antara baris (row) dan kolom (column) pada Excel disebut..." },
  { id: "EX03", semester: 1, materi: "Excel", kunci: "=AVERAGE", opsi: ["=AVERAGE", "=MEAN", "=MEDIAN", "=MAX"], teks: "Fungsi untuk mencari nilai rata-rata dalam suatu range data adalah..." },

  // 3. Pengelolaan File & Folder - 2 Soal
  { id: "LD01", semester: 1, materi: "File & Folder", kunci: "CTRL + C", opsi: ["CTRL + C", "CTRL + V", "CTRL + X", "CTRL + Z"], teks: "Shortcut keyboard untuk menyalin (copy) sebuah file adalah..." },
  { id: "LD02", semester: 1, materi: "File & Folder", kunci: ".docx", opsi: [".docx", ".xlsx", ".pptx", ".jpg"], teks: "Ekstensi file yang dihasilkan oleh aplikasi Microsoft Word adalah..." },

  // 4. Browser & Mesin Pencari - 2 Soal
  { id: "LD03", semester: 1, materi: "Browser", kunci: "Google Chrome", opsi: ["Google Chrome", "Windows 10", "Microsoft Excel", "Photoshop"], teks: "Manakah yang termasuk dalam perangkat lunak penjelajah internet (browser)?" },
  { id: "LD04", semester: 1, materi: "Browser", kunci: "Search Engine", opsi: ["Search Engine", "Web Mail", "Social Media", "Internet Banking"], teks: "Situs web yang dirancang khusus untuk membantu pengguna menemukan informasi di internet disebut..." },

  // 5. Etika Media Sosial & Surel - 2 Soal
  { id: "LD05", semester: 1, materi: "Etika Digital", kunci: "Subject", opsi: ["Subject", "CC", "BCC", "Spam"], teks: "Bagian pada email yang digunakan untuk memberikan judul ringkas pesan adalah..." },
  { id: "LD06", semester: 1, materi: "Etika Digital", kunci: "Cyberbullying", opsi: ["Cyberbullying", "Browsing", "Streaming", "Uploading"], teks: "Tindakan mengejek atau mengintimidasi orang lain di media sosial disebut..." },

  // === SEMESTER 2 (38 SOAL) ===
  // 6. Algoritma Pemrograman - 5 Soal
  { id: "AL01", semester: 2, materi: "Algoritma", kunci: "Oval", opsi: ["Oval", "Persegi", "Jajar Genjang", "Belah Ketupat"], teks: "Simbol flowchart yang digunakan untuk menandai Start (Mulai) atau End (Selesai) adalah..." },
  { id: "AL02", semester: 2, materi: "Algoritma", kunci: "Belah Ketupat", opsi: ["Belah Ketupat", "Oval", "Persegi", "Lingkaran"], teks: "Simbol flowchart yang berfungsi untuk percabangan atau pengambilan keputusan (Decision) adalah..." },
  { id: "AL03", semester: 2, materi: "Algoritma", kunci: "Variabel", opsi: ["Variabel", "Konstanta", "Operator", "Fungsi"], teks: "Wadah untuk menyimpan data yang nilainya dapat berubah-ubah selama program berjalan disebut..." },
  { id: "AL04", semester: 2, materi: "Algoritma", kunci: "Input", opsi: ["Input", "Output", "Proses", "Iterasi"], teks: "Tahap dalam algoritma di mana data dimasukkan ke dalam sistem disebut..." },
  { id: "AL05", semester: 2, materi: "Algoritma", kunci: "Logika", opsi: ["Logika", "Sintaks", "Bahasa", "Desain"], teks: "Kesalahan program yang membuat hasil perhitungan tidak sesuai (padahal program tidak error) disebut kesalahan..." },

  // 7. Pemrograman Visual (Scratch) - 5 Soal
  { id: "SC01", semester: 2, materi: "Scratch", kunci: "Sprite", opsi: ["Sprite", "Stage", "Script", "Costume"], teks: "Karakter atau objek yang dapat diprogram dalam aplikasi Scratch disebut..." },
  { id: "SC02", semester: 2, materi: "Scratch", kunci: "Green Flag", opsi: ["Green Flag", "Red Button", "Blue Block", "Yellow Icon"], teks: "Simbol yang digunakan untuk menjalankan program di Scratch secara umum adalah..." },
  { id: "SC03", semester: 2, materi: "Scratch", kunci: "Backdrop", opsi: ["Backdrop", "Sprite", "Block", "Variable"], teks: "Latar belakang pada panggung Scratch disebut dengan..." },
  { id: "SC04", semester: 2, materi: "Scratch", kunci: "Repeat", opsi: ["Repeat", "If-Then", "Set-To", "Say"], teks: "Block yang digunakan untuk melakukan perulangan perintah adalah..." },
  { id: "SC05", semester: 2, materi: "Scratch", kunci: "Orange", opsi: ["Orange", "Blue", "Green", "Purple"], teks: "Block 'Variables' pada Scratch ditandai dengan warna..." },

  // 8. Pengantar Sistem Komputer - 4 Soal
  { id: "SK01", semester: 2, materi: "Sistem Komputer", kunci: "Input-Proses-Output", opsi: ["Input-Proses-Output", "Output-Input-Proses", "Proses-Input-Output", "Input-Output-Proses"], teks: "Siklus kerja komputer yang benar adalah..." },
  { id: "SK02", semester: 2, materi: "Sistem Komputer", kunci: "CPU", opsi: ["CPU", "Monitor", "Keyboard", "Speaker"], teks: "Komponen yang disebut sebagai otak dari komputer adalah..." },
  { id: "SK03", semester: 2, materi: "Sistem Komputer", kunci: "RAM", opsi: ["RAM", "Harddisk", "Flashdisk", "CD-ROM"], teks: "Memori utama komputer yang bersifat sementara (volatile) adalah..." },
  { id: "SK04", semester: 2, materi: "Sistem Komputer", kunci: "Operating System", opsi: ["Operating System", "Application", "Brainware", "Malware"], teks: "Perangkat lunak yang berfungsi mengelola sumber daya hardware secara dasar adalah..." },

  // 9. Hardware & Software - 4 Soal
  { id: "HS01", semester: 2, materi: "Hardware Software", kunci: "Hardware", opsi: ["Hardware", "Software", "Brainware", "Firmware"], teks: "Komponen fisik komputer yang dapat disentuh secara langsung disebut..." },
  { id: "HS02", semester: 2, materi: "Hardware Software", kunci: "Mouse", opsi: ["Mouse", "Monitor", "Printer", "Projector"], teks: "Berikut ini yang merupakan contoh perangkat input adalah..." },
  { id: "HS03", semester: 2, materi: "Hardware Software", kunci: "Printer", opsi: ["Printer", "Scanner", "Keyboard", "Microphone"], teks: "Manakah yang merupakan perangkat output?" },
  { id: "HS04", semester: 2, materi: "Hardware Software", kunci: "Aplikasi", opsi: ["Aplikasi", "Sistem Operasi", "BIOS", "Compiler"], teks: "Microsoft Word, Canva, dan CapCut termasuk dalam kategori perangkat lunak..." },

  // 10. Bilangan Biner - 4 Soal
  { id: "BN01", semester: 2, materi: "Biner", kunci: "0 dan 1", opsi: ["0 dan 1", "0 sampai 9", "1 dan 2", "A sampai Z"], teks: "Bilangan biner hanya terdiri dari dua angka, yaitu..." },
  { id: "BN02", semester: 2, materi: "Biner", kunci: "5", opsi: ["5", "4", "6", "7"], teks: "Angka desimal dari bilangan biner 0101 adalah..." },
  { id: "BN03", semester: 2, materi: "Biner", kunci: "1010", opsi: ["1010", "1111", "1001", "1100"], teks: "Bilangan biner dari angka desimal 10 adalah..." },
  { id: "BN04", semester: 2, materi: "Biner", kunci: "Bit", opsi: ["Bit", "Byte", "Pixel", "Hertz"], teks: "Satuan terkecil dalam data digital disebut..." },

  // 11. Antarmuka Pengguna (UI) - 4 Soal
  { id: "UI01", semester: 2, materi: "UI", kunci: "GUI", opsi: ["GUI", "CLI", "VUI", "TUI"], teks: "Antarmuka yang menggunakan gambar, ikon, dan menu disebut..." },
  { id: "UI02", semester: 2, materi: "UI", kunci: "Ikon", opsi: ["Ikon", "Folder", "Taskbar", "Cursor"], teks: "Simbol kecil berupa gambar yang mewakili aplikasi atau file disebut..." },
  { id: "UI03", semester: 2, materi: "UI", kunci: "Wallpaper", opsi: ["Wallpaper", "Screensaver", "Desktop", "Window"], teks: "Gambar latar belakang pada layar utama komputer disebut..." },
  { id: "UI04", semester: 2, materi: "UI", kunci: "Drag and Drop", opsi: ["Drag and Drop", "Copy Paste", "Cut Paste", "Double Click"], teks: "Aksi menggeser objek menggunakan mouse dan melepasnya di tempat lain disebut..." },

  // 12. Aplikasi Perkantoran - 3 Soal
  { id: "AP01", semester: 2, materi: "Perkantoran", kunci: "Presentasi", opsi: ["Presentasi", "Surat Menyurat", "Olah Data", "Edit Video"], teks: "Fungsi utama dari aplikasi Microsoft PowerPoint adalah..." },
  { id: "AP02", semester: 2, materi: "Perkantoran", kunci: "Table", opsi: ["Table", "Text Box", "Shape", "Chart"], teks: "Fitur yang digunakan untuk menyusun data dalam bentuk baris dan kolom disebut..." },
  { id: "AP03", semester: 2, materi: "Perkantoran", kunci: "Header & Footer", opsi: ["Header & Footer", "Margins", "Orientation", "Columns"], teks: "Fitur untuk memberikan catatan tetap di bagian atas atau bawah setiap halaman adalah..." },

  // 13. Jaringan Komputer & Internet - 3 Soal
  { id: "JK01", semester: 2, materi: "Jaringan", kunci: "Router", opsi: ["Router", "Switch", "Hub", "Cable"], teks: "Perangkat yang digunakan untuk menghubungkan dua jaringan yang berbeda disebut..." },
  { id: "JK02", semester: 2, materi: "Jaringan", kunci: "LAN", opsi: ["LAN", "WAN", "MAN", "PAN"], teks: "Jaringan komputer yang mencakup area gedung atau sekolah saja disebut..." },
  { id: "JK03", semester: 2, materi: "Jaringan", kunci: "Wi-Fi", opsi: ["Wi-Fi", "Bluetooth", "Inframerah", "Fiber Optic"], teks: "Teknologi jaringan nirkabel lokal yang paling umum digunakan saat ini adalah..." },

  // 14. Proteksi Data (Kriptografi) - 2 Soal
  { id: "KR01", semester: 2, materi: "Kriptografi", kunci: "Enkripsi", opsi: ["Enkripsi", "Deskripsi", "Injeksi", "Redaksi"], teks: "Proses mengacak data agar tidak dapat dibaca tanpa kunci khusus disebut..." },
  { id: "KR02", semester: 2, materi: "Kriptografi", kunci: "Password", opsi: ["Password", "Username", "Status", "Email"], teks: "Salah satu cara paling dasar untuk melindungi kerahasiaan akun digital adalah..." },

  //tambahan
  { id: "JK04", semester: 2, materi: "Jaringan", kunci: "IP Address", opsi: ["IP Address", "Username", "Domain", "Password"], teks: "Alamat unik yang digunakan untuk mengidentifikasi perangkat dalam jaringan komputer disebut..." },
  { id: "KR03", semester: 2, materi: "Kriptografi", kunci: "Two-Factor Authentication", opsi: ["Two-Factor Authentication", "Incognito Mode", "Clipboard", "Auto Save"], teks: "Metode keamanan akun yang menggunakan dua tahap verifikasi disebut..." },
  { id: "SC06", semester: 2, materi: "Scratch", kunci: "If-Then", opsi: ["If-Then", "Repeat", "Move 10 Steps", "Wait"], teks: "Blok Scratch yang digunakan untuk membuat percabangan atau kondisi adalah..." },
  { id: "SK05", semester: 2, materi: "Sistem Komputer", kunci: "Brainware", opsi: ["Brainware", "Hardware", "Software", "Firmware"], teks: "Pengguna atau manusia yang mengoperasikan sistem komputer disebut..." }
];

/**
 * Fungsi bantu untuk mengacak soal (Fisher-Yates Shuffle)
 */
export const shuffleSoal = (array) => {
  let currentIndex = array.length, randomIndex;
  const newArray = [...array];
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
};

/**
 * Fungsi bantu mengacak opsi
 */
export const shuffleOpsi = (opsiArray) => {
  return [...opsiArray].sort(() => Math.random() - 0.5);
};

/**
 * Fungsi hitung nilai skala 0-100
 */
export const hitungNilaiSiswa = (jawabanSiswa, pool) => {
  if (!jawabanSiswa || !pool) return 0;
  let benar = 0;
  pool.forEach(s => {
    if (jawabanSiswa[s.id] === s.kunci) benar++;
  });
  return Math.round((benar / pool.length) * 100);
};