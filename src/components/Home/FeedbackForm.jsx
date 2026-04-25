import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, CornerDownRight, User, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { filterBadWords } from '../../utils/bannedWordsPool';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user_siswa'));

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    // Ambil data tanpa limit dulu agar bisa menyusun thread balasan dengan benar
    const { data } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: true }); // Ascending agar urutan thread benar
    setComments(data || []);
  };

  const handleSubmit = async () => {
    if (!user) return alert('Silahkan login terlebih dahulu!');
    if (!feedback.trim()) return;

    setLoading(true);
    const cleanText = filterBadWords(feedback);

    const { error } = await supabase.from('feedback').insert([{
      nama: user.NAMA,
      kelas: user.Kelas,
      komentar: cleanText,
      parent_id: replyTo?.id || null
    }]);

    if (!error) {
      setFeedback('');
      setReplyTo(null);
      fetchComments();
    } else {
      console.error("Error insert:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    // 1. Simpan backup komentar sebelum dihapus (untuk rollback jika gagal)
    const previousComments = [...comments];

    // 2. Optimistic Update: Langsung hapus dari layar tanpa nunggu database
    setComments(comments.filter(c => c.id !== id));

    // 3. Jalankan perintah hapus ke Supabase
    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', id);

    if (error) {
      // 4. Jika gagal, kembalikan komentar yang tadi dihapus (Rollback)
      setComments(previousComments);
      console.error('Gagal menghapus:', error.message);
      alert('Gagal menghapus data dari server.');
    }
  };

  // LOGIKA MENYUSUN THREAD: Memisahkan komentar utama dan balasannya
  const [visibleCount, setVisibleCount] = useState(3)
  // Filter semua komentar utama (tanpa parent_id)
  const allMainComments = comments.filter(c => !c.parent_id).reverse();

  // Ambil komentar utama sesuai jumlah visibleCount
  const mainComments = allMainComments.slice(0, visibleCount);

  // Fungsi cek apakah masih ada komentar yang tersembunyi
  const hasMore = allMainComments.length > visibleCount;

  // const mainComments = comments.filter(c => !c.parent_id).reverse().slice(0, 3);
  const getReplies = (parentId) => comments.filter(c => c.parent_id === parentId);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="w-full mt-20 space-y-12"
    >

      {/* FORM INPUT - SLIM VERSION */}
      <div className="relative overflow-hidden bg-black/90 border border-white/5 p-6 md:p-8 rounded-[2.5rem] mb-12 backdrop-blur-3xl group text-left transition-all duration-500 shadow-[0_0_50px_-20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_60px_-15px_rgba(245,158,11,0.5)] hover:border-amber-500/30">

        {/* Glow tetap sama */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-amber-600/20 to-transparent opacity-60 blur-[100px] -z-10 transition-opacity duration-700 group-hover:opacity-100" />

        <div className="relative z-10">
          {/* Header dibuat lebih kecil (mb-8 jadi mb-5) */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 bg-slate-950/80 shadow-lg text-amber-500">
              <MessageSquare size={20} strokeWidth={2.5} className="drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            </div>
            <h3 className="text-lg md:text-xl font-black italic uppercase text-white/90 tracking-tighter leading-none">Masukan dan Saran</h3>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Textarea h-32 jadi h-20 agar lebih slim */}
            <textarea
              disabled={!user}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={user ? (replyTo ? `Balas saran dari ${replyTo.nama}...` : "Tuliskan ide atau saranmu...") : "Akses Terkunci. Silahkan login."}
              className="flex-grow bg-slate-950/50 p-4 px-6 rounded-2xl border border-white/10 text-sm focus:border-amber-500/50 focus:ring-0 outline-none transition-all resize-none h-20 text-white placeholder:text-slate-700 font-medium"
            />

            {/* Button disesuaikan ukurannya agar pas dengan textarea h-20 */}
            <motion.button
              whileHover={user ? { scale: 1.02, y: -2 } : {}}
              whileTap={user ? { scale: 0.98 } : {}}
              onClick={handleSubmit}
              disabled={loading || !user}
              className={`w-full md:w-28 rounded-2xl font-black flex md:flex-col items-center justify-center gap-2 transition-all duration-500
          ${user ? 'bg-amber-500 text-black shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)] hover:bg-amber-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'}`}
            >
              <Send size={18} />
              <span className="text-[9px] font-black uppercase tracking-widest">{loading ? '...' : 'Kirim'}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* LIST KOMENTAR TERSTRUKTUR - Jarak antar grup dipersempit */}
      {/* LIST KOMENTAR TERSTRUKTUR */}
      <div className="space-y-1 md:space-y-3">
        <AnimatePresence mode="popLayout">
          {mainComments.map((item, index) => (
            <div key={item.id} className="space-y-2 md:space-y-3">
              <CommentItem
                item={item}
                index={index}
                user={user}
                onDelete={handleDelete}
                onReply={setReplyTo}
                // Tambahkan Props Baru:
                activeReplyId={replyTo?.id}
                feedback={feedback}
                setFeedback={setFeedback}
                onSubmit={handleSubmit}
                loading={loading}
              />

              <div className="ml-6 md:ml-12 space-y-1 border-l border-white/5 pl-4 md:pl-6">
                {getReplies(item.id).map((reply, rIndex) => (
                  <CommentItem
                    key={reply.id}
                    item={reply}
                    index={rIndex}
                    user={user}
                    onDelete={handleDelete}
                    isReply={true}
                  />
                ))}
              </div>
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* TOMBOL SHOW MORE */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center pt-4"
        >
          <button
            onClick={() => setVisibleCount(prev => prev + 5)} // Tambah 5 komentar setiap klik
            className="group relative px-8 py-3 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-amber-500/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-amber-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-amber-500 transition-colors">
              Tampilkan Lebih Banyak ({allMainComments.length - visibleCount} lagi)
            </span>
          </button>
        </motion.div>
      )}
    </motion.section>
  );
};

// Komponen Kecil untuk Baris Komentar agar rapi
const CommentItem = ({
  item, index, user, onDelete, onReply, isReply = false,
  activeReplyId, feedback, setFeedback, onSubmit, loading
}) => (
  <motion.div
    initial={{ opacity: 0, x: isReply ? 10 : (index % 2 === 0 ? -10 : 10) }}
    whileInView={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, scale: 0.98 }}
    className={`relative p-4 md:p-5 rounded-2xl md:rounded-[2rem] border backdrop-blur-xl transition-all duration-500
      ${isReply ? 'bg-blue-500/5 border-blue-500/10 shadow-sm' : 'bg-black/40 border-white/5 shadow-md'}`}
  >
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${isReply ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-slate-800 border-white/5 text-slate-400'
          }`}>
          {isReply ? <CornerDownRight size={14} /> : <User size={14} />}
        </div>
        <div>
          <h4 className="text-xs font-black text-white uppercase tracking-tight flex items-center gap-2">
            {item.nama}
            <span className={`text-[8px] px-1.5 py-0.5 rounded border font-black ${isReply ? 'border-blue-500/30 text-blue-400' : 'border-white/10 text-slate-500'
              }`}>
              {item.kelas}
            </span>
          </h4>
          <p className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter">
            {new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {user?.role === 'admin' && (
          <button
            onClick={() => onDelete(item.id)}
            className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
          >
            <Trash2 size={12} />
          </button>
        )}
        {!isReply && user && (
          <button
            onClick={() => onReply(activeReplyId === item.id ? null : item)}
            className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase transition-all ${activeReplyId === item.id
                ? 'bg-rose-500/20 border-rose-500/30 text-rose-500'
                : 'bg-white/5 border-white/5 text-amber-500/60 hover:text-amber-500'
              }`}
          >
            {activeReplyId === item.id ? 'Batal' : 'Balas'}
          </button>
        )}
      </div>
    </div>

    <p className="text-slate-400 text-sm leading-snug font-medium pl-1">{item.komentar}</p>

    {/* INLINE REPLY FORM - Muncul hanya jika sedang membalas komentar ini */}
    <AnimatePresence>
      {activeReplyId === item.id && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-white/5"
        >
          <div className="flex gap-2">
            <textarea
              autoFocus
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={`Tulis balasan untuk ${item.nama}...`}
              className="flex-grow bg-slate-950/50 p-3 rounded-xl border border-white/10 text-xs text-white outline-none focus:border-amber-500/50 resize-none h-16"
            />
            <button
              onClick={onSubmit}
              disabled={loading || !feedback.trim()}
              className="px-4 rounded-xl bg-amber-500 text-black font-black text-[10px] uppercase hover:bg-amber-400 transition-all flex items-center justify-center"
            >
              {loading ? '...' : <Send size={14} />}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default FeedbackForm;