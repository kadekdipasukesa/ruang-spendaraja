import { Keyboard, Bird, Zap } from 'lucide-react';
// src/components/tabs/PlaygroundTab.jsx

import GameCard from "./GameCard"; // Tambahkan '/' setelah '..'

export default function PlaygroundTab({ 
  student, 
  allLockStatuses, 
  gameStates, // Kita bungkus state isLocked ke object agar rapi
  handlers // Kita bungkus fungsi ke object
}) {
  const { isGame1Locked, isGame2Locked, isGame3Locked } = gameStates;
  const { setIsGame1Locked, setIsGame2Locked, setIsGame3Locked, toggleLockGame, getOptionLabel, setShowGameKetik, setShowGameLCC } = handlers;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
      <GameCard
        title="Ketik Cepat"
        gameId="game1"
        description="Ketiklah dengan tepat dan cepat!"
        icon={Keyboard}
        color="blue"
        student={student}
        allLockStatuses={allLockStatuses}
        isGameLocked={isGame1Locked}
        getOptionLabel={(cls, label) => getOptionLabel('game1', cls, label)}
        onPlay={() => setShowGameKetik(true)}
        onToggleLock={(selectedClass, mode) => {
          if (mode === 'check') setIsGame1Locked(allLockStatuses.game1?.[selectedClass] || false);
          else toggleLockGame('game1', isGame1Locked, selectedClass);
        }}
      />

      <GameCard
        title="Flappy Bird"
        gameId="game2"
        description="Terbangkan burung melewati pipa!"
        icon={Bird}
        color="green"
        student={student}
        allLockStatuses={allLockStatuses}
        isGameLocked={isGame2Locked}
        getOptionLabel={(cls, label) => getOptionLabel('game2', cls, label)}
        onPlay={() => window.open('/flappy.html', '_blank')}
        onToggleLock={(selectedClass, mode) => {
          if (mode === 'check') setIsGame2Locked(allLockStatuses.game2?.[selectedClass] || false);
          else toggleLockGame('game2', isGame2Locked, selectedClass);
        }}
      />

      <GameCard
        title="Cerdas Cermat"
        gameId="game3"
        description="Adu cepat pencet bel dan jawab soal!"
        icon={Zap}
        color="purple"
        student={student}
        allLockStatuses={allLockStatuses}
        isGameLocked={isGame3Locked}
        getOptionLabel={(cls, label) => getOptionLabel('game3', cls, label)}
        onPlay={() => setShowGameLCC(true)}
        onToggleLock={(selectedClass, mode) => {
          if (mode === 'check') setIsGame3Locked(allLockStatuses.game3?.[selectedClass] || false);
          else toggleLockGame('game3', isGame3Locked, selectedClass);
        }}
      />
    </div>
  );
}