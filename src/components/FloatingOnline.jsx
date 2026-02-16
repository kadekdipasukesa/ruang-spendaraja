import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function FloatingOnline({ user, activeTab }) {
    const [onlineCount, setOnlineCount] = useState(0);
    const [onlineUsers, setOnlineUsers] = useState([]); // Simpan list user di sini
    const [isOpen, setIsOpen] = useState(false);
    const [showDetail, setShowDetail] = useState(false); // State untuk modal detail

    useEffect(() => {
        // 1. Identifikasi
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
                    // 2. Track dengan tambahan data 'posisi'
                    await channel.track({
                        nama: identifier,
                        kelas: isUserReady ? user.Kelas : 'N/A',
                        posisi: activeTab, // <-- Melaporkan tab yang sedang dibuka
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            channel.unsubscribe();
        };
        // 3. Efek ini akan jalan ulang setiap kali user login atau pindah Tab!
    }, [user?.NAMA, activeTab]);

    // Tambahkan useEffect baru ini di dalam FloatingOnline.jsx
    useEffect(() => {
        if (showDetail) {
            // Kunci scroll body
            document.body.style.overflow = 'hidden';
        } else {
            // Buka kunci scroll body
            document.body.style.overflow = 'unset';
        }

        // Cleanup: Pastikan scroll terbuka lagi kalau komponen ini hancur
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [user?.NAMA, activeTab]); // <--- activeTab di sini sangat penting!

    return (
        <>
            {/* Jendela Mengambang Kanan */}
            <div
                className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ease-in-out flex items-center ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-12px)]'
                    }`}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                <div className="w-3 h-20 bg-emerald-500 rounded-l-md cursor-pointer flex flex-col items-center justify-center gap-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>

                <div className="bg-slate-900 border border-emerald-500/30 p-4 rounded-l-xl shadow-2xl min-w-[100px] text-center">
                    <div className="relative flex h-3 w-3 mx-auto mb-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </div>
                    <div className="text-2xl font-black text-emerald-400 leading-none">{onlineCount}</div>
                    <div className="text-[10px] uppercase text-emerald-500/70 font-bold mb-2">Online</div>

                    <button
                        onClick={() => setShowDetail(true)}
                        className="text-[10px] text-white bg-emerald-600 hover:bg-emerald-500 px-2 py-1 rounded-md transition-colors"
                    >
                        Detail
                    </button>
                </div>
            </div>

            {/* Jendela Modal Detail (Muncul di tengah kalau diklik) */}
            {showDetail && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-emerald-500/40 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-emerald-500/20 flex justify-between items-center bg-emerald-500/5">
                            <h3 className="font-bold text-emerald-400">User yang Online</h3>
                            <button onClick={() => setShowDetail(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>

                        <div className="max-h-64 overflow-y-auto p-2 custom-scrollbar">
                            {onlineUsers.map((u, index) => (
                                <div key={index} className="flex justify-between items-center p-3 hover:bg-emerald-500/10 rounded-lg transition-colors border-b border-slate-800 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-200">{u.nama}</span>
                                            {/* Label Lokasi Kecil */}
                                            <span className="text-[9px] text-emerald-500/60 font-medium uppercase tracking-tighter">
                                                📍 Sedang di: {u.posisi || 'Beranda'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] px-2 py-1 bg-slate-800 text-emerald-400 rounded-md border border-emerald-500/20 font-bold">
                                        {u.kelas}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="p-3 text-center bg-slate-800/50">
                            <p className="text-[10px] text-slate-500">Total: {onlineCount} User Aktif</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}