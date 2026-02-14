import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Trophy, Zap, Keyboard, Timer, Target } from 'lucide-react';
// Di dalam GameKetikCepat.jsx
import ModalRiwayat from './ModalRiwayat'; // Gunakan './' karena satu folder
import { supabase } from '../../lib/supabaseClient'; // Naik 2 level ke folder src

const GameKetikCepat = () => {
  // ==========================================
  // 1. KONFIGURASI & DATA TEKS
  // ==========================================
  const SAMPLE_TEXTS = [
    'saya berlatih mengetik dengan kecepatan penuh setiap hari untuk mengasah keterampilan jari jemari agar bisa lebih lincah dan akurat dalam menekan setiap tombol pada papan ketik ini adalah tantangan yang saya nikmati karena dapat menguji fokus dan daya tahan mental saya',
    'komputer adalah mesin elektronik serbaguna yang digunakan untuk memproses data dan informasi perangkat keras seperti cpu monitor keyboard dan mouse bekerja sama dengan perangkat lunak seperti sistem operasi dan aplikasi komputer digunakan dalam berbagai bidang',
    'scratch adalah bahasa pemrograman visual yang dirancang khusus untuk anak anak dan pemula dengan menggunakan antarmuka drag and drop pengguna dapat membuat cerita interaktif permainan dan animasi tanpa harus menulis kode yang rumit'
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
    // Fokus otomatis ke input
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // ==========================================
  // LOGIKA TIMER (Hanya jalan jika isTimerStarted = true)
  // ==========================================
  // Timer Effect
  useEffect(() => {
    let timer;
    if (isPlaying && isTimerStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
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
      // 1. Ambil data siswa dari localStorage (Sesuai dengan yang di-set di Navbar)
      const savedUser = localStorage.getItem('user_siswa');

      if (!savedUser) {
        console.warn("Skor tidak disimpan karena siswa belum login.");
        return;
      }

      const userData = JSON.parse(savedUser);
      console.log("Mencoba simpan skor untuk:", userData.NAMA);

      // 2. Kirim data ke tabel game1_scores_typing
      const { error } = await supabase
        .from('game1_scores_typing')
        .insert([
          {
            user_id: userData.id, // ID dari tabel master_siswa
            full_name: userData.NAMA, // Kolom NAMA dari tabel master_siswa
            wpm: finalWpm,
            class: userData.class, // Pastikan ini ikut terkirim
            accuracy: finalAccuracy,
            status: finalAccuracy >= 90 ? 'VALID' : 'GUGUR'
          }
        ]);

      if (error) throw error;
      console.log("✅ Skor berhasil masuk database!");
      if (!error) {
        console.log("Skor Berhasil!");
        fetchLeaderboard(); // Langsung update ranking saat itu juga
        // Jika ada fungsi fetchHistory(), panggil juga di sini
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
  // 4. HANDLER INPUT & PERHITUNGAN
  // ==========================================

  const handleInput = (e) => {
    const val = e.target.value;

    // --- CEK KETIKAN PERTAMA ---
    // Jika game sedang main tapi timer belum nyala, nyalakan sekarang!
    if (isPlaying && !isTimerStarted && val.length > 0) {
      setIsTimerStarted(true);
    }

    // --- LOGIKA SPASI (Pindah Kata) ---
    if (val.endsWith(' ')) {
      const typedWord = val.trim();
      const targetWord = words[currentIndex];
      const isCorrect = typedWord === targetWord; // Cek kebenaran di sini

      // --- SIMPAN KE HISTORI ---
      setWordHistory((prev) => [...prev, isCorrect]);

      let newCorrect = correctChars;
      if (typedWord === targetWord) {
        newCorrect += targetWord.length;
        setCorrectChars(newCorrect);
      }

      const newTotal = totalTypedChars + targetWord.length;
      setTotalTypedChars(newTotal);

      // Update Statistik
      const timeElapsed = (TIME_LIMIT - timeLeft) / 60;
      if (timeElapsed > 0) setWpm(Math.round((newCorrect / 5) / timeElapsed));
      if (newTotal > 0) setAccuracy(Math.round((newCorrect / newTotal) * 100));

      setCurrentIndex(currentIndex + 1);
      setUserInput('');

      if (currentIndex + 1 >= words.length) endGame();
    } else {
      setUserInput(val);
    }
  };

  // ==========================================
  // 5. SUB-KOMPONEN: VISUAL HURUF (HIJAU/MERAH)
  // ==========================================
  const renderChar = (word, wordIdx, char, charIdx) => {
    let colorClass = "text-slate-500"; // Warna default (belum diketik)

    // A. LOGIKA UNTUK KATA YANG SUDAH LEWAT (Sudah Tekan Spasi)
    if (wordIdx < currentIndex) {
      // Ambil status benar/salah dari histori berdasarkan index kata
      const isCorrect = wordHistory[wordIdx];
      colorClass = isCorrect ? "text-green-950" : "text-red-950";
    }

    // B. LOGIKA UNTUK KATA YANG SEDANG AKTIF DIKETIK
    else if (wordIdx === currentIndex) {
      if (charIdx < userInput.length) {
        // Hijau terang jika benar, Merah terang jika salah (sedang fokus)
        colorClass = char === userInput[charIdx]
          ? "text-green-400"
          : "text-red-500 underline underline-offset-4 decoration-2";
      } else {
        colorClass = "text-white"; // Huruf sisa dalam kata aktif
      }
    }

    return (
      <span key={charIdx} className={`${colorClass} transition-colors duration-75`}>
        {char}
      </span>
    );
  };

  // ... (Bagian import dan state tetap sama di atas)

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
          console.log("Ada skor baru masuk, memperbarui peringkat...");
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
                  <span key={wIdx} ref={wIdx === currentIndex ? activeWordRef : null} className={`transition-all duration-200 px-1 md:px-2 py-0.5 rounded-lg text-xl md:text-4xl font-medium leading-none whitespace-nowrap ${wIdx === currentIndex ? 'bg-blue-600/30 ring-1 ring-blue-500/50 scale-110' : 'scale-100'}`}>
                    {word.split('').map((char, cIdx) => renderChar(word, wIdx, char, cIdx))}
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
        <div className="text-left border-t border-white/10 pt-8 mt-12 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span className="text-2xl">🏆</span> Papan Peringkat
              </h3>
              <p className="text-xs text-slate-500">
                Siswa dengan ketikan tercepat (Akurasi &gt; 90%)
              </p>
            </div>

            {/* --- Grouping Tombol di Sebelah Kanan --- */}
            <div className="flex items-center gap-4">
              <button
                onClick={fetchUserHistory}
                className="text-xs text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider transition-all"
              >
                Riwayat Saya
              </button>

              <button
                onClick={() => setShowFullLeaderboard(!showFullLeaderboard)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-white/5 transition-all font-bold"
              >
                {showFullLeaderboard ? "Top 3" : "Top 100"}
              </button>
            </div>
          </div>

          <div className={`space-y-2 transition-all duration-500 ${showFullLeaderboard ? 'max-h-[400px] overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
            {leaderboard.length > 0 ? (
              leaderboard
                .slice(0, showFullLeaderboard ? 100 : 3)
                .map((entry, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${index === 0 ? 'bg-gradient-to-r from-yellow-500/20 to-transparent border-yellow-500/30' : index === 1 ? 'bg-gradient-to-r from-slate-300/10 to-transparent border-slate-300/30' : index === 2 ? 'bg-gradient-to-r from-orange-500/10 to-transparent border-orange-500/30' : 'bg-slate-900/40 border-white/5'}`}>
                    <div className="flex items-center gap-4">
                      {/* Lingkaran Nomor Urut */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-slate-300 text-black' :
                            index === 2 ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-500'
                        }`}>
                        {index + 1}
                      </div>

                      {/* Info Siswa: Nama di atas, Badge di bawah */}
                      <div className="flex flex-col min-w-0">
                        <span className="text-white font-bold capitalize truncate">
                          {entry.full_name?.toLowerCase() || 'siswa spenda'}
                        </span>

                        <div className="flex items-center gap-2 mt-0.5">
                          {entry.class && (
                            <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 font-bold uppercase">
                              {entry.class}
                            </span>
                          )}
                          {entry.attendance_number && (
                            <span className="text-[9px] bg-slate-800/80 text-slate-400 px-1.5 py-0.5 rounded border border-white/5 font-medium">
                              Absen {entry.attendance_number}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="block text-[9px] text-slate-500 uppercase font-bold">WPM</span>
                        <span className="text-blue-400 font-black text-lg">{entry.wpm}</span>
                      </div>
                      <div className="text-right w-12 border-l border-white/5 pl-4">
                        <span className="block text-[9px] text-slate-500 uppercase font-bold">ACC</span>
                        <span className="text-emerald-400 font-bold">{entry.accuracy}%</span>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center text-slate-600 py-4 italic text-sm">Belum ada skor hari ini...</p>
            )}
          </div>
        </div>
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