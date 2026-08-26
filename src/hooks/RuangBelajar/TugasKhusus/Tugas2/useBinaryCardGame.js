import { useState } from 'react';

// Skenario Pertanyaan 2 Kemungkinan (Ya/Tidak) vs Banyak Kemungkinan
export const REPRESENTATION_EXAMPLES = [
  {
    id: 'ex-1',
    title: 'Sarapan Pagi',
    openQuestion: 'Apa menu sarapanmu pagi ini?',
    openType: 'Banyak Kemungkinan (Nasi, Roti, Bubur, Mie, dll)',
    binaryQuestion: 'Apakah hari ini kamu sarapan roti?',
    binaryType: '2 Kemungkinan (Hanya "Ya" atau "Tidak")',
    stateYesNo: true,
  },
  {
    id: 'ex-2',
    title: 'Kondisi Cuaca Kemarin',
    openQuestion: 'Bagaimana kondisi cuaca di kotamu kemarin?',
    openType: 'Banyak Kemungkinan (Cerah, Berawan, Gerimis, Hujan Lebat)',
    binaryQuestion: 'Apakah kemarin di kotamu turun hujan?',
    binaryType: '2 Kemungkinan (Hanya "Ya" atau "Tidak")',
    stateYesNo: false,
  },
  {
    id: 'ex-3',
    title: 'Warna Kesukaan',
    openQuestion: 'Apa warna kesukaanmu?',
    openType: 'Banyak Kemungkinan (Merah, Biru, Hijau, Kuning, dll)',
    binaryQuestion: 'Apakah warna kesukaanmu adalah warna Biru?',
    binaryType: '2 Kemungkinan (Hanya "Ya" atau "Tidak")',
    stateYesNo: true,
  },
  {
    id: 'ex-4',
    title: 'Perlengkapan Sekolah',
    openQuestion: 'Buku pelajaran apa saja yang kamu bawa hari ini?',
    openType: 'Banyak Kemungkinan (Informatika, IPA, Matematika, dll)',
    binaryQuestion: 'Apakah hari ini kamu membawa buku Informatika?',
    binaryType: '2 Kemungkinan (Hanya "Ya" atau "Tidak")',
    stateYesNo: true,
  },
];

