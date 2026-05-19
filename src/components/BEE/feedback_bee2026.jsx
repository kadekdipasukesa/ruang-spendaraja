import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const FeedbackBEE2026 = () => {
  const [form, setForm] = useState({
    nama: '',
    instansi: '',
    jabatan: '',
    komentar: ''
  });

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    const { data } = await supabase
      .from('feedback_bee2026')
      .select('*')
      .order('created_at', { ascending: false });

    setFeedbacks(data || []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.nama || !form.komentar) return;

    setLoading(true);

    const { error } = await supabase
      .from('feedback_bee2026')
      .insert([form]);

    if (!error) {
      setForm({ nama: '', instansi: '', jabatan: '', komentar: '' });
      fetchFeedback();
    }

    setLoading(false);
  };

  return (
    <motion.section className="max-w-4xl mx-auto mt-24 space-y-10">

      {/* FORM */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] border border-slate-100 relative overflow-hidden">

        <div className="relative z-10 space-y-4">

          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
            <MessageSquare className="text-amber-500" />
            Feedback & Masukan
          </h2>

          <p className="text-slate-500 text-sm">
            Berikan saran, kritik, atau masukan untuk BEE 2026
          </p>

          {/* INPUT */}
          <input
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Nama"
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-400 outline-none"
          />

          <input
            name="instansi"
            value={form.instansi}
            onChange={handleChange}
            placeholder="Instansi / Asal Sekolah"
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-400 outline-none"
          />

          <select
            name="jabatan"
            value={form.jabatan}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-400 outline-none"
          >
            <option value="">Pilih Jabatan</option>
            <option value="Guru">Guru</option>
            <option value="Siswa">Siswa</option>
            <option value="Orang Tua">Orang Tua</option>
            <option value="Lainnya">Lainnya</option>
          </select>

          <textarea
            name="komentar"
            value={form.komentar}
            onChange={handleChange}
            placeholder="Tulis komentar / masukan..."
            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 h-24 focus:border-amber-400 outline-none"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 text-black font-black px-6 py-3 rounded-2xl transition shadow-md"
          >
            {loading ? 'Mengirim...' : 'Kirim Feedback'}
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-5">

  {feedbacks.map((item) => (
    <div
      key={item.id}
      className="group bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.12)] hover:shadow-[0_15px_40px_-20px_rgba(0,0,0,0.18)] transition-all duration-300"
    >

      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          {/* Avatar inisial */}
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm">
            {item.nama?.charAt(0)}
          </div>

          <div>
            <h4 className="text-slate-900 font-bold leading-tight">
              {item.nama}
            </h4>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <p className="text-xs text-slate-500">
                {item.instansi}
              </p>

              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                {item.jabatan}
              </span>
            </div>
          </div>

        </div>

        {/* TIME */}
        <span className="text-[10px] text-slate-400 whitespace-nowrap">
          {new Date(item.created_at).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>

      </div>

      {/* COMMENT */}
      <p className="text-slate-700 mt-4 leading-relaxed text-sm pl-1 border-l-2 border-amber-200 group-hover:border-amber-400 transition-all">
        {item.komentar}
      </p>

    </div>
  ))}

</div>
    </motion.section>
  );
};

export default FeedbackBEE2026;