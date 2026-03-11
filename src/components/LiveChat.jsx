import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { MessageCircle, X, Send, Trash2, Lock, Unlock, MessageSquareOff } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { filterBadWords } from '../utils/bannedWordsPool';
import EmojiPicker from 'emoji-picker-react';

// Fungsi pembantu dipindah ke luar agar tidak didefinisikan ulang setiap render
const getMiddleName = (fullName) => {
    if (!fullName) return "User";
    const parts = fullName.trim().split(' ');
    return parts.length > 1 ? parts[1] : parts[0];
};

export default function LiveChat({ student }) {
    // ==========================================
    // 1. STATE & HOOKS
    // ==========================================
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [selectedClass, setSelectedClass] = useState("Tanpa Kelas");
    const [allLockStatuses, setAllLockStatuses] = useState({});
    const [limit, setLimit] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const scrollRef = useRef(null);

    const CLASSES = ["Tanpa Kelas", "7.1", "7.2", "7.3", "7.4", "7.5", "7.6", "7.7", "7.8", "7.9", "7.10", "7.11"];

    //emoji
    // Di dalam komponen LiveChat:
const [showEmoji, setShowEmoji] = useState(false);

const onEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    // setShowEmoji(false); // Opsional: tutup picker setelah pilih
};

    // ==========================================
    // 2. DATA FETCHING & REALTIME
    // ==========================================

    // A. FETCH STATUS & REALTIME SETUP (Hanya jalan sekali / saat kelas berubah)
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

        const channel = supabase
            .channel('livechat_system')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'livechat' },
                (payload) => {
                    setMessages((prev) => {
                        // Cek ID agar tidak duplikat saat kita kirim pesan sendiri
                        if (prev.some(m => m.id === payload.new.id)) return prev;
                        return [...prev, payload.new];
                    });
                    new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3').play().catch(() => { });
                    setUnreadCount((prev) => (isOpen ? 0 : prev + 1));
                })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'livechat' },
                () => setMessages([]))
            .on('postgres_changes', { event: '*', schema: 'public', table: 'game_controls', filter: `game_id=eq.livechat_control` },
                () => fetchLockStatuses())
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [student?.Kelas, isOpen]); // Disederhanakan agar tidak re-subscribe saat mengetik

    // B. FETCH HISTORY (Hanya jalan saat limit atau window chat dibuka)
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
    }, [limit, isOpen]);

    // ==========================================
    // 3. AUTO SCROLL LOGIC
    // ==========================================
    const lastScrollHeight = useRef(0);
    const lastMessageCount = useRef(0);

    useLayoutEffect(() => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            if (messages.length > lastMessageCount.current + 1 && lastMessageCount.current !== 0) {
                const heightDifference = container.scrollHeight - lastScrollHeight.current;
                container.scrollTop = heightDifference + 1;
            }
            else if (messages.length <= lastMessageCount.current + 1 || lastMessageCount.current === 0) {
                container.scrollTop = container.scrollHeight;
            }
            lastScrollHeight.current = container.scrollHeight;
            lastMessageCount.current = messages.length;
        }
    }, [messages, isOpen]);

    if (!student) return null;

    // ==========================================
    // 5. ADMIN ACTIONS
    // ==========================================
    const toggleLockAction = async () => {
        const currentStatus = allLockStatuses[selectedClass] || false;
        const { error } = await supabase
            .from('game_controls')
            .upsert({
                game_id: 'livechat_control',
                class_name: selectedClass,
                is_locked: !currentStatus
            }, { onConflict: 'game_id, class_name' });

        if (error) alert("Gagal memperbarui akses");
    };

    const handleDeleteAll = async () => {
        if (window.confirm("Hapus semua riwayat chat untuk semua orang?")) {
            await supabase.from('livechat').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        }
    };

    // ==========================================
    // 6. CHAT ACTIONS (Optimized handleSend)
    // ==========================================
    const handleSend = async (e) => {
        e.preventDefault();
        const messageText = newMessage.trim();

        if (!messageText || (isLocked && student.role !== 'admin')) return;

        // OPTIMISTIC UPDATE: Kosongkan input langsung agar terasa ringan
        setNewMessage('');

        const cleanMessage = filterBadWords(messageText);

        await supabase.from('livechat').insert([{
            full_name: student.NAMA,
            kelas: student.Kelas,
            role: student.role || 'siswa',
            pesan: cleanMessage,
            student_id: String(student.id)
        }]);
    };

    // 1. Tambahkan fungsi ini di luar komponen (di atas atau di bawah getMiddleName)
