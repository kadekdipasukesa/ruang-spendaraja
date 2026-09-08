import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { X, Send, Trash2, Lock, Unlock, MessageSquareOff, Users, GraduationCap, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { filterBadWords } from '../utils/bannedWordsPool';
import EmojiPicker from 'emoji-picker-react';
import LinkPreviewCard, { extractFirstUrl, renderMessageText } from './LiveChat/LinkPreviewCard';

// --- FUNGSI PEMBANTU (Helper Functions) ---
// Mengambil 2 kata nama (nama tengah dan belakang) dengan format Title Case (misal: "KADEK DIPA SUKESA" -> "Dipa Sukesa")
const getShortName = (fullName) => {
    if (!fullName) return "User";
    const parts = fullName.trim().split(/\s+/);
    const selectedParts = parts.length <= 1 ? parts : parts.slice(-2);
    return selectedParts
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

const getNameColor = (name) => {
    const colors = [
        'text-emerald-400', 'text-orange-400', 'text-pink-400',
        'text-amber-400', 'text-cyan-400', 'text-lime-400',
        'text-violet-400', 'text-fuchsia-400'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

/**
 * Memeriksa apakah suatu pesan ditujukan untuk 'siswa' atau 'guru'
 * - Pesan guru -> khusus ruang guru
 * - Pesan siswa/osis -> khusus ruang siswa
 * - Pesan admin -> ditentukan dari target kelas ('Ruang Guru' vs 'Ruang Siswa'/lainnya)
 */
const isMessageInRoom = (msg, targetRoom) => {
    if (!msg) return false;
    if (msg.role === 'guru') {
        return targetRoom === 'guru';
    }
    if (msg.role === 'siswa' || msg.role === 'osis') {
        return targetRoom === 'siswa';
    }
    if (msg.role === 'admin') {
        if (msg.kelas === 'Ruang Guru') {
            return targetRoom === 'guru';
        }
        return targetRoom === 'siswa';
    }
    return targetRoom === 'siswa';
};

export default function LiveChat({ student, externalTrigger, setExternalTrigger, setUnreadExternal }) {
    // ==========================================
    // 1. STATE & REF
    // ==========================================
    const isUserGuru = student?.role === 'guru';
    const isUserAdmin = student?.role === 'admin';

    // Kamar aktif: default 'guru' untuk guru, default 'siswa' untuk siswa & admin
    const [activeRoom, setActiveRoom] = useState(isUserGuru ? 'guru' : 'siswa');
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [selectedClass, setSelectedClass] = useState("Tanpa Kelas");
    const [allLockStatuses, setAllLockStatuses] = useState({});
    const [limit, setLimit] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const [showEmoji, setShowEmoji] = useState(false);

    const scrollRef = useRef(null);
    const lastScrollHeight = useRef(0);
    const lastMessageCount = useRef(0);

    // Ref untuk listener WebSocket agar tidak re-subscribe terus-menerus
    const isOpenRef = useRef(isOpen);
    const activeRoomRef = useRef(activeRoom);
    const studentRef = useRef(student);

    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    useEffect(() => {
        activeRoomRef.current = activeRoom;
    }, [activeRoom]);

    useEffect(() => {
        studentRef.current = student;
    }, [student]);

    const CLASSES = ["Tanpa Kelas", "7.1", "7.2", "7.3", "7.4", "7.5", "7.6", "7.7", "7.8", "7.9", "7.10", "7.11"];

    // Kunci chat hanya berlaku untuk siswa di Ruang Siswa (guru dan admin tidak pernah terkunci)
    const isChatLockedForUser = isLocked && !isUserAdmin && !isUserGuru && activeRoom === 'siswa';

    // ==========================================
    // 2. REALTIME & LOCK STATUS
    // ==========================================
    useEffect(() => {
        if (!student) return;

        const fetchLockStatuses = async () => {
            const { data } = await supabase
                .from('game_controls')
                .select('class_name, is_locked')
                .eq('game_id', 'livechat_control');

            if (data) {
                const statusMap = {};
                data.forEach(item => { statusMap[item.class_name] = item.is_locked; });
                setAllLockStatuses(statusMap);
                setIsLocked(statusMap[student.Kelas] || false);
            }
        };

        fetchLockStatuses();

        const channelId = `livechat_system_${Math.random().toString(36).substring(2, 7)}`;
        const channel = supabase
            .channel(channelId)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'livechat' },
                (payload) => {
                    const newMsg = payload.new;
                    if (!newMsg) return;

                    // Simpan pesan ke daftar
                    setMessages((prev) => {
                        if (prev.some(m => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg];
                    });

                    // Cek apakah pesan relevan dengan ruang pengguna saat ini
                    const currentUserRole = studentRef.current?.role;
                    const userTargetRoom = currentUserRole === 'guru' 
                        ? 'guru' 
                        : (currentUserRole === 'admin' ? activeRoomRef.current : 'siswa');
                    
                    const isRelevant = isMessageInRoom(newMsg, userTargetRoom);

                    // Bunyikan audio dan tambah unread hanya bila pesan relevan dengan kamar pengguna
                    if (isRelevant) {
                        new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3').play().catch(() => { });

                        if (!isOpenRef.current) {
                            setUnreadCount((prev) => {
                                const nextCount = prev + 1;
                                if (typeof setUnreadExternal === 'function') {
                                    setTimeout(() => {
                                        setUnreadExternal(nextCount);
                                    }, 0);
                                }
                                return nextCount;
                            });
                        }
                    }
                })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'livechat' },
                () => setMessages([]))
            .on('postgres_changes', { event: '*', schema: 'public', table: 'game_controls', filter: `game_id=eq.livechat_control` },
                () => fetchLockStatuses())
            .subscribe((status) => {
                console.log("📡 Status Koneksi LiveChat:", status);
            });

        return () => { supabase.removeChannel(channel); };
    }, [student?.Kelas, setUnreadExternal]);

    // ==========================================
    // 3. EXTERNAL TRIGGER & RESET UNREAD
    // ==========================================
    useEffect(() => {
        if (externalTrigger) {
            setIsOpen(true);
            if (setExternalTrigger) setExternalTrigger(false);
        }
    }, [externalTrigger, setExternalTrigger]);

    useEffect(() => {
        if (isOpen) {
            setUnreadCount(0);
            if (setUnreadExternal) setUnreadExternal(0);
        }
    }, [isOpen, setUnreadExternal]);

    // ==========================================
    // 4. FETCH HISTORY
    // ==========================================
    useEffect(() => {
        if (!isOpen || !student) return;

        const fetchMessages = async () => {
            const { data } = await supabase
                .from('livechat')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (data) {
                const sortedData = [...data].reverse();
                setMessages((prevMessages) => {
                    if (prevMessages.length === 0) return sortedData;
                    const existingIds = new Set(prevMessages.map(m => m.id));
                    const newHistory = sortedData.filter(m => !existingIds.has(m.id));
                    return [...newHistory, ...prevMessages];
                });
                setHasMore(data.length >= limit);
            }
        };

        fetchMessages();
    }, [limit, isOpen, student]);

    // ==========================================
    // 5. AUTO SCROLL
    // ==========================================
    useLayoutEffect(() => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            if (messages.length > lastMessageCount.current + 1 && lastMessageCount.current !== 0) {
                const heightDifference = container.scrollHeight - lastScrollHeight.current;
                container.scrollTop = heightDifference + 1;
            } else {
                container.scrollTop = container.scrollHeight;
            }
            lastScrollHeight.current = container.scrollHeight;
            lastMessageCount.current = messages.length;
        }
    }, [messages, isOpen, activeRoom]);

    // ==========================================
    // 6. ACTIONS (SEND, LOCK, DELETE)
    // ==========================================
    const onEmojiClick = (emojiData) => {
        setNewMessage(prev => prev + emojiData.emoji);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        const messageText = newMessage.trim();
        if (!messageText || isChatLockedForUser) return;

        setNewMessage('');
        const cleanMessage = filterBadWords(messageText);

        // Penentuan target ruang & kelas berdasarkan pengirim dan kamar aktif
        let payloadKelas = student.Kelas || 'Tanpa Kelas';
        let payloadRole = student.role || 'siswa';

        if (isUserAdmin) {
            payloadRole = 'admin';
            payloadKelas = activeRoom === 'guru' ? 'Ruang Guru' : 'Ruang Siswa';
        } else if (isUserGuru) {
            payloadRole = 'guru';
            payloadKelas = student.Kelas || 'Guru';
        }

        await supabase.from('livechat').insert([{
            full_name: student.NAMA,
            kelas: payloadKelas,
            role: payloadRole,
            pesan: cleanMessage,
            student_id: String(student.id)
        }]);
    };

    const toggleLockAction = async () => {
        const currentStatus = allLockStatuses[selectedClass] || false;
        await supabase.from('game_controls').upsert({
            game_id: 'livechat_control',
            class_name: selectedClass,
            is_locked: !currentStatus
        }, { onConflict: 'game_id, class_name' });
    };

    const handleDeleteAllInRoom = async () => {
        const targetRoomName = activeRoom === 'guru' ? 'Ruang Guru' : 'Ruang Siswa';
        if (window.confirm(`Hapus semua riwayat obrolan di ${targetRoomName}?`)) {
            if (activeRoom === 'guru') {
                // Hapus pesan khusus ruang guru
                await supabase.from('livechat').delete().or('role.eq.guru,kelas.eq.Ruang Guru');
            } else {
                // Hapus pesan khusus ruang siswa
                await supabase.from('livechat').delete().not('role', 'eq', 'guru').not('kelas', 'eq', 'Ruang Guru');
            }
        }
    };

    if (!student) return null;

    // View: Locked State (Hanya untuk siswa yang kelasnya dikunci)
    if (isChatLockedForUser) {
        return (
            <div className="fixed bottom-6 right-6 z-[100] opacity-50 grayscale">
                <div className="bg-slate-800 p-4 rounded-full shadow-xl border border-slate-700">
                    <MessageSquareOff size={28} className="text-slate-500" />
                </div>
            </div>
        );
    }

    // Filter pesan yang sesuai dengan kamar aktif
    const displayMessages = messages.filter(msg => isMessageInRoom(msg, activeRoom));

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[350px] max-w-[calc(100vw-24px)] h-[550px] max-h-[calc(100vh-120px)] bg-[#1e293b] border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">

                    {/* Header */}
                    <div className="p-3.5 bg-slate-800 border-b border-slate-700">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <h3 className="font-bold text-white text-sm">Live Chat</h3>
                                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                </div>
                                <p className="text-[10px] text-slate-400">
                                    {activeRoom === 'guru' ? 'Diskusi Dewan Guru' : 'Obrolan Siswa SMPN 2 Singaraja'}
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                {isUserAdmin && (
                                    <button 
                                        onClick={handleDeleteAllInRoom} 
                                        title={`Hapus riwayat ${activeRoom === 'guru' ? 'Ruang Guru' : 'Ruang Siswa'}`}
                                        className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                <button 
                                    onClick={() => setIsOpen(false)} 
                                    className="p-1.5 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* TAB NAVIGASI RUANG: Khusus Admin dapat beralih kamar */}
                        {isUserAdmin ? (
                            <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-700/60 mt-2.5 shadow-inner">
                                <button
                                    type="button"
                                    onClick={() => setActiveRoom('siswa')}
                                    className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                        activeRoom === 'siswa'
                                            ? 'bg-blue-600 text-white shadow'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                    }`}
                                >
                                    <Users size={13} />
                                    <span>Ruang Siswa</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveRoom('guru')}
                                    className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                        activeRoom === 'guru'
                                            ? 'bg-amber-600 text-white shadow'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                    }`}
                                >
                                    <GraduationCap size={14} />
                                    <span>Ruang Guru</span>
                                </button>
                            </div>
                        ) : (
                            /* Badge Status Kamar untuk Guru / Siswa Biasa */
                            <div className="mt-2 flex items-center">
                                {isUserGuru ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[11px] font-bold text-amber-300">
                                        <GraduationCap size={13} className="text-amber-400" />
                                        <span>Ruang Khusus Dewan Guru</span>
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-[11px] font-bold text-blue-300">
                                        <Users size={13} className="text-blue-400" />
                                        <span>Ruang Obrolan Siswa</span>
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Admin Control: Kunci Chat Siswa per Kelas */}
                        {isUserAdmin && activeRoom === 'siswa' && (
                            <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-700/50 mt-2">
                                <div className="flex gap-2 items-center">
                                    <span className="text-[10px] text-slate-400 font-medium shrink-0">Kunci Kelas:</span>
                                    <select
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white outline-none"
                                    >
                                        {CLASSES.map(c => (
                                            <option key={c} value={c}>
                                                {allLockStatuses[c] ? '🔴' : '🟢'} {c}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={toggleLockAction}
                                        title={allLockStatuses[selectedClass] ? 'Buka Kunci' : 'Kunci Chat Kelas Ini'}
                                        className={`px-2.5 py-1 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                            allLockStatuses[selectedClass] ? 'bg-red-600' : 'bg-emerald-600'
                                        } text-white`}
                                    >
                                        {allLockStatuses[selectedClass] ? <Lock size={14} /> : <Unlock size={14} />}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Messages Area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1 bg-[#0f172a]/30">
                        {hasMore && (
                            <div className="flex justify-center pb-4">
                                <button 
                                    onClick={() => setLimit(prev => prev + 10)} 
                                    className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 hover:bg-blue-500/20 transition-colors cursor-pointer"
                                >
                                    Lihat chat lebih lama...
                                </button>
                            </div>
                        )}

                        {displayMessages.length === 0 ? (
                            <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-4 text-slate-400">
                                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-2.5 ${
                                    activeRoom === 'guru' 
                                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                                        : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                }`}>
                                    {activeRoom === 'guru' ? <GraduationCap size={24} /> : <Users size={24} />}
                                </div>
                                <p className="text-xs font-bold text-slate-200">
                                    {activeRoom === 'guru' ? 'Ruang Guru Masih Kosong' : 'Ruang Siswa Masih Kosong'}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-1 max-w-[220px] leading-relaxed">
                                    {activeRoom === 'guru' 
                                        ? 'Belum ada obrolan dewan guru. Awali koordinasi di sini.' 
                                        : 'Belum ada obrolan siswa. Jadilah yang pertama menyapa teman-teman.'}
                                </p>
                            </div>
                        ) : (
                            displayMessages.map((msg, index) => {
                                const isMe = msg.full_name === student.NAMA;
                                const isAdmin = msg.role === 'admin';
                                const isGuru = msg.role === 'guru';
                                const isSameSender = index > 0 && displayMessages[index - 1].full_name === msg.full_name;
                                const msgDate = new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });
                                const prevMsgDate = index > 0 ? new Date(displayMessages[index - 1].created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' }) : null;
                                const firstUrl = extractFirstUrl(msg.pesan);

                                return (
                                    <React.Fragment key={msg.id}>
                                        {msgDate !== prevMsgDate && (
                                            <div className="flex justify-center my-4 sticky top-0 z-10">
                                                <span className="bg-slate-800/80 backdrop-blur-sm text-[10px] text-slate-400 px-3 py-1 rounded-lg border border-slate-700">
                                                    {msgDate}
                                                </span>
                                            </div>
                                        )}
                                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isSameSender ? 'mt-0.5' : 'mt-3'} max-w-full`}>
                                            <div className={`relative max-w-[85%] min-w-0 px-3 py-1.5 shadow-md flex flex-col overflow-hidden ${
                                                isMe 
                                                    ? (isUserGuru ? 'rounded-2xl rounded-tr-none bg-amber-600 text-white' : 'rounded-2xl rounded-tr-none bg-blue-600 text-white')
                                                    : 'rounded-2xl rounded-tl-none bg-slate-700 text-slate-100'
                                            } ${isAdmin ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600' : ''}`}>
                                                {!isMe && !isSameSender && (
                                                    <span className={`text-[10px] font-normal mb-0.5 flex items-center gap-1 ${
                                                        isAdmin ? 'text-white/90 font-semibold' : (isGuru ? 'text-amber-300 font-semibold' : getNameColor(msg.full_name))
                                                    }`}>
                                                        {isAdmin && <ShieldCheck size={11} className="text-yellow-300" />}
                                                        {isGuru && <GraduationCap size={11} className="text-amber-300" />}
                                                        <span>{getShortName(msg.full_name)} • {msg.kelas}</span>
                                                    </span>
                                                )}
                                                <div className="flex items-end gap-x-3 min-w-0 max-w-full">
                                                    <div className="text-sm break-all [overflow-wrap:anywhere] leading-relaxed flex-1 min-w-0">
                                                        {renderMessageText(msg.pesan, isMe)}
                                                    </div>
                                                    <span className={`text-[9px] shrink-0 self-end ml-1 ${isAdmin ? 'text-white/70' : 'text-slate-400'}`}>
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>

                                                {/* Preview Link ala WhatsApp */}
                                                {firstUrl && (
                                                    <LinkPreviewCard url={firstUrl} />
                                                )}
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            })
                        )}
                    </div>

                    {/* Input Form dengan PENGAMAN ANTI-SALAH KAMAR */}
                    <form onSubmit={handleSend} className="p-3 bg-slate-800 border-t border-slate-700 relative">
                        {showEmoji && (
                            <div className="absolute bottom-full right-0 mb-2 z-[110]">
                                <EmojiPicker theme="dark" onEmojiClick={onEmojiClick} width={300} height={400} skinTonesDisabled />
                            </div>
                        )}

                        {/* LAPISAN PENGAMAN ANTI-SALAH KAMAR UNTUK ADMIN */}
                        {isUserAdmin && (
                            <div className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg mb-2 flex items-center justify-between border transition-all ${
                                activeRoom === 'guru' 
                                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' 
                                    : 'bg-blue-950/40 border-blue-500/40 text-blue-300'
                            }`}>
                                <div className="flex items-center gap-1.5">
                                    <span 
                                        className="inline-block w-2 h-2 rounded-full animate-pulse" 
                                        style={{ backgroundColor: activeRoom === 'guru' ? '#f59e0b' : '#3b82f6' }} 
                                    />
                                    <span>Target: <strong>{activeRoom === 'guru' ? 'Ruang Guru (Privat)' : 'Ruang Siswa (Publik)'}</strong></span>
                                </div>
                                <span className="text-[9px] opacity-80 hidden sm:inline">
                                    {activeRoom === 'guru' ? 'Khusus Dewan Guru' : 'Terbaca Seluruh Siswa'}
                                </span>
                            </div>
                        )}

                        <div className="flex gap-2 items-center">
                            <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="text-xl cursor-pointer">😀</button>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onFocus={() => setShowEmoji(false)}
                                placeholder={
                                    activeRoom === 'guru' 
                                        ? "Tulis pesan untuk dewan guru..." 
                                        : "Tulis pesan untuk siswa..."
                                }
                                className={`flex-1 bg-slate-900 border rounded-xl px-4 py-2 text-sm text-white focus:outline-none transition-colors ${
                                    activeRoom === 'guru' 
                                        ? 'border-slate-700 focus:border-amber-500' 
                                        : 'border-slate-700 focus:border-blue-500'
                                }`}
                            />
                            <button 
                                type="submit" 
                                title="Kirim pesan"
                                className={`p-2 rounded-xl text-white active:scale-90 transition-all cursor-pointer ${
                                    activeRoom === 'guru' 
                                        ? 'bg-amber-600 hover:bg-amber-500' 
                                        : 'bg-blue-600 hover:bg-blue-500'
                                }`}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
