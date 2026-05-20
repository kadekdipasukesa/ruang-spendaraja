// src/components/Games1Typing/TypingGame.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Keyboard } from 'lucide-react';
import { useTypingGame } from '../../hooks/Game1Typing/useTypingGame';
import { supabase } from '../../lib/supabaseClient';
import StatsBar from './StatsBar';
import WordItem from './WordItem';
import TypingResult from './TypingResult';
import Leaderboard from '../Leaderboard';
import ModalRiwayat from './ModalRiwayat';

const TypingGame = () => {
    const [personalBest, setPersonalBest] = useState(0);
    const [leaderboard, setLeaderboard] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);

    // PEMANDU SCROLL UTAMA
    const scrollRef = useRef(null);
    const activeWordRef = useRef(null); // Tambahkan ini untuk melacak kata aktif
    const inputRef = useRef(null);

    const saveScore = async (wpm, accuracy) => {
        const savedUser = localStorage.getItem('user_siswa');
        if (!savedUser) return;
        const userData = JSON.parse(savedUser);

        const { error } = await supabase.from('game1_scores_typing').insert([{
            user_id: userData.id,
            full_name: userData.NAMA,
            wpm,
            class: userData.Kelas,
            attendance_number: userData["No Absen"],
            accuracy,
            status: accuracy >= 90 ? 'VALID' : 'GUGUR'
        }]);

        if (!error) fetchLeaderboard();
    };

    const {
        words, userInput, currentIndex, timeLeft, isPlaying, isFinished,
        wordHistory, wpm, accuracy, initGame, handleInput
    } = useTypingGame(saveScore);

    // ==========================================
    // LOGIKA AUTO-SCROLL SEBANYAK 2 BARIS (SMOOTH)
    // ==========================================
    useEffect(() => {
        if (activeWordRef.current && scrollRef.current) {
            const parent = scrollRef.current;
            const active = activeWordRef.current;

            const currentOffsetTop = active.offsetTop;
            const parentHeight = parent.clientHeight;
            const parentScrollTop = parent.scrollTop;

            // Jika kata aktif sudah turun melewati setengah tinggi box container, scroll diturunkan
            if (currentOffsetTop - parentScrollTop > parentHeight / 2) {
                const isMobile = window.innerWidth < 768;
                // Loncat setinggi 2 baris teks (Kompensasi tinggi baris padding)
                const lineJump = isMobile ? 35 : 48;

                parent.scrollTo({
                    top: currentOffsetTop - lineJump,
                    behavior: 'smooth'
                });
            } else if (currentIndex === 0) {
                // Balikkan scroll ke atas jika game di-restart kembali
                parent.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }
    }, [currentIndex]); // Berjalan otomatis setiap kali kata berganti indeks

    const fetchLeaderboard = async () => {
        const { data } = await supabase
            .from('game1_scores_typing')
            .select('full_name, wpm, accuracy, user_id, class')
            .eq('status', 'VALID')
            .order('wpm', { ascending: false });

        if (data) {
            const unique = [];
            const seen = new Set();
            for (const entry of data) {
                if (!seen.has(entry.user_id)) {
                    unique.push(entry);
                    seen.add(entry.user_id);
                }
            }
            setLeaderboard(unique.slice(0, 100));
        }
    };

    useEffect(() => {
        fetchLeaderboard();
        if (isPlaying) inputRef.current?.focus();
    }, [isPlaying]);

    const fetchUserHistory = async () => {
        const savedUser = localStorage.getItem('user_siswa');
        if (!savedUser) return;
        const userData = JSON.parse(savedUser);

        const { data, error } = await supabase
            .from('game1_scores_typing')
            .select('*')
            .eq('user_id', userData.id)
            .order('created_at', { ascending: false });

        if (!error) {
            setHistoryData(data);
            setShowHistory(true);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 pt-24 md:pt-28">
            {!isPlaying && !isFinished ? (
                <div className="text-center py-20">
                    <div className="bg-blue-600/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <Keyboard className="text-blue-500" size={40} />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">
                        Typing Challenge
                    </h1>
                    <button
                        onClick={initGame}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-4 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-blue-900/40"
                    >
                        MULAI SEKARANG
                    </button>
                </div>
            ) : isFinished ? (
                <TypingResult wpm={wpm} accuracy={accuracy} onRetry={initGame} />
            ) : (
                <div className="animate-in fade-in">
                    <StatsBar timeLeft={timeLeft} wpm={wpm} />
                    <div
                        ref={scrollRef}
                        className="bg-slate-950/80 border border-blue-500/20 rounded-3xl p-8 mb-6 h-[160px] overflow-hidden relative shadow-2xl"
                    >
                        {/* KODE REKOMENDASI (Gunakan leading-loose agar jarak baris konstan saat scroll) */}
                        <div className="flex flex-wrap gap-x-4 gap-y-6 leading-loose pt-2">
                            {words.map((word, idx) => (
                                <WordItem
                                    key={idx}
                                    word={word}
                                    wordIdx={idx}
                                    currentIndex={currentIndex}
                                    userInput={userInput}
                                    wordHistory={wordHistory}
                                    // SUNTIKKAN REF KE KATA YANG SEDANG DIKETIK
                                    ref={idx === currentIndex ? activeWordRef : null}
                                />
                            ))}
                        </div>
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={userInput}
                        onChange={handleInput}
                        className="w-full bg-slate-900 border-2 border-blue-500/30 focus:border-blue-500 rounded-2xl p-6 text-3xl text-white text-center outline-none shadow-2xl transition-all"
                        placeholder="Ketik di sini..."
                        autoComplete="off"
                        autoFocus
                    />
                </div>
            )}

            {!isPlaying && (
                <div className="mt-12">
                    <Leaderboard
                        data={leaderboard}
                        scoreLabel="WPM"
                        secondaryLabel="ACC"
                        onShowHistory={fetchUserHistory}
                    />
                </div>
            )}

            <ModalRiwayat
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                data={historyData}
            />
        </div>
    );
};

export default TypingGame;