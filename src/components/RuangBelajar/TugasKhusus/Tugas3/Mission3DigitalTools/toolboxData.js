import {
  MessageSquare,
  Music,
  Video,
  Palette,
  FileSpreadsheet,
  FileText,
  Gamepad2,
  GraduationCap,
  Compass,
  HardDrive,
  ShieldCheck,
  Globe,
  CheckSquare,
  ShieldAlert,
  FolderOpen,
  Sparkles
} from 'lucide-react';

// ========================================================
// DATA 20 APLIKASI PERKAKAS DIGITAL UNTUK DIKELOMPOKKAN
// ========================================================
export const APP_20_TOOLS = [
  // 1. KOMUNIKASI & KOLABORASI (4 item)
  { id: 'app_whatsapp', name: 'WhatsApp', group: 'komunikasi', icon: MessageSquare, desc: 'Aplikasi perpesanan instan, kirim dokumen, dan panggilan suara/video.' },
  { id: 'app_zoom', name: 'Zoom Meetings', group: 'komunikasi', icon: Video, desc: 'Aplikasi video telekonferensi untuk rapat kelas virtual tatap muka.' },
  { id: 'app_discord', name: 'Discord', group: 'komunikasi', icon: MessageSquare, desc: 'Komunitas obrolan suara dan forum diskusi kelompok kordinasi.' },
  { id: 'app_gmail', name: 'Gmail / Email', group: 'komunikasi', icon: Globe, desc: 'Layanan surat elektronik resmi untuk berkirim pesan formal dan lampiran.' },

  // 2. HIBURAN & REKREASI (4 item)
  { id: 'app_youtube', name: 'YouTube', group: 'hiburan', icon: Video, desc: 'Platform streaming video tontonan kreatif, musik, dan konten edukasi hiburan.' },
  { id: 'app_spotify', name: 'Spotify Music', group: 'hiburan', icon: Music, desc: 'Layanan pemutar lagu streaming, playlist favorit, dan siaran podcast.' },
  { id: 'app_netflix', name: 'Netflix', group: 'hiburan', icon: Video, desc: 'Aplikasi streaming film, serial drama, dan dokumenter rekreasi.' },
  { id: 'app_roblox', name: 'Roblox / Game', group: 'hiburan', icon: Gamepad2, desc: 'Permainan virtual multipemain interaktif untuk mengisi waktu senggang.' },

  // 3. PRODUKTIVITAS & MANAJEMEN KERJA (4 item)
  { id: 'app_docs', name: 'Google Docs / Word', group: 'produktivitas', icon: FileText, desc: 'Pengolah kata untuk mengetik naskah, laporan makalah, dan artikel rapi.' },
  { id: 'app_excel', name: 'Microsoft Excel / Sheets', group: 'produktivitas', icon: FileSpreadsheet, desc: 'Pengolah lembar kerja angka, rumus akuntansi kas, dan grafik statistik.' },
  { id: 'app_canva', name: 'Canva Design', group: 'produktivitas', icon: Palette, desc: 'Perkakas desain grafis cepat untuk poster, pamflet, dan slide presentasi.' },
  { id: 'app_trello', name: 'Trello Task Board', group: 'produktivitas', icon: CheckSquare, desc: 'Papan manajemen tugas visual untuk membagi jadwal kerja tim kolaboratif.' },

  // 4. PEMBELAJARAN, EDUKASI & KREATIVITAS (4 item)
  { id: 'app_classroom', name: 'Google Classroom', group: 'edukasi', icon: GraduationCap, desc: 'Platform kelas maya untuk menerima materi, tugas guru, dan pengumuman.' },
  { id: 'app_duolingo', name: 'Duolingo', group: 'edukasi', icon: GraduationCap, desc: 'Aplikasi edukasi bahasa asing interaktif dengan sistem permainan asyik.' },
  { id: 'app_scratch', name: 'Scratch 3.0', group: 'edukasi', icon: Sparkles, desc: 'Aplikasi belajar logika koding pemrograman visual dengan blok balok kode.' },
  { id: 'app_ruangguru', name: 'Ruangguru', group: 'edukasi', icon: GraduationCap, desc: 'Aplikasi bimbingan belajar daring dengan video materi kurikulum sekolah.' },

  // 5. UTILITAS, SISTEM, NAVIGASI & KEAMANAN (4 item)
  { id: 'app_drive', name: 'Google Drive Cloud', group: 'utilitas', icon: HardDrive, desc: 'Media penyimpanan awan (cloud) untuk mencadangkan file penting secara online.' },
  { id: 'app_maps', name: 'Google Maps Navigasi', group: 'utilitas', icon: Compass, desc: 'Aplikasi peta digital penunjuk arah rute lalu lintas dan lokasi penting.' },
  { id: 'app_antivirus', name: 'Smadav / Defender', group: 'utilitas', icon: ShieldAlert, desc: 'Software pelindung sistem komputer dari ancaman malware dan virus flashdisk.' },
  { id: 'app_zip', name: '7-Zip / WinRAR', group: 'utilitas', icon: FolderOpen, desc: 'Perkakas untuk mengompresi kumpulan file menjadi satu arsip hemat ruang.' },
];

