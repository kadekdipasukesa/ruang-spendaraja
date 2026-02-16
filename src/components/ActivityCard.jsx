import React from 'react';
import { MessageSquare, Trophy, User, Check, Trash2, UserCircle2 } from 'lucide-react';

export default function ActivityCard({ post, student, onApprove, onDelete }) {
    const isAchievement = post.category === 'pencapaian';
    const isMine = student && student.id === post.student_id;

    return (
        <div className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 w-full ${
            isAchievement
                ? 'bg-gradient-to-br from-amber-500/20 via-slate-900/60 to-slate-900/60 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                : isMine 
                    ? 'bg-blue-600/10 border-blue-500/30'
                    : 'bg-slate-900/40 border-white/5 hover:border-white/10'
        }`}>

            <div className={`flex flex-col ${isMine ? 'items-end text-right' : 'items-start text-left'}`}>
                
                {/* HEADER: INFO USER */}
                <div className={`flex items-center gap-3 mb-4 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* AVATAR: Tetap Piala jika Pencapaian */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shrink-0 ${
                        isAchievement
                            ? 'bg-gradient-to-tr from-amber-600 to-yellow-400 rotate-3 ring-2 ring-amber-500/20'
                            : isMine
                                ? 'bg-blue-600' 
                                : 'bg-slate-800 border border-white/5'
                        }`}>
                        {isAchievement ? <Trophy size={20} /> : isMine ? <UserCircle2 size={20} /> : <User size={20} />}
                    </div>

                    <div>
                        <div className={`flex items-center gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                            <h4 className={`font-bold text-sm tracking-wide ${
                                isAchievement ? 'text-amber-400' : isMine ? 'text-blue-400' : 'text-white'
                            }`}>
                                {isMine ? 'Anda' : post.NAMA}
                            </h4>
                            
                            {post.status === 'pending' && (
                                <span className="text-[9px] px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded-md border border-amber-500/20 animate-pulse font-medium">
                                    Menunggu
                                </span>
                            )}
                        </div>
                        
                        <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-0.5">
                            {isMine ? (
                                <>
                                    {new Date(post.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • <span>Kelas {post.Kelas}</span>
                                </>
                            ) : (
                                <>
                                    <span>Kelas {post.Kelas}</span> • {new Date(post.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="relative z-10 w-full">
                    <p className={`text-sm leading-relaxed ${
                        isAchievement ? 'text-amber-50/90 font-medium' : isMine ? 'text-slate-200' : 'text-slate-400'
                    }`}>
                        {post.content}
                    </p>
                </div>

                {/* ADMIN ACTIONS */}
                {student?.role === 'admin' && post.status === 'pending' && (
                    <div className="mt-4 flex gap-2 w-full pt-4 border-t border-white/10 relative z-20">
                        <button onClick={() => onApprove(post.id)} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white text-xs font-bold py-2.5 rounded-xl transition-all border border-emerald-600/30">
                            <Check size={14} /> Setujui
                        </button>
                        <button onClick={() => onDelete(post.id)} className="flex-1 flex items-center justify-center gap-2 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-bold py-2.5 rounded-xl transition-all border border-rose-600/30">
                            <Trash2 size={14} /> Tolak
                        </button>
                    </div>
                )}

                {/* FOOTER */}
                <div className={`mt-4 pt-4 border-t ${isAchievement ? 'border-amber-500/10' : 'border-white/5'} w-full flex items-center ${isMine ? 'justify-end' : 'justify-start'} text-slate-500`}>
                    <div className={`flex items-center gap-1.5 text-[11px] hover:text-white cursor-pointer transition-colors font-medium ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isAchievement ? 'bg-amber-500 animate-ping' : isMine ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                        <span className={isAchievement ? 'text-amber-500/80' : ''}>
                            {isAchievement ? 'Beri Selamat' : isMine ? 'Postingan Anda' : 'Balas Postingan'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}