import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { filterBadWords } from '../utils/bannedWordsPool';
import ChatHeader from './LiveChat/ChatHeader';
import ChatMessageItem from './LiveChat/ChatMessageItem';
import ChatInputForm from './LiveChat/ChatInputForm';
import { isMessageInRoom } from './LiveChat/chatHelpers';
import { Users, GraduationCap, MessageSquareOff } from 'lucide-react';

export default function LiveChat({ student, externalTrigger, setExternalTrigger, setUnreadExternal }) {
    // ==========================================
    // 1. STATE & USER PERMISSION
    // ==========================================
    const userRole = String(student?.role || '').toLowerCase().trim();
    const isUserGuru = userRole === 'guru';
    const isUserAdmin = userRole === 'admin';

    // Kamar aktif: default 'guru' untuk guru, default 'siswa' untuk siswa & admin
    const [activeRoom, setActiveRoom] = useState(isUserGuru ? 'guru' : 'siswa');
    // Kamar aktif yang efektif: Guru 100% selalu di 'guru', Siswa di 'siswa', Admin bebas beralih
    const effectiveRoom = isUserGuru ? 'guru' : (isUserAdmin ? activeRoom : 'siswa');

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [, setUnreadCount] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [selectedClass, setSelectedClass] = useState("Tanpa Kelas");
    const [allLockStatuses, setAllLockStatuses] = useState({});
    const [limit, setLimit] = useState(25);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);

    // Cache profil sender: { [sender_id]: { id, NAMA, Kelas, role } }
    const [senderMap, setSenderMap] = useState({});
    const senderMapRef = useRef(senderMap);

    useEffect(() => {
        senderMapRef.current = senderMap;
    }, [senderMap]);

    const scrollRef = useRef(null);
    const lastScrollHeight = useRef(0);
    const lastMessageCount = useRef(0);

    // Sinkronisasi kamar aktif dengan role pengguna saat data student termuat/berubah
    useEffect(() => {
        if (!student?.role) return;
        const currentRole = String(student.role).toLowerCase().trim();
        if (currentRole === 'guru') {
            setActiveRoom('guru');
        } else if (currentRole !== 'admin') {
            setActiveRoom('siswa');
        }
    }, [student?.role]);

    // Seed profil student yang sedang login ke cache
    useEffect(() => {
        if (student?.id || student?.NISN) {
            const myKey = String(student.id || student.NISN);
            setSenderMap(prev => ({
                ...prev,
                [myKey]: {
                    id: student.id,
                    NAMA: student.NAMA || student.nama,
                    Kelas: student.Kelas || student.KELAS,
                    role: student.role || 'siswa'
                }
            }));
        }
    }, [student]);

    // Ref untuk listener WebSocket & auto-scroll
    const isOpenRef = useRef(isOpen);
    const activeRoomRef = useRef(effectiveRoom);
    const studentRef = useRef(student);

    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    useEffect(() => {
        activeRoomRef.current = effectiveRoom;
    }, [effectiveRoom]);

    useEffect(() => {
        studentRef.current = student;
    }, [student]);

    // Kunci chat hanya berlaku untuk siswa di Ruang Siswa (guru dan admin tidak pernah terkunci)
    const isChatLockedForUser = isLocked && !isUserAdmin && !isUserGuru && effectiveRoom === 'siswa';

    // ==========================================
    // 2. HELPER FETCH PROFIL PENGIRIM DARI MASTER_SISWA
    // ==========================================
    const fetchSenderProfiles = useCallback(async (ids) => {
        if (!ids || ids.length === 0) return;
        const cleanIds = ids.filter(id => id && id !== 'undefined' && id !== 'null');
        if (cleanIds.length === 0) return;

        try {
            const { data, error } = await supabase
                .from('master_siswa')
                .select('id, NAMA, Kelas, role')
                .in('id', cleanIds);

            if (!error && data && data.length > 0) {
                setSenderMap(prev => {
                    const updated = { ...prev };
                    data.forEach(u => {
                        updated[String(u.id)] = u;
                    });
                    return updated;
                });
            }
        } catch (err) {
            console.warn("Gagal memuat profil pengirim master_siswa:", err);
        }
    }, []);

    // ==========================================
    // 3. REALTIME & STATUS KUNCI KELAS
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

        const channelId = `livechat_sys_${Math.random().toString(36).substring(2, 7)}`;
        const channel = supabase
            .channel(channelId)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'livechat' },
                (payload) => {
                    const newMsg = payload.new;
                    if (!newMsg) return;

                    // Simpan pesan ke memori state
                    setMessages((prev) => {
                        if (prev.some(m => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg];
                    });

                    // Muat profil pengirim jika belum ada di cache
                    const senderIdStr = String(newMsg.sender_id || newMsg.student_id || '');
                    if (senderIdStr && !senderMapRef.current[senderIdStr]) {
                        fetchSenderProfiles([senderIdStr]);
                    }

                    // Cek apakah pesan relevan dengan ruang pengguna saat ini
                    const currentUserRole = studentRef.current?.role;
                    const userTargetRoom = currentUserRole === 'guru' 
                        ? 'guru' 
                        : (currentUserRole === 'admin' ? activeRoomRef.current : 'siswa');
                    
                    const isRelevant = isMessageInRoom(newMsg, userTargetRoom);

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
                (payload) => {
                    if (payload.old?.id) {
                        setMessages(prev => prev.filter(m => m.id !== payload.old.id));
                    } else {
                        setMessages([]);
                    }
                })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'game_controls', filter: `game_id=eq.livechat_control` },
                () => fetchLockStatuses())
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [student?.Kelas, setUnreadExternal, fetchSenderProfiles]);

    // ==========================================
    // 4. EXTERNAL TRIGGER & RESET UNREAD
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
    // 5. FETCH HISTORY DARI DATABASE
    // ==========================================
    useEffect(() => {
        if (!isOpen || !student) return;

        const fetchMessages = async () => {
            setIsLoading(true);
            const targetRoomId = effectiveRoom === 'guru' ? 'group_guru' : 'group_siswa';

            // Mengambil pesan sesuai target_id kamar aktif (dengan fallback untuk baris lama)
            const { data, error } = await supabase
                .from('livechat')
                .select('*')
                .or(`target_id.eq.${targetRoomId},target_id.is.null`)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                console.error("Gagal memuat pesan livechat:", error);
                setIsLoading(false);
                return;
            }

            if (data) {
                const sortedData = [...data].reverse();
                setMessages((prevMessages) => {
                    if (prevMessages.length === 0) return sortedData;
                    const existingIds = new Set(prevMessages.map(m => m.id));
                    const newHistory = sortedData.filter(m => !existingIds.has(m.id));
                    return [...newHistory, ...prevMessages];
                });
                setHasMore(data.length >= limit);

                // Cari ID pengirim yang belum ada di cache
                const missingSenderIds = [...new Set(
                    data
                        .map(m => String(m.sender_id || m.student_id || ''))
                        .filter(id => id && id !== 'undefined' && !senderMapRef.current[id])
                )];

                if (missingSenderIds.length > 0) {
                    fetchSenderProfiles(missingSenderIds);
                }
            }
            setIsLoading(false);
        };

        fetchMessages();
    }, [limit, isOpen, student, effectiveRoom, fetchSenderProfiles]);

    // ==========================================
    // 6. AUTO SCROLL & LOAD MORE
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
    }, [messages, isOpen, effectiveRoom]);

    const handleScroll = (e) => {
        const { scrollTop } = e.currentTarget;
        if (scrollTop === 0 && hasMore && !isLoading) {
            setLimit((prev) => prev + 20);
        }
    };

    // ==========================================
    // 7. ACTIONS (SEND, LOCK, DELETE)
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

        // Skema baru: sender_id, pesan, target_type, target_id, is_read
        const targetRoomId = effectiveRoom === 'guru' ? 'group_guru' : 'group_siswa';
        const senderId = String(student.id || student.NISN || '');

        await supabase.from('livechat').insert([{
            sender_id: senderId,
            pesan: cleanMessage,
            target_type: 'group',
            target_id: targetRoomId,
            is_read: false
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
        const targetRoomName = effectiveRoom === 'guru' ? 'Ruang Guru' : 'Ruang Siswa';
        const targetRoomId = effectiveRoom === 'guru' ? 'group_guru' : 'group_siswa';

        if (window.confirm(`Hapus semua riwayat obrolan di ${targetRoomName}?`)) {
            await supabase
                .from('livechat')
                .delete()
                .or(`target_id.eq.${targetRoomId},and(target_id.is.null,${effectiveRoom === 'guru' ? 'role.eq.guru' : 'not.role.eq.guru'})`);

            setMessages(prev => prev.filter(msg => !isMessageInRoom(msg, effectiveRoom)));
        }
    };

    if (!student) return null;

    // View jika chat kelas dikunci guru (untuk siswa)
    if (isChatLockedForUser && !isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-[100] opacity-50 grayscale">
                <div className="bg-slate-800 p-4 rounded-full shadow-xl border border-slate-700">
                    <MessageSquareOff size={28} className="text-slate-500" />
                </div>
            </div>
        );
    }

    // Filter pesan yang sesuai dengan kamar aktif
    const displayMessages = messages.filter(msg => isMessageInRoom(msg, effectiveRoom));

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[350px] max-w-[calc(100vw-24px)] h-[550px] max-h-[calc(100vh-120px)] bg-[#1e293b] border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
                    
                    {/* Header Chat */}
                    <ChatHeader
                        effectiveRoom={effectiveRoom}
                        isUserAdmin={isUserAdmin}
                        onSwitchRoom={setActiveRoom}
                        onDeleteAllInRoom={handleDeleteAllInRoom}
                        onClose={() => setIsOpen(false)}
                        selectedClass={selectedClass}
                        setSelectedClass={setSelectedClass}
                        allLockStatuses={allLockStatuses}
                        onToggleLock={toggleLockAction}
                    />

                    {/* Chat Messages List */}
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/50"
                    >
                        {isLoading && (
                            <p className="text-center text-[10px] text-slate-500 font-medium">
                                Memuat pesan sebelumnya...
                            </p>
                        )}

                        {displayMessages.length === 0 ? (
                            <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-4 text-slate-400">
                                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-2.5 ${
                                    effectiveRoom === 'guru' 
                                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                                        : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                }`}>
                                    {effectiveRoom === 'guru' ? <GraduationCap size={24} /> : <Users size={24} />}
                                </div>
                                <p className="text-xs font-bold text-slate-200">
                                    {effectiveRoom === 'guru' ? 'Ruang Guru Masih Kosong' : 'Ruang Siswa Masih Kosong'}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-1 max-w-[220px] leading-relaxed">
                                    {effectiveRoom === 'guru' 
                                        ? 'Belum ada obrolan dewan guru. Awali koordinasi di sini.' 
                                        : 'Belum ada obrolan siswa. Jadilah yang pertama menyapa teman-teman.'}
                                </p>
                            </div>
                        ) : (
                            displayMessages.map((msg) => (
                                <ChatMessageItem
                                    key={msg.id}
                                    msg={msg}
                                    currentUserId={student.id || student.NISN}
                                    currentStudent={student}
                                    senderMap={senderMap}
                                />
                            ))
                        )}
                    </div>

                    {/* Input Form */}
                    <ChatInputForm
                        isChatLockedForUser={isChatLockedForUser}
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        handleSend={handleSend}
                        effectiveRoom={effectiveRoom}
                        showEmoji={showEmoji}
                        setShowEmoji={setShowEmoji}
                        onEmojiClick={onEmojiClick}
                    />
                </div>
            )}
        </div>
    );
}
