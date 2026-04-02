import React, { useEffect, useState } from "react";
import Phaser from "phaser";
import { supabase } from "../../lib/supabaseClient";
import Leaderboard from "../../components/Leaderboard";

export default function FlappyBird({ student }) {
    const [gameState, setGameState] = useState('playing'); 
    const [currentScore, setCurrentScore] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState(null);

    // Data Soal Persis dari FLUFY.txt
    const quizData = [
        { cat: "💻 Perangkat Keras", q: "Perangkat keras komputer yang berfungsi sebagai 'otak' komputer adalah...", opts: ["RAM", "CPU/Prosesor", "Harddisk", "Monitor"], ans: 1 },
        { cat: "🖥️ Perangkat Lunak", q: "Windows, macOS, dan Linux adalah contoh dari...", opts: ["Aplikasi game", "Sistem Operasi", "Browser internet", "Antivirus"], ans: 1 },
        { cat: "🌐 Internet & Jaringan", q: "WWW singkatan dari...", opts: ["World Wide Web", "Wide World Web", "Web World Wide", "World Web Wide"], ans: 0 },
        { cat: "📱 Teknologi Dasar", q: "Satuan terkecil dari data digital adalah...", opts: ["Byte", "Bit", "Kilobyte", "Pixel"], ans: 1 },
        { cat: "💾 Memori", q: "Singkatan dari RAM adalah...", opts: ["Read Access Memory", "Random Anti Memory", "Random Access Memory", "Ready Access Memory"], ans: 2 }
    ];

    useEffect(() => {
        if (gameState !== 'playing' || showQuiz) return;
    
        const config = {
            type: Phaser.AUTO,
            parent: 'game-container',
            width: 400,
            height: 500,
            backgroundColor: '#87CEEB', // --sky dari FLUFY.txt
            physics: { 
                default: 'arcade', 
                arcade: { gravity: { y: 1100 }, debug: false } 
            },
            scene: {
                preload: function() {
                    let graphics = this.make.graphics({ x: 0, y: 0, add: false });
                    
                    // Bird Kuning (Sesuai gaya Fluffy)
                    graphics.fillStyle(0xFFD700, 1);
                    graphics.fillRoundedRect(0, 0, 34, 24, 8);
                    graphics.fillStyle(0xffffff, 1);
                    graphics.fillCircle(25, 8, 4);
                    graphics.fillStyle(0x000000, 1);
                    graphics.fillCircle(26, 8, 2);
                    graphics.generateTexture('bird', 34, 24);
                    
                    // Pipe Hijau dengan border (Sesuai gaya Fluffy)
                    graphics.clear();
                    graphics.fillStyle(0x2ECC40, 1);
                    graphics.fillRect(0, 0, 50, 50);
                    graphics.lineStyle(4, 0x1a7a26, 1);
                    graphics.strokeRect(0, 0, 50, 50);
                    graphics.generateTexture('pipe', 50, 50);
                },
                create: function() {
                    this.bird = this.physics.add.sprite(100, 245, 'bird');
                    this.bird.setCollideWorldBounds(true);
                    this.pipes = this.physics.add.group();
                    this.gameActive = true;
                    this.score = 0;

                    this.input.on('pointerdown', () => { 
                        if (this.gameActive) this.bird.setVelocityY(-350); 
                    });

                    this.time.addEvent({ 
                        delay: 1500, 
                        callback: () => {
                            if (!this.gameActive) return;
                            const hole = Math.floor(Math.random() * 5) + 1;
                            for (let i = 0; i < 10; i++) {
                                if (i !== hole && i !== hole + 1) {
                                    const pipe = this.pipes.create(400, i * 50 + 25, 'pipe');
                                    pipe.body.allowGravity = false;
                                    pipe.setVelocityX(-200);
                                    pipe.setImmovable(true);
                                }
                            }
                            this.score += 1;
                            setCurrentScore(this.score);
                        }, 
                        callbackScope: this, 
                        loop: true 
                    });

                    this.physics.add.collider(this.bird, this.pipes, () => {
                        if (this.gameActive) {
                            this.gameActive = false;
                            this.physics.pause();
                            this.bird.setTint(0xff4136);
                            setActiveQuestion(quizData[Math.floor(Math.random() * quizData.length)]);
                            setTimeout(() => { setShowQuiz(true); }, 500);
                        }
                    }, null, this);
                },
                update: function() {
                    if (this.gameActive && (this.bird.y > 500 || this.bird.y < 0)) {
                        this.gameActive = false;
                        setActiveQuestion(quizData[Math.floor(Math.random() * quizData.length)]);
                        setShowQuiz(true);
                    }
                }
            }
        };

        const game = new Phaser.Game(config);
        return () => game.destroy(true);
    }, [gameState, showQuiz]);

    const handleAnswer = async (index) => {
        if (index === activeQuestion.ans) {
            if (student) {
                await supabase.from('game2_flappybird').insert([{
                    nama: student.Nama || student.NAMA,
                    kelas: student.Kelas,
                    score: currentScore,
                    student_id: Number(student.id)
                }]);
            }
            setShowQuiz(false);
            setGameState('gameOver');
        } else {
            alert("SALAHA! Kamu harus jawab benar untuk simpan skor.");
            setShowQuiz(false);
            setGameState('gameOver');
            setCurrentScore(0);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a2e] font-['Nunito']">
            
            {/* KONTINER UTAMA (Gaya Kartu Fluffy) */}
            <div className="relative p-4 bg-[#FFFEF0] rounded-[3rem] border-8 border-[#5BA3CC] shadow-[0_20px_0_#ccc]">
                
                {/* HUD SKOR (Persis FLUFY.txt) */}
                <div className="absolute -top-10 left-0 right-0 flex justify-center gap-4 px-4">
                    <div className="bg-[#FF8C00] text-white px-6 py-2 rounded-full border-4 border-white shadow-lg font-black italic">
                        SCORE: {currentScore}
                    </div>
                </div>

                {gameState === 'playing' ? (
                    <div className="flex flex-col items-center">
                        <div 
                            id="game-container" 
                            className="rounded-[2rem] overflow-hidden border-4 border-[#8B6914] shadow-inner"
                            style={{ width: '400px', height: '500px' }}
                        ></div>
                        
                        {/* MODAL KUIS OVERLAY (Sangat Identik dengan HTML) */}
                        {showQuiz && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm rounded-[2.5rem]">
                                <div className="bg-[#FFFEF0] w-full max-w-sm rounded-[2rem] border-4 border-[#FF8C00] shadow-[0_10px_0_#ccc] overflow-hidden animate-in zoom-in">
                                    <div className="bg-[#FF8C00] p-4 text-center">
                                        <div className="bg-white/20 text-white text-[10px] px-2 py-1 rounded-md font-bold uppercase mb-1 inline-block">
                                            {activeQuestion?.cat}
                                        </div>
                                        <h3 className="text-[#603813] font-black text-lg leading-tight">{activeQuestion?.q}</h3>
                                    </div>
                                    <div className="p-4 space-y-2">
                                        {activeQuestion?.opts.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleAnswer(i)}
                                                className="w-full bg-[#F0F0F0] hover:bg-[#87CEEB] hover:text-white text-[#444] font-extrabold py-3 px-4 rounded-2xl border-b-4 border-black/10 transition-all active:border-0 active:translate-y-1 text-left flex items-center"
                                            >
                                                <span className="bg-white/50 w-6 h-6 rounded-lg flex items-center justify-center mr-3 text-xs">{String.fromCharCode(65 + i)}</span>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* SCREEN RESULT (Gaya Fluffy) */
                    <div className="w-[400px] h-[500px] flex flex-col items-center justify-center text-center p-6 bg-[#87CEEB] rounded-[2rem]">
                        <h2 className="text-6xl font-black text-white italic drop-shadow-lg mb-4">SKOR!</h2>
                        <div className="bg-[#FFFEF0] p-8 rounded-[2.5rem] border-8 border-[#FF8C00] mb-6 shadow-xl">
                            <div className="text-8xl font-black text-[#FF8C00]">{currentScore}</div>
                            <div className="text-[#5BA3CC] font-bold uppercase tracking-widest">Points</div>
                        </div>

                        <div className="w-full bg-white/20 p-2 rounded-2xl mb-4 max-h-32 overflow-y-auto">
                           <Leaderboard table="game2_flappybird" limit={3} />
                        </div>

                        <button 
                            onClick={() => { setGameState('playing'); setCurrentScore(0); setShowQuiz(false); }}
                            className="bg-[#FF8C00] hover:bg-[#FFD700] text-white text-2xl font-black py-4 px-10 rounded-full border-b-8 border-[#c76d00] shadow-lg active:border-0 active:translate-y-2 transition-all uppercase italic"
                        >
                            LAGI! 🚀
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}