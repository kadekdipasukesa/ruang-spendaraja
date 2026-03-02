import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Crown, User, Zap, Trophy, Gamepad2, Timer, LogOut } from 'lucide-react';

const ArenaMejaBundar = ({ student, isAdmin, soalPool, onExit }) => {
    const [players, setPlayers] = useState([]);
    const [isRM, setIsRM] = useState(false);
    const [gameStatus, setGameStatus] = useState('PLAYING'); 
    const [currentSoal, setCurrentSoal] = useState(null);
    const [winner, setWinner] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [timeLeft, setTimeLeft] = useState(60);

    const channelRef = useRef(null);
    const roomId = "meja_bundar_spenda";
    const isRMRef = useRef(false);
    const timerRef = useRef(null);
    const hasStartedRef = useRef(false);

    useEffect(() => {
        isRMRef.current = isRM;
    }, [isRM]);

    // --- LOGIKA TIMER 60 DETIK ---
    useEffect(() => {
        if (gameStatus === 'PLAYING' && currentSoal) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        if (isRMRef.current) {
                            startRound();
                        }
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [gameStatus, currentSoal, isRM]);

    const getDisplayName = (fullName) => {
        if (!fullName) return "Siswa";
        const parts = fullName.trim().split(/\s+/);
        return parts.length > 1 ? parts[1] : parts[0];
    };

    if (!student || !student.id) {
        return (
            <div className="flex items-center justify-center h-full bg-slate-950">
                <p className="text-white animate-pulse">Menyiapkan Kursi Arena...</p>
            </div>
        );
    }

    useEffect(() => {
        if (!student?.id || channelRef.current) return;
    
        const channel = supabase.channel(roomId, {
            config: {
                presence: { key: student.id },
                broadcast: { self: true }
            }
        });
    
        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                const rawPresences = Object.values(state).flat();
                const uniquePresences = Array.from(new Map(rawPresences.map(item => [item.id, item])).values());
                const sortedPlayers = uniquePresences.sort((a, b) => a.joined_at - b.joined_at);
    
                setPlayers(sortedPlayers);
    
                const roomMaster = sortedPlayers[0];
                if (roomMaster) {
                    const amIRM = roomMaster.id === student.id;
                    setIsRM(amIRM);
                    
                    if (amIRM && !currentSoal && !hasStartedRef.current) {
                        hasStartedRef.current = true;
                        startRound(); 
                    } else if (!amIRM && roomMaster.currentSoal && !currentSoal) {
                        setCurrentSoal(roomMaster.currentSoal);
                        setGameStatus(roomMaster.currentStatus || 'PLAYING');
                    }
                }
            })
            .on('broadcast', { event: 'game_start' }, ({ payload }) => {
                setCurrentSoal(payload.soal);
                setWinner(null);
                setCandidates([]);
                setGameStatus('PLAYING');
                setTimeLeft(60); 
            })
            .on('broadcast', { event: 'buzzer_pushed' }, ({ payload }) => {
                handleJudgeWinner(payload); 
            })
            .on('broadcast', { event: 'announce_winner' }, ({ payload }) => {
                setWinner(payload.winner);
                setGameStatus('WINNER');
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        id: student.id,
                        nama: student.NAMA,
                        kelas: student.KELAS || "7A",
                        joined_at: Date.now(),
                        currentStatus: 'PLAYING',
                        currentSoal: null 
                    });
                }
            });
    
        channelRef.current = channel;
        return () => {
            if (channel) {
                channel.untrack();
                supabase.removeChannel(channel);
                channelRef.current = null;
            }
        };
    }, [student?.id, currentSoal]);

    const handleJudgeWinner = (newPush) => {
        setCandidates((prev) => {
            const newList = [...prev, newPush];
            if (newList.length === 1 && isRMRef.current) {
                setTimeout(() => {
                    setCandidates(current => {
                        if (current.length === 0) return [];
                        const sorted = [...current].sort((a, b) => a.timestamp - b.timestamp);
                        const realWinner = sorted[0];
                        if (channelRef.current) {
                            channelRef.current.send({
                                type: 'broadcast',
                                event: 'announce_winner',
                                payload: { winner: realWinner }
                            });
                        }
                        return [];
                    });
                }, 500);
            }
            return newList;
        });
    };

    const startRound = async () => {
        if (!soalPool || soalPool.length === 0) return;
        const soalAcak = soalPool[Math.floor(Math.random() * soalPool.length)];
        
        if (channelRef.current) {
            channelRef.current.send({
                type: 'broadcast',
                event: 'game_start',
                payload: { soal: soalAcak }
            });

            await channelRef.current.track({
                id: student.id,
                nama: student.NAMA,
                kelas: student.KELAS || "7A",
                joined_at: Date.now(),
                currentStatus: 'PLAYING',
                currentSoal: soalAcak
            });
        }
    };

    const handleBelClick = () => {
        if (channelRef.current && gameStatus === 'PLAYING') {
            channelRef.current.send({
                type: 'broadcast',
                event: 'buzzer_pushed',
                payload: { 
                    id: student.id, 
                    nama: getDisplayName(student.NAMA), 
                    kelas: student.KELAS,
                    timestamp: Date.now() 
                }
            });
        }
    };

    return (
        <div className="fixed inset-0 w-full h-screen bg-slate-950 z-[9999] flex flex-col items-center justify-between py-6 overflow-hidden touch-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black -z-10"></div>
    
            {/* Header: Tombol Keluar di Kiri, Judul di Tengah/Kanan */}
            <div className="w-full px-6 flex justify-between items-center z-30">
                <button 
                    onClick={onExit}
                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 px-4 py-2 rounded-full transition-all active:scale-90"
                >
                    <LogOut size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Keluar</span>
                </button>

                <div className="flex flex-col items-end">
                    <span className="text-yellow-500 font-black text-xs tracking-widest uppercase text-right">Arena Meja Bundar</span>
                    <span className="text-slate-500 text-[10px] font-bold uppercase">{players.length} Pemain</span>
                </div>
            </div>

            {/* Grid Pemain Atas */}
            <div className="w-full flex flex-wrap justify-center gap-x-6 gap-y-8 z-20 px-4">
                {players.slice(0, Math.ceil(players.length / 2)).map((p) => (
                    <div key={p.id} className="flex flex-col items-center">
                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center shadow-xl transition-all duration-500
                            ${winner?.id === p.id ? 'bg-green-600 border-white scale-110' : 'bg-slate-900 border-slate-800'}`}>
                            {p.id === student?.id ? <Zap size={20} className="text-yellow-400 fill-yellow-400" /> : <User size={20} className="text-slate-600" />}
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-[11px] font-black text-white leading-none uppercase">{getDisplayName(p.nama)}</p>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">{p.kelas || "7A"}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Area Utama (Soal & Timer Tengah) */}
            <div className="w-full max-w-xl mx-auto z-10 px-4">
                
                {/* Visual Timer diletakkan di atas kotak soal */}
                {gameStatus === 'PLAYING' && currentSoal && (
                    <div className="flex flex-col items-center mb-4 animate-bounce">
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-1.5 rounded-full backdrop-blur-sm">
                            <Timer size={14} className={timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-blue-400"} />
                            <span className={`text-xs font-black tracking-tighter ${timeLeft <= 10 ? "text-red-500" : "text-white"}`}>
                                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                            </span>
                        </div>
                    </div>
                )}

                <div className={`p-8 rounded-[2.5rem] border-2 text-center transition-all duration-500
                    ${gameStatus === 'WINNER' ? 'bg-green-600 border-white shadow-[0_0_40px_rgba(34,197,94,0.3)]' : 'bg-slate-900/50 border-white/5 backdrop-blur-md'}`}>
                    
                    {!currentSoal && gameStatus !== 'WINNER' && (
                        <div className="py-4">
                            <Gamepad2 className="mx-auto text-slate-700 mb-2 animate-pulse" size={32} />
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Sinkronisasi Arena...</p>
                        </div>
                    )}

                    {gameStatus === 'PLAYING' && currentSoal && (
                        <div className="animate-in fade-in zoom-in duration-500">
                            <h2 className="text-white text-lg md:text-2xl font-black leading-tight drop-shadow-lg uppercase tracking-tight">
                                {currentSoal.tanya}
                            </h2>
                        </div>
                    )}

                    {gameStatus === 'WINNER' && (
                        <div className="flex flex-col items-center animate-in zoom-in duration-300">
                            <Trophy className="text-white mb-2" size={40} />
                            <h3 className="text-white font-black text-2xl uppercase italic tracking-tighter">{winner?.nama}</h3>
                            <p className="text-green-100 text-[10px] font-bold uppercase tracking-widest mt-1">Berhasil Menekan Bel!</p>
                            <button onClick={startRound} className="mt-6 bg-white text-green-700 text-[10px] font-black px-8 py-3 rounded-full shadow-xl active:scale-95 transition-transform uppercase italic">
                                Lanjut Ronde Baru
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Grid Pemain Bawah */}
            <div className="w-full flex flex-wrap justify-center gap-x-6 gap-y-8 z-20 px-4">
                {players.slice(Math.ceil(players.length / 2)).map((p) => (
                    <div key={p.id} className="flex flex-col items-center">
                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center shadow-xl transition-all duration-500
                            ${winner?.id === p.id ? 'bg-green-600 border-white scale-110' : 'bg-slate-900 border-slate-800'}`}>
                            {p.id === student?.id ? <Zap size={20} className="text-yellow-400 fill-yellow-400" /> : <User size={20} className="text-slate-600" />}
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-[11px] font-black text-white leading-none uppercase">{getDisplayName(p.nama)}</p>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">{p.kelas || "7A"}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Buzzer */}
            {gameStatus === 'PLAYING' && currentSoal && (
                <div className="pb-8 z-[50]">
                    <button onClick={handleBelClick} className="group relative active:scale-90 transition-transform">
                        <div className="absolute inset-0 bg-red-600/30 blur-[30px] rounded-full group-active:bg-red-500/60 transition-all"></div>
                        <div className="relative w-24 h-24 bg-red-600 rounded-full border-b-[8px] border-red-900 shadow-2xl flex items-center justify-center text-white font-black text-2xl select-none uppercase tracking-tighter">
                            BEL
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ArenaMejaBundar;