export const APP_GROUPS = [
  { id: 'komunikasi', label: '1. Komunikasi & Kolaborasi', icon: MessageSquare, color: 'border-blue-500/40 bg-blue-950/20 text-blue-400', desc: 'Berkirim pesan, rapat video, surat elektronik, dan koordinasi tim.' },
  { id: 'hiburan', label: '2. Hiburan & Rekreasi Media', icon: Music, color: 'border-purple-500/40 bg-purple-950/20 text-purple-400', desc: 'Mendengarkan musik, menonton film/video, dan bermain game santai.' },
  { id: 'produktivitas', label: '3. Produktivitas & Manajemen Kerja', icon: FileSpreadsheet, color: 'border-amber-500/40 bg-amber-950/20 text-amber-400', desc: 'Mengetik dokumen, olah angka keuangan, desain poster, dan tugas.' },
  { id: 'edukasi', label: '4. Pembelajaran, Edukasi & Kreativitas', icon: GraduationCap, color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400', desc: 'Kelas belajar daring, koding visual anak, dan latihan bahasa asing.' },
  { id: 'utilitas', label: '5. Utilitas, Sistem, Navigasi & Keamanan', icon: ShieldCheck, color: 'border-rose-500/40 bg-rose-950/20 text-rose-400', desc: 'Penyimpanan cloud, peta jalan, antivirus, dan manajemen file.' },
];

// ========================================================
// SOAL KUIS PERKAKAS DIGITAL & SOFTWARE
// ========================================================
export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Perangkat lunak yang dikategorikan sebagai "Perkakas Produktivitas" memiliki fungsi utama untuk...',
    options: [
      { id: 'a', text: 'Menguras bandwidth kuota data internet saat tidak digunakan' },
      { id: 'b', text: 'Membantu penyelesaian tugas dokumen dan pengolahan data' },
      { id: 'c', text: 'Mengubah warna fisik luar sirkuit casing perangkat laptop' },
      { id: 'd', text: 'Meningkatkan putaran desibel suara kipas pendingin mesin' },
    ],
    correct: 'b',
  },
  {
    id: 2,
    question: 'Jika kamu bersama teman ingin menyusun naskah tugas kelompok bersamaan dalam satu dokumen secara langsung (live online), perkakas yang paling tepat adalah...',
    options: [
      { id: 'a', text: 'Aplikasi pemutar rekaman video resolusi tinggi offline' },
      { id: 'b', text: 'Program kalkulator standar bawaan sistem operasi komputer' },
      { id: 'c', text: 'Notepad teks sederhana tanpa sambungan jaringan internet' },
      { id: 'd', text: 'Dokumen berbasis cloud dengan fitur kolaborasi real-time' },
    ],
    correct: 'd',
  },
  {
    id: 3,
    question: 'Perangkat lunak dengan lisensi "Open Source" (seperti Linux OS atau LibreOffice) memiliki karakteristik utama, yaitu...',
    options: [
      { id: 'a', text: 'Kode sumber bebas ditelaah, dimodifikasi, dan dibagikan' },
      { id: 'b', text: 'Wajib membayar lisensi tagihan berlangganan setiap bulan' },
      { id: 'c', text: 'Hanya diizinkan dibuka pada komputer berspesifikasi server' },
      { id: 'd', text: 'Dilarang keras disebarluaskan untuk kegiatan pendidikan' },
    ],
    correct: 'a',
  },
  {
    id: 4,
    question: 'Manakah padanan yang TEPAT antara kebutuhan komputasi pengguna dan kelompok perkakas digital pengolahnya?',
    options: [
      { id: 'a', text: 'Mencadangkan arsip foto ➔ Perangkat lunak editor audio radio' },
      { id: 'b', text: 'Menghapus malware jahat ➔ Perangkat lunak pemutar lagu MP3' },
      { id: 'c', text: 'Menghitung kas mingguan ➔ Aplikasi pengolah lembar sebar' },
      { id: 'd', text: 'Belajar animasi visual ➔ Kalkulator konversi mata uang' },
    ],
    correct: 'c',
  },
  {
    id: 5,
    question: 'Aplikasi yang bertugas sebagai pelindung laptop saat dicolokkan flashdisk asing agar sistem terhindar dari file berbahaya/malware tergolong dalam kelompok...',
    options: [
      { id: 'a', text: 'Perkakas Pemutar Musik Digital' },
      { id: 'b', text: 'Perkakas Utilitas & Proteksi Keamanan' },
      { id: 'c', text: 'Perkakas Desain Banner Spanduk' },
      { id: 'd', text: 'Perkakas Penjelajah Peramban Web' },
    ],
    correct: 'b',
  },
];
