import { Keyboard, Trophy, RotateCcw } from 'lucide-react';
import WordItem from './WordItem';
import LeaderboardWrapper from './LeaderboardWrapper';

const TypingUI = ({ game }) => {
    const {
        words,
        userInput,
        currentIndex,
        timeLeft,
        isPlaying,
        isFinished,
        wpm,
        accuracy,
        leaderboard,
        initGame,
        handleInput,
        wordHistory // ✅ TAMBAHKAN INI
    } = game;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-slate-900/70 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]">

                {!isPlaying && !isFinished && (
                    <div className="text-center py-10">
                        <Keyboard size={40} className="mx-auto text-blue-400 mb-4" />
                        <h2 className="text-2xl text-white mb-4">Lomba Ketik Cepat</h2>
                        <button onClick={initGame} className="bg-blue-600 px-6 py-3 rounded-xl text-white">
                            Mulai
                        </button>
                    </div>
                )}

                {isFinished && (
                    <div className="text-center">
                        <Trophy size={50} className="mx-auto mb-4" />
                        <p className="text-2xl text-white">{wpm} WPM</p>
                        <p className="text-lg">{accuracy}%</p>

                        <button onClick={initGame} className="mt-4 bg-blue-600 px-6 py-3 rounded-xl text-white">
                            <RotateCcw size={16} className="inline mr-2" />
                            Ulangi
                        </button>
                    </div>
                )}

                {isPlaying && (
                    <>
                        <div className="flex justify-between mb-4">
                            <span>{timeLeft}s</span>
                            <span>{wpm} WPM</span>
                        </div>

                        <div className="bg-slate-900 p-4 rounded-xl mb-4 flex flex-wrap gap-2">
                            {words.map((word, i) => (
                                <WordItem
                                    key={i}
                                    word={word}
                                    wordIdx={i}
                                    currentIndex={currentIndex}
                                    userInput={userInput}
                                    wordHistory={wordHistory}
                                />
                            ))}
                        </div>

                        <input
                            value={userInput}
                            onChange={handleInput}
                            className="w-full p-4 text-center rounded-xl"
                        />
                    </>
                )}

                {!isPlaying && (
                    <LeaderboardWrapper data={leaderboard} />
                )}
            </div>
        </div>
    );
};

export default TypingUI;