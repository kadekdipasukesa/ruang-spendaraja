import React, { useState } from 'react';
import { X, Send, PlayCircle, FileText, CheckCircle2, Clock, User } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function ModalDetailTugas({ tugas, student, onClose }) {
  const [jawaban, setJawaban] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Ambil ID Video jika ada
  const videoId = tugas.link_materi?.includes('youtube.com') 
    ? tugas.link_materi.split('v=')[1]?.split('&')[0] 
    : null;

  const handleSubmit = async () => {
    // BARIS TAMBAHAN UNTUK CEK DATA DI CONSOLE
    console.log("Data Siswa saat ini:", student);

    setLoading(true);
    const { error } = await supabase.from('submissions').insert([{
      tugas_id: tugas.id,
      student_id: student.id || student.Nama, // Menyesuaikan data student kamu
      nama: student.Nama,
      no_absen: student.Absen,
      kelas: student.Kelas,
      jawaban: jawaban,
      status: 'Selesai'
    }]);

    if (!error) {
      setIsDone(true);
      setTimeout(onClose, 2000);
    } else {
      alert("Gagal mengirim: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-[#1e293b] border border-slate-700 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95">
        
        {/* Header Gambar/Video */}
        {videoId ? (
          <div className="aspect-video w-full bg-black">
            <iframe 
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex items-end">
            <h2 className="text-2xl font-bold text-white">{tugas.judul}</h2>
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-400 border-b border-slate-700/50 pb-4">
            <div className="flex items-center gap-1.5"><User size={14}/> {tugas.guru_nama}</div>
            <div className="flex items-center gap-1.5"><Clock size={14}/> Batas: {new Date(tugas.deadline).toLocaleString('id-ID')}</div>
            <div className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded uppercase font-bold">{tugas.tipe_konten}</div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Instruksi:</h4>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{tugas.deskripsi}</p>
          </div>

          {/* Area Pengerjaan */}
          {!isDone ? (
            <div className="pt-4 space-y-3">
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Jawaban Kamu:</h4>
              
              {tugas.tipe_konten === 'link' && (
                <input 
                  type="url"
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Tempel link tugas (Google Drive/YouTube) di sini..."
                  value={jawaban} onChange={(e) => setJawaban(e.target.value)}
                />
              )}

              {tugas.tipe_konten === 'esai' && (
                <textarea 
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 min-h-[120px]"
                  placeholder="Ketik jawaban kamu di sini..."
                  value={jawaban} onChange={(e) => setJawaban(e.target.value)}
                />
              )}

              {/* Tombol Aksi */}
              <div className="flex gap-3 pt-2">
                <button onClick={onClose} className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold transition-all text-slate-300">
                  Batal
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading || !jawaban}
                  className="flex-[2] bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-white shadow-lg shadow-blue-500/20"
                >
                  <Send size={18} /> {loading ? 'Mengirim...' : 'Kirim Jawaban'}
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-2 animate-in fade-in zoom-in">
              <div className="bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-emerald-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">Berhasil Terkirim!</h3>
              <p className="text-slate-400 text-sm">Tugas kamu sudah masuk ke database guru.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}