import WordItem from './WordItem';
import StatsBar from './StatsBar';

export default function TypingPlay({ game }) {
  return (
    <div>
      <StatsBar time={game.timeLeft} wpm={game.wpm} />

      <div className="bg-slate-900 p-4 rounded-xl mb-4 flex flex-wrap gap-2">
        {game.words.map((w, i) => (
          <WordItem
            key={i}
            word={w}
            active={i === game.currentIndex}
          />
        ))}
      </div>

      <input
        value={game.userInput}
        onChange={game.handleInput}
        className="w-full p-4 text-center rounded-xl"
        placeholder="Ketik di sini..."
      />
    </div>
  );
}