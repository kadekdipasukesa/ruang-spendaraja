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
    const scrollRef = useRef(null);
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

    // Tambahkan fungsi ini di dalam TypingGame.jsx
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
            setShowHistory(true); // Membuka modal
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            {!isPlaying && !isFinished ? (
                <div className="text-center py-20">
                    <div className="bg-blue-600/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <Keyboard className="text-blue-500" size={40} />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Typing Challenge</h1>
                    <button onClick={initGame} className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-4 rounded-2xl font-bold text-xl transition-all shadow-xl shadow-blue-900/40">
                        MULAI SEKARANG
                    </button>
                </div>
            ) : isFinished ? (
                <TypingResult wpm={wpm} accuracy={accuracy} onRetry={initGame} />
            ) : (
                <div className="animate-in fade-in">
                    <StatsBar timeLeft={timeLeft} wpm={wpm} />
                    <div ref={scrollRef} className="bg-slate-950/80 border border-blue-500/20 rounded-3xl p-8 mb-6 h-[160px] overflow-hidden relative shadow-2xl">
                        <div className="flex flex-wrap gap-x-6 gap-y-4">
                            {words.map((word, idx) => (
                                <WordItem
                                    key={idx}
                                    word={word}
                                    wordIdx={idx}
                                    currentIndex={currentIndex}
                                    userInput={userInput}
                                    wordHistory={wordHistory}
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
                    />
                </div>
            )}

            {!isPlaying && (
                <div className="mt-12">
                    <Leaderboard
                        data={leaderboard}
                        scoreLabel="WPM"
                        secondaryLabel="ACC"
                        onShowHistory={fetchUserHistory} // KIRIM PROPS INI
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