// Berfungsi untuk menghasilkan warna unik berdasarkan string nama
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

    // ==========================================
    // 7. UI RENDER (Tampilan)
    // ==========================================

    // Tampilan jika akses chat sedang dikunci oleh Admin untuk kelas siswa tersebut
    if (isLocked && student.role !== 'admin') {
        return (
            <div className="fixed bottom-6 right-6 z-[100] opacity-50 grayscale">
                <div className="bg-slate-800 p-4 rounded-full shadow-xl border border-slate-700">
                    <MessageSquareOff size={28} className="text-slate-500" />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            {/* Tombol pemicu (Trigger) untuk membuka dan menutup jendela chat */}
            <button
                onClick={() => { setIsOpen(!isOpen); setUnreadCount(0); }}
                className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-2xl transition-all relative active:scale-90"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}

                {/* Badge notifikasi jumlah pesan yang belum terbaca saat chat tertutup */}
                {!isOpen && unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#0f172a] animate-bounce">
                        {unreadCount}
                    </div>
                )}
            </button>

            {/* Kontainer utama jendela chat yang muncul saat isOpen bernilai true */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[350px] h-[550px] bg-[#1e293b] border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">

                    {/* Header Jendela Chat: Berisi judul dan tombol hapus riwayat khusus Admin */}
                    <div className="p-4 bg-slate-800 border-b border-slate-700">
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <h3 className="font-bold text-white text-sm">Live Chat</h3>
                                <p className="text-[10px] text-emerald-400 flex items-center gap-1">Online</p>
                            </div>
                            {student.role === 'admin' && (
                                <button onClick={handleDeleteAll} title="Hapus Semua Chat" className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>

                        {/* Panel Kontrol Admin: Digunakan untuk memilih kelas dan mengunci/membuka akses chat */}
                        {student.role === 'admin' && (
                            <div className="bg-slate-900/50 p-2 rounded-xl border border-slate-700/50 space-y-2">
                                <p className="text-[9px] font-bold text-slate-500 uppercase px-1">Kontrol Akses Kelas</p>
                                <div className="flex gap-2">
                                    <select
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                                    >
                                        {CLASSES.map(c => (
                                            <option key={c} value={c}>
                                                {allLockStatuses[c] ? '🔴' : '🟢'} {c}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={toggleLockAction}
                                        className={`px-3 rounded-lg flex items-center justify-center transition-all ${allLockStatuses[selectedClass] ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'} text-white`}
                                    >
                                        {allLockStatuses[selectedClass] ? <Lock size={16} /> : <Unlock size={16} />}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    

                   {/* Area Pesan: Menampilkan daftar chat, tombol 'Load More', dan menangani auto-scroll */}
<div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-1 bg-[#0f172a]/30">

{/* Tombol Load More */}
{hasMore && (
    <div className="flex justify-center pb-4">
        <button
            onClick={() => setLimit(prev => prev + 10)}
            className="text-[10px] font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 transition-all active:scale-95"
        >
            Lihat chat lebih lama...
        </button>
    </div>
)}

{messages.map((msg, index) => {
    const isMe = msg.full_name === student.NAMA;
    const isAdmin = msg.role === 'admin';
    const isSameSender = index > 0 && messages[index - 1].full_name === msg.full_name;
    
    const msgDate = new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const prevMsgDate = index > 0 ? new Date(messages[index - 1].created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : null;
    const showDateSeparator = msgDate !== prevMsgDate;

    return (
        <React.Fragment key={msg.id}>
            {/* Tanggal Melayang */}
            {showDateSeparator && (
                <div className="flex justify-center my-4 sticky top-0 z-10">
                    <span className="bg-slate-800/80 backdrop-blur-sm text-[10px] text-slate-400 px-3 py-1 rounded-lg border border-slate-700 shadow-sm">
                        {msgDate}
                    </span>
                </div>
            )}

            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isSameSender ? 'mt-0.5' : 'mt-3'}`}>
                
                {/* Gelembung (Bubble) Pesan */}
                <div className={`
                    relative max-w-[85%] px-3 py-1.5 shadow-md transition-all flex flex-col
                    ${isMe ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl rounded-tl-none'}
                    ${isAdmin
                        ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white border border-white/20'
                        : isMe
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-100'
                    }
                `}>
                    {!isMe && !isSameSender && (
                        <span className={`text-[10px] font-black uppercase mb-0.5 ${isAdmin ? 'text-white/90' : getNameColor(msg.full_name)}`}>
                            {getMiddleName(msg.full_name)} • {msg.kelas}
                        </span>
                    )}

                    <div className="flex items-end gap-x-4">
                        <div className="text-sm break-words leading-relaxed flex-1">
                            {msg.pesan}
                        </div>

                        <div className="flex-shrink-0 mb-[-2px]">
                            <span className={`text-[9px] ${isAdmin ? 'text-white/70' : 'text-slate-400'} font-medium`}>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
})}
</div>

{/* FORM INPUT DENGAN EMOJI PICKER */}
<form onSubmit={handleSend} className="p-3 bg-slate-800 border-t border-slate-700 relative">

{/* Pop-up Emoji Picker (Hanya muncul jika showEmoji true) */}
{showEmoji && (
    <div className="absolute bottom-full right-0 mb-2 z-[110] shadow-2xl animate-in fade-in slide-in-from-bottom-2">
        <EmojiPicker 
            theme="dark"
            onEmojiClick={onEmojiClick}
            width={300}
            height={400}
            skinTonesDisabled
            searchDisabled={false}
        />
    </div>
)}

<div className="flex gap-2 items-center">
    {/* Tombol Buka Emoji */}
    <button 
        type="button"
        onClick={() => setShowEmoji(!showEmoji)}
        className={`transition-colors ${showEmoji ? 'text-yellow-400' : 'text-slate-400 hover:text-slate-200'}`}
    >
        <span className="text-xl">😀</span>
    </button>

    <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onFocus={() => setShowEmoji(false)} // Otomatis tutup picker saat mulai ngetik
        placeholder="Tulis pesan..."
        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
    />
    <button type="submit" className="bg-blue-600 p-2 rounded-xl text-white hover:bg-blue-500 transition-all active:scale-90">
        <Send size={18} />
    </button>
</div>
</form>

                   
                </div>
            )}
        </div>
    );
}