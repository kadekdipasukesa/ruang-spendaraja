import { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Eye,
  Lock,
  MessageSquare,
  RotateCcw
} from 'lucide-react';
import { celebratePointGain } from '../skAssets';

const ETHICS_CASES = [
  {
    id: 'case_hoax',
    title: 'Studi Kasus 1: Pesan Berantai Hadiah Kuota Gratis 100GB di Grup WhatsApp',
    scenario: 'Kamu menerima pesan yang meminta meneruskan (forward) tautan aneh ke 10 grup agar mendapat kuota internet gratis.',
    correctAction: 'action_verify',
    correctImpact: 'negative_phising',
    actions: [
      { id: 'action_forward', text: 'Langsung teruskan tautan ke seluruh kontak grup obrolan agar mendapat kuota gratis' },
      { id: 'action_verify', text: 'Abaikan tautan mencurigakan, verifikasi di situs resmi, dan beri tahu teman grup' },
      { id: 'action_click', text: 'Buka tautan secara cepat kemudian masukkan nomor kontak telepon serta kata sandi akun' },
    ],
    impacts: [
      { id: 'negative_phising', text: 'Dampak Negatif: Berpotensi Phising & Pembobolan Akun Pribadi' },
      { id: 'positive_sharing', text: 'Dampak Positif: Mendapat Bonus Akses Internet Tanpa Batas Waktu' },
      { id: 'neutral', text: 'Dampak Netral: Sistem Otomatis Mengabaikan Formulir Pendaftaran' },
    ],
  },
  {
    id: 'case_privacy',
    title: 'Studi Kasus 2: Foto Teman Saat Sedang Tidur Lucu di Kelas',
    scenario: 'Kamu memotret temanmu yang sedang tidur di pojok kelas dengan pose lucu dan ingin menjadikannya meme di status media sosial.',
    correctAction: 'action_ask_permission',
    correctImpact: 'negative_cyberbullying',
    actions: [
      { id: 'action_post_direct', text: 'Unggah langsung ke akun publik agar memicu komentar ramai dan tawa pengikut' },
      { id: 'action_ask_permission', text: 'Minta persetujuan teman secara santun; batalkan unggah bila ia merasa tidak nyaman' },
      { id: 'action_tag_everyone', text: 'Kirimkan foto tersebut ke akun grup wali murid serta seluruh guru sekolah' },
    ],
    impacts: [
      { id: 'negative_cyberbullying', text: 'Dampak Negatif: Melanggar Privasi & Menjadi Korban Perundungan Siber' },
      { id: 'positive_humor', text: 'Dampak Positif: Menjalin Keakraban Tanpa Batas Etika Pertemanan' },
      { id: 'no_harm', text: 'Dampak Netral: Konten Media Sosial Otomatis Terhapus Sendiri' },
    ],
  },
  {
    id: 'case_screentime',
    title: 'Studi Kasus 3: Keseimbangan Waktu Layar (Screen Time)',
    scenario: 'Menjelang ujian sekolah, kamu merasa ingin terus bermain game online sampai larut malam pukul 02:00 pagi.',
    correctAction: 'action_time_management',
    correctImpact: 'negative_health_focus',
    actions: [
      { id: 'action_all_night', text: 'Lanjutkan bermain game sepanjang malam sambil mengonsumsi minuman penahan kantuk' },
      { id: 'action_time_management', text: 'Batasi screen time maksimal 1-2 jam untuk rileks, lalu tidur cukup demi ujian' },
      { id: 'action_skip_school', text: 'Mengambil izin tidak masuk kelas esok harinya agar dapat melunasi hutang jam tidur' },
    ],
    impacts: [
      { id: 'negative_health_focus', text: 'Dampak Negatif: Gangguan Penglihatan, Kelelahan Otak & Nilai Ujian Anjlok' },
      { id: 'positive_pro_gamer', text: 'Dampak Positif: Keterampilan Bermain Game Meningkat Tanpa Efek Samping' },
      { id: 'no_effect', text: 'Dampak Netral: Pola Jam Tubuh Menyesuaikan Aktivitas Bermain Game' },
    ],
  },
  {
    id: 'case_digital_footprint',
    title: 'Studi Kasus 4: Jejak Digital & Komentar di Media Sosial',
    scenario: 'Melihat konten video orang lain yang tidak kamu sukai di internet, lalu kamu ingin menuliskan kata-kata makian kasar.',
    correctAction: 'action_wise_comment',
    correctImpact: 'negative_digital_trace',
    actions: [
      { id: 'action_flame', text: 'Tuliskan ejekan dengan profil samaran tanpa nama agar identitas diri tidak diketahui' },
      { id: 'action_wise_comment', text: 'Terapkan etika netiket: beri tanggapan santun atau lewati konten tanpa mencaci' },
      { id: 'action_spam_insult', text: 'Mengajak beberapa rekan untuk membanjiri kolom komentar dengan kalimat sindiran' },
    ],
    impacts: [
      { id: 'negative_digital_trace', text: 'Dampak Negatif: Jejak Digital Tercatat Buruk & Berisiko Sanksi Hukum UU ITE' },
      { id: 'positive_freedom', text: 'Dampak Positif: Melatih Keberanian Mengutarakan Opini Tanpa Halangan Etika' },
      { id: 'no_trace', text: 'Dampak Netral: Komentar Daring Otomatis Lenyap Tanpa Bukti Tangkapan Layar' },
    ],
  },
  {
    id: 'case_security_password',
    title: 'Studi Kasus 5: Keamanan Akun & Kata Sandi',
    scenario: 'Teman sekelasmu meminta pinjam akun belajar untuk melihat tugas, dan menanyakan kata sandi akunmu.',
    correctAction: 'action_keep_secret',
    correctImpact: 'positive_account_safety',
    actions: [
      { id: 'action_give_password', text: 'Berikan informasi kata sandi akun pribadi karena rasa sungkan menolak kawan dekat' },
      { id: 'action_keep_secret', text: 'Jaga kerahasiaan kata sandi; dampingi langsung temanmu saat mempelajari materi' },
      { id: 'action_write_board', text: 'Menempelkan catatan akun dan kata sandi pada meja kelas agar mudah dibuka bersama' },
    ],
    impacts: [
      { id: 'positive_account_safety', text: 'Dampak Positif: Profil Aman dari Manipulasi Nilai & Penyalahgunaan Data' },
      { id: 'negative_friendship', text: 'Dampak Negatif: Mengakibatkan Kerenggangan Tali Hubungan Pertemanan Kelas' },
      { id: 'neutral_pass', text: 'Dampak Netral: Sistem Otomatis Mengunci Sandi Bila Dipakai Perangkat Lain' },
    ],
  },
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Istilah "Jejak Digital" (Digital Footprint) dalam dunia teknologi informasi mengacu pada...',
    options: [
      { id: 'a', text: 'Sisa partikel debu halus pada permukaan layar sentuh gawai' },
      { id: 'b', text: 'Kabel tembaga jaringan internet yang tertanam di bawah aspal' },
      { id: 'c', text: 'Rekam jejak seluruh riwayat aktivitas online yang tersimpan' },
      { id: 'd', text: 'Ukuran resolusi tampilan grafis kartu video pada monitor LED' },
    ],
    correct: 'c',
  },
  {
    id: 2,
    question: 'Tindakan mengirim pesan berulang-ulang yang mengintimidasi, menghina, atau mempermalukan seseorang di media sosial disebut...',
    options: [
      { id: 'a', text: 'Cyberbullying atau perundungan siber di ranah internet' },
      { id: 'b', text: 'Cloud storage atau pencadangan berkas server daring' },
      { id: 'c', text: 'Digital marketing atau promosi komersial produk daring' },
      { id: 'd', text: 'Search engine optimization atau perayapan halaman situs' },
    ],
    correct: 'a',
  },
  {
    id: 3,
    question: 'Kombinasi kata sandi (password) akun yang memiliki tingkat keamanan tinggi dari risiko peretasan adalah...',
    options: [
      { id: 'a', text: 'Rangkaian tanggal lahir lengkap siswa tanpa spasi' },
      { id: 'b', text: 'Nama panggilan akun media sosial berulang tiga kali' },
      { id: 'c', text: 'Urutan alfabet angka berurutan sederhana "12345678"' },
      { id: 'd', text: 'Paduan minimal 8 karakter huruf besar, angka, dan simbol' },
    ],
    correct: 'd',
  },
  {
    id: 4,
    question: 'Manakah di bawah ini yang merupakan DAMPAK POSITIF dari pemanfaatan Teknologi Informasi dan Komunikasi?',
    options: [
      { id: 'a', text: 'Meningkatnya kebiasaan begadang tanpa beristirahat' },
      { id: 'b', text: 'Kemudahan mengakses ilmu dan kolaborasi pembelajaran' },
      { id: 'c', text: 'Makin derasnya peredaran kabar palsu yang menyesatkan' },
      { id: 'd', text: 'Tergantungnya aktivitas harian pada layar ponsel cerdas' },
    ],
    correct: 'b',
  },
  {
    id: 5,
    question: 'Tata krama kesopanan serta etika komunikasi yang wajib dijunjung saat berinteraksi di dunia maya dikenal dengan istilah...',
    options: [
      { id: 'a', text: 'Algorithm protocol sistem pertukaran kode data jaringan' },
      { id: 'b', text: 'Bandwidth throttling pembatasan kuota kecepatan sinyal' },
      { id: 'c', text: 'Netiket atau etika berkomunikasi santun di ruang siber' },
      { id: 'd', text: 'Firewall antivirus filter penyaring data lalu lintas web' },
    ],
    correct: 'c',
  },
];

