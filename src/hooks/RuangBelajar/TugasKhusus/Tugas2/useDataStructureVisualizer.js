import { useState, useEffect } from 'react';
import { soundEffects } from '../../../../utils/gameAudio';
import { triggerConfetti } from '../../../../utils/confettiHelper';

// Preset contoh daftar belanjaan & daftar nama siswa
export const INITIAL_SHOPPING_LIST = [
  { id: 'item-1', name: 'Bayam Segar', category: 'Sayuran', secretLetter: 'B', indexPos: 1, secretHint: 'Huruf ke-1 dari "Bayam"' },
  { id: 'item-2', name: 'Udang Laut', category: 'Lauk', secretLetter: 'U', indexPos: 2, secretHint: 'Huruf ke-1 dari "Udang"' },
  { id: 'item-3', name: 'Kacang Kedelai', category: 'Bumbu', secretLetter: 'K', indexPos: 3, secretHint: 'Huruf ke-1 dari "Kacang"' },
  { id: 'item-4', name: 'Ubi Manis', category: 'Karbohidrat', secretLetter: 'U', indexPos: 4, secretHint: 'Huruf ke-1 dari "Ubi"' },
];

export const INITIAL_STUDENT_LIST = [
  { id: 'std-1', name: 'I Made Indra', absen: '01', secretLetter: 'I', indexPos: 1 },
  { id: 'std-2', name: 'Ni Nyoman Sari', absen: '02', secretLetter: 'N', indexPos: 2 },
  { id: 'std-3', name: 'Fajar Pratama', absen: '03', secretLetter: 'F', indexPos: 3 },
  { id: 'std-4', name: 'Okta Wijaya', absen: '04', secretLetter: 'O', indexPos: 4 },
];

// Kuis Pilihan Ganda A-B-C-D-E dengan panjang opsi seimbang & acak (tidak membocorkan jawaban, hanya hasil nilai)
export const STRUCTURE_QUIZ_QUESTIONS = [
  {
    id: 'sq-1',
    question: 'Mengapa komputer dan manusia membutuhkan struktur data dalam bentuk daftar (list) dalam kehidupan sehari-hari?',
    options: [
      { id: 'opt-a', text: 'Agar kumpulan informasi tersimpan secara teratur dan lebih mudah dicari kembali.', correct: true },
      { id: 'opt-b', text: 'Agar seluruh memori perangkat elektronik langsung terkuras habis secara terus-menerus.', correct: false },
      { id: 'opt-c', text: 'Agar seluruh susunan data di dalam dokumen komputer berubah menjadi teracak otomatis.', correct: false },
      { id: 'opt-d', text: 'Agar setiap baris catatan informasi tidak dapat diedit atau diperbarui oleh pengguna.', correct: false },
      { id: 'opt-e', text: 'Agar semua teks di dalam lembar kerja komputer terhapus permanen setiap beberapa saat.', correct: false },
    ],
  },
  {
    id: 'sq-2',
    question: 'Ibu mencatat 4 barang belanjaan di kertas: [1. Apel, 2. Melon, 3. Jeruk, 4. Pisang]. Angka nomor 1 sampai 4 tersebut dalam struktur data disebut sebagai...',
    options: [
      { id: 'opt-a', text: 'Kapasitas maksimal memori penyimpanan baterai yang tersisa pada komputer laptop.', correct: false },
      { id: 'opt-b', text: 'Indeks atau posisi nomor urut yang menunjukkan letak elemen di dalam daftar.', correct: true },
      { id: 'opt-c', text: 'Jumlah harga total keseluruhan barang yang wajib dibayarkan kepada pihak kasir.', correct: false },
      { id: 'opt-d', text: 'Nama kode rahasia keamanan untuk mengunci dokumen file catatan di komputer.', correct: false },
      { id: 'opt-e', text: 'Tingkat kecepatan koneksi jaringan internet yang sedang terhubung ke telepon pintar.', correct: false },
    ],
  },
  {
    id: 'sq-3',
    question: 'Jika pada daftar belanjaan [Apel, Melon, Jeruk, Pisang], ibu menghapus "Melon" dari urutan ke-2, apa yang terjadi pada posisi barang "Jeruk"?',
    options: [
      { id: 'opt-a', text: 'Posisi Jeruk otomatis langsung terhapus dan hilang sepenuhnya dari dalam catatan.', correct: false },
      { id: 'opt-b', text: 'Posisi Jeruk otomatis berpindah secara acak ke luar halaman berkas catatan ibu.', correct: false },
      { id: 'opt-c', text: 'Posisi Jeruk otomatis bergeser maju menempati urutan ke-2 di dalam daftar belanja.', correct: true },
      { id: 'opt-d', text: 'Posisi Jeruk tetap berada di urutan ke-3 dengan membiarkan urutan ke-2 rusak.', correct: false },
      { id: 'opt-e', text: 'Posisi Jeruk otomatis berganti nama menjadi barang lain yang sama sekali berbeda.', correct: false },
    ],
  },
  {
    id: 'sq-4',
    question: 'Pada aktivitas kata rahasia, jika kita mengambil huruf pertama dari setiap kata di daftar: [1. Kopi, 2. Onde, 3. Donat, 4. Es], kata rahasia apa yang tersusun?',
    options: [
      { id: 'opt-a', text: 'BUKU (Tersusun teratur dari huruf pertama masing-masing urutan ke 1, 2, 3, dan 4).', correct: false },
      { id: 'opt-b', text: 'DATA (Tersusun teratur dari huruf pertama masing-masing urutan ke 1, 2, 3, dan 4).', correct: false },
      { id: 'opt-c', text: 'TEKS (Tersusun teratur dari huruf pertama masing-masing urutan ke 1, 2, 3, dan 4).', correct: false },
      { id: 'opt-d', text: 'KODE (Tersusun teratur dari huruf pertama masing-masing urutan ke 1, 2, 3, dan 4).', correct: true },
      { id: 'opt-e', text: 'SUAP (Tersusun teratur dari huruf pertama masing-masing urutan ke 1, 2, 3, dan 4).', correct: false },
    ],
  },
  {
    id: 'sq-5',
    question: 'Manakah di bawah ini yang merupakan contoh nyata penerapan struktur data berbentuk Daftar (List) di lingkungan sekolah?',
    options: [
      { id: 'opt-a', text: 'Warna cat dinding pada gedung perpustakaan sekolah yang berwarna putih terang.', correct: false },
      { id: 'opt-b', text: 'Bunyi nada bel istirahat sekolah yang berbunyi tepat pada pukul sepuluh pagi.', correct: false },
      { id: 'opt-c', text: 'Ukuran luas lapangan upacara bendera sekolah yang diukur menggunakan meteran.', correct: false },
      { id: 'opt-d', text: 'Hembusan arah angin yang bergerak kencang di halaman sekolah saat siang hari.', correct: false },
      { id: 'opt-e', text: 'Daftar nama dan nomor absen seluruh peserta didik pada buku presensi kelas 7A.', correct: true },
    ],
  },
];

