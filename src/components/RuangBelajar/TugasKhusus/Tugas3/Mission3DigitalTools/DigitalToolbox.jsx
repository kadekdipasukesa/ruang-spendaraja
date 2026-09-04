import { useState, useEffect, useRef } from 'react';
import {
  LayoutGrid,
  Sparkles,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Zap,
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
  RotateCcw
} from 'lucide-react';
import { RealAssetThumbnail, celebratePointGain } from '../skAssets';
import { soundEffects } from '../../../../../utils/gameAudio';

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
const QUIZ_QUESTIONS = [
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

export default function DigitalToolbox({ currentScore, onComplete, onNextMission, initialPlacements }) {
  const [activeTab, setActiveTab] = useState('materi'); // 'materi' | 'tools_drag' | 'kuis'
  const [materiRead, setMateriRead] = useState(() => (Number(currentScore) > 0));

  // Penempatan 20 Aplikasi: Cek initialPlacements, lalu localStorage, lalu default
  const [appPlacements, setAppPlacements] = useState(() => {
    if (initialPlacements?.appPlacements && typeof initialPlacements.appPlacements === 'object') {
      return initialPlacements.appPlacements;
    }
    try {
      const saved = localStorage.getItem('tugas_sk_m3_app_placements');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      /* ignore */
    }
    if (Number(currentScore) >= 20) {
      const init = {};
      APP_20_TOOLS.forEach((item) => {
        init[item.id] = item.group;
      });
      return init;
    }
    const init = {};
    APP_20_TOOLS.forEach((item) => {
      init[item.id] = '';
    });
    return init;
  });
  const [shuffledAppList, setShuffledAppList] = useState(() =>
    [...APP_20_TOOLS].sort(() => Math.random() - 0.5)
  );
  const [selectedAppItem, setSelectedAppItem] = useState(null);
  const [appChecked, setAppChecked] = useState(() => {
    if (initialPlacements?.appPlacements && Object.values(initialPlacements.appPlacements).some(Boolean)) {
      return true;
    }
    try {
      return Boolean(localStorage.getItem('tugas_sk_m3_app_placements')) || Number(currentScore) >= 20;
    } catch (e) {
      return Number(currentScore) >= 20;
    }
  });

  // Simpan draft penempatan ke localStorage agar tidak hilang
  useEffect(() => {
    try {
      localStorage.setItem('tugas_sk_m3_app_placements', JSON.stringify(appPlacements));
    } catch (e) {
      /* ignore */
    }
  }, [appPlacements]);

  // Kuis State (No individual answer reveal, reset required)
  const [quizAnswers, setQuizAnswers] = useState(() => {
    if (initialPlacements?.quizAnswers && typeof initialPlacements.quizAnswers === 'object') {
      return initialPlacements.quizAnswers;
    }
    try {
      const savedQ = localStorage.getItem('tugas_sk_m3_quiz_answers');
      if (savedQ) {
        const parsed = JSON.parse(savedQ);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      /* ignore */
    }
    if (Number(currentScore) >= 10) {
      const initQ = {};
      QUIZ_QUESTIONS.forEach((q) => {
        initQ[q.id] = q.correct;
      });
      return initQ;
    }
    return {};
  });
  const [quizChecked, setQuizChecked] = useState(() => {
    if (initialPlacements?.quizAnswers && Object.values(initialPlacements.quizAnswers).some(Boolean)) {
      return true;
    }
    try {
      return Boolean(localStorage.getItem('tugas_sk_m3_quiz_answers')) || Number(currentScore) >= 10;
    } catch (e) {
      return Number(currentScore) >= 10;
    }
  });

  // Sinkronkan prop initialPlacements bila tiba dari database Supabase
  useEffect(() => {
    if (initialPlacements?.appPlacements && typeof initialPlacements.appPlacements === 'object') {
      setAppPlacements(initialPlacements.appPlacements);
      if (Object.values(initialPlacements.appPlacements).some(Boolean)) {
        setAppChecked(true);
      }
    }
    if (initialPlacements?.quizAnswers && typeof initialPlacements.quizAnswers === 'object') {
      setQuizAnswers(initialPlacements.quizAnswers);
      if (Object.values(initialPlacements.quizAnswers).some(Boolean)) {
        setQuizChecked(true);
      }
    }
  }, [initialPlacements]);

  useEffect(() => {
    try {
      localStorage.setItem('tugas_sk_m3_quiz_answers', JSON.stringify(quizAnswers));
    } catch (e) {
      /* ignore */
    }
  }, [quizAnswers]);

  // ====================================================
  // PERHITUNGAN SKOR MISI 3 (Total 30 Poin):
  // - Lab Drag & Drop 20 Aplikasi (20 item): 20 Poin (1 poin per aplikasi benar)
  // - Kuis Perkakas & Software (5 soal x 2 Poin): 10 Poin
  // Total = 20 + 10 = 30 Poin
  // ====================================================
  const appCorrectCount = APP_20_TOOLS.filter(
    (item) => appPlacements[item.id] === item.group
  ).length;
  const labScore = appCorrectCount; // 20 Poin (1 point per item)

  const quizCorrectCount = QUIZ_QUESTIONS.filter(
    (q) => quizAnswers[q.id] === q.correct
  ).length;
  const quizScore = quizChecked ? quizCorrectCount * 2 : 0; // 10 Poin

  const totalM3Score = Math.min(30, Math.max(Number(currentScore) || 0, Math.round(labScore + quizScore)));

  // Sync skor ke controller
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (onCompleteRef.current && totalM3Score > 0) {
      onCompleteRef.current('m3', totalM3Score);
    }
  }, [totalM3Score]);

  // Handler Assign Aplikasi (Tanpa petasan per klik)
  const handleAssignApp = (itemId, targetGroup) => {
    const isUnassigning = !targetGroup || appPlacements[itemId] === targetGroup;
    const nextGroup = isUnassigning ? '' : targetGroup;

    setAppPlacements((prev) => ({
      ...prev,
      [itemId]: nextGroup,
    }));
    setAppChecked(false);
  };

  // Drag and Drop handlers
  const handleDragStart = (e, itemId) => {
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDrop = (e, groupId) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    if (itemId && APP_20_TOOLS.some((a) => a.id === itemId)) {
      handleAssignApp(itemId, groupId);
    }
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  // Check apps with sound & petasan/confetti
  const handleCheckApps = () => {
    setAppChecked(true);
    celebratePointGain(true);
  };

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
      {/* Sub-Header Misi 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Misi 3 • Bobot 30 Poin
            </span>
            <span className="text-xs text-slate-400">Pengelompokan 20 Aplikasi & Kuis Software</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1">
            Eksplorasi Perkakas Digital & Ragam Software
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pelajari 5 kelompok perkakas digital, cocokkan 20 aplikasi populer ke kelompok yang tepat, dan selesaikan kuis lisensi.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => {
              setActiveTab('materi');
              setMateriRead(true);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'materi'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. Materi 5 Kelompok</span>
            {materiRead && (
              <CheckCircle2 className={`w-3.5 h-3.5 ${activeTab === 'materi' ? 'text-slate-950' : 'text-emerald-400'}`} />
            )}
          </button>

          <button
            onClick={() => setActiveTab('tools_drag')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'tools_drag'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>2. Lab 20 Aplikasi (20p)</span>
            {(appChecked || labScore > 0) && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === 'tools_drag'
                  ? 'bg-slate-950/20 text-slate-950'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                <span>{labScore}/20p</span>
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('kuis')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'kuis'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>3. Kuis Software (10p)</span>
            {(quizChecked || quizScore > 0) && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === 'kuis'
                  ? 'bg-slate-950/20 text-slate-950'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                <span>{quizScore}/10p</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: MATERI 5 KELOMPOK PERKAKAS DIGITAL */}
      {/* ========================================================= */}
      {activeTab === 'materi' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                🧰
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  5 Kelompok Perkakas Digital (Digital Tools)
                </h3>
                <p className="text-xs text-slate-400">
                  Setiap jenis aplikasi diciptakan dengan kegunaan dan ekosistem spesifik.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Di era digital, perangkat lunak terbagi ke dalam berbagai fungsi kerja. Memahami klasifikasi perkakas membantu kita memilih alat yang tepat untuk belajar, berkarya, berkomunikasi, dan menjaga keamanan sistem komputer secara bijak.
            </p>

            {/* 5 Kelompok Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {/* 1. Komunikasi */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-blue-500/30 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs sm:text-sm">
                  <MessageSquare className="w-4 h-4" />
                  <span>1. Komunikasi & Kolaborasi</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Menghubungkan orang lewat obrolan teks instan, video conference, email, dan kerja kelompok jarak jauh.
                </p>
                <div className="text-[10px] text-blue-300 font-semibold">
                  Contoh: WhatsApp, Zoom, Discord, Gmail.
                </div>
              </div>

              {/* 2. Hiburan */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-purple-500/30 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs sm:text-sm">
                  <Music className="w-4 h-4" />
                  <span>2. Hiburan & Rekreasi Media</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Mengisi waktu senggang dengan memutar musik streaming, menonton film/video kreatif, dan bermain game interaktif.
                </p>
                <div className="text-[10px] text-purple-300 font-semibold">
                  Contoh: YouTube, Spotify, Netflix, Roblox.
                </div>
              </div>

              {/* 3. Produktivitas */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs sm:text-sm">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>3. Produktivitas & Kerja</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Menyelesaikan tugas sekolah atau kantor: mengetik makalah, kalkulasi rumus tabel angka, dan desain grafis poster.
                </p>
                <div className="text-[10px] text-amber-300 font-semibold">
                  Contoh: Google Docs, Excel, Canva, Trello.
                </div>
              </div>

              {/* 4. Edukasi */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
                  <GraduationCap className="w-4 h-4" />
                  <span>4. Pembelajaran & Edukasi</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Platform kelas maya pengumpulan tugas guru, belajar bahasa asing interaktif, dan pemrograman visual koding.
                </p>
                <div className="text-[10px] text-emerald-300 font-semibold">
                  Contoh: Google Classroom, Duolingo, Scratch, Ruangguru.
                </div>
              </div>

              {/* 5. Utilitas */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-rose-500/30 space-y-2 sm:col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>5. Utilitas, Sistem, Navigasi & Keamanan</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Mendukung kinerja sistem operasi: pencadangan file awan (cloud), pemetaan peta jalan GPS, antivirus pembasmi malware, dan kompresi file arsip ZIP.
                </p>
                <div className="text-[10px] text-rose-300 font-semibold">
                  Contoh: Google Drive, Google Maps, Antivirus Smadav/Defender, 7-Zip.
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                setMateriRead(true);
                setActiveTab('tools_drag');
              }}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Lanjut ke Praktikum 20 Aplikasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: LAB DRAG & DROP 20 APLIKASI */}
      {/* ========================================================= */}
      {activeTab === 'tools_drag' && (
        <div className="space-y-5">
          {/* Sub-Header Lab */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-amber-400" />
                Tantangan Drag & Drop 20 Aplikasi Digital (Logo Asli)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tarik (drag) atau klik aplikasi berlogo asli, lalu letakkan ke dalam 5 kelompok perkakas digital yang sesuai.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300">
                Terpasang: <span className="text-amber-400">{Object.values(appPlacements).filter(Boolean).length}/20</span>
              </div>
              <button
                onClick={handleCheckApps}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Cek Hasil ({labScore}/20p)</span>
              </button>
            </div>
          </div>

          {/* Tata Letak Berdampingan (Side-by-Side): Bank Aplikasi Kiri & Dropzones Kanan */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Kolom Kiri (Bank 20 Aplikasi Digital) */}
            <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-3 lg:sticky lg:top-20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Bank Aplikasi ({APP_20_TOOLS.filter((a) => !appPlacements[a.id]).length} Sisa)
                </span>
                <button
                  onClick={() => {
                    const cleared = {};
                    APP_20_TOOLS.forEach((a) => { cleared[a.id] = ''; });
                    setAppPlacements(cleared);
                    setSelectedAppItem(null);
                    setAppChecked(false);
                    setShuffledAppList([...APP_20_TOOLS].sort(() => Math.random() - 0.5));
                  }}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Mobile / Tap Selection Banner for Apps */}
              {selectedAppItem && (
                <div className="p-2 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-between animate-pulse">
                  <span className="truncate pr-1">👉 Terpilih: <strong>{APP_20_TOOLS.find((a) => a.id === selectedAppItem)?.name}</strong></span>
                  <button
                    onClick={() => setSelectedAppItem(null)}
                    className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 hover:text-white flex-shrink-0"
                  >
                    Batal
                  </button>
                </div>
              )}

              {/* Daftar Scrollable 1 Kolom Aplikasi */}
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {shuffledAppList.map((item) => {
                  const placedGroup = appPlacements[item.id];
                  const isSelected = selectedAppItem === item.id;

                  if (placedGroup) {
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
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onClick={() => setSelectedAppItem(isSelected ? null : item.id)}
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

            {/* Kolom Kanan (5 Dropzones Kelompok Perkakas) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {APP_GROUPS.map((grp) => {
                const assignedItems = APP_20_TOOLS.filter(
                  (a) => appPlacements[a.id] === grp.id
                );

                return (
                  <div
                    key={grp.id}
                    onDragOver={allowDrop}
                    onDrop={(e) => handleDrop(e, grp.id)}
                    onClick={() => {
                      if (selectedAppItem) {
                        handleAssignApp(selectedAppItem, grp.id);
                        setSelectedAppItem(null);
                      }
                    }}
                    className={`border rounded-2xl p-3.5 transition-all min-h-[175px] flex flex-col justify-between ${grp.color} ${
                      selectedAppItem ? 'ring-2 ring-amber-400/40 cursor-pointer bg-slate-900/60' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 font-black text-xs text-white">
                          <grp.icon className="w-4 h-4 text-amber-400" />
                          <span>{grp.label}</span>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
                          {assignedItems.length} item
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-2.5 leading-snug">{grp.desc}</p>

                      {/* Assigned Chips with Real Logos */}
                      <div className="flex flex-wrap gap-1.5 min-h-[60px] p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        {assignedItems.length === 0 ? (
                          <div className="w-full text-center py-4 text-[11px] text-slate-500 italic">
                            Tarik dari daftar kiri atau klik aplikasi lalu klik kelompok ini
                          </div>
                        ) : (
                          assignedItems.map((item) => {
                            const isCorrect = item.group === grp.id;
                            return (
                              <span
                                key={item.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignApp(item.id, grp.id);
                                }}
                                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-xl text-[11px] font-semibold border border-slate-700 bg-slate-900 text-slate-200 cursor-pointer hover:border-slate-500 hover:bg-slate-800 transition"
                                title="Klik untuk menghapus dari kelompok"
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

                    <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                      <span>💡 Format: {grp.formats || 'Standar Digital'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="text-xs text-slate-400">
              {appChecked && (
                <div className="font-bold flex items-center gap-2 animate-in fade-in">
                  {appCorrectCount === 20 ? (
                    <span className="text-emerald-400">
                      🎉 Luar Biasa! Sempurna 20 / 20 Aplikasi Tepat Sasaran (+{labScore}/20 Poin)
                    </span>
                  ) : (
                    <span className="text-amber-300">
                      📊 Hasil Evaluasi: {appCorrectCount} dari 20 aplikasi tepat pada kelompoknya (+{labScore}/20 Poin). Periksa kembali penempatanmu jika ingin menyempurnakan!
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveTab('kuis')}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Lanjut ke Kuis Software</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: KUIS PERKAKAS DIGITAL & LISENSI */}
      {/* ========================================================= */}
      {activeTab === 'kuis' && (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                Kuis Perkakas Digital & Lisensi Software (5 Soal • 10 Poin)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pilih satu opsi paling tepat. Nilai kuis dievaluasi sekaligus setelah seluruh soal dijawab.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-3 py-1 rounded-xl">
              Skor Kuis: {quizScore} / 10 Poin
            </span>
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

          <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Total Poin Misi 3 yang Didapat: {totalM3Score} / 30 Poin</span>
            </div>
            {onNextMission && (
              <button
                type="button"
                onClick={onNextMission}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition"
              >
                <span>Lanjut ke Misi 4 (Dampak & Etika TIK)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
