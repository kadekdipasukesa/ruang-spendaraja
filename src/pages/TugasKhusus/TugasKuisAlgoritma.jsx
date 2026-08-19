import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Award,
  RotateCcw,
  Sparkles,
  BookOpen,
  Send,
  Loader2,
  LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { recordTaskPointLog } from '../../utils/pointLogger';

const QUESTIONS = [
  {
    id: 1,
    pilar: "Dekomposisi",
    question: "Dalam membuat sistem pengelolaan sampah sekolah, langkah pertama yang dilakukan siswa adalah memisahkan masalah menjadi: (1) Jadwal piket, (2) Jenis wadah tong sampah, dan (3) Jalur pengangkutan ke bank sampah. Tindakan ini mencerminkan pilar Computational Thinking yaitu...",
    options: [
      "A. Abstraksi",
      "B. Dekomposisi",
      "C. Pengenalan Pola",
      "D. Algoritma"
    ],
    answer: 1,
    explanation: "Dekomposisi adalah kemampuan memecah masalah yang kompleks menjadi bagian-bagian yang lebih kecil dan mudah dikelola."
  },
  {
    id: 2,
    pilar: "Pengenalan Pola",
    question: "Seorang siswa mengamati bahwa setiap hari Senin dan Jumat, volume botol plastik di kantin sekolah selalu meningkat 2 kali lipat dibanding hari lainnya. Kemampuan mengenali kesamaan siklus ini disebut...",
    options: [
      "A. Pengenalan Pola (Pattern Recognition)",
      "B. Abstraksi (Abstraction)",
      "C. Debugging",
      "D. Kompilasi Kode"
    ],
    answer: 0,
    explanation: "Pengenalan Pola bertujuan untuk melihat kesamaan, tren, atau keteraturan dalam suatu data atau masalah."
  },
  {
    id: 3,
    pilar: "Abstraksi",
    question: "Saat membuat peta denah rute evakuasi gempa di sekolah, kita hanya menggambar jalur koridor, tangga, dan titik kumpul lapangan, tanpa perlu menggambar warna cat dinding atau merek meja kelas. Konsep ini adalah penerapan...",
    options: [
      "A. Dekomposisi",
      "B. Abstraksi",
      "C. Sorting",
      "D. Algoritma Percabangan"
    ],
    answer: 1,
    explanation: "Abstraksi adalah proses menyaring dan mengabaikan informasi yang tidak relevan agar fokus pada informasi penting."
  },
  {
    id: 4,
    pilar: "Algoritma",
    question: "Urutan langkah logis dan terstruktur yang disusun secara sistematis untuk menyelesaikan suatu permasalahan disebut...",
    options: [
      "A. Hardware",
      "B. Algoritma",
      "C. Abstraksi",
      "D. Database"
    ],
    answer: 1,
    explanation: "Algoritma adalah serangkaian instruksi terurut yang harus diikuti untuk memecahkan masalah atau mencapai tujuan tertentu."
  },
  {
    id: 5,
    pilar: "Diagram Alir (Flowchart)",
    question: "Pada simbol diagram alir (Flowchart), bangun datar berbentuk 'Belah Ketupat' (Decision) digunakan untuk melambangkan...",
    options: [
      "A. Awal atau akhir program (Terminator)",
      "B. Input data dari pengguna",
      "C. Keputusan atau kondisi percabangan (Ya / Tidak)",
      "D. Proses perhitungan aritmatika"
    ],
    answer: 2,
    explanation: "Simbol belah ketupat dalam flowchart digunakan untuk pengujian kondisi / percabangan logis (If-Then-Else)."
  },
  {
    id: 6,
    pilar: "Logika Pemrograman",
    question: "Perhatikan logika berikut: JIKA (Nilai >= 75) MAKA cetak 'TUNTAS', SELAIN ITU cetak 'REMIDI'. Jika nilai Budi adalah 74, maka output program adalah...",
    options: [
      "A. TUNTAS",
      "B. REMIDI",
      "C. NILAI TINGGI",
      "D. ERROR"
    ],
    answer: 1,
    explanation: "Karena 74 < 75, kondisi bernilai FALSE (Salah) sehingga mengeksekusi blok SELAIN ITU yaitu 'REMIDI'."
  },
  {
    id: 7,
    pilar: "Struktur Perulangan (Looping)",
    question: "Instruksi yang digunakan saat kita ingin mengulang animasi sprite melangkah sebanyak 10 kali secara otomatis tanpa menulis kode 'Maju 10 langkah' berulang-ulang adalah...",
    options: [
      "A. Percabangan (If)",
      "B. Perulangan (Loop / Repeat)",
      "C. Broadcast Message",
      "D. Variabel Global"
    ],
    answer: 1,
    explanation: "Struktur perulangan (Loop/Repeat) digunakan untuk menjalankan satu atau beberapa instruksi berulang kali sesuai ketentuan."
  },
  {
    id: 8,
    pilar: "Konsep Variabel",
    question: "Dalam game Scratch, di manakah nilai 'SKOR' pemain yang terus bertambah saat menangkap koin disimpan?",
    options: [
      "A. Backdrops",
      "B. Variabel",
      "C. Sound Effect",
      "D. Motion Sensor"
    ],
    answer: 1,
    explanation: "Variabel adalah tempat di memori komputer yang digunakan untuk menyimpan nilai atau data yang dapat berubah selama program berjalan."
  },
  {
    id: 9,
    pilar: "Debugging",
    question: "Aktivitas mencari, menganalisis, dan memperbaiki kesalahan / bug pada algoritma atau baris program dinamakan...",
    options: [
      "A. Debugging",
      "B. Rendering",
      "C. Enkripsi",
      "D. Defrag"
    ],
    answer: 0,
    explanation: "Debugging adalah proses menemukan dan memperbaiki kesalahan (bug) agar program berjalan sesuai logika yang diharapkan."
  },
  {
    id: 10,
    pilar: "Etika Digital",
    question: "Manakah tindakan di bawah ini yang mencerminkan etika digital (Netiquette) yang baik saat berdiskusi di grup kelas online?",
    options: [
      "A. Menyebarkan tangkapan layar chat pribadi teman tanpa izin",
      "B. Menulis semua pesan menggunakan HURUF KAPITAL BESAR SEMUA",
      "C. Menggunakan bahasa yang sopan dan tidak menyebarkan informasi hoaks",
      "D. Membagikan password akun portal belajar kepada siapa saja"
    ],
    answer: 2,
    explanation: "Etika digital mencakup kesantunan berbahasa, menghargai privasi, dan memastikan kebenaran informasi sebelum membagikannya."
  }
];

