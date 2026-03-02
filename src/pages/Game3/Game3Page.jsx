import React, { useState, useEffect } from 'react';
import ArenaMejaBundar from './ArenaMejaBundar';
import { SOAL_POOL } from './SoalData';
import { supabase } from '../../lib/supabaseClient';

const Game3Page = ({ userSiswa, onBack }) => {
  const [gameState, setGameState] = useState('LOBBY'); // LOBBY atau PLAYING
  const [players, setPlayers] = useState([]);
  const [isRM, setIsRM] = useState(false);

  // Fungsi untuk mulai game (Hanya RM yang bisa trigger)
  const handleStartGame = () => {
    setGameState('PLAYING');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      {/* Tombol Back */}
      <button onClick={onBack} className="absolute top-4 left-4 text-slate-400 hover:text-white transition-colors">
        ← Keluar
      </button>

      <div className="max-w-4xl mx-auto pt-10">
        <ArenaMejaBundar 
          // UBAH INI: sesuaikan dengan nama yang diminta Arena (student)
          student={userSiswa} 
          gameState={gameState} 
          setGameState={setGameState}
          soalPool={SOAL_POOL}
        />
      </div>
    </div>
  );
};

export default Game3Page;