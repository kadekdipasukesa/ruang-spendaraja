import {
  Cpu,
  HardDrive,
  Layers,
  Monitor,
  Keyboard,
  Mouse,
  Mic,
  Camera,
  Scan,
  QrCode,
  Tv,
  Printer,
  Volume2,
  Zap,
  Radio,
  FileCode2,
  AppWindow,
  Globe,
  MessageSquare,
  Music,
  Video,
  Palette,
  Compass,
  FileSpreadsheet,
  FileText,
  Gamepad2,
  GraduationCap
} from 'lucide-react';

// ==========================================
// DATA 20 KOMPONEN PERANGKAT KERAS (HARDWARE)
// ==========================================
export const HARDWARE_20_ITEMS = [
  { id: 'hw_keyboard', name: 'Keyboard (Papan Ketik)', category: 'input', icon: Keyboard, hint: 'Memasukkan karakter teks, angka, dan kombinasi shortcut perintah.' },
  { id: 'hw_mouse', name: 'Mouse Optik', category: 'input', icon: Mouse, hint: 'Menggerakkan pointer kursor dan memilih objek di layar secara presisi.' },
  { id: 'hw_mic', name: 'Mikrofon (Microphone)', category: 'input', icon: Mic, hint: 'Menangkap gelombang suara analog menjadi sinyal audio digital komputer.' },
  { id: 'hw_webcam', name: 'Webcam (Kamera Web)', category: 'input', icon: Camera, hint: 'Menangkap gambar video wajah secara langsung untuk panggilan daring.' },
  { id: 'hw_scanner', name: 'Scanner Dokumen', category: 'input', icon: Scan, hint: 'Memindai lembaran kertas fisik menjadi berkas dokumen PDF/gambar.' },
  { id: 'hw_barcode', name: 'Barcode & QR Scanner', category: 'input', icon: QrCode, hint: 'Membaca kode optik barcode kasir/kartu ujian ke dalam sistem.' },
  
  { id: 'hw_cpu', name: 'Processor (CPU)', category: 'process', icon: Cpu, hint: 'Otak komputasi utama yang mengeksekusi instruksi aritmatika & logika.' },
  { id: 'hw_gpu', name: 'VGA Card (GPU Grafis)', category: 'process', icon: Tv, hint: 'Memproses rendering gambar 3D, grafis game berat, dan video visual.' },
  { id: 'hw_mobo', name: 'Motherboard (Mainboard)', category: 'process', icon: Radio, hint: 'Papan sirkuit induk yang menghubungkan seluruh komponen agar berkomunikasi.' },
  { id: 'hw_soundcard', name: 'Sound Card Audio', category: 'process', icon: Volume2, hint: 'Chip pengolah sinyal suara digital menjadi gelombang audio berkualitas.' },
  
  { id: 'hw_ram', name: 'RAM (Random Access Memory)', category: 'storage', icon: Layers, hint: 'Memori kerja berkecepatan tinggi yang aktif saat komputer menyala (volatile).' },
  { id: 'hw_ssd', name: 'SSD NVMe / SATA', category: 'storage', icon: HardDrive, hint: 'Penyimpanan non-volatile berkecepatan tinggi untuk booting OS dan data.' },
  { id: 'hw_hdd', name: 'Harddisk Drive (HDD)', category: 'storage', icon: HardDrive, hint: 'Penyimpanan piringan magnetik berkapasitas besar untuk arsip data jangka panjang.' },
  { id: 'hw_flashdisk', name: 'Flashdisk USB', category: 'storage', icon: HardDrive, hint: 'Media penyimpanan portabel yang mudah dipindah-pindahkan antar komputer.' },
  
  { id: 'hw_monitor', name: 'Monitor LED / Layar', category: 'output', icon: Monitor, hint: 'Menampilkan antarmuka visual grafik dan hasil proses komputer.' },
  { id: 'hw_speaker', name: 'Speaker Audio Stereo', category: 'output', icon: Volume2, hint: 'Mengeluarkan suara nada, musik, dan efek audio dari komputer.' },
  { id: 'hw_printer', name: 'Printer Inkjet / Laser', category: 'output', icon: Printer, hint: 'Mencetak dokumen digital dan gambar ke atas media kertas fisik.' },
  { id: 'hw_projector', name: 'Proyektor InFocus', category: 'output', icon: Monitor, hint: 'Memproyeksikan tampilan layar ke dinding/layar besar di kelas.' },
  
  { id: 'hw_psu', name: 'Power Supply Unit (PSU)', category: 'auxiliary', icon: Zap, hint: 'Mengubah arus listrik AC PLN menjadi daya DC untuk semua komponen.' },
  { id: 'hw_cooler', name: 'Heatsink & Fan Cooler', category: 'auxiliary', icon: Zap, hint: 'Mendinginkan dan menjaga suhu processor agar tidak terjadi overheat.' },
];

