/**
 * POOL SOAL ULANGAN INFORMATIKA TERPADU
 * Total: 140 Soal (14 Materi x 10 Soal)
 */

export const SOAL_POOL = [
    // ==========================================
    // SEMESTER 1 (BOBOT 25%)
    // ==========================================
  
    // --- 1. BK: KONSEP BERPIKIR KOMPUTASIONAL (C2, C4) ---
    { id: "BK01", materi: "Konsep BK", level: "C4", tanya: "Saat merancang rute terpendek untuk kurir paket, pilar BK yang paling dominan digunakan adalah...", opsi: ["Algoritma", "Dekomposisi", "Abstraksi", "Pola"], kunci: "Algoritma" },
    { id: "BK02", materi: "Konsep BK", level: "C2", tanya: "Melihat kesamaan antara cara kerja mencuci baju dan mencuci piring merupakan contoh...", opsi: ["Pengenalan Pola", "Dekomposisi", "Abstraksi", "Algoritma"], kunci: "Pengenalan Pola" },
    { id: "BK03", materi: "Konsep BK", level: "C4", tanya: "Seorang dokter mendiagnosa penyakit berdasarkan gejala yang ada. Proses menyisihkan gejala yang tidak relevan disebut...", opsi: ["Abstraksi", "Dekomposisi", "Algoritma", "Pola"], kunci: "Abstraksi" },
    { id: "BK04", materi: "Konsep BK", level: "C2", tanya: "Memecah masalah mesin motor yang mati menjadi pemeriksaan busi, bensin, dan aki adalah...", opsi: ["Dekomposisi", "Abstraksi", "Algoritma", "Pola"], kunci: "Dekomposisi" },
    { id: "BK05", materi: "Konsep BK", level: "C4", tanya: "Analisis data penjualan menunjukkan setiap Sabtu pembeli meningkat. Ini adalah penerapan...", opsi: ["Pengenalan Pola", "Abstraksi", "Dekomposisi", "Algoritma"], kunci: "Pengenalan Pola" },
    { id: "BK06", materi: "Konsep BK", level: "C2", tanya: "Langkah-langkah sistematis dalam membuat kopi yang enak disebut...", opsi: ["Algoritma", "Abstraksi", "Dekomposisi", "Pola"], kunci: "Algoritma" },
    { id: "BK07", materi: "Konsep BK", level: "C4", tanya: "Menentukan fitur utama pada aplikasi ojek online tanpa memikirkan warna tombol dulu disebut...", opsi: ["Abstraksi", "Algoritma", "Pola", "Dekomposisi"], kunci: "Abstraksi" },
    { id: "BK08", materi: "Konsep BK", level: "C2", tanya: "Dekomposisi dalam BK bertujuan untuk...", opsi: ["Menyederhanakan masalah besar", "Menyembunyikan detail", "Membuat urutan langkah", "Mencari kesamaan"], kunci: "Menyederhanakan masalah besar" },
    { id: "BK09", materi: "Konsep BK", level: "C4", tanya: "Algoritma yang baik harus bersifat...", opsi: ["Logis dan terbatas", "Acak dan bebas", "Rumit dan panjang", "Singkat dan membingungkan"], kunci: "Logis dan terbatas" },
    { id: "BK10", materi: "Konsep BK", level: "C2", tanya: "Salah satu manfaat berpikir komputasional bagi siswa adalah...", opsi: ["Melatih pemecahan masalah secara logis", "Mempercepat mengetik", "Memperbaiki hardware", "Menghafal rumus"], kunci: "Melatih pemecahan masalah secara logis" },
  
    // --- 2. BK: MS EXCEL & ORGANISASI DATA (C3, C4) ---
    { id: "EX01", materi: "MS Excel", level: "C3", tanya: "Rumus untuk menjumlahkan data dari sel B1 sampai B10 adalah...", opsi: ["=SUM(B1:B10)", "=AVERAGE(B1:B10)", "=COUNT(B1:B10)", "=MAX(B1:B10)"], kunci: "=SUM(B1:B10)" },
    { id: "EX02", materi: "MS Excel", level: "C4", tanya: "Jika di sel C1 tertulis '=A1+B1', saat A1=10 dan B1=5 hasil C1=15. Jika B1 diubah menjadi 10, maka C1 menjadi...", opsi: ["20", "15", "10", "Error"], kunci: "20" },
    { id: "EX03", materi: "MS Excel", level: "C3", tanya: "Untuk mencari nilai tertinggi dalam suatu rentang data menggunakan fungsi...", opsi: ["MAX", "MIN", "SUM", "AVERAGE"], kunci: "MAX" },
    { id: "EX04", materi: "MS Excel", level: "C4", tanya: "Fungsi yang digunakan jika kita ingin menghitung rata-rata nilai siswa adalah...", opsi: ["AVERAGE", "SUM", "COUNT", "IF"], kunci: "AVERAGE" },
    { id: "EX05", materi: "MS Excel", level: "C3", tanya: "Simbol yang digunakan untuk memulai sebuah rumus di Excel adalah...", opsi: ["=", "+", "*", "@"], kunci: "=" },
    { id: "EX06", materi: "MS Excel", level: "C4", tanya: "Pesan error '#DIV/0!' muncul karena...", opsi: ["Pembagian dengan angka 0", "Sel kosong", "Rumus salah ketik", "Data terlalu panjang"], kunci: "Pembagian dengan angka 0" },
    { id: "EX07", materi: "MS Excel", level: "C3", tanya: "Pertemuan antara baris (row) dan kolom (column) disebut...", opsi: ["Cell", "Range", "Sheet", "Workbook"], kunci: "Cell" },
    { id: "EX08", materi: "MS Excel", level: "C4", tanya: "Jika ingin mengunci posisi sel saat rumus disalin, kita menggunakan simbol...", opsi: ["$", "&", "%", "#"], kunci: "$" },
    { id: "EX09", materi: "MS Excel", level: "C3", tanya: "Kumpulan dari beberapa sel disebut...", opsi: ["Range", "Grid", "Area", "Block"], kunci: "Range" },
    { id: "EX10", materi: "MS Excel", level: "C4", tanya: "Fungsi '=COUNT(A1:A5)' digunakan untuk...", opsi: ["Menghitung jumlah sel berisi angka", "Menjumlahkan nilai sel", "Mencari rata-rata", "Mencari nilai tengah"], kunci: "Menghitung jumlah sel berisi angka" },
  
    // --- 3. LD: PENGELOLAAN FILE & FOLDER (C2) ---
    { id: "FF01", materi: "File Folder", level: "C2", tanya: "Ekstensi file '.docx' menandakan bahwa file tersebut adalah...", opsi: ["Dokumen Word", "Gambar", "Presentasi", "Tabel Excel"], kunci: "Dokumen Word" },
    { id: "FF02", materi: "File Folder", level: "C2", tanya: "Tombol kombinasi (shortcut) untuk menyalin (copy) file adalah...", opsi: ["Ctrl + C", "Ctrl + V", "Ctrl + X", "Ctrl + S"], kunci: "Ctrl + C" },
    { id: "FF03", materi: "File Folder", level: "C2", tanya: "Folder di dalam folder disebut dengan istilah...", opsi: ["Subfolder", "Parent folder", "Root", "Directory"], kunci: "Subfolder" },
    { id: "FF04", materi: "File Folder", level: "C2", tanya: "Tempat penampungan sementara file yang dihapus sebelum benar-benar hilang adalah...", opsi: ["Recycle Bin", "My Documents", "Desktop", "Download"], kunci: "Recycle Bin" },
    { id: "FF05", materi: "File Folder", level: "C2", tanya: "Ekstensi file untuk gambar biasanya adalah...", opsi: [".jpg", ".mp3", ".exe", ".txt"], kunci: ".jpg" },
    { id: "FF06", materi: "File Folder", level: "C2", tanya: "Shortcut 'Ctrl + X' digunakan untuk fungsi...", opsi: ["Memotong (Cut)", "Menempel (Paste)", "Mencetak", "Menutup"], kunci: "Memotong (Cut)" },
    { id: "FF07", materi: "File Folder", level: "C2", tanya: "Mengelompokkan file berdasarkan jenisnya bertujuan untuk...", opsi: ["Memudahkan pencarian", "Mempercepat internet", "Menghemat baterai", "Menambah RAM"], kunci: "Memudahkan pencarian" },
    { id: "FF08", materi: "File Folder", level: "C2", tanya: "Untuk mengubah nama file (rename), kita bisa menekan tombol...", opsi: ["F2", "F5", "F12", "Esc"], kunci: "F2" },
    { id: "FF09", materi: "File Folder", level: "C2", tanya: "Kumpulan data elektronik yang disimpan di media penyimpanan disebut...", opsi: ["File", "Folder", "Icon", "Taskbar"], kunci: "File" },
    { id: "FF10", materi: "File Folder", level: "C2", tanya: "Sistem operasi mengatur file dalam struktur...", opsi: ["Hierarkis", "Acak", "Linear", "Melingkar"], kunci: "Hierarkis" },
  
    // --- 4. LD: BROWSER & MESIN PENCARI (C2, C4) ---
    { id: "BS01", materi: "Browser", level: "C2", tanya: "Aplikasi yang digunakan untuk menjelajahi internet disebut...", opsi: ["Web Browser", "Search Engine", "Web Page", "Internet Explorer"], kunci: "Web Browser" },
    { id: "BS02", materi: "Browser", level: "C4", tanya: "Salah satu ciri sumber informasi internet yang kredibel (terpercaya) adalah...", opsi: ["Mencantumkan penulis dan sumber", "Banyak iklan pop-up", "Menggunakan bahasa gaul", "Judul sangat bombastis"], kunci: "Mencantumkan penulis dan sumber" },
    { id: "BS03", materi: "Browser", level: "C2", tanya: "Google dan Bing adalah contoh dari...", opsi: ["Search Engine", "Browser", "Social Media", "Operating System"], kunci: "Search Engine" },
    { id: "BS04", materi: "Browser", level: "C4", tanya: "Untuk mencari frasa yang pasti/persis di Google, kita menggunakan tanda...", opsi: ["Petik dua ( \" )", "Bintang ( * )", "Plus ( + )", "Kurung ( () )"], kunci: "Petik dua ( \" )" },
    { id: "BS05", materi: "Browser", level: "C2", tanya: "Alamat sebuah halaman web sering disebut dengan istilah...", opsi: ["URL", "HTTP", "WWW", "IP Address"], kunci: "URL" },
    { id: "BS06", materi: "Browser", level: "C4", tanya: "Simbol gembok di sebelah alamat URL menandakan bahwa...", opsi: ["Koneksi terenkripsi (Aman)", "Web sedang diperbaiki", "Web berbayar", "Web dilarang dibuka"], kunci: "Koneksi terenkripsi (Aman)" },
    { id: "BS07", materi: "Browser", level: "C2", tanya: "Fitur untuk menyimpan alamat web agar mudah dibuka lagi adalah...", opsi: ["Bookmark", "History", "Download", "Tab"], kunci: "Bookmark" },
    { id: "BS08", materi: "Browser", level: "C4", tanya: "Domain '.edu' biasanya digunakan untuk institusi...", opsi: ["Pendidikan", "Pemerintah", "Perdagangan", "Organisasi"], kunci: "Pendidikan" },
    { id: "BS09", materi: "Browser", level: "C2", tanya: "Menghapus 'Browsing History' bertujuan untuk...", opsi: ["Menjaga privasi", "Mempercepat download", "Menghemat kuota", "Menambah sinyal"], kunci: "Menjaga privasi" },
    { id: "BS10", materi: "Browser", level: "C4", tanya: "Situs ensiklopedia terbuka yang sering digunakan untuk mencari informasi adalah...", opsi: ["Wikipedia", "Instagram", "WhatsApp", "Spotify"], kunci: "Wikipedia" },
  
    // --- 5. LD: ETIKA MEDIA SOSIAL & SUREL (C2) ---
    { id: "ET01", materi: "Etika Digital", level: "C2", tanya: "Segala jejak aktivitas kita di internet yang tertinggal disebut...", opsi: ["Rekam jejak digital", "History browser", "Cache", "Cookies"], kunci: "Rekam jejak digital" },
    { id: "ET02", materi: "Etika Digital", level: "C2", tanya: "Perilaku merundung atau mengejek orang lain di media sosial disebut...", opsi: ["Cyberbullying", "Phishing", "Spamming", "Hacking"], kunci: "Cyberbullying" },
    { id: "ET03", materi: "Etika Digital", level: "C2", tanya: "Saat mengirim email, bagian 'Subject' harus diisi dengan...", opsi: ["Inti/Judul pesan", "Alamat pengirim", "Isi surat lengkap", "Lampiran"], kunci: "Inti/Judul pesan" },
    { id: "ET04", materi: "Etika Digital", level: "C2", tanya: "Singkatan dari 'Carbon Copy' dalam pengiriman email adalah...", opsi: ["CC", "BCC", "To", "Subject"], kunci: "CC" },
    { id: "ET05", materi: "Etika Digital", level: "C2", tanya: "Menggunakan huruf kapital semua dalam berkomunikasi di internet dianggap...", opsi: ["Berteriak/Kurang sopan", "Sangat penting", "Sangat formal", "Gaul"], kunci: "Berteriak/Kurang sopan" },
    { id: "ET06", materi: "Etika Digital", level: "C2", tanya: "Berita bohong yang bertujuan untuk memprovokasi disebut...", opsi: ["Hoax", "Viral", "Trending", "Spam"], kunci: "Hoax" },
    { id: "ET07", materi: "Etika Digital", level: "C2", tanya: "Sebelum membagikan informasi (share), kita harus melakukan...", opsi: ["Saring sebelum sharing", "Langsung share", "Bayar kuota", "Copy paste"], kunci: "Saring sebelum sharing" },
    { id: "ET08", materi: "Etika Digital", level: "C2", tanya: "Mengambil karya orang lain dan mengakuinya sebagai milik sendiri adalah...", opsi: ["Plagiarisme", "Abstraksi", "Dekomposisi", "Enkripsi"], kunci: "Plagiarisme" },
    { id: "ET09", materi: "Etika Digital", level: "C2", tanya: "Email yang masuk secara bertubi-tubi dan tidak diinginkan disebut...", opsi: ["Spam", "Draft", "Inbox", "Sent"], kunci: "Spam" },
    { id: "ET10", materi: "Etika Digital", level: "C2", tanya: "Untuk melindungi akun dari hacker, kita harus menggunakan password yang...", opsi: ["Kuat dan unik", "Tanggal lahir", "Mudah diingat", "Nama sendiri"], kunci: "Kuat dan unik" },
  
    // ==========================================
    // SEMESTER 2 (BOBOT 75%)
    // ==========================================
  
    // --- 6. BK: ALGORITMA PEMROGRAMAN (C2, C3, C4) ---
    { id: "AL01", materi: "Algoritma", level: "C2", tanya: "Struktur algoritma yang menjalankan langkah demi langkah secara berurutan disebut...", opsi: ["Sekuensial", "Percabangan", "Perulangan", "Fungsi"], kunci: "Sekuensial" },
    { id: "AL02", materi: "Algoritma", level: "C3", tanya: "Jika X = 5, kemudian ada perintah 'X = X + 2', maka nilai X sekarang adalah...", opsi: ["7", "5", "2", "10"], kunci: "7" },
    { id: "AL03", materi: "Algoritma", level: "C4", tanya: "Simbol Belah Ketupat (Diamond) dalam Flowchart berfungsi untuk...", opsi: ["Keputusan/Kondisi", "Mulai/Selesai", "Proses", "Input/Output"], kunci: "Keputusan/Kondisi" },
    { id: "AL04", materi: "Algoritma", level: "C2", tanya: "Algoritma 'Perulangan' digunakan saat...", opsi: ["Melakukan instruksi berulang kali", "Memilih salah satu jalur", "Hanya satu instruksi", "Berhenti"], kunci: "Melakukan instruksi berulang kali" },
    { id: "AL05", materi: "Algoritma", level: "C3", tanya: "Urutan yang benar untuk membuat teh adalah...", opsi: ["Seduh teh > Tambah gula > Sajikan", "Sajikan > Minum > Buat", "Beli teh > Sajikan > Seduh", "Minum > Seduh > Sajikan"], kunci: "Seduh teh > Tambah gula > Sajikan" },
    { id: "AL06", materi: "Algoritma", level: "C4", tanya: "Logika 'IF Nilai > 75 THEN Lulus' adalah contoh dari...", opsi: ["Percabangan", "Perulangan", "Sekuensial", "Abstraksi"], kunci: "Percabangan" },
    { id: "AL07", materi: "Algoritma", level: "C2", tanya: "Bahasa semu yang menyerupai kode program namun mudah dibaca manusia disebut...", opsi: ["Pseudocode", "Binary", "Assembly", "Hardware"], kunci: "Pseudocode" },
    { id: "AL08", materi: "Algoritma", level: "C3", tanya: "Simbol Jajar Genjang dalam flowchart digunakan untuk...", opsi: ["Input/Output Data", "Proses", "Terminator", "Arus"], kunci: "Input/Output Data" },
    { id: "AL09", materi: "Algoritma", level: "C4", tanya: "Looping 'For i=1 to 5' akan menjalankan instruksi sebanyak...", opsi: ["5 kali", "1 kali", "0 kali", "Tak terhingga"], kunci: "5 kali" },
    { id: "AL10", materi: "Algoritma", level: "C2", tanya: "Tempat menyimpan nilai sementara dalam pemrograman disebut...", opsi: ["Variabel", "Konstanta", "Output", "Input"], kunci: "Variabel" },
  
    // --- 7. BK: PEMROGRAMAN VISUAL (SCRATCH) (C3, C4) ---
    { id: "SC01", materi: "Scratch", level: "C3", tanya: "Blok kode Scratch yang berwarna oranye gelap biasanya berfungsi untuk...", opsi: ["Variabel / Control", "Gerakan (Motion)", "Suara", "Tampilan"], kunci: "Variabel / Control" },
    { id: "SC02", materi: "Scratch", level: "C4", tanya: "Jika ingin sprite bergerak selamanya, kita menggunakan blok...", opsi: ["Forever", "Repeat 10", "Wait", "If"], kunci: "Forever" },
    { id: "SC03", materi: "Scratch", level: "C3", tanya: "Blok 'When Green Flag Clicked' berfungsi sebagai...", opsi: ["Pemicu mulai program", "Penghenti program", "Penambah skor", "Ganti kostum"], kunci: "Pemicu mulai program" },
    { id: "SC04", materi: "Scratch", level: "C4", tanya: "Untuk mendeteksi jika sprite menyentuh pinggir layar, kita menggunakan blok...", opsi: ["If on edge, bounce", "Move 10 steps", "Point in direction", "Say Hello"], kunci: "If on edge, bounce" },
    { id: "SC05", materi: "Scratch", level: "C3", tanya: "Tokoh/objek dalam Scratch disebut dengan istilah...", opsi: ["Sprite", "Script", "Stage", "Costume"], kunci: "Sprite" },
    { id: "SC06", materi: "Scratch", level: "C4", tanya: "Bagian layar tempat sprite beraksi disebut...", opsi: ["Stage", "Script Area", "Palette", "Backpack"], kunci: "Stage" },
    { id: "SC07", materi: "Scratch", level: "C3", tanya: "Blok warna Biru Muda (Sensing) digunakan untuk...", opsi: ["Mendeteksi sentuhan/input", "Menggerakkan sprite", "Mengatur suara", "Matematika"], kunci: "Mendeteksi sentuhan/input" },
    { id: "SC08", materi: "Scratch", level: "C4", tanya: "Koordinat tengah panggung Scratch adalah...", opsi: ["X:0, Y:0", "X:100, Y:100", "X:-100, Y:0", "X:0, Y:240"], kunci: "X:0, Y:0" },
    { id: "SC09", materi: "Scratch", level: "C3", tanya: "Untuk mengubah penampilan sprite, kita menggunakan blok...", opsi: ["Looks", "Motion", "Sound", "Pen"], kunci: "Looks" },
    { id: "SC10", materi: "Scratch", level: "C4", tanya: "Logic 'If Touching Mouse Pointer' berada di kelompok warna...", opsi: ["Biru Muda (Sensing)", "Biru Tua (Motion)", "Hijau (Operator)", "Kuning (Events)"], kunci: "Biru Muda (Sensing)" },
  
    // --- 8. BK: PENGANTAR SISTEM KOMPUTER (C2, C4) ---
    { id: "SK01", materi: "Sistem Komputer", level: "C2", tanya: "Siklus pengolahan data pada sistem komputer yang benar adalah...", opsi: ["Input > Proses > Output", "Output > Proses > Input", "Proses > Input > Output", "Input > Output > Proses"], kunci: "Input > Proses > Output" },
    { id: "SK02", materi: "Sistem Komputer", level: "C4", tanya: "Manusia yang mengoperasikan komputer disebut...", opsi: ["Brainware", "Hardware", "Software", "Malware"], kunci: "Brainware" },
    { id: "SK03", materi: "Sistem Komputer", level: "C2", tanya: "Perangkat keras yang termasuk alat output adalah...", opsi: ["Monitor", "Keyboard", "Mouse", "Scanner"], kunci: "Monitor" },
    { id: "SK04", materi: "Sistem Komputer", level: "C4", tanya: "Sistem operasi (Windows, Linux) termasuk ke dalam golongan...", opsi: ["Software", "Hardware", "Brainware", "Firmware"], kunci: "Software" },
    { id: "SK05", materi: "Sistem Komputer", level: "C2", tanya: "Perangkat keras yang berfungsi memasukkan data (input) adalah...", opsi: ["Keyboard", "Printer", "Monitor", "Speaker"], kunci: "Keyboard" },
    { id: "SK06", materi: "Sistem Komputer", level: "C4", tanya: "Bagian dari komputer yang melakukan perhitungan aritmatika disebut...", opsi: ["ALU", "CU", "Register", "RAM"], kunci: "ALU" },
    { id: "SK07", materi: "Sistem Komputer", level: "C2", tanya: "Storage device berfungsi untuk...", opsi: ["Penyimpanan data", "Memproses data", "Menampilkan data", "Input data"], kunci: "Penyimpanan data" },
    { id: "SK08", materi: "Sistem Komputer", level: "C4", tanya: "Interaksi manusia dengan komputer melalui suara disebut...", opsi: ["Voice User Interface", "GUI", "CLI", "Touch Screen"], kunci: "Voice User Interface" },
    { id: "SK09", materi: "Sistem Komputer", level: "C2", tanya: "Mouse dan Keyboard terhubung ke komputer melalui...", opsi: ["Port USB", "Power Supply", "Monitor", "Kabel LAN"], kunci: "Port USB" },
    { id: "SK10", materi: "Sistem Komputer", level: "C4", tanya: "Jika komputer hang/macet, komponen yang kemungkinan penuh muatannya adalah...", opsi: ["RAM", "Speaker", "Monitor", "Keyboard"], kunci: "RAM" },
  
    // --- 9. BK: HARDWARE & SOFTWARE (C1, C2) ---
    { id: "HS01", materi: "Hardware Software", level: "C1", tanya: "Komponen komputer yang dapat dilihat dan diraba secara fisik disebut...", opsi: ["Hardware", "Software", "Brainware", "Operating System"], kunci: "Hardware" },
    { id: "HS02", materi: "Hardware Software", level: "C2", tanya: "Fungsi utama dari RAM adalah...", opsi: ["Penyimpanan sementara", "Penyimpanan permanen", "Otak komputer", "Mencetak data"], kunci: "Penyimpanan sementara" },
    { id: "HS03", materi: "Hardware Software", level: "C1", tanya: "Papan sirkuit utama tempat semua komponen komputer terpasang disebut...", opsi: ["Motherboard", "Power Supply", "Processor", "VGA Card"], kunci: "Motherboard" },
    { id: "HS04", materi: "Hardware Software", level: "C2", tanya: "Software yang berfungsi mengolah kata adalah...", opsi: ["Microsoft Word", "Microsoft Excel", "Photoshop", "Chrome"], kunci: "Microsoft Word" },
    { id: "HS05", materi: "Hardware Software", level: "C1", tanya: "VGA Card berfungsi untuk mengolah data...", opsi: ["Grafis / Gambar", "Suara", "Teks", "Internet"], kunci: "Grafis / Gambar" },
    { id: "HS06", materi: "Hardware Software", level: "C2", tanya: "Android dan iOS adalah contoh software kategori...", opsi: ["Sistem Operasi Mobile", "Antivirus", "Desain Grafis", "Game"], kunci: "Sistem Operasi Mobile" },
    { id: "HS07", materi: "Hardware Software", level: "C1", tanya: "Alat untuk mencetak dokumen ke kertas adalah...", opsi: ["Printer", "Scanner", "Plotter", "Monitor"], kunci: "Printer" },
    { id: "HS08", materi: "Hardware Software", level: "C2", tanya: "Harddisk adalah media penyimpanan yang bersifat...", opsi: ["Permanen / Non-volatile", "Sementara", "Hanya baca", "Virtual"], kunci: "Permanen / Non-volatile" },
    { id: "HS09", materi: "Hardware Software", level: "C1", tanya: "Satuan kecepatan Processor adalah...", opsi: ["Hertz (Hz)", "Byte (B)", "Pixel (Px)", "Watt (W)"], kunci: "Hertz (Hz)" },
    { id: "HS10", materi: "Hardware Software", level: "C2", tanya: "Software gratis yang kode sumbernya boleh dimodifikasi disebut...", opsi: ["Open Source", "Freeware", "Shareware", "Adware"], kunci: "Open Source" },
  
    // --- 10. BK: BILANGAN BINER (C3) ---
    { id: "BN01", materi: "Biner", level: "C3", tanya: "Bilangan biner dari angka desimal 8 adalah...", opsi: ["1000", "1111", "0001", "1010"], kunci: "1000" },
    { id: "BN02", materi: "Biner", level: "C3", tanya: "Bilangan desimal dari biner 0011 adalah...", opsi: ["3", "1", "2", "4"], kunci: "3" },
    { id: "BN03", materi: "Biner", level: "C3", tanya: "Sistem bilangan biner hanya terdiri dari angka...", opsi: ["0 dan 1", "1 dan 2", "0 sampai 9", "A sampai F"], kunci: "0 dan 1" },
    { id: "BN04", materi: "Biner", level: "C3", tanya: "Satu Byte terdiri dari berapa Bit?", opsi: ["8 Bit", "4 Bit", "16 Bit", "10 Bit"], kunci: "8 Bit" },
    { id: "BN05", materi: "Biner", level: "C3", tanya: "Biner 1010 jika dikonversi ke desimal menjadi...", opsi: ["10", "12", "8", "5"], kunci: "10" },
    { id: "BN06", materi: "Biner", level: "C3", tanya: "Desimal 5 jika diubah ke biner menjadi...", opsi: ["0101", "1010", "1100", "1111"], kunci: "0101" },
    { id: "BN07", materi: "Biner", level: "C3", tanya: "Hasil dari biner 0001 + 0001 adalah...", opsi: ["0010", "0001", "1000", "1111"], kunci: "0010" },
    { id: "BN08", materi: "Biner", level: "C3", tanya: "Nilai desimal terbesar yang bisa ditampung 4 bit biner (1111) adalah...", opsi: ["15", "16", "10", "8"], kunci: "15" },
    { id: "BN09", materi: "Biner", level: "C3", tanya: "Digit biner disebut juga dengan istilah...", opsi: ["Bit", "Byte", "Kilo", "Mega"], kunci: "Bit" },
    { id: "BN10", materi: "Biner", level: "C3", tanya: "Komputer menggunakan biner karena sirkuit elektroniknya hanya mengenal kondisi...", opsi: ["On dan Off", "Panas dan Dingin", "Angka dan Huruf", "Input dan Output"], kunci: "On dan Off" },
  
    // --- 11. LD: ANTARMUKA PENGGUNA (UI) (C2, C4) ---
    { id: "UI01", materi: "UI", level: "C2", tanya: "Antarmuka yang menggunakan gambar/ikon untuk memudahkan pengguna disebut...", opsi: ["GUI", "CLI", "VUI", "Menu"], kunci: "GUI" },
    { id: "UI02", materi: "UI", level: "C4", tanya: "Kekurangan utama antarmuka berbasis teks (CLI) adalah...", opsi: ["Harus menghafal perintah", "Sangat lambat", "Boros memori", "Tampilan terlalu warna-warni"], kunci: "Harus menghafal perintah" },
    { id: "UI03", materi: "UI", level: "C2", tanya: "Contoh antarmuka suara (VUI) yang populer adalah...", opsi: ["Google Assistant / Siri", "Windows Explorer", "Command Prompt", "Microsoft Word"], kunci: "Google Assistant / Siri" },
    { id: "UI04", materi: "UI", level: "C4", tanya: "GUI singkatan dari...", opsi: ["Graphical User Interface", "Global Unit Internal", "General User Icon", "Graphics Utility Info"], kunci: "Graphical User Interface" },
    { id: "UI05", materi: "UI", level: "C2", tanya: "Interaksi melalui layar sentuh termasuk jenis...", opsi: ["Direct Manipulation", "CLI", "VUI", "Hardware"], kunci: "Direct Manipulation" },
    { id: "UI06", materi: "UI", level: "C4", tanya: "Kelebihan CLI dibandingkan GUI bagi profesional IT adalah...", opsi: ["Lebih cepat dan efisien", "Lebih cantik", "Mudah dipelajari pemula", "Banyak animasi"], kunci: "Lebih cepat dan efisien" },
    { id: "UI07", materi: "UI", level: "C2", tanya: "Warna, tata letak, dan jenis huruf dalam aplikasi diatur oleh seorang...", opsi: ["UI Designer", "Programmer", "Hardware Engineer", "System Analyst"], kunci: "UI Designer" },
    { id: "UI08", materi: "UI", level: "C4", tanya: "Menu 'Start' pada Windows adalah bagian dari antarmuka...", opsi: ["GUI", "CLI", "VUI", "BIOS"], kunci: "GUI" },
    { id: "UI09", materi: "UI", level: "C2", tanya: "Command Prompt di Windows adalah contoh antarmuka...", opsi: ["CLI", "GUI", "VUI", "Touch"], kunci: "CLI" },
    { id: "UI10", materi: "UI", level: "C4", tanya: "Kemudahan pengguna dalam mengoperasikan aplikasi disebut...", opsi: ["User Experience (UX)", "Hardware", "Operating System", "Processing"], kunci: "User Experience (UX)" },
  
    // --- 12. LD: APLIKASI PERKANTORAN (C2, C3) ---
    { id: "AP01", materi: "Aplikasi Perkantoran", level: "C2", tanya: "Aplikasi yang digunakan untuk membuat presentasi adalah...", opsi: ["MS PowerPoint", "MS Word", "MS Excel", "MS Access"], kunci: "MS PowerPoint" },
    { id: "AP02", materi: "Aplikasi Perkantoran", level: "C3", tanya: "Untuk menyisipkan gambar ke dalam dokumen Word, kita menggunakan menu...", opsi: ["Insert", "Home", "Layout", "Review"], kunci: "Insert" },
    { id: "AP03", materi: "Aplikasi Perkantoran", level: "C2", tanya: "Fungsi 'Mail Merge' pada MS Word digunakan untuk...", opsi: ["Membuat surat massal", "Mengirim email", "Membuat tabel", "Menghitung angka"], kunci: "Membuat surat massal" },
    { id: "AP04", materi: "Aplikasi Perkantoran", level: "C3", tanya: "Mengambil data dari Excel dan menempelkannya di Word agar tetap terhubung disebut...", opsi: ["Object Linking", "Copy Paste Biasa", "Export", "Import"], kunci: "Object Linking" },
    { id: "AP05", materi: "Aplikasi Perkantoran", level: "C2", tanya: "Shortcut 'Ctrl + S' berfungsi untuk...", opsi: ["Menyimpan (Save)", "Mencetak", "Keluar", "Membuka baru"], kunci: "Menyimpan (Save)" },
    { id: "AP06", materi: "Aplikasi Perkantoran", level: "C3", tanya: "Untuk mengatur orientasi kertas menjadi miring (melebar), kita memilih...", opsi: ["Landscape", "Portrait", "A4", "Margin"], kunci: "Landscape" },
    { id: "AP07", materi: "Aplikasi Perkantoran", level: "C2", tanya: "Software perkantoran gratis buatan Google yang mirip Excel adalah...", opsi: ["Google Sheets", "Google Docs", "Google Slides", "Google Forms"], kunci: "Google Sheets" },
    { id: "AP08", materi: "Aplikasi Perkantoran", level: "C3", tanya: "Efek perpindahan antar slide dalam PowerPoint disebut...", opsi: ["Transition", "Animation", "Design", "Layout"], kunci: "Transition" },
    { id: "AP09", materi: "Aplikasi Perkantoran", level: "C2", tanya: "Format file standar untuk dokumen yang tidak mudah berubah tampilannya adalah...", opsi: [".pdf", ".docx", ".txt", ".rtf"], kunci: ".pdf" },
    { id: "AP10", materi: "Aplikasi Perkantoran", level: "C3", tanya: "Untuk membuat daftar nomor otomatis di Word, kita menggunakan fitur...", opsi: ["Numbering", "Bullets", "Bold", "Italic"], kunci: "Numbering" },
  
    // --- 13. LD: JARINGAN KOMPUTER & INTERNET (C2, C4) ---
    { id: "JK01", materi: "Jaringan", level: "C2", tanya: "Jaringan komputer yang mencakup area lokal seperti satu kantor atau sekolah disebut...", opsi: ["LAN", "WAN", "MAN", "Internet"], kunci: "LAN" },
    { id: "JK02", materi: "JK", level: "C4", tanya: "Alat yang berfungsi menghubungkan beberapa jaringan dan menentukan jalur data terbaik adalah...", opsi: ["Router", "Switch", "Hub", "Modem"], kunci: "Router" },
    { id: "JK03", materi: "JK", level: "C2", tanya: "Kepanjangan dari Wi-Fi adalah...", opsi: ["Wireless Fidelity", "Wired Fiber", "Wireless Firewall", "Wide Find"], kunci: "Wireless Fidelity" },
    { id: "JK04", materi: "JK", level: "C4", tanya: "Kumpulan jaringan komputer yang saling terhubung di seluruh dunia disebut...", opsi: ["Internet", "Intranet", "Ethernet", "Web"], kunci: "Internet" },
    { id: "JK05", materi: "JK", level: "C2", tanya: "Satu identitas unik setiap perangkat dalam jaringan disebut...", opsi: ["IP Address", "MAC Address", "Username", "Domain"], kunci: "IP Address" },
    { id: "JK06", materi: "JK", level: "C4", tanya: "Teknologi seluler terbaru yang menawarkan kecepatan internet sangat tinggi adalah...", opsi: ["5G", "4G", "3G", "Edge"], kunci: "5G" },
    { id: "JK07", materi: "JK", level: "C2", tanya: "Alat yang mengubah sinyal analog menjadi digital dan sebaliknya adalah...", opsi: ["Modem", "Server", "Client", "Switch"], kunci: "Modem" },
    { id: "JK08", materi: "JK", level: "C4", tanya: "Komputer yang bertugas melayani permintaan data dari komputer lain disebut...", opsi: ["Server", "Client", "User", "Admin"], kunci: "Server" },
    { id: "JK09", materi: "JK", level: "C2", tanya: "Topologi jaringan yang berbentuk seperti lingkaran disebut...", opsi: ["Ring", "Star", "Bus", "Mesh"], kunci: "Ring" },
    { id: "JK10", materi: "JK", level: "C4", tanya: "Kabel jaringan yang menggunakan cahaya untuk mengirim data adalah...", opsi: ["Fiber Optic", "UTP", "Coaxial", "Listrik"], kunci: "Fiber Optic" },
  
    // --- 14. LD: PROTEKSI DATA (KRIPTOGRAFI) (C3) ---
    { id: "KG01", materi: "Kriptografi", level: "C3", tanya: "Proses mengubah pesan asli menjadi pesan rahasia disebut...", opsi: ["Enkripsi", "Dekripsi", "Abstraksi", "Dekomposisi"], kunci: "Enkripsi" },
    { id: "KG02", materi: "KG", level: "C3", tanya: "Metode geser huruf tertua yang digunakan Julius Caesar disebut...", opsi: ["Caesar Cipher", "RSA", "Hash", "Vigenere"], kunci: "Caesar Cipher" },
    { id: "KG03", materi: "KG", level: "C3", tanya: "Proses mengembalikan pesan rahasia menjadi pesan asli disebut...", opsi: ["Dekripsi", "Enkripsi", "Encoding", "Modulasi"], kunci: "Dekripsi" },
    { id: "KG04", materi: "KG", level: "C3", tanya: "Pada Caesar Cipher geser 1, kata 'HALO' menjadi...", opsi: ["IBMP", "GZKN", "JAMQ", "KBNR"], kunci: "IBMP" },
    { id: "KG05", materi: "KG", level: "C3", tanya: "Pesan yang sudah dienkripsi dan tidak bisa dibaca disebut...", opsi: ["Ciphertext", "Plaintext", "Key", "Secret"], kunci: "Ciphertext" },
    { id: "KG06", materi: "KG", level: "C3", tanya: "Pesan asli sebelum dienkripsi disebut...", opsi: ["Plaintext", "Ciphertext", "Source", "Data"], kunci: "Plaintext" },
    { id: "KG07", materi: "KG", level: "C3", tanya: "Kunci dalam kriptografi digunakan untuk...", opsi: ["Mengunci/Membuka pesan", "Menghapus pesan", "Mengirim pesan", "Mencetak pesan"], kunci: "Mengunci/Membuka pesan" },
    { id: "KG08", materi: "KG", level: "C3", tanya: "Keamanan data di WhatsApp menggunakan teknologi enkripsi...", opsi: ["End-to-End Encryption", "Public Enkripsi", "No Encryption", "Basic Enkripsi"], kunci: "End-to-End Encryption" },
    { id: "KG09", materi: "KG", level: "C3", tanya: "Pada Caesar Cipher geser 2, huruf 'A' menjadi...", opsi: ["C", "B", "D", "E"], kunci: "C" },
    { id: "KG10", materi: "KG", level: "C3", tanya: "Tujuan utama kriptografi adalah menjaga...", opsi: ["Kerahasiaan data", "Kecepatan data", "Ukuran data", "Warna data"], kunci: "Kerahasiaan data" }
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
          [newArray[currentIndex], newArray[randomIndex]] = [
              newArray[randomIndex], newArray[currentIndex]];
      }
      return newArray;
  };
  
  /**
   * Fungsi bantu untuk mengacak urutan pilihan jawaban
   */
  export const shuffleOpsi = (opsiArray) => {
      return [...opsiArray].sort(() => Math.random() - 0.5);
  };

  const generateUjianPin = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Tanpa 'I', 'O', '1', '0' agar tidak bingung
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };