import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send } from 'lucide-react';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }} // Muncul saat scroll sampai sini
      className="bg-slate-900 p-8 rounded-3xl border border-white/5 shadow-inner"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3.5 bg-blue-600/10 rounded-2xl text-blue-400">
          <MessageSquare size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black italic mb-0.5">Papan Saran & Komentar</h3>
          <p className="text-slate-500 text-xs font-medium">Bantu kami meningkatkan Ruang Spenda Raja dengan saranmu.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <textarea 
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tuliskan ide, keluhan, atau saranmu di sini..."
          className="flex-grow bg-slate-950 p-5 rounded-2xl border border-white/10 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition resize-none h-24 md:h-20"
        />
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="w-full md:w-auto h-12 md:h-20 md:w-20 rounded-2xl bg-amber-500 text-slate-900 font-black flex items-center justify-center gap-2 md:flex-col md:gap-1 shadow-lg shadow-amber-500/20 active:bg-amber-400"
          onClick={() => {
            alert('Terima kasih! Saranmu telah dikirim.');
            setFeedback('');
          }}
        >
          <Send size={18} />
          <span className="text-xs uppercase tracking-wider md:text-[9px]">Kirim</span>
        </motion.button>
      </div>
    </motion.section>
  );
};

export default FeedbackForm;