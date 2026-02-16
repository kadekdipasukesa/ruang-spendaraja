import React, { useState } from 'react';
import { Send, MessageCircle, Trophy, LayoutGrid, Plus, X } from 'lucide-react';
import ActivityCard from './ActivityCard';

export default function Feed({ posts, student, onApprove, onDelete, newPost, setNewPost, handlePost }) {
    const [filter, setFilter] = useState('semua');
    const [isExpanded, setIsExpanded] = useState(false); // State untuk buka/tutup form

    // Logika Filter Berdasarkan Kategori
    const filteredPosts = posts.filter(post => {
        if (filter === 'semua') return true;
        return post.category === filter;
    });

    // Wrapper untuk menutup form setelah posting
    const handleSubmit = (e) => {
        handlePost(e);
        setIsExpanded(false); 
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">

            {/* --- 1. FORM INPUT PERTANYAAN (Toggle Mode) --- */}
            {student && (
                <div className="bg-slate-800/40 border border-white/10 p-4 rounded-2xl backdrop-blur-sm shadow-xl transition-all duration-300">
                    {!isExpanded ? (
                        /* Tampilan Tombol Saja (Collapsed) */
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="w-full flex items-center gap-3 p-3 bg-slate-900/50 hover:bg-slate-900/80 border border-white/5 rounded-xl text-slate-400 text-sm transition-all group"
                        >
                            <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                <Plus size={18} className="text-blue-400" />
                            </div>
                            <span>Ada pertanyaan apa hari ini, {student.NAMA?.split(' ')[0]}?</span>
                        </button>
                    ) : (
                        /* Tampilan Form Lengkap (Expanded) */
                        <form onSubmit={handleSubmit} className="animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-500/20 rounded-lg">
                                        <MessageCircle size={16} className="text-blue-400" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-tight">Buat Pertanyaan</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded(false)}
                                    className="p-1 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <textarea
                                autoFocus
                                className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-white placeholder-slate-500 resize-none h-32 text-sm focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all outline-none"
                                placeholder="Tuliskan pertanyaanmu di sini agar teman-teman atau guru bisa membantu..."
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                            />

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded(false)}
                                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-white transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    disabled={!newPost.trim()}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/40 active:scale-95"
                                >
                                    <span>Kirim</span>
                                    <Send size={14} />
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* --- 2. FILTER CATEGORY --- */}
            <div className="flex items-center gap-2 p-1 bg-slate-900/40 border border-white/5 rounded-2xl w-fit mx-auto md:mx-0">
                <button
                    onClick={() => setFilter('semua')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all ${filter === 'semua' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <LayoutGrid size={14} />
                    Semua
                </button>
                <button
                    onClick={() => setFilter('umum')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all ${filter === 'umum' ? 'bg-blue-600/20 text-blue-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <MessageCircle size={14} />
                    Pertanyaan
                </button>
                <button
                    onClick={() => setFilter('pencapaian')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all ${filter === 'pencapaian' ? 'bg-amber-600/20 text-amber-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <Trophy size={14} />
                    Pencapaian
                </button>
            </div>

            {/* --- 3. LIST POSTINGAN --- */}
            <div className="grid gap-4">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <ActivityCard
                            key={post.id}
                            post={post}
                            student={student}      // Penting untuk cek role di dalam kartu
                            onApprove={onApprove}  // Fungsi moderasi
                            onDelete={onDelete}    // Fungsi moderasi
                        />
                    ))
                ) : (
                    <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-white/5">
                        <p className="text-slate-500 text-sm font-medium">Belum ada postingan di kategori ini.</p>
                    </div>
                )}
            </div>
        </div>
    );
}