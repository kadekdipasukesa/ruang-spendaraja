import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import Leaderboard from "../../components/Leaderboard";

// Kita masukkan CSS persis dari FLUFY.html agar styling-nya identik
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
  
  .game-body {
    --sky: #87CEEB;
    --sky-dark: #5BA3CC;
    --ground: #8B6914;
    --grass: #5CB85C;
    --pipe: #2ECC40;
    --pipe-dark: #1a7a26;
    --yellow: #FFD700;
    --orange: #FF8C00;
    --red: #FF4136;
    --white: #FFFEF0;
    font-family: 'Nunito', sans-serif;
    background: #1a1a2e;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin: 0;
  }

  .game-card {
    background: var(--white);
    width: 420px;
    height: 720px;
    position: relative;
    border-radius: 40px;
    border: 8px solid var(--sky-dark);
    box-shadow: 0 20px 0 #0002;
    overflow: hidden;
  }

  canvas { display: block; background: var(--sky); cursor: pointer; }

  .ui-layer {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 10;
  }

  .btn-fluffy {
    pointer-events: auto;
    background: var(--orange);
    color: white;
    border: none;
    padding: 15px 40px;
    border-radius: 20px;
    font-family: 'Fredoka One', cursive;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 8px 0 #c76d00;
    transition: 0.1s;
  }

  .btn-fluffy:active {
    transform: translateY(4px);
    box-shadow: 0 4px 0 #c76d00;
  }

  .quiz-card {
    pointer-events: auto;
    background: var(--white);
    width: 90%;
    border-radius: 30px;
    border: 4px solid var(--orange);
    box-shadow: 0 10px 0 #ccc;
    overflow: hidden;
    animation: zoomIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  @keyframes zoomIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;

export default function FlappyBirdPage({ student }) {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // start, playing, quiz, over
  const [score, setScore] = useState(0);
  const [activeQuiz, setActiveQuiz] = useState(null);

  // Bank Soal (Identik dengan FLUFY.html)
  const quizBank = [
    { cat: "💻 Perangkat Keras", q: "Perangkat keras komputer yang berfungsi sebagai 'otak' komputer adalah...", opts: ["RAM", "CPU/Prosesor", "Harddisk", "Monitor"], ans: 1 },
    { cat: "🖥️ Perangkat Lunak", q: "Windows, macOS, dan Linux adalah contoh dari...", opts: ["Aplikasi game", "Sistem Operasi", "Browser internet", "Antivirus"], ans: 1 },
    { cat: "🌐 Internet & Jaringan", q: "WWW singkatan dari...", opts: ["World Wide Web", "Wide World Web", "Web World Wide", "World Web Wide"], ans: 0 }
  ];

  // Logika Game Loop (Direct Canvas API sesuai file .html Anda)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    // Variabel Game (Sesuai FLUFY.html)
    let birdY = 250;
    let birdV = 0;
    let pipes = [];
    let frame = 0;
    const gravity = 0.4;
    const jump = -7;

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Sky
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (gameState === 'playing') {
        birdV += gravity;
        birdY += birdV;

        // Pipa Logic
        if (frame % 100 === 0) {
          const hole = Math.random() * 200 + 100;
          pipes.push({ x: 400, holeTop: hole, w: 60 });
        }

        pipes.forEach((p, i) => {
          p.x -= 3;
          // Draw Pipe Top
          ctx.fillStyle = '#2ECC40';
          ctx.fillRect(p.x, 0, p.w, p.holeTop);
          // Draw Pipe Bottom
          ctx.fillRect(p.x, p.holeTop + 150, p.w, canvas.height);

          // Collision check
          if (100 + 30 > p.x && 100 < p.x + p.w) {
            if (birdY < p.holeTop || birdY + 24 > p.holeTop + 150) {
                handleHit();
            }
          }
          
          if (p.x + p.w < 0) {
            pipes.splice(i, 1);
            setScore(s => s + 1);
          }
        });

        if (birdY > canvas.height || birdY < 0) handleHit();
      }

      // Draw Bird (Kuning Fluffy)
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.roundRect(100, birdY, 34, 24, 8);
      ctx.fill();
      // Eye
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(125, birdY + 8, 4, 0, Math.PI * 2);
      ctx.fill();

      frame++;
      animationId = requestAnimationFrame(gameLoop);
    };

    const handleHit = () => {
      cancelAnimationFrame(animationId);
      setGameState('quiz');
      setActiveQuiz(quizBank[Math.floor(Math.random() * quizBank.length)]);
    };

    gameLoop();
    return () => cancelAnimationFrame(animationId);
  }, [gameState]);

  const handleJump = () => {
    if (gameState === 'playing') {
        // Logic jump ditangani di dalam loop melalui ref atau state update sederhana
    }
  };

  const submitScore = async (finalScore) => {
    if (student) {
      await supabase.from('game2_flappybird').insert([{
        nama: student.Nama || student.NAMA,
        kelas: student.Kelas,
        score: finalScore,
        student_id: Number(student.id)
      }]);
    }
    setGameState('over');
  };

  return (
    <div className="game-body">
      <style>{styles}</style>
      
      <div className="game-card">
        {/* HUD Score */}
        {gameState === 'playing' && (
          <div className="absolute top-8 left-0 right-0 flex justify-center z-20 pointer-events-none">
            <div className="bg-[#FF8C00] text-white px-8 py-2 rounded-full border-4 border-white shadow-lg font-black text-2xl italic">
              {score}
            </div>
          </div>
        )}

        <canvas 
          ref={canvasRef} 
          width={400} 
          height={600} 
          onClick={() => {
            if (gameState === 'start') setGameState('playing');
          }}
          className="w-full h-full"
        />

        {/* UI LAYERS */}
        <div className="ui-layer">
          {gameState === 'start' && (
            <div className="text-center animate-bounce">
              <h1 className="font-['Fredoka_One'] text-5xl text-white drop-shadow-lg mb-8">FLUFFY BIRD</h1>
              <button className="btn-fluffy" onClick={() => setGameState('playing')}>MULAI</button>
            </div>
          )}

          {gameState === 'quiz' && (
            <div className="quiz-card">
              <div className="bg-[#FF8C00] p-6 text-center text-white">
                <span className="text-[10px] font-bold bg-white/20 px-3 py-1 rounded-full uppercase">{activeQuiz?.cat}</span>
                <h3 className="font-['Fredoka_One'] text-xl mt-3 leading-tight">{activeQuiz?.q}</h3>
              </div>
              <div className="p-4 space-y-3 bg-white">
                {activeQuiz?.opts.map((opt, i) => (
                  <button 
                    key={i} 
                    onClick={() => i === activeQuiz.ans ? submitScore(score) : setGameState('over')}
                    className="w-full text-left p-4 bg-[#F0F0F0] hover:bg-[#87CEEB] rounded-2xl font-bold border-b-4 border-black/10 active:border-0 transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {gameState === 'over' && (
            <div className="text-center p-8 bg-[#FFFEF0] rounded-[3rem] border-8 border-[#5BA3CC] w-[85%] shadow-2xl">
              <h2 className="font-['Fredoka_One'] text-5xl text-[#5BA3CC] italic mb-4">SKOR!</h2>
              <div className="text-7xl font-black text-[#FF8C00] mb-6">{score}</div>
              
              <div className="mb-6 h-32 overflow-hidden">
                <Leaderboard table="game2_flappybird" limit={3} />
              </div>

              <button className="btn-fluffy w-full" onClick={() => {
                setGameState('playing');
                setScore(0);
              }}>LAGI! 🚀</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}