// Soal Kuis Representasi Data (5 Soal Pilihan Ganda A-B-C-D-E dengan opsi sama panjang & acak)
export const REPRESENTATION_QUIZ_QUESTIONS = [
  {
    id: 'rq-1',
    question: 'Di antara pertanyaan-pertanyaan berikut, manakah pertanyaan yang HANYA memiliki 2 kemungkinan jawaban (Ya atau Tidak)?',
    options: [
      { id: 'opt-a', text: 'Berapa nomor ukuran sepatu olahraga yang kamu pakai untuk senam?', correct: false },
      { id: 'opt-b', text: 'Siapakah nama teman sebangkumu saat belajar di ruang kelas 7A?', correct: false },
      { id: 'opt-c', text: 'Apakah kamu hari ini membawa buku paket Informatika ke sekolah?', correct: true },
      { id: 'opt-d', text: 'Apa makanan kesukaanmu saat berbelanja di kantin sekolah siang?', correct: false },
      { id: 'opt-e', text: 'Di mana alamat rumah tempat tinggal kakek dan nenekmu berada?', correct: false },
    ],
  },
  {
    id: 'rq-2',
    question: 'Pertanyaan "Apa warna kesukaanmu?" memiliki banyak kemungkinan jawaban. Bagaimana cara mengubahnya menjadi pertanyaan 2 kemungkinan (Ya/Tidak)?',
    options: [
      { id: 'opt-a', text: 'Mengubahnya menjadi pertanyaan: "Mengapa kamu sangat menyukai warna itu?".', correct: false },
      { id: 'opt-b', text: 'Mengubahnya menjadi pertanyaan: "Kapan pertama kali kamu melihat warna itu?".', correct: false },
      { id: 'opt-c', text: 'Mengubahnya menjadi pertanyaan: "Berapa banyak warna pelangi yang kamu tahu?".', correct: false },
      { id: 'opt-d', text: 'Mengubahnya menjadi pertanyaan: "Apakah warna kesukaanmu adalah biru?".', correct: true },
      { id: 'opt-e', text: 'Mengubahnya menjadi pertanyaan: "Di toko mana kamu membeli cat warna tersebut?".', correct: false },
    ],
  },
  {
    id: 'rq-3',
    question: 'Mengapa komputer di tingkat dasar sering menggunakan representasi data dengan dua kondisi (seperti Benar/Salah atau 1/0)?',
    options: [
      { id: 'opt-a', text: 'Karena sirkuit listrik komputer bekerja dengan dua keadaan yaitu arus mengalir atau mati.', correct: true },
      { id: 'opt-b', text: 'Karena komputer tidak mampu menyimpan angka hitungan yang bernilai lebih dari angka sepuluh.', correct: false },
      { id: 'opt-c', text: 'Karena kabel komputer akan langsung terbakar jika menerima lebih dari dua baris data teks.', correct: false },
      { id: 'opt-d', text: 'Karena layar monitor komputer hanya dapat memunculkan dua variasi warna hitam dan putih.', correct: false },
      { id: 'opt-e', text: 'Karena tombol papan ketik komputer hanya memiliki dua tombol alfabet yang dapat ditekan.', correct: false },
    ],
  },
  {
    id: 'rq-4',
    question: 'Ketika guru bertanya di kelas: "Apakah semua siswa sudah mengumpulkan tugas?", jenis kemungkinan jawaban dari pertanyaan tersebut adalah...',
    options: [
      { id: 'opt-a', text: 'Memiliki ratusan kemungkinan jawaban yang tidak memiliki kepastian informasi.', correct: false },
      { id: 'opt-b', text: 'Hanya 2 kemungkinan jawaban yang pasti, yaitu "Ya (Sudah)" atau "Tidak (Belum)".', correct: true },
      { id: 'opt-c', text: 'Hanya dapat dijawab dengan menyebutkan angka pecahan desimal tanpa kata-kata.', correct: false },
      { id: 'opt-d', text: 'Tidak dapat dijawab sama sekali karena pertanyaannya melanggar aturan tata bahasa.', correct: false },
      { id: 'opt-e', text: 'Wajib dijawab dengan menuliskan karangan cerita panjang sebanyak sepuluh lembar.', correct: false },
    ],
  },
  {
    id: 'rq-5',
    question: 'Budi ingin mengecek apakah temannya sarapan pagi dengan pertanyaan biner (2 kemungkinan). Pertanyaan yang tepat diajukan oleh Budi adalah...',
    options: [
      { id: 'opt-a', text: 'Berapa harga seporsi nasi bungkus yang kamu beli di warung dekat rumah?', correct: false },
      { id: 'opt-b', text: 'Siapakah yang memasak makanan lauk pauk di dapur rumahmu tadi pagi?', correct: false },
      { id: 'opt-c', text: 'Pukul berapa tepatnya kamu bangun dari tempat tidurmu tadi pagi hari?', correct: false },
      { id: 'opt-d', text: 'Di mana tempat makan favorit keluargamu ketika hari libur tiba nanti?', correct: false },
      { id: 'opt-e', text: 'Apakah kamu tadi pagi sudah sarapan sebelum berangkat sekolah?', correct: true },
    ],
  },
];

export function useBinaryCardGame({ onComplete, currentScore = 0 }) {
  const [activeSubTab, setActiveSubTab] = useState('simulasi'); // 'simulasi' | 'kuis'
  const [interactiveStates, setInteractiveStates] = useState({
    'ex-1': true,
    'ex-2': false,
    'ex-3': true,
    'ex-4': true,
  });

  // Kuis State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(currentScore > 0);
  const [quizScoreResult, setQuizScoreResult] = useState(Math.round(currentScore / 4));

  // Toggle switch Ya / Tidak pada contoh interaktif
  const handleToggleState = (id) => {
    setInteractiveStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Pilih Opsi Kuis
  const handleSelectQuizOption = (questionId, optionId) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Submit Kuis
  const handleSubmitQuiz = () => {
    let correctCount = 0;
    REPRESENTATION_QUIZ_QUESTIONS.forEach((q) => {
      const chosenId = quizAnswers[q.id];
      const correctOpt = q.options.find((o) => o.correct);
      if (chosenId === correctOpt?.id) {
        correctCount += 1;
      }
    });

    const earnedScore = correctCount * 4; // 5 soal x 4 = 20 Poin
    setQuizScoreResult(correctCount);
    setQuizSubmitted(true);

    if (onComplete) {
      onComplete('m4', earnedScore);
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScoreResult(0);
  };

  return {
    activeSubTab,
    setActiveSubTab,
    examples: REPRESENTATION_EXAMPLES,
    interactiveStates,
    handleToggleState,
    quizQuestions: REPRESENTATION_QUIZ_QUESTIONS,
    quizAnswers,
    quizSubmitted,
    quizScoreResult,
    handleSelectQuizOption,
    handleSubmitQuiz,
    handleResetQuiz,
  };
}