export const HW_CATEGORIES = [
  { id: 'input', label: '1. Perangkat Masukan (Input)', icon: Keyboard, color: 'border-blue-500/40 bg-blue-950/20 text-blue-400', desc: 'Memasukkan data/sinyal dari pengguna ke komputer' },
  { id: 'process', label: '2. Perangkat Pemrosesan (Process)', icon: Cpu, color: 'border-amber-500/40 bg-amber-950/20 text-amber-400', desc: 'Mengolah logika instruksi dan perhitungan data' },
  { id: 'storage', label: '3. Perangkat Penyimpanan (Storage)', icon: HardDrive, color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400', desc: 'Menyimpan data sementara (RAM) maupun permanen (SSD/HDD)' },
  { id: 'output', label: '4. Perangkat Keluaran (Output)', icon: Monitor, color: 'border-purple-500/40 bg-purple-950/20 text-purple-400', desc: 'Menampilkan hasil olahan data ke bentuk visual/suara/cetak' },
  { id: 'auxiliary', label: '5. Perangkat Pendukung (Power & Cooler)', icon: Zap, color: 'border-rose-500/40 bg-rose-950/20 text-rose-400', desc: 'Mendukung daya listrik, pendinginan, dan stabilitas perangkat' },
];

// ==========================================
// DATA 20 PERANGKAT LUNAK (OS vs APLIKASI)
// ==========================================
export const SOFTWARE_20_ITEMS = [
  { id: 'sw_win11', name: 'Windows 11', type: 'os', icon: AppWindow, desc: 'Sistem operasi desktop populer buatan Microsoft.' },
  { id: 'sw_linux', name: 'Linux Ubuntu', type: 'os', icon: FileCode2, desc: 'Sistem operasi open-source yang tangguh dan gratis.' },
  { id: 'sw_macos', name: 'Apple macOS', type: 'os', icon: AppWindow, desc: 'Sistem operasi eksklusif komputer Apple Mac.' },
  { id: 'sw_android', name: 'Android OS', type: 'os', icon: Globe, desc: 'Sistem operasi paling banyak digunakan di smartphone & tablet.' },
  { id: 'sw_ios', name: 'Apple iOS', type: 'os', icon: AppWindow, desc: 'Sistem operasi mobile untuk iPhone dan iPad.' },
  { id: 'sw_chromeos', name: 'ChromeOS', type: 'os', icon: Globe, desc: 'Sistem operasi ringan berbasis web browser dari Google.' },

  { id: 'sw_word', name: 'Microsoft Word', type: 'app', icon: FileText, desc: 'Aplikasi pengolah kata untuk membuat makalah & naskah.' },
  { id: 'sw_excel', name: 'Microsoft Excel', type: 'app', icon: FileSpreadsheet, desc: 'Aplikasi spreadsheet pengolah angka, rumus, dan tabel.' },
  { id: 'sw_chrome', name: 'Google Chrome', type: 'app', icon: Globe, desc: 'Aplikasi peramban web browser untuk menjelajah internet.' },
  { id: 'sw_wa', name: 'WhatsApp', type: 'app', icon: MessageSquare, desc: 'Aplikasi komunikasi berkirim pesan dan panggilan daring.' },
  { id: 'sw_photoshop', name: 'Adobe Photoshop', type: 'app', icon: Palette, desc: 'Aplikasi profesional untuk manipulasi dan edit grafis foto.' },
  { id: 'sw_vlc', name: 'VLC Media Player', type: 'app', icon: Video, desc: 'Aplikasi pemutar video dan musik serbaguna.' },
  { id: 'sw_capcut', name: 'CapCut Video Editor', type: 'app', icon: Video, desc: 'Aplikasi penyuntingan video kreatif dengan efek modern.' },
  { id: 'sw_spotify', name: 'Spotify Music', type: 'app', icon: Music, desc: 'Aplikasi streaming lagu dan siaran siniar (podcast).' },
  { id: 'sw_canva', name: 'Canva', type: 'app', icon: Palette, desc: 'Aplikasi desain grafis berbasis web untuk poster dan slide.' },
  { id: 'sw_zoom', name: 'Zoom Meetings', type: 'app', icon: Video, desc: 'Aplikasi telekonferensi video tatap muka jarak jauh.' },
  { id: 'sw_scratch', name: 'Scratch 3.0', type: 'app', icon: FileCode2, desc: 'Aplikasi pemrograman visual berbasis blok blok koding.' },
  { id: 'sw_roblox', name: 'Roblox / Game Studio', type: 'app', icon: Gamepad2, desc: 'Aplikasi permainan kreasi simulasi dunia virtual.' },
  { id: 'sw_duolingo', name: 'Duolingo', type: 'app', icon: GraduationCap, desc: 'Aplikasi edukasi interaktif untuk belajar bahasa asing.' },
  { id: 'sw_maps', name: 'Google Maps', type: 'app', icon: Compass, desc: 'Aplikasi navigasi rute jalan dan pemetaan peta digital.' },
];

export const SW_CATEGORIES = [
  { id: 'os', label: '🖥️ Sistem Operasi (Operating System / OS)', color: 'border-amber-500/40 bg-amber-950/20 text-amber-300', desc: 'Perangkat lunak dasar yang mengelola perangkat keras dan menjadi pondasi bagi aplikasi lain.' },
  { id: 'app', label: '📱 Perangkat Lunak Aplikasi (Application Software)', color: 'border-blue-500/40 bg-blue-950/20 text-blue-300', desc: 'Perangkat lunak yang dirancang untuk menyelesaikan tugas spesifik kebutuhan pengguna.' },
];

// ==========================================
// SOAL KUIS SISTEM KOMPUTER
// ==========================================
export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Jika komputer tiba-tiba padam karena pemadaman listrik, data yang sedang aktif di RAM seketika hilang. Karakteristik memori tersebut disebut...',
    options: [
      { id: 'a', text: 'Non-volatile yang menyimpan berkas secara permanen' },
      { id: 'b', text: 'Read-only memory yang hanya dapat dibaca prosesor' },
      { id: 'c', text: 'Volatile yang memerlukan daya listrik konstan aktif' },
      { id: 'd', text: 'Virtual storage yang tersinkronisasi server awan' },
    ],
    correct: 'c',
  },
  {
    id: 2,
    question: 'Komponen perangkat keras yang bertindak sebagai pusat pemrosesan logika, kontrol instruksi, dan perhitungan matematis adalah...',
    options: [
      { id: 'a', text: 'Central Processing Unit sebagai otak utama pemroses' },
      { id: 'b', text: 'Power Supply Unit sebagai penyuplai arus daya listrik' },
      { id: 'c', text: 'Heatsink Fan Cooler pendingin temperatur sirkuit' },
      { id: 'd', text: 'Solid State Drive penyimpan berkas sistem digital' },
    ],
    correct: 'a',
  },
  {
    id: 3,
    question: 'Di antara kelompok perangkat berikut, manakah deretan yang seluruhnya berfungsi mengirimkan data masukan ke sistem komputer?',
    options: [
      { id: 'a', text: 'Monitor LCD, Proyektor Digital, dan Speaker Stereo' },
      { id: 'b', text: 'Printer Laser, Plotter Grafis, dan Monitor Layar' },
      { id: 'c', text: 'Solid State Drive, Flashdisk USB, dan Random RAM' },
      { id: 'd', text: 'Keyboard USB, Mouse Optik, Scanner, dan Mikrofon' },
    ],
    correct: 'd',
  },
  {
    id: 4,
    question: 'Manakah pernyataan yang paling tepat dalam membedakan peran Sistem Operasi dengan Perangkat Lunak Aplikasi?',
    options: [
      { id: 'a', text: 'Aplikasi mengontrol sirkuit fisik, sedangkan Sistem Operasi mengetik naskah' },
      { id: 'b', text: 'Sistem Operasi mengelola sumber daya dasar, sedangkan Aplikasi melayani tugas spesifik' },
      { id: 'c', text: 'Aplikasi bekerja mandiri tanpa OS, sedangkan Sistem Operasi butuh browser' },
      { id: 'd', text: 'Sistem Operasi berupa kabel jaringan, sedangkan Aplikasi berupa papan ketik' },
    ],
    correct: 'b',
  },
  {
    id: 5,
    question: 'Papan sirkuit utama terintegrasi yang menjadi jalur komunikasi dan penghubung antara CPU, RAM, GPU, dan storage adalah...',
    options: [
      { id: 'a', text: 'Sound Card audio kontroler' },
      { id: 'b', text: 'Network Interface Card LAN' },
      { id: 'c', text: 'Motherboard papan sirkuit induk' },
      { id: 'd', text: 'Power Distribution Unit PSU' },
    ],
    correct: 'c',
  },
];
