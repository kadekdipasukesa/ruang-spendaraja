// src/hooks/Game1Typing/useTypingGame.js
import { useState, useEffect, useRef, useCallback } from 'react';

const WORD_POOL = [
  'belajar', 'sekolah', 'siswa', 'guru', 'kelas', 'buku', 'pensil', 'tugas', 'ujian', 'ilmu',
  'pintar', 'cerdas', 'kreatif', 'mandiri', 'disiplin', 'tekun', 'perpustakaan', 'kantin', 'upacara', 'bendera',
  'kurikulum', 'materi', 'praktek', 'teori', 'metode', 'riset', 'kamus', 'jurnal', 'prestasi', 'beasiswa',
  'pendidikan', 'akademik', 'skor', 'nilai', 'rangking', 'semester', 'ijazah', 'bangku', 'kapur', 'spidol',
  'semangat', 'hebat', 'mampu', 'bisa', 'lancar', 'cepat', 'lincah', 'fokus', 'asah', 'latih',
  'juara', 'berani', 'sukses', 'impian', 'cita', 'usaha', 'doa', 'sabar', 'jujur', 'setia',
  'bangga', 'ceria', 'aktif', 'positif', 'inovasi', 'imajinasi', 'potensi', 'bakat', 'minat', 'paham',
  'gigih', 'tangguh', 'optimis', 'bijak', 'santun', 'ramah', 'peduli', 'berbagi', 'kerjasama', 'gotong',
  'papan', 'tombol', 'jari', 'tangan', 'mata', 'layar', 'suara', 'gambar', 'video', 'musik',
  'baca', 'tulis', 'hitung', 'gambar', 'simpan', 'hapus', 'salin', 'tempel', 'cari', 'temukan',
  'buka', 'tutup', 'mulai', 'selesai', 'istirahat', 'makan', 'minum', 'duduk', 'berdiri', 'jalan',
  'lompat', 'lari', 'main', 'kerja', 'bantu', 'lihat', 'dengar', 'rasa', 'pikir', 'paham',
  'di', 'ke', 'dari', 'dan', 'atau', 'yang', 'untuk', 'pada', 'dengan', 'tanpa'
];

const TIME_LIMIT = 60;

export const useTypingGame = (onGameEnd) => {
  const [words, setWords] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [wordHistory, setWordHistory] = useState([]);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const startTimeRef = useRef(null);
  
  // Menggunakan Ref untuk mengunci callback onGameEnd agar tidak memicu reset internal pada useEffect
  const onGameEndRef = useRef(onGameEnd);
  useEffect(() => {
    onGameEndRef.current = onGameEnd;
  }, [onGameEnd]);

  const initGame = useCallback(() => {
    const shuffled = [...WORD_POOL].sort(() => Math.random() - 0.5).slice(0, 100);
    setWords(shuffled);
    setCurrentIndex(0);
    setIsTimerStarted(false);
    setWordHistory([]);
    setTimeLeft(TIME_LIMIT);
    setUserInput('');
    setCorrectChars(0);
    setTotalTypedChars(0);
    setWpm(0);
    setAccuracy(100);
    setIsPlaying(true);
    setIsFinished(false);
    startTimeRef.current = null;
  }, []);

  // Memisahkan penanda status selesai murni dari pengiriman callback skor Supabase
  const endGame = useCallback(() => {
    setIsPlaying(false);
    setIsFinished(true);
  }, []);

  // Memicu pengiriman skor ke Supabase ketika game selesai terkonfirmasi
  useEffect(() => {
    if (isFinished && onGameEndRef.current) {
      onGameEndRef.current(wpm, accuracy);
    }
  }, [isFinished, wpm, accuracy]);

  // ==========================================
  // LOGIKA TIMER (ANTI-DELAY STABILIZER)
  // ==========================================
  useEffect(() => {
    let timer;
    if (isPlaying && isTimerStarted && timeLeft > 0) {
      if (!startTimeRef.current) startTimeRef.current = Date.now();

      timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const remaining = Math.max(0, TIME_LIMIT - elapsed);
        
        // Mencegah re-render jika nilainya sama
        setTimeLeft((prev) => {
          if (prev === remaining) return prev;
          if (remaining <= 0) {
            endGame();
            return 0;
          }
          return remaining;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isTimerStarted, endGame]);

  const handleInput = (e) => {
    const val = e.target.value;
    if (isPlaying && !isTimerStarted && val.length > 0) setIsTimerStarted(true);

    if (val.endsWith(' ') && val.trim().length > 0) {
      const typedWord = val.trim();
      const targetWord = words[currentIndex];
      const isCorrect = typedWord === targetWord;

      setWordHistory(prev => [...prev, isCorrect]);

      let newCorrect = correctChars;
      if (isCorrect) newCorrect += targetWord.length;
      setCorrectChars(newCorrect);

      // Hitung akumulasi total karakter yang terproses secara akurat
      const newTotal = totalTypedChars + targetWord.length;
      setTotalTypedChars(newTotal);

      const elapsedMinutes = (Date.now() - (startTimeRef.current || Date.now())) / 60000;
      if (elapsedMinutes > 0) {
        setWpm(Math.round((newCorrect / 5) / elapsedMinutes));
      }
      if (newTotal > 0) setAccuracy(Math.round((newCorrect / newTotal) * 100));

      setCurrentIndex(prev => prev + 1);
      setUserInput('');
      
      if (currentIndex + 1 >= words.length) endGame();
    } else if (val !== ' ') {
      setUserInput(val);
    }
  };

  return {
    words, userInput, currentIndex, timeLeft, isPlaying, isFinished,
    wordHistory, wpm, accuracy, initGame, handleInput
  };
};