import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Users, MapPin } from 'lucide-react';

/**
 * Modal Detail Statistik Pengguna Online
 * Dirender via createPortal langsung ke document.body dengan z-[99999]
 * agar selalu berada di posisi paling depan di atas seluruh elemen layar.
 */
export default function ModalDetailStatistik({ isOpen, onClose, onlineUsers = [], onlineCount }) {
    // Kunci scroll body saat modal terbuka
    useEffect(() => {
        if (!isOpen) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose?.();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const totalUsers = onlineCount ?? onlineUsers.length;

    const modalContent = (
        <div 
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div 
                className="bg-slate-900 border border-emerald-500/30 w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="p-4 sm:p-5 border-b border-emerald-500/20 flex justify-between items-center bg-emerald-500/5 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                            <Users size={16} />
                        </div>
                        <div>
                            <h3 className="font-bold text-emerald-400 text-sm leading-tight">Detail Pengguna Online</h3>
                            <p className="text-[10px] text-slate-400">
                                {totalUsers} pengguna aktif saat ini
                            </p>
                        </div>
                    </div>
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="text-slate-400 p-1.5 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                        title="Tutup"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body / Daftar Pengguna Online */}
                <div className="overflow-y-auto p-3 sm:p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
                    {onlineUsers.length === 0 ? (
                        <div className="py-8 text-center text-slate-500 text-xs">
                            Tidak ada pengguna online lainnya saat ini
                        </div>
                    ) : (
                        onlineUsers.map((u, index) => (
                            <div 
                                key={u.key || index} 
                                className="flex justify-between items-center p-2.5 sm:p-3 hover:bg-emerald-500/5 rounded-2xl border border-slate-800/60 transition-all"
                            >
                                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-[11px] font-bold text-emerald-400 border border-emerald-500/20 uppercase shrink-0">
                                        {u.nama ? u.nama.charAt(0) : '?'}
                                    </div>
                                    <div className="flex flex-col text-left truncate">
                                        <span className="text-xs font-semibold text-slate-200 truncate">{u.nama}</span>
                                        <span className="text-[9px] text-emerald-400/70 font-medium flex items-center gap-1 truncate mt-0.5">
                                            <MapPin size={10} className="shrink-0" />
                                            <span className="truncate">{u.posisi || 'Beranda'}</span>
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[9px] px-2 py-1 bg-slate-800 text-emerald-400 rounded-lg border border-emerald-500/20 font-bold shrink-0">
                                    {u.kelas || 'N/A'}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-3 bg-slate-950/40 border-t border-slate-800/60 text-center shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
