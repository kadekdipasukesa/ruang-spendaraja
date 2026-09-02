import { useState, useEffect, useRef } from 'react';
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
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
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
  GraduationCap,
  RotateCcw
} from 'lucide-react';
import { RealAssetThumbnail, celebratePointGain } from '../skAssets';
import { soundEffects } from '../../../../../utils/gameAudio';

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
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Jika komputer tiba-tiba mati mendadak saat listrik padam, data yang tersimpan di RAM akan hilang seketika. Sifat memori ini disebut...',
    options: [
      { id: 'a', text: 'Non-Volatile (Permanen & Tetap Tersimpan)' },
      { id: 'b', text: 'Volatile (Sementara / Bergantung Aliran Listrik)' },
      { id: 'c', text: 'Read-Only Memory (ROM)' },
      { id: 'd', text: 'Cloud Storage Server' },
    ],
    correct: 'b',
  },
  {
    id: 2,
    question: 'Komponen perangkat keras yang sering diibaratkan sebagai "Otak Utama" karena bertugas mengeksekusi instruksi dan mengontrol lalu lintas data adalah...',
    options: [
      { id: 'a', text: 'Central Processing Unit (CPU)' },
      { id: 'b', text: 'Power Supply Unit (PSU)' },
      { id: 'c', text: 'Heatsink Fan Cooler' },
      { id: 'd', text: 'Casing Komputer' },
    ],
    correct: 'a',
  },
  {
    id: 3,
    question: 'Di antara pilihan berikut, kelompok manakah yang seluruhnya merupakan PERANGKAT MASUKAN (Input Device)?',
    options: [
      { id: 'a', text: 'Monitor, Printer, Proyektor' },
      { id: 'b', text: 'Keyboard, Mouse, Mikrofon, Scanner' },
      { id: 'c', text: 'Speaker, SSD, Flashdisk' },
      { id: 'd', text: 'RAM, Processor, Motherboard' },
    ],
    correct: 'b',
  },
  {
    id: 4,
    question: 'Manakah pernyataan yang paling tepat mengenai perbedaan Sistem Operasi (OS) dan Aplikasi?',
    options: [
      { id: 'a', text: 'OS adalah perangkat keras, sedangkan aplikasi adalah kabel' },
      { id: 'b', text: 'OS mengelola sumber daya perangkat keras dan menjalankan komputer, sedangkan Aplikasi membantu pengguna mengerjakan tugas tertentu (mengetik, edit video, dll)' },
      { id: 'c', text: 'Aplikasi bisa berjalan lancar di komputer tanpa memerlukan Sistem Operasi' },
      { id: 'd', text: 'OS hanya dipakai untuk bermain game saja' },
    ],
    correct: 'b',
  },
  {
    id: 5,
    question: 'Papan sirkuit elektronik utama tempat terhubungnya CPU, RAM, kartu grafis, dan media penyimpanan agar dapat saling bertukar data disebut...',
    options: [
      { id: 'a', text: 'Motherboard (Mainboard)' },
      { id: 'b', text: 'Sound Card' },
      { id: 'c', text: 'Optical Drive' },
      { id: 'd', text: 'Modem Jaringan' },
    ],
    correct: 'a',
  },
];

