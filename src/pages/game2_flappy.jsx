import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function FlappyBirdPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start'); 
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [activeQuiz, setActiveQuiz] = useState(null);

  // Ref untuk audio agar tidak re-render
  const audioJump = useRef(new Audio('/sounds/jump.mp3'));
  const audioCorrect = useRef(new Audio('/sounds/correct.mp3'));
  const audioCrash = useRef(new Audio('/sounds/crash.mp3'));

  const quizBank = [
    { cat: "💻 Perangkat Keras", q: "Otak komputer adalah...", opts: ["RAM", "CPU", "Harddisk", "Monitor"], ans: 1 },
    { cat: "🖥️ Perangkat Lunak", q: "Windows adalah contoh dari...", opts: ["Game", "OS", "Browser", "Virus"], ans: 1 },
    { cat: "🌐 Internet", q: "WWW singkatan dari...", opts: ["World Wide Web", "Wide World Web", "Web World Wide", "World Web Wide"], ans: 0 }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    let bird = { x: 80, y: 250, w: 34, h: 24, v: 0, gravity: 0.25, jump: -5.5, rotation: 0 };
    let pipes = [];
    let stars = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.2
    }));
    let frame = 0;
    let localScore = score; // Gunakan localScore agar tidak reset saat re-render

    const drawStars = () => {
      ctx.fillStyle = "white";
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        s.x -= s.speed;
        if (s.x < 0) s.x = canvas.width;
      });
    };

    const drawBird = () => {
      ctx.save();
      ctx.translate(bird.x + bird.w / 2, bird.y + bird.h / 2);
      ctx.rotate((bird.rotation * Math.PI) / 180);
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.roundRect(-bird.w/2, -bird.h/2, bird.w, bird.h, 8);
      ctx.fill();
      ctx.strokeStyle = '#603813';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      drawStars();

      if (gameState === 'playing') {
        bird.v += bird.gravity;
        bird.y += bird.v;
        bird.rotation = Math.min(Math.max(bird.v * 4, -20), 90);

        if (frame % 100 === 0) {
          const gap = 150;
          const topH = Math.random() * (canvas.height - 350) + 50;
          pipes.push({ x: canvas.width, topH, botY: topH + gap, passed: false });
        }

        pipes.forEach((p, i) => {
          p.x -= 2.5;
          ctx.fillStyle = '#2ECC40';
          ctx.fillRect(p.x, 0, 52, p.topH);
          ctx.fillRect(p.x, p.botY, 52, canvas.height - p.botY);

          if (bird.x + bird.w - 5 > p.x && bird.x + 5 < p.x + 52) {
            if (bird.y + 5 < p.topH || bird.y + bird.h - 5 > p.botY) {
                audioCrash.current.play();
                setGameState('quiz');
                setActiveQuiz(quizBank[Math.floor(Math.random() * quizBank.length)]);
            }
          }

          if (!p.passed && p.x + 52 < bird.x) {
            p.passed = true;
            localScore++;
            setScore(localScore);
          }
        });

        if (bird.y + bird.h > canvas.height - 100 || bird.y < 0) {
            audioCrash.current.play();
            setGameState('quiz');
            setActiveQuiz(quizBank[Math.floor(Math.random() * quizBank.length)]);
        }
      }

      // Ground
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
      
      drawBird();
      frame++;
      animationId = requestAnimationFrame(update);
    };

    update();
    
    const handleInput = () => {
        if (gameState === 'playing') {
            bird.v = bird.jump;
            audioJump.current.currentTime = 0;
            audioJump.current.play();
        }
    };

    window.addEventListener('mousedown', handleInput);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousedown', handleInput);
    };
  }, [gameState]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      audioCorrect.current.play();
      if (score > bestScore) setBestScore(score);
      setGameState('over'); 
      // Skor tidak di-reset di sini agar tetap tampil skor terakhirnya
    } else {
      setScore(0);
      setGameState('over');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap');
        .fredoka { font-family: 'Fredoka One', cursive; }
      `}</style>

      {/* Tombol Back to Home */}
      <button 
        onClick={() => navigate('/')}
        className="mb-4 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2"
      >
        ⬅ Kembali ke Home
      </button>

      <div className="relative w-[400px] h-[600px] bg-[#FFFEF0] rounded-[3rem] border-8 border-[#5BA3CC] shadow-2xl overflow-hidden">
        
        {gameState === 'playing' && (
          <div className="absolute top-6 left-0 right-0 flex justify-center z-10">
            <div className="bg-[#FF8C00] text-white px-6 py-1 rounded-full border-4 border-white fredoka text-2xl italic shadow-lg">
              {score}
            </div>
          </div>
        )}

        <canvas ref={canvasRef} width={400} height={600} className="w-full h-full" />

        {/* Start Screen */}
        {gameState === 'start' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
            <h1 className="fredoka text-5xl text-white drop-shadow-lg mb-8 text-center">FLUFFY BIRD</h1>
            <button 
                onClick={() => setGameState('playing')}
                className="bg-[#FF8C00] text-white fredoka text-2xl px-12 py-4 rounded-2xl shadow-[0_8px_0_#c76d00] active:translate-y-1 active:shadow-none"
            >
              MULAI
            </button>
          </div>
        )}

        {/* Quiz Screen */}
        {gameState === 'quiz' && (
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/60 z-50">
            <div className="bg-[#FFFEF0] w-full rounded-[2rem] border-4 border-[#FF8C00] overflow-hidden shadow-2xl animate-in zoom-in">
              <div className="bg-[#FF8C00] p-6 text-center text-white">
                <h3 className="fredoka text-xl leading-tight">{activeQuiz?.q}</h3>
              </div>
              <div className="p-4 space-y-3">
                {activeQuiz?.opts.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i === activeQuiz.ans)}
                    className="w-full text-left p-4 bg-slate-100 hover:bg-sky-400 hover:text-white rounded-xl font-bold transition-all border-b-4 border-slate-300"
                  >
                    {String.fromCharCode(65 + i)}. {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'over' && (
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-[#87CEEB] z-40 text-center">
            <div className="bg-[#FFFEF0] w-full p-8 rounded-[3rem] border-6 border-[#FF8C00]">
              <h2 className="fredoka text-5xl text-[#5BA3CC] mb-2">SKOR!</h2>
              <div className="text-8xl font-black text-[#FF8C00] my-4">{score}</div>
              <p className="text-slate-400 font-bold mb-6">BEST: {bestScore}</p>
              <button 
                onClick={() => { setGameState('playing'); setScore(0); }}
                className="w-full bg-[#FF8C00] text-white fredoka text-xl py-4 rounded-2xl shadow-[0_8px_0_#c76d00] active:translate-y-1 active:shadow-none"
              >
                LAGI! 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}