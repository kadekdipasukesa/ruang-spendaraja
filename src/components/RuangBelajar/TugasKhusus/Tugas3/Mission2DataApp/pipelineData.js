import {
  GraduationCap,
  ShoppingCart,
  Activity
} from 'lucide-react';

export const PIPELINE_CASES = [
  {
    id: 'case_school',
    icon: GraduationCap,
    title: 'Kasus 1: Pengolahan Nilai & Rapor Sekolah',
    description: 'Sekolah mengolah data mentah kumpulan nilai tugas, ulangan harian, dan absensi kehadiran siswa menjadi lembar rapor resmi semester.',
    correctInput: 'Daftar angka nilai harian & presensi absensi siswa',
    correctApp: 'Aplikasi Spreadsheet / Sistem Informasi Akademik',
    correctOutput: 'Buku Rapor Digital & Rekap Peringkat Prestasi Siswa',
    inputs: [
      'Daftar angka nilai harian & presensi absensi siswa',
      'Daftar buku paket bacaan & denah tata ruang kelas',
      'Jadwal giliran piket harian & menu makanan kantin',
    ],
    apps: [
      'Aplikasi Desain Grafis / Editor Ilustrasi Digital',
      'Aplikasi Spreadsheet / Sistem Informasi Akademik',
      'Aplikasi Peramban Web / Pengunduh Dokumen Online',
    ],
    outputs: [
      'Buku Rapor Digital & Rekap Peringkat Prestasi Siswa',
      'Kuitansi Pembayaran Kain Seragam Olahraga Sekolah',
      'Lembar Denah Jalur Evakuasi Kebakaran Gedung Guru',
    ],
  },
  {
    id: 'case_supermarket',
    icon: ShoppingCart,
    title: 'Kasus 2: Mesin Kasir & Transaksi Minimarket',
    description: 'Kasir memindai kode barcode belanjaan pembeli untuk menghitung total harga pembayaran dan mencetak struk belanja.',
    correctInput: 'Kode barcode produk & kuantitas jumlah belanjaan',
    correctApp: 'Aplikasi Point of Sales / Kasir Komputer Toko',
    correctOutput: 'Struk Total Belanja & Pembaruan Stok Barang Kasir',
    inputs: [
      'Kode barcode produk & kuantitas jumlah belanjaan',
      'Nomor rekening supplier & kuitansi tagihan listrik',
      'Riwayat panggilan nomor toko & jadwal kirim gudang',
    ],
    apps: [
      'Aplikasi Pengolah Kata / Pengetikan Naskah Buku',
      'Aplikasi Point of Sales / Kasir Komputer Toko',
      'Aplikasi Editor Rekaman Suara / Podcast Digital',
    ],
    outputs: [
      'Struk Total Belanja & Pembaruan Stok Barang Kasir',
      'Surat Izin Edar Produk Makanan Dari Badan POM',
      'Buku Panduan Petunjuk Servis Mesin Pendingin Es',
    ],
  },
  {
    id: 'case_smartwatch',
    icon: Activity,
    title: 'Kasus 3: Jam Tangan Pintar (Smartwatch Kesehatan)',
    description: 'Sensor pada smartwatch merekam denyut nadi dan jumlah getaran langkah kaki pengguna sepanjang hari.',
    correctInput: 'Sinyal sensor detak jantung & jumlah langkah kaki',
    correctApp: 'Aplikasi Health Tracker & Pemantau Kebugaran Raga',
    correctOutput: 'Laporan Kalori Terbakar & Ringkasan Kebugaran Tubuh',
    inputs: [
      'Sinyal sensor detak jantung & jumlah langkah kaki',
      'Daftar nama kontak darurat & agenda janji dokter',
      'Rekaman suara perintah memo & nada alarm pengingat',
    ],
    apps: [
      'Aplikasi Health Tracker & Pemantau Kebugaran Raga',
      'Aplikasi Pemutar Musik Digital & Pembuat Nada Dering',
      'Aplikasi Navigasi Maritim & Pengukur Kedalaman Laut',
    ],
    outputs: [
      'Laporan Kalori Terbakar & Ringkasan Kebugaran Tubuh',
      'Sertifikat Kelayakan Garansi Baterai Arloji Pintar',
      'Arsip Berkas Manual Petunjuk Pemakaian Gadget Jam',
    ],
  },
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Perbedaan mendasar antara konsep DATA MENTAH dan INFORMASI dalam pemrosesan komputer adalah...',
    options: [
      { id: 'a', text: 'Data mentah berupa file video, sedangkan informasi berupa sinyal suara' },
      { id: 'b', text: 'Data sudah tersusun rapi, sedangkan informasi merupakan catatan acak' },
      { id: 'c', text: 'Data adalah fakta mentah acak, sedangkan Informasi olahan bermakna' },
      { id: 'd', text: 'Data tersimpan di flashdisk, sedangkan informasi ada di layar kaca' },
    ],
    correct: 'c',
  },
  {
    id: 2,
    question: 'Dalam siklus pengolahan data komputer, posisi dan fungsi utama APLIKASI (Software) adalah...',
    options: [
      { id: 'a', text: 'Penyedia daya listrik baterai cadangan penopang motherboard' },
      { id: 'b', text: 'Mesin pengolah yang memproses input menjadi output informasi' },
      { id: 'c', text: 'Perangkat fisik penyambung koneksi kabel layar monitor' },
      { id: 'd', text: 'Penyaring partikel debu halus pada ventilasi kipas prosesor' },
    ],
    correct: 'b',
  },
  {
    id: 3,
    question: 'Siswa memasukkan angka nilai "80, 90, 75, 85" ke program spreadsheet, lalu muncul teks "Rata-rata: 82.5 (Tuntas)". Manakah yang merupakan INFORMASI?',
    options: [
      { id: 'a', text: 'Papan ketik keyboard mekanik yang diketik oleh siswa' },
      { id: 'b', text: 'Kabel stopkontak penghubung arus listrik komputer' },
      { id: 'c', text: 'Kumpulan deretan angka acak nilai mentah 80, 90, 75, 85' },
      { id: 'd', text: 'Teks hasil perhitungan akhir "Rata-rata: 82.5 (Tuntas)"' },
    ],
    correct: 'd',
  },
  {
    id: 4,
    question: 'Manakah ilustrasi yang tepat menggambarkan perubahan dari data mentah menjadi informasi pada aplikasi Navigasi GPS?',
    options: [
      { id: 'a', text: 'Koordinat satelit & volume jalan diolah menjadi petunjuk rute tercepat' },
      { id: 'b', text: 'Suhu baterai ponsel diubah menjadi nada dering musik telepon pemanggil' },
      { id: 'c', text: 'Foto pemandangan kota diubah menjadi kuota data internet berkecepatan' },
      { id: 'd', text: 'Suara klakson kendaraan diubah menjadi saldo uang tunai elektronik' },
    ],
    correct: 'a',
  },
  {
    id: 5,
    question: 'Mengapa dalam pengolahan data sistem informatika berlaku hukum prinsip GIGO (Garbage In, Garbage Out)?',
    options: [
      { id: 'a', text: 'Komputer butuh pembersihan fisik agar tidak menimbun berkas lama' },
      { id: 'b', text: 'Input data yang keliru akan menghasilkan informasi yang salah pula' },
      { id: 'c', text: 'Komputer akan mematikan diri secara otomatis jika data tidak lengkap' },
      { id: 'd', text: 'Program aplikasi hanya dapat bekerja jika memori komputer dikosongkan' },
    ],
    correct: 'b',
  },
];
