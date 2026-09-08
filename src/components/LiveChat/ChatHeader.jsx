import React from 'react';
import { X, Trash2, Lock, Unlock, Users, GraduationCap } from 'lucide-react';
import { CLASSES } from './chatHelpers';

export default function ChatHeader({
    effectiveRoom,
    isUserAdmin,
    onSwitchRoom,
    onDeleteAllInRoom,
    onClose,
    selectedClass,
    setSelectedClass,
    allLockStatuses,
    onToggleLock,
    onlineCount = 0,
    onOpenStats
}) {
    return (
        <div className="p-3 bg-slate-800 border-b border-slate-700">
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-white tracking-wide">Live Chat</h3>
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenStats?.();
                            }}
                            title="Lihat Detail Statistik Pengguna Online"
                            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 hover:bg-emerald-500/25 active:scale-95 px-1.5 py-0.5 rounded-full border border-emerald-500/30 transition-all cursor-pointer shadow-xs"
                        >
                            <Users size={12} />
                            <span>{onlineCount}</span>
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400">
                        {effectiveRoom === 'guru' ? 'Diskusi Guru' : 'Obrolan Siswa'}
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    {isUserAdmin && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteAllInRoom?.();
                            }}
                            title={`Hapus riwayat ${effectiveRoom === 'guru' ? 'Ruang Guru' : 'Ruang Siswa'}`}
                            className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer active:scale-95"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        title="Tutup Chat"
                        className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* TAB NAVIGASI RUANG: Khusus Admin dapat beralih kamar */}
            {isUserAdmin && (
                <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-700/60 mt-2 shadow-inner">
                    <button
                        type="button"
                        onClick={() => onSwitchRoom('siswa')}
                        className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            effectiveRoom === 'siswa'
                                ? 'bg-blue-600 text-white shadow'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                    >
                        <Users size={13} />
                        <span>Ruang Siswa</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onSwitchRoom('guru')}
                        className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            effectiveRoom === 'guru'
                                ? 'bg-amber-600 text-white shadow'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`}
                    >
                        <GraduationCap size={14} />
                        <span>Ruang Guru</span>
                    </button>
                </div>
            )}

            {/* Admin Control: Kunci Chat Siswa per Kelas */}
            {isUserAdmin && effectiveRoom === 'siswa' && (
                <div className="bg-slate-900/60 p-1.5 rounded-xl border border-slate-700/50 mt-1.5">
                    <div className="flex gap-2 items-center">
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">Kunci:</span>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-0.5 text-xs text-white outline-none"
                        >
                            {CLASSES.map(c => (
                                <option key={c} value={c}>
                                    {c} {allLockStatuses[c] ? '🔒' : '🔓'}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={onToggleLock}
                            title={allLockStatuses[selectedClass] ? 'Buka Kunci' : 'Kunci Chat Kelas Ini'}
                            className={`px-2 py-0.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                allLockStatuses[selectedClass] ? 'bg-red-600' : 'bg-emerald-600'
                            } text-white`}
                        >
                            {allLockStatuses[selectedClass] ? <Lock size={13} /> : <Unlock size={13} />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
