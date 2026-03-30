import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import LiveChat from './LiveChat'; // Pastikan path file benar
import { MessageCircle } from 'lucide-react';

export default function FloatingOnline({ user, activeTab }) {
    const [onlineCount, setOnlineCount] = useState(0);
    const [onlineUsers, setOnlineUsers] = useState([]); 
    const [isOpen, setIsOpen] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    
    // State tambahan untuk memicu tombol chat dari luar
    const [triggerChat, setTriggerChat] = useState(false);

    // --- TAMBAHKAN STATE UNTUK NOTIFIKASI DI SINI ---
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const isUserReady = user && user.NAMA;
        const identifier = isUserReady ? user.NAMA : `Tamu-${Math.floor(Math.random() * 1000)}`;

        const channel = supabase.channel('online_room', {
            config: { presence: { key: identifier } },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                setOnlineCount(Object.keys(state).length);
                setOnlineUsers(Object.values(state).flat());
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        nama: identifier,
                        kelas: isUserReady ? user.Kelas : 'N/A',
                        posisi: activeTab, 
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return () => { channel.unsubscribe(); };
    }, [user?.NAMA, activeTab]);

    return (
        <>
            {/* Overlay Gelap saat panel terbuka di HP */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[45] md:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Jendela Mengambang Samping */}
            <div
                className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center 
                ${isOpen 
                    ? 'translate-x-0 w-[85%] md:w-auto' 
                    : 'translate-x-[calc(100%-12px)] w-auto' 
                }`}
            >
                {/* HANDLE */}
                <div 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-4 h-24 bg-emerald-500 rounded-l-xl cursor-pointer flex flex-col items-center justify-center gap-1 shadow-[-4px_0_15px_rgba(16,185,129,0.4)] relative"
                >
                    {/* Badge Notif Kecil saat panel tertutup */}
                    {!isOpen && unreadCount > 0 && (
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full border border-slate-900 animate-pulse" />
                    )}
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>

                {/* PANEL UTAMA */}
                <div className="bg-slate-900 border-l border-y border-emerald-500/50 p-5 rounded-l-3xl shadow-2xl flex-1 md:flex-none md:min-w-[140px] text-center backdrop-blur-xl h-auto flex flex-col items-center justify-center">
                    
                    <div className="relative flex h-4 w-4 mx-auto mb-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900"></span>
                    </div>

                    <div className="text-4xl font-black text-emerald-400 leading-none mb-1 tabular-nums">
                        {onlineCount}
                    </div>
                    <div className="text-[10px] uppercase text-emerald-500/70 font-black mb-5 tracking-[0.2em]">
                        Online
                    </div>

                    {/* GRUP TOMBOL */}
                    <div className="flex flex-col gap-2 w-full">
                        <button
                            onClick={() => { setShowDetail(true); setIsOpen(false); }}
                            className="w-full text-[10px] font-bold text-white bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl border border-emerald-500/20 transition-all active:scale-95"
                        >
                            STATISTIK
                        </button>

                        {/* TOMBOL CHAT BARU */}
                        <button
                            onClick={() => {
                                setTriggerChat(true); // Memicu LiveChat untuk terbuka
                                setIsOpen(false);     // Menutup panel online
                            }}
                            className="w-full text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-500 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all active:scale-95 relative"
                        >
                            <MessageCircle size={14} />
                            LIVE CHAT

                            {/* ANGKA NOTIFIKASI MERAH */}
                            {unreadCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>

                    <button 
                        onClick={() => setIsOpen(false)}
                        className="mt-4 text-[9px] text-slate-500 font-bold uppercase md:hidden tracking-widest"
                    >
                        Tutup
                    </button>
                </div>
            </div>

            {/* Modal Detail Statistik */}
            {showDetail && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-slate-900 border border-emerald-500/30 w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-5 border-b border-emerald-500/20 flex justify-between items-center bg-emerald-500/5">
                            <h3 className="font-bold text-emerald-400 text-sm">User Online</h3>
                            <button onClick={() => setShowDetail(false)} className="text-slate-400 p-2 hover:text-white">✕</button>
                        </div>
                        <div className="max-h-80 overflow-y-auto p-2 scrollbar-hide">
                            {onlineUsers.map((u, index) => (
                                <div key={index} className="flex justify-between items-center p-3 hover:bg-emerald-500/5 rounded-2xl border-b border-slate-800/50 last:border-0 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-[10px] font-bold text-emerald-500 border border-emerald-500/20 uppercase">
                                            {u.nama?.charAt(0)}
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-xs font-semibold text-slate-200">{u.nama}</span>
                                            <span className="text-[8px] text-emerald-500/60 font-medium">📍 {u.posisi || 'Beranda'}</span>
                                        </div>
                                    </div>
                                    <span className="text-[9px] px-2 py-1 bg-slate-800 text-emerald-400 rounded-lg border border-emerald-500/20 font-bold">
                                        {u.kelas}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* RENDER LIVE CHAT */}
            {/* HUBUNGKAN setUnreadExternal dengan setUnreadCount agar fungsi terdeteksi */}
            <LiveChat 
                student={user} 
                externalTrigger={triggerChat} 
                setExternalTrigger={setTriggerChat} 
                setUnreadExternal={setUnreadCount} 
            />
        </>
    );
}