export default function DigitalEthicsDetective({ userId, currentScore, onComplete, onSubmitAll, isSubmitting }) {
  const uid = userId ? String(userId) : 'guest';
  const CASE_KEY = `tugas_sk_m4_case_answers_user_${uid}`;
  const QUIZ_KEY = `tugas_sk_m4_quiz_answers_user_${uid}`;

  const [activeTab, setActiveTab] = useState('materi');
  const [materiRead, setMateriRead] = useState(() => (Number(currentScore) > 0));
  const [caseAnswers, setCaseAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(CASE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      /* ignore */
    }
    if (Number(currentScore) >= 10) {
      const initC = {};
      ETHICS_CASES.forEach((cs) => {
        initC[cs.id] = { action: cs.correctAction, impact: cs.correctImpact };
      });
      return initC;
    }
    return {
      case_hoax: { action: '', impact: '' },
      case_privacy: { action: '', impact: '' },
      case_screentime: { action: '', impact: '' },
      case_digital_footprint: { action: '', impact: '' },
      case_security_password: { action: '', impact: '' },
    };
  });
  const [casesChecked, setCasesChecked] = useState(() => {
    return Number(currentScore) >= 10;
  });

  const [quizAnswers, setQuizAnswers] = useState(() => {
    try {
      const savedQ = localStorage.getItem(QUIZ_KEY);
      if (savedQ) {
        const parsed = JSON.parse(savedQ);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      /* ignore */
    }
    if (Number(currentScore) >= 5) {
      const initQ = {};
      QUIZ_QUESTIONS.forEach((q) => {
        initQ[q.id] = q.correct;
      });
      return initQ;
    }
    return {};
  });
  const [quizChecked, setQuizChecked] = useState(() => {
    return Number(currentScore) >= 15;
  });

  useEffect(() => {
    try {
      localStorage.setItem(CASE_KEY, JSON.stringify(caseAnswers));
    } catch (e) {
      /* ignore */
    }
  }, [CASE_KEY, caseAnswers]);

  useEffect(() => {
    try {
      localStorage.setItem(QUIZ_KEY, JSON.stringify(quizAnswers));
    } catch (e) {
      /* ignore */
    }
  }, [QUIZ_KEY, quizAnswers]);

  // Sinkronisasi otomatis saat user login berganti
  useEffect(() => {
    try {
      const savedCases = localStorage.getItem(CASE_KEY);
      if (savedCases) {
        const parsed = JSON.parse(savedCases);
        if (parsed && typeof parsed === 'object') {
          setCaseAnswers(parsed);
        }
      } else if (Number(currentScore) >= 10) {
        const initC = {};
        ETHICS_CASES.forEach((cs) => {
          initC[cs.id] = { action: cs.correctAction, impact: cs.correctImpact };
        });
        setCaseAnswers(initC);
      } else {
        setCaseAnswers({
          case_hoax: { action: '', impact: '' },
          case_privacy: { action: '', impact: '' },
          case_screentime: { action: '', impact: '' },
          case_digital_footprint: { action: '', impact: '' },
          case_security_password: { action: '', impact: '' },
        });
        setCasesChecked(false);
      }
    } catch (e) {
      /* ignore */
    }

    try {
      const savedQ = localStorage.getItem(QUIZ_KEY);
      if (savedQ) {
        const parsed = JSON.parse(savedQ);
        if (parsed && typeof parsed === 'object') {
          setQuizAnswers(parsed);
        }
      } else if (Number(currentScore) >= 15) {
        const initQ = {};
        QUIZ_QUESTIONS.forEach((q) => { initQ[q.id] = q.correct; });
        setQuizAnswers(initQ);
      } else {
        setQuizAnswers({});
        setQuizChecked(false);
      }
    } catch (e) {
      /* ignore */
    }
  }, [CASE_KEY, QUIZ_KEY, currentScore]);

  // ====================================================
  // PERHITUNGAN SKOR MISI 4 (Total 15 Poin):
  // - Lab 5 Kasus Detektif (5 x 2 Poin): 10 Poin
  // - Kuis Etika & Keamanan (5 x 1 Poin): 5 Poin
  // Total = 10 + 5 = 15 Poin
  // ====================================================
  let labScore = 0;
  ETHICS_CASES.forEach((cs) => {
    const st = caseAnswers[cs.id] || {};
    const isActOk = st.action === cs.correctAction;
    const isImpOk = st.impact === cs.correctImpact;
    if (isActOk && isImpOk) {
      labScore += 2;
    } else if (isActOk || isImpOk) {
      labScore += 1;
    }
  });
  labScore = Math.min(10, Math.round(labScore));

  const quizCorrectCount = QUIZ_QUESTIONS.filter(
    (q) => quizAnswers[q.id] === q.correct
  ).length;
  const quizScore = quizChecked ? quizCorrectCount * 1 : 0; // 5 Poin max

  const totalM4Score = Math.min(15, Math.max(Number(currentScore) || 0, labScore + quizScore));

  const handleSelectAction = (caseId, actionId) => {
    setCaseAnswers((prev) => ({
      ...prev,
      [caseId]: { ...prev[caseId], action: actionId },
    }));
    setCasesChecked(false);
  };

  const handleSelectImpact = (caseId, impactId) => {
    setCaseAnswers((prev) => ({
      ...prev,
      [caseId]: { ...prev[caseId], impact: impactId },
    }));
    setCasesChecked(false);
  };

  const handleCheckCases = () => {
    setCasesChecked(true);
    celebratePointGain(true);
    let pts = 0;
    ETHICS_CASES.forEach((cs) => {
      const st = caseAnswers[cs.id] || {};
      const isActOk = st.action === cs.correctAction;
      const isImpOk = st.impact === cs.correctImpact;
      if (isActOk && isImpOk) pts += 2;
      else if (isActOk || isImpOk) pts += 1;
    });
    const newLabScore = Math.min(10, Math.round(pts));
    const newTotal = Math.min(15, Math.max(Number(currentScore) || 0, newLabScore + quizScore));
    if (onComplete && newTotal > 0) {
      onComplete('m4', newTotal);
    }
  };

  const handleEvaluateQuiz = () => {
    setQuizChecked(true);
    if (quizCorrectCount > 0) {
      celebratePointGain(quizCorrectCount === 5);
    }
    const newQuizScore = quizCorrectCount * 1;
    const newTotal = Math.min(15, Math.max(Number(currentScore) || 0, labScore + newQuizScore));
    if (onComplete && newTotal > 0) {
      onComplete('m4', newTotal);
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizChecked(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Misi 4 • Bobot 15 Poin
            </span>
            <span className="text-xs text-slate-400">Detektif Etika TIK, Netiket & Keamanan Akun</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1">
            Dampak Positif/Negatif TIK & Detektif Etika Digital
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis 5 kasus nyata dunia digital, buat keputusan bijak, dan selesaikan kuis pemahaman etika netiket.
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
            <span>1. Materi Etika</span>
            {materiRead && (
              <CheckCircle2 className={`w-3.5 h-3.5 ${activeTab === 'materi' ? 'text-slate-950' : 'text-emerald-400'}`} />
            )}
          </button>

          <button
            onClick={() => setActiveTab('detective')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'detective'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>2. Kasus Detektif (10p)</span>
            {(casesChecked || labScore > 0) && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === 'detective'
                  ? 'bg-slate-950/20 text-slate-950'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                <span>{labScore}/10p</span>
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
            <span>3. Kuis Netiket (5p)</span>
            {(quizChecked || quizScore > 0) && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === 'kuis'
                  ? 'bg-slate-950/20 text-slate-950'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                <span>{quizScore}/5p</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: MATERI DAMPAK & ETIKA DIGITAL */}
      {/* ========================================================= */}
      {activeTab === 'materi' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                🛡️
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  Dua Sisi Mata Uang Teknologi Informasi (TIK)
                </h3>
                <p className="text-xs text-slate-400">
                  Kekuatan besar memerlukan tanggung jawab dan kebijaksanaan moral yang tinggi.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Dampak Positif */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Dampak Positif TIK</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Kemudahan mencari sumber belajar dan referensi sains di seluruh dunia.</li>
                  <li>Komunikasi instan dengan keluarga dan guru tanpa batas jarak.</li>
                  <li>Ruang berkreasi digital: coding, animasi, desain, dan pembuatan konten bermanfaat.</li>
                  <li>Efisiensi transaksi perbankan dan administrasi sekolah paperless.</li>
                </ul>
              </div>

              {/* Dampak Negatif & Risiko */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-rose-500/30 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Dampak Negatif & Ancaman</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Penyebaran berita bohong (Hoax) dan penipuan phishing data pribadi.</li>
                  <li>Perundungan siber (Cyberbullying) dan ujaran kebencian di media sosial.</li>
                  <li>Kecanduan game/layar yang menurunkan kesehatan mata dan fisik.</li>
                  <li>Pencurian kata sandi dan pembajakan akun akibat kelalaian keamanan.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3 Pedoman Utama Netiket */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Prinsip 3S Netiket (Sopan, Saring, Simpan)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-300">1. Sopan & Santun</span>
                <p className="text-slate-400 text-[11px] leading-snug">
                  Ingat bahwa di balik setiap layar ada manusia yang memiliki perasaan. Jangan mengetik kata kasar atau menghina orang lain.
                </p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-blue-300">2. Saring Sebelum Sharing</span>
                <p className="text-slate-400 text-[11px] leading-snug">
                  Cek kebenaran berita dan tautan sebelum membagikannya. Jangan mudah tergiur hadiah kuota gratis atau pesan hoax berantai.
                </p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-300">3. Simpan Rahasia Pribadi</span>
                <p className="text-slate-400 text-[11px] leading-snug">
                  Jangan pernah membagikan kata sandi akun, foto dokumen penting, alamat rumah, atau nomor identitas ke publik terbuka.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                setMateriRead(true);
                setActiveTab('detective');
              }}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Lanjut ke 5 Kasus Detektif</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: DETEKTIF 5 STUDI KASUS */}
      {/* ========================================================= */}
      {activeTab === 'detective' && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                Detektif Etika: Selesaikan 5 Studi Kasus Dunia Nyata
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Baca skenario di bawah ini, pilih tindakan paling bijak dan kenali dampak konsekuensinya.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCheckCases}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Cek Hasil ({labScore}/10p)</span>
              </button>
            </div>
          </div>

          {/* 5 Cards */}
          <div className="space-y-4">
            {ETHICS_CASES.map((cs, idx) => {
              const currentAns = caseAnswers[cs.id] || {};
              const isActionCorrect = currentAns.action === cs.correctAction;
              const isImpactCorrect = currentAns.impact === cs.correctImpact;
              const isCaseSolved = isActionCorrect && isImpactCorrect;

              return (
                <div
                  key={cs.id}
                  className={`bg-slate-950 border rounded-3xl p-5 space-y-4 transition-all ${
                    casesChecked
                      ? isCaseSolved
                        ? 'border-emerald-500/50 bg-emerald-950/10'
                        : 'border-amber-500/40 bg-amber-950/10'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-white">{cs.title}</h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                          {cs.scenario}
                        </p>
                      </div>
                    </div>

                    {casesChecked && (
                      <span
                        className={`text-[11px] font-black px-2.5 py-1 rounded-full border shrink-0 ${
                          isCaseSolved
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                            : 'bg-rose-950 text-rose-300 border-rose-700'
                        }`}
                      >
                        {isCaseSolved ? '✅ 2/2p' : 'Perlu Diperbaiki'}
                      </span>
                    )}
                  </div>

                  {/* Actions & Impact Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                    {/* Action Choices */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-amber-400 flex items-center justify-between">
                        <span>Pilihan Tindakan Terbaik:</span>
                        {casesChecked && (isActionCorrect ? '✅ Tepat' : '❌ Kurang Bijak')}
                      </label>
                      <div className="space-y-1.5">
                        {cs.actions.map((act) => {
                          const isSelected = currentAns.action === act.id;
                          return (
                            <button
                              key={act.id}
                              onClick={() => handleSelectAction(cs.id, act.id)}
                              className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                                isSelected
                                  ? 'border-amber-400 bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/30'
                                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              {act.text}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Impact Choices */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-blue-400 flex items-center justify-between">
                        <span>Analisis Dampak Konsekuensi:</span>
                        {casesChecked && (isImpactCorrect ? '✅ Tepat' : '❌ Kurang Tepat')}
                      </label>
                      <div className="space-y-1.5">
                        {cs.impacts.map((imp) => {
                          const isSelected = currentAns.impact === imp.id;
                          return (
                            <button
                              key={imp.id}
                              onClick={() => handleSelectImpact(cs.id, imp.id)}
                              className={`w-full text-left p-2.5 rounded-xl border text-xs font-medium transition-all ${
                                isSelected
                                  ? 'border-blue-400 bg-blue-500/20 text-blue-200 ring-1 ring-blue-400/30'
                                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              {imp.text}
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

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab('kuis')}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Lanjut ke Kuis Pemahaman Etika</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: KUIS ETIKA & NETIKET */}
      {/* ========================================================= */}
      {activeTab === 'kuis' && (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                Kuis Netiket, Jejak Digital & Keamanan Akun (5 Soal • 5 Poin)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pilih opsi paling tepat. Evaluasi kuis dilakukan sekaligus setelah seluruh soal dijawab.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-3 py-1 rounded-xl">
              Skor Kuis: {quizScore} / 5 Poin
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
                    <span>Hasil Kuis: Kamu menjawab {quizCorrectCount} dari 5 soal benar ({quizScore}/5 Poin).</span>
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
              <span>Total Poin Misi 4 yang Didapat: {totalM4Score} / 15 Poin</span>
            </div>
            {onSubmitAll && (
              <button
                type="button"
                onClick={() => {
                  if (onComplete && totalM4Score > 0) {
                    onComplete('m4', totalM4Score);
                  }
                  onSubmitAll();
                }}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition"
              >
                <span>{isSubmitting ? 'Menyimpan...' : 'Kumpulkan & Selesaikan Semua Misi'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
