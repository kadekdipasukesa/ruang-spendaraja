import React, { useEffect, useState } from "react";
import Phaser from "phaser";
import { supabase } from "../../lib/supabaseClient";
import Leaderboard from "../../components/Leaderboard";

export default function FlappyBird({ student, onGameOver }) {
    const [gameState, setGameState] = useState('playing'); 
    const [currentScore, setCurrentScore] = useState(0);

    useEffect(() => {
        if (gameState !== 'playing') return;
    
        const timeoutId = setTimeout(() => {
            const config = {
                type: Phaser.AUTO,
                parent: 'game-container',
                width: 400,
                height: 500,
                backgroundColor: '#1e293b',
                physics: { 
                    default: 'arcade', 
                    arcade: { gravity: { y: 1000 }, debug: false } 
                },
                scene: {
                    preload: function() {
                        let graphics = this.make.graphics({ x: 0, y: 0, add: false });
                        graphics.fillStyle(0xffff00, 1);
                        graphics.fillRect(0, 0, 30, 30);
                        graphics.generateTexture('bird', 30, 30);
                        
                        graphics.clear();
                        graphics.fillStyle(0x22c55e, 1);
                        graphics.fillRect(0, 0, 50, 50);
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
                            if (!this.gameActive) return;
                            this.gameActive = false;
                            this.physics.pause();
                            this.bird.setTint(0xff0000);
                            saveToSupabase(this.score);
                        }, null, this);
                    },
                    update: function() {
                        if (this.gameActive && (this.bird.y > 500 || this.bird.y < 0)) {
                            this.gameActive = false;
                            saveToSupabase(this.score);
                        }
                    }
                }
            };

            const game = new Phaser.Game(config);

            async function saveToSupabase(finalScore) {
                if (student) {
                    await supabase.from('game2_flappybird').insert([{
                        nama: student.Nama || student.NAMA,
                        kelas: student.Kelas,
                        score: finalScore,
                        student_id: Number(student.id)
                    }]);
                }
                setTimeout(() => {
                    game.destroy(true);
                    setGameState('gameOver');
                }, 500);
            }

            return () => {
                game.destroy(true);
            };
        }, 100);
    
        return () => clearTimeout(timeoutId);
    }, [gameState, student]);

    // --- BAGIAN INI YANG PENTING AGAR GAME MUNCUL ---
    return (
        <div className="flex flex-col items-center justify-center min-h-[550px] w-full bg-slate-900 rounded-xl p-4 shadow-inner">
            {gameState === 'playing' ? (
                <div className="flex flex-col items-center">
                    <div className="mb-4 flex justify-between w-full max-w-[400px] px-2 text-white font-bold bg-slate-800 py-2 rounded-t-lg border-b border-slate-700">
                        <span>Pemain: {student?.Nama || student?.NAMA || 'Siswa'}</span>
                        <span className="text-yellow-400">Skor: {currentScore}</span>
                    </div>
                    {/* Container tempat Phaser akan muncul */}
                    <div 
                        id="game-container" 
                        className="border-4 border-slate-700 rounded-b-lg overflow-hidden shadow-2xl"
                        style={{ width: '400px', height: '500px' }}
                    ></div>
                    <p className="mt-4 text-slate-400 animate-pulse text-sm">
                        Klik Layar / Tap untuk Terbang
                    </p>
                </div>
            ) : (
                <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl shadow-2xl border-2 border-yellow-500/30 text-center animate-in zoom-in duration-300">
                    <h2 className="text-4xl font-black text-white mb-2 italic">GAME OVER</h2>
                    <div className="bg-slate-900 py-4 rounded-xl mb-6">
                        <p className="text-slate-400 text-sm uppercase tracking-widest">Skor Akhir</p>
                        <div className="text-6xl font-black text-yellow-400">{currentScore}</div>
                    </div>

                    <div className="mb-6 max-h-60 overflow-y-auto rounded-lg bg-slate-900/50 p-2 border border-slate-700">
                        <Leaderboard table="game2_flappybird" limit={5} />
                    </div>

                    <button 
                        onClick={() => {
                            setGameState('playing');
                            setCurrentScore(0);
                        }}
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black py-4 rounded-xl shadow-[0_5px_0_rgb(161,98,7)] active:translate-y-1 active:shadow-none transition-all text-xl"
                    >
                        MAIN LAGI 🐦
                    </button>
                </div>
            )}
        </div>
    );
}