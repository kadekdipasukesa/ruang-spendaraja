import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Link, FileText, HelpCircle, Video } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export default function ModalInputTugas({ onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [tipeKonten, setTipeKonten] = useState('link'); // link, esai, quiz
  
  const [formData, setFormData] = useState({
    judul: '',
    mapel: '',
    guru_nama: '',
    deadline: '',
    target_kelas: 'Semua',
    deskripsi: '',
    link_materi: ''
  });

  // State khusus untuk Quiz
  const [quizData, setQuizData] = useState([
    { question: '', options: ['', '', '', ''], answer: 0 }
  ]);

  const handleAddQuestion = () => {
    setQuizData([...quizData, { question: '', options: ['', '', '', ''], answer: 0 }]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      tipe_konten: tipeKonten,
      metadata: tipeKonten === 'quiz' ? { questions: quizData } : {}
    };

    const { error } = await supabase.from('assignments').insert([payload]);

    if (error) {
      alert("Gagal simpan: " + error.message);
    } else {
      alert("Tugas berhasil dipublikasikan!");
      onRefresh(); // Untuk fetch ulang data di Home
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1e293b] border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#1e293b] p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Buat Tugas Baru</h2>
            <p className="text-xs text-slate-400">Isi detail tugas untuk siswa</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Baris 1: Judul & Mapel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 ml-1">JUDUL TUGAS</label>
              <input required className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 focus:border-blue-500 outline-none" 
                placeholder="Contoh: Latihan Aljabar"
                value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 ml-1">MATA PELAJARAN</label>
              <input required className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 focus:border-blue-500 outline-none" 
                placeholder="MTK, IPA, dll"
                value={formData.mapel} onChange={e => setFormData({...formData, mapel: e.target.value})} />
            </div>
          </div>

          {/* Baris 2: Guru & Target Kelas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 ml-1">NAMA GURU</label>
              <input required className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 focus:border-blue-500 outline-none" 
                value={formData.guru_nama} onChange={e => setFormData({...formData, guru_nama: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 ml-1">TARGET KELAS</label>
              <select className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 focus:border-blue-500 outline-none"
                value={formData.target_kelas} onChange={e => setFormData({...formData, target_kelas: e.target.value})}>
                <option value="Semua">Semua Kelas</option>
                <option value="9A">Kelas 9A</option>
                <option value="9B">Kelas 9B</option>
                {/* Tambahkan kelas lain sesuai kebutuhan */}
              </select>
            </div>
          </div>

          {/* Baris 3: Deadline */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 ml-1">BATAS PENGUMPULAN (DEADLINE)</label>
            <input required type="datetime-local" className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 focus:border-blue-500 outline-none" 
              value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
          </div>

          {/* PILIH TIPE KONTEN */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 ml-1">TIPE PENGERJAAN</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'link', icon: Link, label: 'Link/Video' },
                { id: 'esai', icon: FileText, label: 'Esai' },
                { id: 'quiz', icon: HelpCircle, label: 'Quiz' },
              ].map((t) => (
                <button key={t.id} type="button" 
                  onClick={() => setTipeKonten(t.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${tipeKonten === t.id ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-[#0f172a] border-slate-700 text-slate-500 hover:border-slate-500'}`}>
                  <t.icon size={20} />
                  <span className="text-[10px] font-bold uppercase">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* INPUT DINAMIS BERDASARKAN TIPE */}
          <div className="p-4 bg-[#0f172a] rounded-2xl border border-slate-700">
            {tipeKonten === 'link' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <Video size={16} /> <span className="text-sm font-bold">Link Materi / YouTube</span>
                </div>
                <input className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-2.5 outline-none" 
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.link_materi} onChange={e => setFormData({...formData, link_materi: e.target.value})} />
                <textarea className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-2.5 outline-none" rows="3"
                  placeholder="Instruksi pengerjaan..."
                  value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} />
              </div>
            )}

            {tipeKonten === 'esai' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <FileText size={16} /> <span className="text-sm font-bold">Instruksi Esai</span>
                </div>
                <textarea required className="w-full bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-2.5 outline-none" rows="5"
                  placeholder="Tuliskan soal atau instruksi esai di sini..."
                  value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} />
              </div>
            )}

            {tipeKonten === 'quiz' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-amber-400 mb-2">
                  <div className="flex items-center gap-2">
                    <HelpCircle size={16} /> <span className="text-sm font-bold">Pertanyaan Quiz</span>
                  </div>
                  <button type="button" onClick={handleAddQuestion} className="text-[10px] bg-amber-500/20 px-3 py-1 rounded-lg hover:bg-amber-500/40 transition-colors">
                    + Tambah Soal
                  </button>
                </div>
                {quizData.map((q, idx) => (
                  <div key={idx} className="p-4 bg-[#1e293b] rounded-xl border border-slate-700 space-y-3">
                    <input className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm" 
                      placeholder={`Soal No. ${idx + 1}`} 
                      value={q.question} onChange={(e) => {
                        const newQuiz = [...quizData];
                        newQuiz[idx].question = e.target.value;
                        setQuizData(newQuiz);
                      }} />
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => (
                        <input key={optIdx} className="bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-1.5 text-xs" 
                          placeholder={`Opsi ${String.fromCharCode(65 + optIdx)}`} 
                          value={opt} onChange={(e) => {
                            const newQuiz = [...quizData];
                            newQuiz[idx].options[optIdx] = e.target.value;
                            setQuizData(newQuiz);
                          }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tombol Submit */}
          <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2">
            <Save size={18} />
            {loading ? 'Menyimpan...' : 'Publikasikan Tugas'}
          </button>
        </form>
      </div>
    </div>
  );
}