export function useDataStructureVisualizer({ onComplete, currentScore = 0 }) {
  const [activeSubTab, setActiveSubTab] = useState('simulasi'); // 'simulasi' | 'kuis'
  const [listType, setListType] = useState('belanja'); // 'belanja' | 'siswa'
  const [items, setItems] = useState(INITIAL_SHOPPING_LIST);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [userGuessWord, setUserGuessWord] = useState('');
  const [guessFeedback, setGuessFeedback] = useState('');

  // Kuis State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(currentScore > 0);
  const [quizScoreResult, setQuizScoreResult] = useState(Math.round(currentScore / 4));

  useEffect(() => {
    if (currentScore > 0) {
      setQuizSubmitted(true);
      setQuizScoreResult(Math.round(currentScore / 4));
    }
  }, [currentScore]);

  // Switch list preset
  const handleSwitchListType = (type) => {
    soundEffects.playStep();
    setListType(type);
    if (type === 'belanja') {
      setItems(INITIAL_SHOPPING_LIST);
    } else {
      setItems(INITIAL_STUDENT_LIST);
    }
    setUserGuessWord('');
    setGuessFeedback('');
  };

  // Add Item to list
  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    soundEffects.playStep();
    const name = newItemName.trim();
    const firstChar = name.charAt(0).toUpperCase();
    const newItem = {
      id: `custom-${Date.now()}`,
      name,
      category: newItemCategory.trim() || 'Lainnya',
      secretLetter: firstChar,
      secretHint: `Huruf ke-1 dari "${name}"`,
    };
    setItems((prev) => [...prev, newItem]);
    setNewItemName('');
    setNewItemCategory('');
  };

  // Delete item from list
  const handleDeleteItem = (id) => {
    if (items.length <= 1) {
      soundEffects.playFail();
      alert('Sisakan minimal 1 elemen di dalam daftar!');
      return;
    }
    soundEffects.playStep();
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Kata rahasia aktual yang terbentuk
  const actualSecretWord = items.map((it) => it.secretLetter).join('');

  // Cek tebakan kata rahasia
  const handleCheckSecretWord = () => {
    if (!userGuessWord.trim()) return;
    if (userGuessWord.trim().toUpperCase() === actualSecretWord.toUpperCase()) {
      soundEffects.playSuccess();
      triggerConfetti();
      setGuessFeedback(`🎉 HEBAT SEKALI! Kata rahasia "${actualSecretWord}" berhasil kamu temukan dengan membaca huruf indeks ke-1 dari setiap urutan!`);
    } else {
      soundEffects.playFail();
      setGuessFeedback(`🔍 Masih belum tepat. Perhatikan huruf pertama pada setiap urutan [1] sampai [${items.length}] untuk membentuk kata rahasia.`);
    }
  };

  // Handle quiz option select
  const handleSelectQuizOption = (questionId, optionId) => {
    if (quizSubmitted) return;
    soundEffects.playStep();
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Submit Quiz
  const handleSubmitQuiz = () => {
    let correctCount = 0;

    STRUCTURE_QUIZ_QUESTIONS.forEach((q) => {
      const chosenOptId = quizAnswers[q.id];
      const correctOpt = q.options.find((opt) => opt.correct);
      if (chosenOptId === correctOpt?.id) {
        correctCount += 1;
      }
    });

    const earnedScore = correctCount * 4; // 5 soal x 4 = 20 Poin
    setQuizScoreResult(correctCount);
    setQuizSubmitted(true);

    if (correctCount >= 3) {
      soundEffects.playSuccess();
      triggerConfetti();
    } else {
      soundEffects.playFail();
    }

    if (onComplete) {
      onComplete('m3', earnedScore);
    }
  };

  const handleResetQuiz = () => {
    soundEffects.playStep();
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScoreResult(0);
  };

  return {
    activeSubTab,
    setActiveSubTab,
    listType,
    items,
    newItemName,
    setNewItemName,
    newItemCategory,
    setNewItemCategory,
    handleSwitchListType,
    handleAddItem,
    handleDeleteItem,
    actualSecretWord,
    userGuessWord,
    setUserGuessWord,
    guessFeedback,
    handleCheckSecretWord,
    quizQuestions: STRUCTURE_QUIZ_QUESTIONS,
    quizAnswers,
    quizSubmitted,
    quizScoreResult,
    handleSelectQuizOption,
    handleSubmitQuiz,
    handleResetQuiz,
  };
}