export default function HardwareExplorer({ currentScore, onComplete }) {
  const [activeTab, setActiveTab] = useState('materi'); // 'materi' | 'hw_drag' | 'sw_drag' | 'kuis'

  // State Penempatan 20 Komponen Hardware
  const [hwPlacements, setHwPlacements] = useState(() => {
    const init = {};
    HARDWARE_20_ITEMS.forEach((item) => {
      init[item.id] = '';
    });
    return init;
  });
  const [shuffledHwList, setShuffledHwList] = useState(() =>
    [...HARDWARE_20_ITEMS].sort(() => Math.random() - 0.5)
  );
  const [selectedHwItem, setSelectedHwItem] = useState(null);
  const [hwChecked, setHwChecked] = useState(false);

  // State Penempatan 20 Perangkat Lunak
  const [swPlacements, setSwPlacements] = useState(() => {
    const init = {};
    SOFTWARE_20_ITEMS.forEach((item) => {
      init[item.id] = '';
    });
    return init;
  });
  const [shuffledSwList, setShuffledSwList] = useState(() =>
    [...SOFTWARE_20_ITEMS].sort(() => Math.random() - 0.5)
  );
  const [selectedSwItem, setSelectedSwItem] = useState(null);
  const [swChecked, setSwChecked] = useState(false);

  // State Kuis (No individual answer reveal, full reset required)
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizChecked, setQuizChecked] = useState(false);

  // ====================================================
  // PERHITUNGAN SKOR BARU (Total 35 Poin untuk Misi 1):
  // - Lab Hardware (20 item): 15 Poin (0.75 poin per item benar)
  // - Lab Software (20 item): 10 Poin (0.5 poin per item benar)
  // - Kuis Komputer (5 soal): 10 Poin (2 poin per soal benar)
  // Total = 15 + 10 + 10 = 35 Poin
  // ====================================================
  const hwCorrectCount = HARDWARE_20_ITEMS.filter(
    (item) => hwPlacements[item.id] === item.category
  ).length;
  const hwScore = Math.round((hwCorrectCount / 20) * 15 * 10) / 10;

  const swCorrectCount = SOFTWARE_20_ITEMS.filter(
    (item) => swPlacements[item.id] === item.type
  ).length;
  const swScore = Math.round((swCorrectCount / 20) * 10 * 10) / 10;

  const quizCorrectCount = QUIZ_QUESTIONS.filter(
    (q) => quizAnswers[q.id] === q.correct
  ).length;
  const quizScore = quizChecked ? quizCorrectCount * 2 : 0; // 10 Poin max

  const totalM1Score = Math.min(35, Math.round(hwScore + swScore + quizScore));

  // Sync skor ke controller
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (onCompleteRef.current) {
      onCompleteRef.current('m1', totalM1Score);
    }
  }, [totalM1Score]);

  // Handler Hardware Placement (Tanpa petasan per klik)
  const handleAssignHw = (itemId, targetCategory) => {
    const isUnassigning = !targetCategory || hwPlacements[itemId] === targetCategory;
    const nextCategory = isUnassigning ? '' : targetCategory;

    setHwPlacements((prev) => ({
      ...prev,
      [itemId]: nextCategory,
    }));
    setHwChecked(false);
  };

  // Handler Software Placement (Tanpa petasan per klik)
  const handleAssignSw = (itemId, targetType) => {
    const isUnassigning = !targetType || swPlacements[itemId] === targetType;
    const nextType = isUnassigning ? '' : targetType;

    setSwPlacements((prev) => ({
      ...prev,
      [itemId]: nextType,
    }));
    setSwChecked(false);
  };

  // Drag and drop HTML5 handlers for Hardware
  const handleHwDragStart = (e, itemId) => {
    e.dataTransfer.setData('text/plain', itemId);
    e.dataTransfer.setData('type', 'hw');
  };

  const handleHwDrop = (e, categoryId) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    if (itemId && HARDWARE_20_ITEMS.some((h) => h.id === itemId)) {
      handleAssignHw(itemId, categoryId);
    }
  };

  // Drag and drop HTML5 handlers for Software
  const handleSwDragStart = (e, itemId) => {
    e.dataTransfer.setData('text/plain', itemId);
    e.dataTransfer.setData('type', 'sw');
  };

  const handleSwDrop = (e, typeId) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    if (itemId && SOFTWARE_20_ITEMS.some((s) => s.id === itemId)) {
      handleAssignSw(itemId, typeId);
    }
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  // Check hardware with sound/confetti or fail tone
  const handleCheckHw = () => {
    setHwChecked(true);
    if (hwCorrectCount >= 14) {
      celebratePointGain(hwCorrectCount >= 18);
    } else {
      soundEffects.playFail();
    }
  };

  // Check software with sound/confetti or fail tone
  const handleCheckSw = () => {
    setSwChecked(true);
    if (swCorrectCount >= 14) {
      celebratePointGain(swCorrectCount >= 18);
    } else {
      soundEffects.playFail();
    }
  };

  // Evaluate quiz with sound/confetti
  const handleEvaluateQuiz = () => {
    setQuizChecked(true);
    if (quizCorrectCount > 0) {
      celebratePointGain(quizCorrectCount === 5);
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizChecked(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header Misi 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Misi 1 • Bobot 35 Poin
            </span>
            <span className="text-xs text-slate-400">Komponen Hardware, Software OS & Kuis</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1">
            Arsitektur Komponen Sistem Komputer & Klasifikasi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pelajari konsep perangkat keras & lunak, cocokkan 20 hardware dan 20 software ke kategorinya, lalu selesaikan kuis pemahaman.
          </p>
        </div>

        {/* Tab Navigation Pill */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('materi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'materi'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. Materi Visual</span>
          </button>

          <button
            onClick={() => setActiveTab('hw_drag')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'hw_drag'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>2. Lab Hardware (15p)</span>
          </button>

          <button
            onClick={() => setActiveTab('sw_drag')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'sw_drag'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3. Lab Software (10p)</span>
          </button>

          <button
            onClick={() => setActiveTab('kuis')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'kuis'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>4. Kuis (10p)</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: MATERI SISTEM KOMPUTER */}
      {/* ========================================================= */}
      {activeTab === 'materi' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                💻
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  Pengertian Sistem Komputer
                </h3>
                <p className="text-xs text-slate-400">
                  Kombinasi harmonis antara Perangkat Keras, Perangkat Lunak, dan Manusia.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong>Sistem Komputer</strong> adalah sekumpulan elemen komputasi terpadu yang saling terhubung untuk menerima data masukan (input), memproses data secara matematis & logika (process), menyimpan hasil (storage), dan menyajikannya sebagai informasi bermanfaat (output) bagi pengguna (brainware).
            </p>

            {/* 3 Pilar Utama Sistem Komputer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-blue-500/30">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">Pilar 1</span>
                <h4 className="text-xs font-black text-white mt-0.5">Hardware (Perangkat Keras)</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Komponen fisik nyata yang dapat dilihat, disentuh, dan dialiri daya listrik (misal: CPU, RAM, Layar).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">Pilar 2</span>
                <h4 className="text-xs font-black text-white mt-0.5">Software (Perangkat Lunak)</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Kumpulan instruksi kode program digital yang memberi perintah kerja pada perangkat keras (OS & Aplikasi).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">Pilar 3</span>
                <h4 className="text-xs font-black text-white mt-0.5">Brainware (Pengguna)</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Manusia (siswa, programmer, operator) yang mengoperasikan dan mengendalikan jalannya komputer.
                </p>
              </div>
            </div>
          </div>

          {/* 5 Kelompok Hardware Utama */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              1. Klasifikasi 5 Kategori Perangkat Keras (Hardware)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Input */}
              <div className="bg-slate-950/90 border border-blue-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <Keyboard className="w-4 h-4" />
                  <span>Perangkat Masukan (Input)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Alat untuk memasukkan data teks, suara, gambar, atau perintah ke dalam sistem komputer.
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded-md font-semibold">Keyboard</span>
                  <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded-md font-semibold">Mouse</span>
                  <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded-md font-semibold">Mikrofon</span>
                  <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded-md font-semibold">Webcam</span>
                  <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded-md font-semibold">Scanner</span>
                  <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded-md font-semibold">Barcode</span>
                </div>
              </div>

              {/* Process */}
              <div className="bg-slate-950/90 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Cpu className="w-4 h-4" />
                  <span>Perangkat Pemrosesan (Process)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pusat komputasi yang mengeksekusi rumus logika, kalkulasi, pengolahan gambar, dan koordinasi lalu lintas data.
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded-md font-semibold">Processor (CPU)</span>
                  <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded-md font-semibold">VGA Card (GPU)</span>
                  <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded-md font-semibold">Motherboard</span>
                  <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded-md font-semibold">Sound Card</span>
                </div>
              </div>

              {/* Storage */}
              <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <HardDrive className="w-4 h-4" />
                  <span>Perangkat Penyimpanan (Storage)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Menyimpan instruksi sementara yang sedang berjalan (RAM) atau berkas dokumen secara permanen (SSD/HDD).
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-md font-semibold">RAM (Volatile)</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-md font-semibold">SSD NVMe</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-md font-semibold">Harddisk (HDD)</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-md font-semibold">Flashdisk USB</span>
                </div>
              </div>

              {/* Output */}
              <div className="bg-slate-950/90 border border-purple-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <Monitor className="w-4 h-4" />
                  <span>Perangkat Keluaran (Output)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Menyajikan hasil proses komputer ke bentuk visual layar, suara speaker, atau lembaran cetak.
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded-md font-semibold">Monitor</span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded-md font-semibold">Speaker</span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded-md font-semibold">Printer</span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded-md font-semibold">Proyektor</span>
                </div>
              </div>

              {/* Auxiliary */}
              <div className="bg-slate-950/90 border border-rose-500/30 rounded-2xl p-4 space-y-2 sm:col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  <span>Perangkat Pendukung & Daya (Power & Cooler)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Menjamin ketersediaan arus listrik stabil (PSU) dan membuang panas berlebih (Heatsink Fan Cooler) agar komputer tidak rusak / mati mendadak.
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800/80 px-2 py-0.5 rounded-md font-semibold">Power Supply Unit (PSU)</span>
                  <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800/80 px-2 py-0.5 rounded-md font-semibold">Heatsink & Fan Cooler</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pembagian Software OS vs Aplikasi */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              2. Pembagian Perangkat Lunak (Software)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <AppWindow className="w-4 h-4" />
                  <span>Sistem Operasi (OS)</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Pondasi utama yang menghubungkan pengguna dengan perangkat keras. Tanpa OS, komputer tidak bisa dinyalakan atau menjalankan aplikasi apapun.
                </p>
                <div className="text-[11px] text-slate-300 font-medium">
                  Contoh: <strong>Windows 11, Linux Ubuntu, macOS, Android, iOS, ChromeOS</strong>.
                </div>
              </div>

              <div className="bg-slate-900/90 border border-blue-500/30 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
                  <Palette className="w-4 h-4" />
                  <span>Perangkat Lunak Aplikasi</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Program siap pakai yang dibuat khusus untuk memenuhi kebutuhan tugas manusia (mengetik, mengedit, menggambar, komunikasi, belajar, dan hiburan).
                </p>
                <div className="text-[11px] text-slate-300 font-medium">
                  Contoh: <strong>Word, Excel, Photoshop, WhatsApp, Canva, Zoom, Spotify, Scratch, Roblox</strong>.
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab('hw_drag')}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Lanjut ke Praktikum 20 Komponen Hardware</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: LAB DRAG & DROP 20 KOMPONEN HARDWARE */}
      {/* ========================================================= */}
      {activeTab === 'hw_drag' && (
        <div className="space-y-5">
          {/* Petunjuk & Progress */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Tantangan Drag & Drop 20 Komponen Hardware (Gambar Asli)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tarik (drag) atau klik kartu komponen berfoto asli, lalu letakkan ke dalam zona kategori perangkat keras yang sesuai.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
                Terpasang: <span className="text-amber-400">{Object.values(hwPlacements).filter(Boolean).length}/20</span>
              </div>
              <button
                onClick={handleCheckHw}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Cek Hasil ({hwScore}/15p)</span>
              </button>
            </div>
          </div>

          {/* Tata Letak Berdampingan (Side-by-Side): Bank Komponen Kiri & Dropzones Kanan */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Kolom Kiri (Bank Komponen Hardware) */}
            <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-3 lg:sticky lg:top-20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Bank Hardware ({HARDWARE_20_ITEMS.filter((h) => !hwPlacements[h.id]).length} Sisa)
                </span>
                <button
                  onClick={() => {
                    const cleared = {};
                    HARDWARE_20_ITEMS.forEach((h) => { cleared[h.id] = ''; });
                    setHwPlacements(cleared);
                    setSelectedHwItem(null);
                    setHwChecked(false);
                    setShuffledHwList([...HARDWARE_20_ITEMS].sort(() => Math.random() - 0.5));
                  }}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Mobile / Tap Selection Banner */}
              {selectedHwItem && (
                <div className="p-2 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-between animate-pulse">
                  <span className="truncate pr-1">👉 Terpilih: <strong>{HARDWARE_20_ITEMS.find((h) => h.id === selectedHwItem)?.name}</strong></span>
                  <button
                    onClick={() => setSelectedHwItem(null)}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 hover:text-white flex-shrink-0"
                  >
                    Batal
                  </button>
                </div>
              )}

              {/* Daftar Scrollable 1 Kolom */}
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {shuffledHwList.map((item) => {
                  const placedCat = hwPlacements[item.id];
                  const isSelected = selectedHwItem === item.id;

                  if (placedCat) {
                    return (
                      <div
                        key={item.id}
                        className="p-2 rounded-xl border border-dashed border-slate-800/80 bg-slate-950/40 opacity-30 grayscale cursor-not-allowed select-none text-left flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <RealAssetThumbnail
                            id={item.id}
                            name={item.name}
                            fallbackIcon={item.icon}
                            isSoftware={false}
                            size="sm"
                          />
                          <span className="text-xs font-bold truncate text-slate-500">{item.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-600 font-semibold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800/60">✓ Terpasang</span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleHwDragStart(e, item.id)}
                      onClick={() => setSelectedHwItem(isSelected ? null : item.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-grab active:cursor-grabbing select-none relative ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/20 ring-2 ring-amber-400/40 shadow-lg'
                          : 'border-slate-800 bg-slate-900/70 hover:border-amber-500/50 hover:bg-slate-900 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <RealAssetThumbnail
                          id={item.id}
                          name={item.name}
                          fallbackIcon={item.icon}
                          isSoftware={false}
                          size="md"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold leading-tight truncate">{item.name}</span>
                            <span className="text-[10px] text-amber-400/80 font-medium ml-1">Tarik / Klik</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">{item.hint}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Kolom Kanan (Kotak-Kotak Dropzone Kategori Hardware) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {HW_CATEGORIES.map((cat) => {
                const assignedItems = HARDWARE_20_ITEMS.filter(
                  (h) => hwPlacements[h.id] === cat.id
                );

                return (
                  <div
                    key={cat.id}
                    onDragOver={allowDrop}
                    onDrop={(e) => handleHwDrop(e, cat.id)}
                    onClick={() => {
                      if (selectedHwItem) {
                        handleAssignHw(selectedHwItem, cat.id);
                        setSelectedHwItem(null);
                      }
                    }}
                    className={`border rounded-2xl p-3.5 transition-all min-h-[175px] flex flex-col justify-between ${cat.color} ${
                      selectedHwItem ? 'ring-2 ring-amber-400/40 cursor-pointer bg-slate-900/60' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 font-black text-xs text-white">
                          <cat.icon className="w-4 h-4 text-amber-400" />
                          <span>{cat.label}</span>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
                          {assignedItems.length} item
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-2.5 leading-snug">{cat.desc}</p>

                      {/* Assigned Chips with Real Thumbnails */}
                      <div className="flex flex-wrap gap-1.5 min-h-[60px] p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        {assignedItems.length === 0 ? (
                          <div className="w-full text-center py-4 text-[11px] text-slate-500 italic">
                            Tarik dari daftar kiri atau klik item lalu klik kotak ini
                          </div>
                        ) : (
                          assignedItems.map((item) => {
                            const isCorrect = item.category === cat.id;
                            return (
                              <span
                                key={item.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignHw(item.id, cat.id);
                                }}
                                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-xl text-[11px] font-semibold border cursor-pointer hover:opacity-80 transition ${
                                  hwChecked
                                    ? isCorrect
                                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                      : 'bg-rose-950 text-rose-300 border-rose-700'
                                    : 'bg-slate-900 text-slate-200 border-slate-700'
                                }`}
                                title="Klik untuk menghapus dari kategori"
                              >
                                <RealAssetThumbnail
                                  id={item.id}
                                  name={item.name}
                                  fallbackIcon={item.icon}
                                  isSoftware={false}
                                  size="sm"
                                />
                                <span className="truncate max-w-[110px]">{item.name}</span>
                                <span className="text-[10px] text-slate-400 hover:text-white font-bold ml-0.5">×</span>
                              </span>
                            );
                          })
                        )}
                      </div>
                    </div>

                    <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                      <span>💡 Contoh: {cat.examples}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="text-xs text-slate-400">
              {hwChecked && (
                hwCorrectCount >= 14 ? (
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                    <span>🎉 Hebat! {hwCorrectCount} / 20 Komponen Benar (+{hwScore}/15 Poin)</span>
                  </span>
                ) : (
                  <span className="font-bold text-rose-400 flex items-center gap-1.5 animate-pulse">
                    <span>⚠️ Masih ada yang keliru ({hwCorrectCount} / 20 Benar). Susun ulang posisi komponen merah lalu cek lagi!</span>
                  </span>
                )
              )}
            </div>

            <button
              onClick={() => setActiveTab('sw_drag')}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Lanjut ke Praktikum 20 Software</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: LAB DRAG & DROP 20 SOFTWARE (OS vs APLIKASI) */}
      {/* ========================================================= */}
      {activeTab === 'sw_drag' && (
        <div className="space-y-5">
          {/* Sub Header Software */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Tantangan Pengelompokan 20 Jenis Perangkat Lunak (Logo Asli)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Kelompokkan 20 software berikut: manakah yang merupakan <strong>Sistem Operasi (OS)</strong> dan manakah <strong>Aplikasi</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
                Terpasang: <span className="text-amber-400">{Object.values(swPlacements).filter(Boolean).length}/20</span>
              </div>
              <button
                onClick={handleCheckSw}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Cek Hasil ({swScore}/10p)</span>
              </button>
            </div>
          </div>

          {/* Tata Letak Berdampingan (Side-by-Side): Bank Software Kiri & Dropzones Kanan */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Kolom Kiri (Bank 20 Software) */}
            <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-3 lg:sticky lg:top-20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Bank Software ({SOFTWARE_20_ITEMS.filter((s) => !swPlacements[s.id]).length} Sisa)
                </span>
                <button
                  onClick={() => {
                    const cleared = {};
                    SOFTWARE_20_ITEMS.forEach((s) => { cleared[s.id] = ''; });
                    setSwPlacements(cleared);
                    setSelectedSwItem(null);
                    setSwChecked(false);
                    setShuffledSwList([...SOFTWARE_20_ITEMS].sort(() => Math.random() - 0.5));
                  }}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Mobile / Tap Selection Banner for Software */}
              {selectedSwItem && (
                <div className="p-2 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-between animate-pulse">
                  <span className="truncate pr-1">👉 Terpilih: <strong>{SOFTWARE_20_ITEMS.find((s) => s.id === selectedSwItem)?.name}</strong></span>
                  <button
                    onClick={() => setSelectedSwItem(null)}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 hover:text-white flex-shrink-0"
                  >
                    Batal
                  </button>
                </div>
              )}

              {/* Daftar Scrollable 1 Kolom Software */}
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {shuffledSwList.map((item) => {
                  const placedType = swPlacements[item.id];
                  const isSelected = selectedSwItem === item.id;

                  if (placedType) {
                    return (
                      <div
                        key={item.id}
                        className="p-2 rounded-xl border border-dashed border-slate-800/80 bg-slate-950/40 opacity-30 grayscale cursor-not-allowed select-none text-left flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <RealAssetThumbnail
                            id={item.id}
                            name={item.name}
                            fallbackIcon={item.icon}
                            isSoftware={true}
                            size="sm"
                          />
                          <span className="text-xs font-bold truncate text-slate-500">{item.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-600 font-semibold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800/60">✓ Terpasang</span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleSwDragStart(e, item.id)}
                      onClick={() => setSelectedSwItem(isSelected ? null : item.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-grab active:cursor-grabbing select-none relative ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/20 ring-2 ring-amber-400/40 shadow-lg'
                          : 'border-slate-800 bg-slate-900/70 hover:border-amber-500/50 hover:bg-slate-900 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <RealAssetThumbnail
                          id={item.id}
                          name={item.name}
                          fallbackIcon={item.icon}
                          isSoftware={true}
                          size="md"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold leading-tight truncate">{item.name}</span>
                            <span className="text-[10px] text-amber-400/80 font-medium ml-1">Tarik / Klik</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">{item.desc}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Kolom Kanan (2 Dropzones: OS vs Aplikasi) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {SW_CATEGORIES.map((cat) => {
                const assignedItems = SOFTWARE_20_ITEMS.filter(
                  (s) => swPlacements[s.id] === cat.id
                );

                return (
                  <div
                    key={cat.id}
                    onDragOver={allowDrop}
                    onDrop={(e) => handleSwDrop(e, cat.id)}
                    onClick={() => {
                      if (selectedSwItem) {
                        handleAssignSw(selectedSwItem, cat.id);
                        setSelectedSwItem(null);
                      }
                    }}
                    className={`border rounded-2xl p-4 transition-all min-h-[220px] flex flex-col justify-between ${cat.color} ${
                      selectedSwItem ? 'ring-2 ring-amber-400/40 cursor-pointer bg-slate-900/60' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-black text-xs sm:text-sm text-white">
                          {cat.label}
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
                          {assignedItems.length} item
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-3 leading-snug">{cat.desc}</p>

                      {/* Assigned Chips with Logos */}
                      <div className="flex flex-wrap gap-1.5 min-h-[100px] p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        {assignedItems.length === 0 ? (
                          <div className="w-full text-center py-8 text-[11px] text-slate-500 italic">
                            Tarik dari daftar kiri atau klik software lalu klik ke zona ini
                          </div>
                        ) : (
                          assignedItems.map((item) => {
                            const isCorrect = item.type === cat.id;
                            return (
                              <span
                                key={item.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignSw(item.id, cat.id);
                                }}
                                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-xl text-xs font-semibold border cursor-pointer hover:opacity-80 transition ${
                                  swChecked
                                    ? isCorrect
                                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                      : 'bg-rose-950 text-rose-300 border-rose-700'
                                    : 'bg-slate-900 text-slate-200 border-slate-700'
                                }`}
                                title="Klik untuk menghapus dari zona"
                              >
                                <RealAssetThumbnail
                                  id={item.id}
                                  name={item.name}
                                  fallbackIcon={item.icon}
                                  isSoftware={true}
                                  size="sm"
                                />
                                <span className="truncate max-w-[110px]">{item.name}</span>
                                <span className="text-[10px] text-slate-400 hover:text-white font-bold ml-0.5">×</span>
                              </span>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="text-xs text-slate-400">
              {swChecked && (
                swCorrectCount >= 14 ? (
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                    <span>🎉 Hebat! {swCorrectCount} / 20 Software Benar (+{swScore}/10 Poin)</span>
                  </span>
                ) : (
                  <span className="font-bold text-rose-400 flex items-center gap-1.5 animate-pulse">
                    <span>⚠️ Masih ada yang keliru ({swCorrectCount} / 20 Benar). Susun ulang posisi software merah lalu cek lagi!</span>
                  </span>
                )
              )}
            </div>

            <button
              onClick={() => setActiveTab('kuis')}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Lanjut ke Kuis Pemahaman</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: KUIS PEMAHAMAN SISTEM KOMPUTER */}
      {/* ========================================================= */}
      {activeTab === 'kuis' && (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                Kuis Logika Sistem Komputer (5 Soal • 10 Poin)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pilih jawaban paling tepat. Evaluasi kuis dilakukan sekaligus setelah seluruh soal dijawab.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-3 py-1 rounded-xl">
                Skor Kuis: {quizScore} / 10 Poin
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const selectedOpt = quizAnswers[q.id];

              return (
                <div
                  key={q.id}
                  className={`bg-slate-950 border rounded-2xl p-4 transition-all ${
                    selectedOpt ? 'border-slate-700 bg-slate-900/40' : 'border-slate-800/80'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="space-y-2.5 flex-1">
                      <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                        {q.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => {
                          const isOptionSelected = selectedOpt === opt.id;

                          let btnStyle = 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700';
                          if (isOptionSelected) {
                            btnStyle = 'border-amber-500 bg-amber-500/20 text-amber-200 ring-2 ring-amber-500/40 font-bold';
                          }

                          return (
                            <button
                              key={opt.id}
                              type="button"
                              disabled={quizChecked}
                              onClick={() => {
                                setQuizAnswers((prev) => ({ ...prev, [q.id]: opt.id }));
                              }}
                              className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-2 ${btnStyle} ${quizChecked ? 'cursor-not-allowed opacity-90' : ''}`}
                            >
                              <span className="uppercase font-extrabold text-[11px] opacity-70 mt-0.5">
                                {opt.id}.
                              </span>
                              <span className="flex-1 leading-snug">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Evaluation Banner / Buttons */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs">
              {quizChecked ? (
                <div className="space-y-1">
                  <p className="font-extrabold text-emerald-400 text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Hasil Kuis: Kamu menjawab {quizCorrectCount} dari 5 soal benar ({quizScore}/10 Poin).</span>
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Ingin memperbaiki nilai? Klik tombol Ulangi Kuis di samping untuk mereset dan mencoba lagi dari awal.
                  </p>
                </div>
              ) : (
                <span className="text-slate-400">
                  Terjawab: {Object.keys(quizAnswers).length} / 5 Soal
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {quizChecked ? (
                <button
                  onClick={handleResetQuiz}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ulangi Kuis dari Awal</span>
                </button>
              ) : (
                <button
                  onClick={handleEvaluateQuiz}
                  disabled={Object.keys(quizAnswers).length < 5}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg transition active:scale-95 ${
                    Object.keys(quizAnswers).length === 5
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kumpulkan & Cek Nilai Kuis</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Total Poin Misi 1 yang Didapat: {totalM1Score} / 35 Poin</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