export default function TugasKuisAlgoritma() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [dbTaskId, setDbTaskId] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  // 1. Identify Student with real-time storage sync
  useEffect(() => {
    const syncStudent = () => {
      try {
        const savedUser = localStorage.getItem('user_siswa');
        if (savedUser) {
          setStudent(JSON.parse(savedUser));
        } else {
          setStudent(null);
        }
      } catch (e) {
        console.error(e);
        setStudent(null);
      }
    };

    syncStudent();
    window.addEventListener('storage', syncStudent);
    return () => window.removeEventListener('storage', syncStudent);
  }, []);

  const handleOpenLogin = () => {
    window.dispatchEvent(new CustomEvent('open-login-modal'));
  };

  // 2. Fetch or match taskId from Supabase tugas_master
  useEffect(() => {
    const findTask = async () => {
      try {
        const { data: taskRecord } = await supabase
          .from('tugas_master')
          .select('id, kode_tugas, tipe_tugas')
          .or('kode_tugas.eq.TUGAS-02-KUIS-ALGO,tipe_tugas.eq.kuis')
          .limit(1)
          .maybeSingle();

        if (taskRecord?.id) {
          setDbTaskId(taskRecord.id);
        }
      } catch (err) {
        console.warn("Kueri tugas_master:", err);
      }
    };
    findTask();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIdx) => {
    if (isFinished) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIdx
    }));
  };

  // Calculate score and finish
  const handleFinishQuiz = async () => {
    if (isFinished) return;

    let correctCount = 0;
    QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correctCount += 1;
      }
    });

    const totalPoints = correctCount * 10; // 10 questions x 10 points = 100
    const resultData = {
      correctCount,
      totalQuestions: QUESTIONS.length,
      score: totalPoints,
      percentage: Math.round((correctCount / QUESTIONS.length) * 100),
      answers: selectedAnswers,
      completedAt: new Date().toISOString()
    };

    setScoreResult(resultData);
    setIsFinished(true);
    setIsSubmitting(true);

    try {
      if (student?.id) {
        // Resolve real taskId
        let resolvedTaskId = dbTaskId;
        if (!resolvedTaskId) {
          const { data: tData } = await supabase
            .from('tugas_master')
            .select('id')
            .or('kode_tugas.eq.TUGAS-02-KUIS-ALGO,tipe_tugas.eq.kuis')
            .limit(1)
            .maybeSingle();

          if (tData?.id) {
            resolvedTaskId = tData.id;
            setDbTaskId(tData.id);
          }
        }

        if (resolvedTaskId) {
          // Ambil skor kuis sebelumnya untuk menghitung delta
          const { data: prevSub } = await supabase
            .from('tugas_pengumpulan')
            .select('skor')
            .eq('tugas_id', resolvedTaskId)
            .eq('siswa_id', student.id)
            .maybeSingle();

          const prevScore = prevSub?.skor || 0;
          const finalScoreToSave = Math.max(prevScore, totalPoints);

          // 1. Upsert to tugas_pengumpulan
          await supabase.from('tugas_pengumpulan').upsert(
            {
              tugas_id: resolvedTaskId,
              siswa_id: student.id,
              status: 'selesai',
              skor: finalScoreToSave,
              detail_jawaban: resultData,
              submitted_at: new Date().toISOString(),
              catatan_guru: `Skor Kuis Berpikir Komputasional: ${totalPoints}/100 (${correctCount}/${QUESTIONS.length} Benar).`
            },
            { onConflict: 'tugas_id,siswa_id' }
          );

          // 2. Catat ke point_logs & sync ke master_siswa
          const latestTotalPoints = await recordTaskPointLog({
            siswaId: student.id,
            currentScore: totalPoints,
            previousScore: prevScore,
            activityType: 'tugas',
            taskTitle: 'Tugas 2: Kuis Berpikir Komputasional'
          });

          if (latestTotalPoints !== null && latestTotalPoints !== undefined) {
            const updatedStudent = { ...student, total_points: latestTotalPoints };
            setStudent(updatedStudent);
            localStorage.setItem('user_siswa', JSON.stringify(updatedStudent));
            window.dispatchEvent(new Event('storage'));
          }
        }
      }
    } catch (e) {
      console.warn("Simpan kuis ke Supabase error:", e);
    }

    setIsSubmitting(false);
  };

  const currentQ = QUESTIONS[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-16 pt-20 sm:pt-24">
      {/* Top Sticky Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-[70px] sm:top-[76px] z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/ruang-belajar')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <div className="h-5 w-px bg-slate-200 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                  Tugas 2 • Kuis Interaktif
                </span>
                {student ? (
                  <span className="text-[10px] font-semibold text-slate-500 hidden sm:inline">
                    Siswa: <strong className="text-slate-800">{student.NAMA || student.nama}</strong> ({student.Kelas || '7.1'})
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Mode Tamu
                  </span>
                )}
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-800 line-clamp-1">
                Logika & 4 Pilar Berpikir Komputasional
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!student && (
              <button
                type="button"
                onClick={handleOpenLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition"
                id="btn-login-quiz-top"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Akun</span>
              </button>
            )}

            {/* Countdown Badge */}
            {!isFinished && (
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold border ${
                  timeLeft < 180
                    ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            )}

            {!isFinished && (
              <button
                type="button"
                onClick={() => {
                  if (answeredCount < QUESTIONS.length) {
                    if (!confirm(`Anda baru menjawab ${answeredCount} dari ${QUESTIONS.length} soal. Yakin ingin mengakhiri kuis?`)) return;
                  }
                  handleFinishQuiz();
                }}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition disabled:opacity-50"
                id="btn-submit-quiz-now"
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Selesai & Kumpul</span>
              </button>
            )}
          </div>
        </div>

        {/* Guest Banner */}
        {!student && (
          <div className="bg-amber-50/90 border-t border-amber-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Perhatian:</strong> Anda belum masuk akun siswa. Anda bisa mengerjakan kuis untuk latihan mandiri, namun skor <strong>tidak akan disimpan</strong> ke database sampai Anda login.
              </span>
            </div>
            <button
              type="button"
              onClick={handleOpenLogin}
              className="font-bold text-indigo-700 hover:text-indigo-900 underline whitespace-nowrap"
            >
              Masuk Sekarang &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {!isFinished ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Active Question Card (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs"
              >
                {/* Question Header */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {currentIndex + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Soal {currentIndex + 1} dari {QUESTIONS.length}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                    Topik: {currentQ.pilar}
                  </span>
                </div>

                {/* Question Body */}
                <h3 className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed mb-6">
                  {currentQ.question}
                </h3>

                {/* Multiple Choice Options */}
                <div className="space-y-3">
                  {currentQ.options.map((option, optIdx) => {
                    const isSelected = selectedAnswers[currentIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-500 text-indigo-900 shadow-xs ring-2 ring-indigo-500/20'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50'
                        }`}
                        id={`option-${currentIndex}-${optIdx}`}
                      >
                        <span>{option}</span>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ml-3 ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Question Navigation Prev/Next */}
                <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition disabled:opacity-30"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Sebelumnya</span>
                  </button>

                  <div className="text-xs text-slate-400 font-medium">
                    Terjawab: <strong className="text-slate-700">{answeredCount}</strong> / {QUESTIONS.length}
                  </div>

                  <button
                    type="button"
                    disabled={currentIndex === QUESTIONS.length - 1}
                    onClick={() => setCurrentIndex((prev) => Math.min(QUESTIONS.length - 1, prev + 1))}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition disabled:opacity-30"
                  >
                    <span>Berikutnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right: Question Palette / Grid (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                  Navigasi Nomor Soal
                </h4>

                <div className="grid grid-cols-5 gap-2">
                  {QUESTIONS.map((q, idx) => {
                    const isAnswered = selectedAnswers[idx] !== undefined;
                    const isCurrent = currentIndex === idx;

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-10 rounded-xl font-bold text-xs transition-all flex items-center justify-center border ${
                          isCurrent
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-2 ring-indigo-500/20'
                            : isAnswered
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-extrabold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded bg-emerald-50 border border-emerald-300" />
                    <span>Sudah Dijawab</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded bg-indigo-600" />
                    <span>Soal Aktif</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-200" />
                    <span>Belum Dijawab</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Quiz Results & Explanations Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            {/* Score Summary Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm text-center">
              <div
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 ${
                  student?.id
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-amber-100 text-amber-600'
                }`}
              >
                <Award className="w-8 h-8" />
              </div>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold inline-block mb-2 ${
                  student?.id
                    ? 'bg-purple-50 text-purple-700 border border-purple-100'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {student?.id ? 'Hasil Kuis Tersimpan' : 'Latihan Mandiri (Mode Tamu)'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                Skor Anda: {scoreResult?.score} / 100 Poin
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Menjawab benar <strong>{scoreResult?.correctCount}</strong> dari {QUESTIONS.length} soal ({scoreResult?.percentage}%).
              </p>

              {student?.id ? (
                <p className="text-xs text-emerald-600 mt-1 font-semibold">
                  Nilai telah otomatis tersimpan ke rekap profil Anda dan papan peringkat kelas!
                </p>
              ) : (
                <div className="mt-4 p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 text-left max-w-md mx-auto">
                  <p className="font-bold mb-1">⚠️ Skor Belum Tersimpan:</p>
                  <p className="text-slate-600">
                    Anda belum masuk akun siswa. Masuk sekarang agar skor latihan Anda tercatat secara resmi.
                  </p>
                </div>
              )}

              <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => navigate('/ruang-belajar')}
                  className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Kembali ke Ruang Belajar
                </button>
                {!student?.id && (
                  <button
                    type="button"
                    onClick={handleOpenLogin}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs transition"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Masuk Akun Siswa</span>
                  </button>
                )}
              </div>
            </div>

            {/* Answer Key & Explanations */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Pembahasan Jawaban & Solusi
              </h3>

              <div className="space-y-4">
                {QUESTIONS.map((q, idx) => {
                  const studentAns = selectedAnswers[idx];
                  const isCorrect = studentAns === q.answer;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border text-xs leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50/60 border-emerald-200'
                          : 'bg-rose-50/50 border-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-bold text-slate-700">Soal {idx + 1} • {q.pilar}</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          isCorrect ? 'bg-emerald-200/80 text-emerald-800' : 'bg-rose-200/80 text-rose-800'
                        }`}>
                          {isCorrect ? '+10 Poin (Benar)' : '0 Poin (Salah)'}
                        </span>
                      </div>
                      <p className="font-medium text-slate-800 mb-2">{q.question}</p>
                      <p className="text-slate-600">
                        <strong>Jawaban Anda:</strong> {studentAns !== undefined ? q.options[studentAns] : '(Tidak dijawab)'}
                      </p>
                      <p className="text-emerald-800 font-semibold mt-1">
                        <strong>Kunci Jawaban:</strong> {q.options[q.answer]}
                      </p>
                      <div className="mt-2 pt-2 border-t border-slate-200/60 text-slate-500 text-[11px]">
                        <strong>Penjelasan:</strong> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
