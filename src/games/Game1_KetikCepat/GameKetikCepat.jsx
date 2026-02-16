import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Trophy, Zap, Keyboard, Timer, Target } from 'lucide-react';
// Di dalam GameKetikCepat.jsx
import ModalRiwayat from './ModalRiwayat'; // Gunakan './' karena satu folder
import { supabase } from '../../lib/supabaseClient'; // Naik 2 level ke folder src
import Leaderboard from '../../components/Leaderboard';

const GameKetikCepat = ({ onArchiveAchievement }) => {
  // ==========================================
  // 1. KONFIGURASI & DATA TEKS
  // ==========================================
  const SAMPLE_TEXTS = [
    'saya berlatih mengetik dengan kecepatan penuh setiap hari untuk mengasah keterampilan jari jemari agar bisa lebih lincah dan akurat dalam menekan setiap tombol pada papan ketik ini adalah tantangan yang saya nikmati karena dapat menguji fokus dan daya tahan mental saya dalam menghadapi berbagai rintangan teknologi di masa depan yang semakin berkembang pesat setiap saat kita harus konsisten berlatih agar tidak tertinggal oleh kemajuan zaman yang menuntut efisiensi kerja tinggi kecepatan jemari dalam menari di atas papan ketik akan membantu kita menyelesaikan tugas sekolah maupun pekerjaan dengan jauh lebih mudah dan efektif tanpa perlu merasa lelah atau bosan karena sudah terbiasa melakukan gerakan yang sama berulang kali dengan presisi tinggi',
    'komputer adalah mesin elektronik serbaguna yang digunakan untuk memproses data dan informasi perangkat keras seperti cpu monitor keyboard dan mouse bekerja sama dengan perangkat lunak seperti sistem operasi dan aplikasi komputer digunakan dalam berbagai bidang kehidupan manusia mulai dari pendidikan kesehatan bisnis hingga hiburan yang sangat menyenangkan bagi siapa saja yang menggunakannya teknologi ini terus mengalami perubahan besar yang membuat hidup kita menjadi lebih praktis dan efisien dalam melakukan komunikasi jarak jauh maupun dalam mengelola dokumen penting yang membutuhkan keamanan tingkat tinggi setiap siswa harus memahami cara kerja perangkat ini agar mampu menguasai dunia digital yang sangat luas dan penuh dengan peluang menarik untuk masa depan karir yang cerah bagi mereka yang tekun belajar',
    'scratch adalah bahasa pemrograman visual yang dirancang khusus untuk anak anak dan pemula dengan menggunakan antarmuka drag and drop pengguna dapat membuat cerita interaktif permainan dan animasi tanpa harus menulis kode yang rumit dan membingungkan bagi orang awam yang baru mengenal dunia logika komputer melalui platform ini kita bisa belajar berpikir secara sistematis dan kreatif dalam memecahkan masalah yang ada di sekitar kita dengan cara yang sangat menyenangkan serta kolaboratif bersama teman teman di seluruh dunia setiap blok kode yang kita susun memiliki fungsi tersendiri yang akan membentuk sebuah program utuh jika dirangkai dengan benar sesuai dengan imajinasi dan logika yang kita miliki sehingga mampu menghasilkan karya digital yang luar biasa bermanfaat bagi orang lain'
  ];
  const TIME_LIMIT = 60;
  const MIN_ACCURACY = 90;

  // ==========================================
  // 2. STATE MANAGEMENT
  // ==========================================
  const [words, setWords] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  // Di dalam daftar state, tambahkan ini:
  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [wordHistory, setWordHistory] = useState([]); // isinya nanti: [true, false, true, ...]
  // State untuk menyimpan leaderboard
  const [leaderboard, setLeaderboard] = useState([]);
  // State untuk menampilkan leaderboard penuh
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);
  const [personalBest, setPersonalBest] = useState(0);

  // Statistik
  const [correctChars, setCorrectChars] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  // Refs untuk DOM manipulation
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const activeWordRef = useRef(null);
  const startTimeRef = useRef(null); // Tambahkan ini untuk mencatat waktu mulai asli

  // ==========================================
  // 3. LOGIKA CORE GAME
  // ==========================================

  const initGame = () => {
    const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setWords(randomText.split(' '));
    setCurrentIndex(0);
    setIsTimerStarted(false); // Timer mati sampai ada ketikan
    setWordHistory([]); // RESET HISTORI DI SINI
    setTimeLeft(TIME_LIMIT);
    setUserInput('');
    setCorrectChars(0);
    setTotalTypedChars(0);
    setWpm(0);
    setAccuracy(100);
    setIsPlaying(true);
    setIsFinished(false);

    // Reset waktu mulai setiap kali game baru
    startTimeRef.current = null;
    // Fokus otomatis ke input
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Tambahkan prop onArchiveAchievement saat memanggil komponen ini
  const handleGameOver = async (finalWpm) => {
    // Logika cek apakah masuk Top 10 (asumsi kamu punya data leaderboard)
    if (isTop10) {
      const message = `Baru saja mencetak rekor baru di Game Ketik Cepat dengan kecepatan ${finalWpm} WPM! 🚀`;

      // Panggil fungsi yang dikirim dari Home.jsx
      if (onArchiveAchievement) {
        onArchiveAchievement(message);
      }
    }
  };

  // ==========================================
  // LOGIKA TIMER (DIPERBAIKI DENGAN TIMESTAMP)
  // ==========================================
  useEffect(() => {
    let timer;
    if (isPlaying && isTimerStarted && timeLeft > 0) {
      // Jika belum ada waktu mulai, set sekarang
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }

      timer = setInterval(() => {
        // Hitung selisih waktu asli antara sekarang dan waktu mulai
        const currentTime = Date.now();
        const elapsedSeconds = Math.floor((currentTime - startTimeRef.current) / 1000);

        // Sisa waktu sebenarnya
        const remaining = Math.max(0, TIME_LIMIT - elapsedSeconds);

        if (remaining <= 0) {
          setTimeLeft(0);
          endGame();
          clearInterval(timer);
        } else {
          // Hanya update state jika nilainya berubah (efisiensi render)
          setTimeLeft(remaining);
        }
      }, 100); // Interval diperkecil ke 100ms agar pengecekan lebih responsif
    }

    return () => clearInterval(timer);
  }, [isPlaying, isTimerStarted, timeLeft]);

  // Auto-scroll logic saat ganti kata/baris
  // ==========================================
  // LOGIKA AUTO-SCROLL (PER BARIS)
  // ==========================================
  useEffect(() => {
    if (activeWordRef.current && scrollRef.current) {
      const parent = scrollRef.current;
      const active = activeWordRef.current;

      const currentOffsetTop = active.offsetTop;

      // Cek apakah ini layar HP (lebar < 768px)
      const isMobile = window.innerWidth < 768;

      // Gunakan buffer yang berbeda: 15px untuk HP, 30px untuk Laptop
      const buffer = isMobile ? 15 : 30;

      parent.scrollTo({
        top: currentOffsetTop - buffer,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);// Berjalan setiap kali kata berpindah

  // ==========================================
  // 8. FUNGSI AMBIL SKOR TERBAIK
  // ==========================================
  useEffect(() => {
    const fetchPB = async () => {
      const savedUser = localStorage.getItem('user_siswa');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        const { data } = await supabase
          .from('game1_scores_typing')
          .select('wpm')
          .eq('user_id', userData.id)
          .eq('status', 'VALID')
          .order('wpm', { ascending: false })
          .limit(1);

        if (data && data.length > 0) setPersonalBest(data[0].wpm);
      }
    };
    fetchPB();
  }, []);

  // ==========================================
  // 9. FUNGSI AMBIL LEADERBOARD
  // ==========================================
  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from('game1_scores_typing')
      // TAMBAHKAN kolom 'class' atau 'kelas' di sini
      .select('full_name, wpm, accuracy, user_id, class')
      .eq('status', 'VALID')
      .order('wpm', { ascending: false });

    if (error) {
      console.error("Error ambil leaderboard:", error.message);
    } else {
      const uniqueData = [];
      const userIds = new Set();

      if (data) {
        for (const entry of data) {
          if (!userIds.has(entry.user_id)) {
            uniqueData.push(entry);
            userIds.add(entry.user_id);
          }
        }
      }
      setLeaderboard(uniqueData.slice(0, 100));
    }
  };

  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  // Fungsi untuk mengambil riwayat skor siswa yang sedang login
  const fetchUserHistory = async () => {
    const savedUser = localStorage.getItem('user_siswa');
    if (!savedUser) return;
    const userData = JSON.parse(savedUser);

    const { data, error } = await supabase
      .from('game1_scores_typing')
      .select('*')
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false });

    if (!error) setHistoryData(data);
    setShowHistory(true); // Buka modal riwayat
  };

  // ==========================================
  // 7. FUNGSI SIMPAN SKOR
  // ==========================================
  const saveScore = async (finalWpm, finalAccuracy) => {
    try {
      // 1. Ambil data siswa dari localStorage
      const savedUser = localStorage.getItem('user_siswa');

      if (!savedUser) {
        console.warn("Skor tidak disimpan karena siswa belum login.");
        return;
      }

      const userData = JSON.parse(savedUser);
      console.log("Mencoba simpan skor untuk:", userData.NAMA);
      // console.log("ISI DATA LOGIN SISWA:", userData);

      // 2. Kirim data ke tabel game1_scores_typing
      const { error } = await supabase
        .from('game1_scores_typing')
        .insert([
          {
            user_id: userData.id,
            full_name: userData.NAMA,
            wpm: finalWpm,
            // --- PERBAIKAN DI SINI ---
            // Mengambil kelas dari data login (mencoba .KELAS atau .class)
            class: userData.Kelas,
            attendance_number: userData["No Absen"],
            accuracy: finalAccuracy,
            status: finalAccuracy >= 90 ? 'VALID' : 'GUGUR'
          }
        ]);

      if (error) throw error;
      // console.log("✅ Skor berhasil masuk database!");

      if (!error) {
        console.log("Skor Berhasil!");

        // --- LOGIKA POSTING OTOMATIS KE BERANDA ---
        const { data: latestRankings } = await supabase
          .from('game1_scores_typing')
          .select('full_name, wpm')
          .eq('status', 'VALID')
          .order('wpm', { ascending: false })
          .limit(3);

        const isTop3 = latestRankings?.some(r => r.full_name === userData.NAMA && r.wpm === finalWpm);

        if (isTop10 && onArchiveAchievement) {
          const achievementMsg = `Wow.. Gak Nyangka! 🔥 Baru saja mencetak skor ${finalWpm} WPM dengan akurasi ${finalAccuracy}% dan berhasil menembus peringkat TOP 3 di Game Ketik Cepat! 🚀🏎️`;
          onArchiveAchievement(achievementMsg);
        }
        // ------------------------------------------

        fetchLeaderboard();
      }

    } catch (error) {
      console.error("❌ Gagal simpan skor:", error.message);
    }
  };

  const endGame = () => {
    setIsPlaying(false);
    setIsFinished(true);
    // Panggil fungsi simpan skor
    // Kita kirimkan nilai WPM dan Akurasi terakhir
    saveScore(wpm, accuracy);
    fetchLeaderboard(); // Panggil fungsi ambil leaderboard
  };

  // ==========================================
  // 4. HANDLER INPUT (DIPERBAIKI)
  // ==========================================
  const handleInput = (e) => {
    const val = e.target.value;

    if (isPlaying && !isTimerStarted && val.length > 0) {
      // Catat waktu mulai tepat saat karakter pertama diketik
      startTimeRef.current = Date.now();
      setIsTimerStarted(true);
    }

    if (val.endsWith(' ')) {
      const typedWord = val.trim();
      const targetWord = words[currentIndex];
      const isCorrect = typedWord === targetWord;

      setWordHistory((prev) => [...prev, isCorrect]);

      let newCorrect = correctChars;
      if (isCorrect) {
        newCorrect += targetWord.length;
        setCorrectChars(newCorrect);
      }

      const newTotal = totalTypedChars + targetWord.length;
      setTotalTypedChars(newTotal);

      // Hitung WPM menggunakan waktu asli (elapsed) agar lebih akurat
      const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
      if (elapsedMinutes > 0) {
        setWpm(Math.round((newCorrect / 5) / elapsedMinutes));
      }

      if (newTotal > 0) setAccuracy(Math.round((newCorrect / newTotal) * 100));

      setCurrentIndex(currentIndex + 1);
      setUserInput('');

      if (currentIndex + 1 >= words.length) endGame();
    } else {
      setUserInput(val);
    }
  };

  // 1. LOGIKA REALTIME & FETCH AWAL
  useEffect(() => {
    fetchLeaderboard();

    // Setup Realtime Subscription
    const channel = supabase
      .channel('realtime_typing_scores')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'game1_scores_typing' },
        () => {
          // console.log("Ada skor baru masuk, memperbarui peringkat...");
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ... (Fungsi handleInput, renderChar, saveScore, dll tetap sama)

  // ==========================================
  // 6. RENDER INTERFACE
  // ==========================================
  return (
    <div className="w-full mx-auto">
      {/* AREA UTAMA: LAYAR START / FINISH / GAMEPLAY */}
      <div className="min-h-[300px]">
        {!isPlaying && !isFinished ? (
          /* --- LAYAR START --- */
          <div className="text-center py-10 animate-in fade-in">
            <div className="bg-blue-600/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Keyboard className="text-blue-500" size={40} />
            </div>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Lomba Ketik Cepat</h2>
            <button onClick={initGame} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/40">
              MULAI SEKARANG
            </button>
          </div>
        ) : isFinished ? (
          /* --- LAYAR FINISH --- */
          <div className="text-center py-6 animate-in zoom-in-95">
            <Trophy className={accuracy >= MIN_ACCURACY ? "mx-auto text-yellow-500 mb-4" : "mx-auto text-slate-500 mb-4"} size={60} />
            <h2 className="text-3xl font-black text-white mb-1">
              {accuracy >= MIN_ACCURACY ? "SKOR VALID!" : "GUGUR!"}
            </h2>

            <div className="grid grid-cols-2 gap-4 my-8">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">WPM</p>
                <p className="text-3xl font-black text-blue-400">{wpm}</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">AKURASI</p>
                <p className={`text-3xl font-black ${accuracy >= 90 ? 'text-green-400' : 'text-red-500'}`}>{accuracy}%</p>
              </div>
            </div>

            <button onClick={initGame} className="flex items-center gap-2 mx-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl transition-all font-bold shadow-lg shadow-blue-900/20">
              <RotateCcw size={18} /> Coba Lagi
            </button>
          </div>
        ) : (
          /* --- LAYAR GAMEPLAY --- */
          <div className="animate-in fade-in duration-500">
            {/* Stats Bar */}
            <div className="flex justify-between gap-4 mb-6">
              <div className="flex-1 bg-slate-900/80 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                <Timer className="text-blue-400" size={20} />
                <p className="text-xl font-black text-white">{timeLeft}s</p>
              </div>
              <div className="flex-1 bg-slate-900/80 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                <Zap className="text-yellow-400" size={20} />
                <p className="text-xl font-black text-white">{wpm}</p>
              </div>
            </div>

            {/* Text Display */}
            <div ref={scrollRef} className="bg-slate-950/80 border border-blue-500/20 rounded-2xl md:rounded-3xl p-4 md:p-8 mb-6 h-[100px] md:h-[150px] overflow-hidden select-none relative shadow-2xl">
              <div className="flex flex-wrap gap-x-3 gap-y-2 md:gap-x-6 md:gap-y-4">
                {words.map((word, wIdx) => (
                  <span key={wIdx} ref={wIdx === currentIndex ? activeWordRef : null}>
                    <WordItem
                      word={word}
                      wordIdx={wIdx}
                      currentIndex={currentIndex}
                      userInput={userInput}
                      wordHistory={wordHistory}
                      renderChar={renderChar}
                    />
                  </span>
                ))}
              </div>
            </div>

            <input ref={inputRef} type="text" value={userInput} onChange={handleInput} className="w-full bg-slate-900 border-2 border-blue-500/30 focus:border-blue-500 rounded-xl md:rounded-2xl p-4 md:p-6 text-xl md:text-3xl text-white text-center outline-none shadow-2xl transition-all" placeholder="Ketik di sini..." spellCheck="false" autoComplete="off" />
          </div>
        )}
      </div>

      {/* --- UI LEADERBOARD (MUNCUL DI START & FINISH) --- */}
      {!isPlaying && (
        <Leaderboard
          data={leaderboard}
          isPlaying={isPlaying}
          showFull={showFullLeaderboard}
          onToggleShow={() => setShowFullLeaderboard(!showFullLeaderboard)}
          onShowHistory={fetchUserHistory}
          scoreLabel="WPM"
          secondaryLabel="ACC"
        />
      )}
      {/* Cukup panggil seperti ini */}
      <ModalRiwayat
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        data={historyData}
      />
    </div>
  );
};

export default GameKetikCepat;

// ==========================================
  // 5. SUB-KOMPONEN: VISUAL HURUF (HIJAU/MERAH)
  // ==========================================
  const renderChar = (word, wordIdx, char, charIdx, userInput, currentIndex, wordHistory) => {
    let colorClass = "text-slate-500";

    if (wordIdx < currentIndex) {
      const isCorrect = wordHistory[wordIdx];
      colorClass = isCorrect ? "text-green-900" : "text-red-900"; // Pakai warna gelap untuk kata yang sudah lewat agar ringan
    }
    else if (wordIdx === currentIndex) {
      if (charIdx < userInput.length) {
        colorClass = char === userInput[charIdx]
          ? "text-green-400"
          : "text-red-500 underline underline-offset-4 decoration-2";
      } else {
        colorClass = "text-white";
      }
    }

    return (
      <span key={charIdx} className={`${colorClass} transition-colors duration-75`}>
        {char}
      </span>
    );
  };

  const WordItem = React.memo(({ word, wordIdx, currentIndex, userInput, wordHistory, renderChar }) => {
    const isActive = wordIdx === currentIndex;

    return (
      <span className={`transition-all duration-200 px-1 md:px-2 py-0.5 rounded-lg text-xl md:text-4xl font-medium leading-none whitespace-nowrap ${isActive ? 'bg-blue-600/30 ring-1 ring-blue-500/50 scale-110' : 'scale-100'}`}>
        {word.split('').map((char, cIdx) =>
          renderChar(word, wordIdx, char, cIdx, userInput, currentIndex, wordHistory)
        )}
      </span>
    );
  }, (prev, next) => {
    // ATURAN EMAS: Jangan gambar ulang jika kata ini bukan kata yang sedang diketik
    // dan bukan kata yang baru saja selesai diketik.
    const isStillInactive = prev.wordIdx !== prev.currentIndex && next.wordIdx !== next.currentIndex;
    return isStillInactive;
  });