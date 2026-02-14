import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
// Gunakan ../ untuk keluar dari folder pages, lalu masuk ke folder components
// Jika sebelumnya: import GameKetikCepat from './components/GameKetikCepat';
// Ubah menjadi:
// Gunakan ../ untuk keluar dari folder 'pages' terlebih dahulu
import GameKetikCepat from "../games/Game1_KetikCepat/GameKetikCepat";
import ModalGame from '../components/ModalGame';

// import { Home as HomeIcon, Trophy, FileText, Lock, Send, Sparkles, Megaphone } from 'lucide-react'
// import { Home as HomeIcon, Megaphone, FileText, Trophy, Lock, Gamepad2 } from 'lucide-react';
// Pastikan semua icon yang kita pakai di Playground ada di sini
import {
  Home as HomeIcon,
  Megaphone,
  FileText,
  Trophy,
  Lock,
  Unlock,
  Gamepad2,
  Keyboard,
  Target,
  ChevronRight,
  X,
  Send // <--- Tambahkan ini
} from 'lucide-react';
import Hero from '../components/Hero'

export default function Home() {
  // --- 1. STATE ---
  const [student, setStudent] = useState(null)
  const [activeTab, setActiveTab] = useState('beranda')
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')

  // Tambahkan baris ini di bagian atas fungsi Home
  const [showGameKetik, setShowGameKetik] = useState(false);
  const [userData, setUserData] = useState(null);

  // Di bagian atas function Home()
  const [isGameOpen, setIsGameOpen] = useState(false);

  const [isGame1Locked, setIsGame1Locked] = useState(false);

  // --- 2. LOGIC: AMBIL DATA ---
  useEffect(() => {
    const checkLogin = () => {
      const savedUser = localStorage.getItem('user_siswa')
      if (savedUser) setStudent(JSON.parse(savedUser))
    }
    checkLogin()
    fetchPosts()
    window.addEventListener('storage', checkLogin)
    return () => window.removeEventListener('storage', checkLogin)
  }, [])

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    setPosts(data || [])
  }

  // Tambahkan di deretan useEffect lainnya
  useEffect(() => {
    if (showGameKetik) {
      // Matikan scroll saat modal terbuka
      document.body.style.overflow = 'hidden';
    } else {
      // Aktifkan kembali scroll saat modal ditutup
      document.body.style.overflow = 'unset';
    }

    // Bersihkan efek saat komponen di-unmount (untuk jaga-jaga)
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showGameKetik]);

  // Tambahkan useEffect untuk memantau status kunci secara realtime di halaman Home
  useEffect(() => {
    if (!student) return;

    const fetchInitialLock = async () => {
      const { data } = await supabase
        .from('game_controls')
        .select('is_locked')
        .eq('game_id', 'game1')
        .eq('class_name', student.Kelas || 'Tanpa Kelas')
        .maybeSingle();
      if (data) setIsGame1Locked(data.is_locked);
    };

    fetchInitialLock();

    // Realtime listener agar icon di Home berubah otomatis jika admin lain mengubahnya
    const channel = supabase
      .channel('home_lock_status')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'game_controls', filter: `game_id=eq.game1` },
        (payload) => {
          if (payload.new && payload.new.class_name === (student.Kelas || 'Tanpa Kelas')) {
            setIsGame1Locked(payload.new.is_locked);
          }
        }
      ).subscribe();

    return () => supabase.removeChannel(channel);
  }, [student]);

  // Di dalam function Home()
  useEffect(() => {
    // 1. Fungsi untuk ambil status awal saat pertama kali load
    const fetchLockStatus = async () => {
      const selectedClass = document.getElementById('select-class-game1')?.value || 'Tanpa Kelas';
      const { data } = await supabase
        .from('game_controls')
        .select('is_locked')
        .eq('game_id', 'game1')
        .eq('class_name', selectedClass)
        .maybeSingle();

      if (data) setIsGame1Locked(data.is_locked);
    };

    fetchLockStatus();

    // 2. LANGKAH REALTIME: Dengar perubahan di database
    const channel = supabase
      .channel('game_controls_realtime') // Nama channel bebas
      .on(
        'postgres_changes',
        {
          event: '*', // Dengar INSERT, UPDATE, maupun DELETE
          schema: 'public',
          table: 'game_controls',
          filter: `game_id=eq.game1` // Filter khusus untuk game1
        },
        (payload) => {
          const selectedClass = document.getElementById('select-class-game1')?.value;
          // Hanya update UI jika kelas yang berubah sama dengan kelas yang sedang dilihat admin
          if (payload.new && payload.new.class_name === selectedClass) {
            setIsGame1Locked(payload.new.is_locked);
            console.log("Realtime Update:", payload.new.is_locked);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePost = async (e) => {
    e.preventDefault()
    if (!newPost.trim() || !student) return
    const { error } = await supabase.from('posts').insert([
      { nama: student.NAMA, kelas: student.Kelas, content: newPost, student_id: student.id }
    ])
    if (!error) {
      setNewPost('')
      fetchPosts()
    }
  }

  // Di dalam export default function Home() { ...

  const toggleLockGame = async (gameId, currentStatus, targetClass) => {
    console.log(`Mencoba update: ${gameId} untuk kelas ${targetClass}, status lama: ${currentStatus}`);

    const { data, error } = await supabase
      .from('game_controls')
      .upsert({
        game_id: gameId,
        class_name: targetClass,
        is_locked: !currentStatus
      }, { onConflict: 'game_id,class_name' })
      .select(); // Tambahkan select() untuk melihat data kembalian

    if (error) {
      console.error("Gagal update Supabase:", error);
      alert("Error: " + error.message);
    } else {
      console.log("Berhasil Update di Database:", data);
      setIsGame1Locked(!currentStatus);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* --- 3. HERO COMPONENT --- */}
        <Hero
          student={student}
          onStart={() => (student ? setActiveTab('tugas') : alert('Login dulu yuk!'))}
        />

        {/* --- 4. MENU TAB --- */}
        <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-2xl mb-8 border border-white/5 overflow-x-auto no-scrollbar">
          {[
            { id: 'beranda', label: 'Beranda', icon: <HomeIcon size={18} /> },
            { id: 'info', label: 'Informasi', icon: <Megaphone size={18} /> },
            { id: 'playground', label: 'Playground', icon: <Gamepad2 size={18} /> },
            { id: 'tugas', label: 'Tugas', icon: <FileText size={18} /> },
            { id: 'ranking', label: 'Ranking', icon: <Trophy size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                const isLocked = tab.id === 'tugas' || tab.id === 'ranking';
                if (isLocked && !student) {
                  alert('Login dulu ya untuk akses menu ini!');
                } else {
                  setActiveTab(tab.id);
                }
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm whitespace-nowrap
                ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              {tab.icon} {tab.label}
              {(tab.id === 'tugas' || tab.id === 'ranking') && !student && (
                <Lock size={12} className="opacity-40" />
              )}
            </button>
          ))}
        </div>

        {/* --- 5. KONTEN TAB --- */}
        <div className="min-h-[300px]">
          {activeTab === 'beranda' && (
            <div className="space-y-6 animate-in fade-in duration-700">
              {student && (
                <form onSubmit={handlePost} className="bg-slate-800/40 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                  <textarea
                    className="w-full bg-transparent border-none outline-none text-white placeholder-slate-500 resize-none h-20 text-sm"
                    placeholder={`Apa yang kamu pikirkan, ${student.NAMA.split(' ')[0]}?`}
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                  />
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Postingan Siswa</span>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-all">
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              )}

              <div className="grid gap-4">
                {posts.length > 0 ? posts.map((post) => (
                  <div key={post.id} className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white">
                          {post.nama ? post.nama[0] : '?'}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">{post.nama}</h4>
                          <p className="text-[10px] text-blue-400 font-bold uppercase">Kelas {post.kelas}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500">{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{post.content}</p>
                  </div>
                )) : (
                  <p className="text-center text-slate-500 py-10">Belum ada postingan.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="bg-blue-900/20 border border-blue-500/20 p-6 rounded-2xl animate-in fade-in">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-white"><Megaphone className="text-blue-400" /> Informasi Sekolah</h3>
              <p className="text-slate-400 text-sm italic">Belum ada pengumuman resmi hari ini.</p>
            </div>
          )}

          {activeTab === 'tugas' && student && (
            <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl animate-in fade-in text-center py-20">
              <FileText size={48} className="mx-auto mb-4 text-slate-600" />
              <h3 className="text-white font-bold text-lg">Daftar Tugas</h3>
            </div>
          )}

          {activeTab === 'ranking' && student && (
            <div className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl animate-in fade-in text-center py-20">
              <Trophy size={48} className="mx-auto mb-4 text-yellow-500/50" />
              <h3 className="text-white font-bold text-lg">Papan Peringkat</h3>
            </div>
          )}

          {activeTab === 'playground' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="relative group">
                {/* Kartu Utama */}
                <div
                  className="bg-gradient-to-br from-blue-600/20 to-slate-900 border border-blue-500/20 p-6 rounded-[2rem] hover:border-blue-500/50 transition-all cursor-pointer shadow-xl"
                  onClick={() => setShowGameKetik(true)}
                >
                  <div className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-900/40">
                    <Keyboard className="text-white" size={30} />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Ketik Cepat</h3>
                  <div className="flex items-center text-blue-400 text-xs font-bold uppercase tracking-widest gap-2">
                    Mainkan <ChevronRight size={14} />
                  </div>
                </div>

                {/* INTERFACE ADMIN: Pilih Kelas & Tombol Kunci */}
                {student?.role === 'admin' && (
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-10">
                    {/* Dropdown Pilih Kelas */}
                    <select
                      id="select-class-game1"
                      onChange={async (e) => {
                        const newClass = e.target.value;
                        // Ambil status kunci terbaru untuk kelas yang baru dipilih
                        const { data } = await supabase
                          .from('game_controls')
                          .select('is_locked')
                          .eq('game_id', 'game1')
                          .eq('class_name', newClass)
                          .maybeSingle();

                        // Jika datanya ada, update state. Jika tidak ada, anggap tidak terkunci (false)
                        setIsGame1Locked(data ? data.is_locked : false);
                      }}
                      className="..."
                      onClick={(e) => e.stopPropagation()}
                    > 
                      <option value="7.1">Kelas 7.1</option>
                      <option value="7.2">Kelas 7.2</option>
                      <option value="7.3">Kelas 7.3</option>
                      <option value="7.4">Kelas 7.4</option>
                      <option value="7.5">Kelas 7.5</option>
                      <option value="7.6">Kelas 7.6</option>
                      <option value="7.7">Kelas 7.7</option>
                      <option value="7.8">Kelas 7.8</option>
                      <option value="7.2">Kelas 7.9</option>
                      <option value="7.9">Kelas 7.10</option>
                      <option value="7.10">Kelas 7.11</option>
                      <option value="develover">Develover</option>
                    </select>


                    {/* Tombol Kunci */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const selectedClass = document.getElementById('select-class-game1').value;
                        // Panggil fungsi toggle dengan kelas yang dipilih dari dropdown
                        toggleLockGame('game1', isGame1Locked, selectedClass);
                      }}
                      className={`p-3 rounded-2xl border transition-all shadow-xl ${isGame1Locked
                        ? 'bg-red-500 border-red-400 text-white'
                        : 'bg-slate-800 border-white/10 text-slate-400 hover:text-white'
                        }`}
                    >
                      {isGame1Locked ? <Lock size={18} /> : <Unlock size={18} />}
                    </button>
                  </div>
                )}
              </div>

              {/* ... kartu game lainnya ... */}
            </div>
          )}
        </div> {/* --- Tutup min-h-[300px] --- */}

      </div> {/* --- Tutup max-w-4xl --- */}

      {/* MODAL ditaruh di luar max-w-4xl tapi masih di dalam div utama */}
      {showGameKetik && (
        <ModalGame
          title="Game Ketik Cepat"
          gameId="game1"
          userClass={student?.Kelas || "Tanpa Kelas"} // Pakai 'student' karena state kamu namanya student
          isAdmin={student?.role === 'admin'}
          // PAKAI FUNGSI YANG SAMA DENGAN VARIABEL DI ATAS
          onClose={() => setShowGameKetik(false)}
        >
          <GameKetikCepat />
        </ModalGame>
      )}

    </div> // --- Tutup min-h-screen ---
  );
}