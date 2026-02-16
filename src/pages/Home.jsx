import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import GameKetikCepat from "../games/Game1_KetikCepat/GameKetikCepat";
import FlappyBird from '../games/Game2_FlappyBird/FlappyBird';
import Leaderboard from '../components/Leaderboard';
import ModalGame from '../components/ModalGame';
import GameCard from '../components/GameCard'; // Komponen yang kita pisah
import Hero from '../components/Hero'
import Navigation from '../components/Navigation';
import FloatingOnline from '../components/FloatingOnline'; // Pastikan jalurnya benar
import ActivityCard from '../components/ActivityCard';
import Feed from '../components/Feed';

import {
  Home as HomeIcon,
  Megaphone,
  FileText,
  Trophy,
  Lock,
  Gamepad2,
  Send,
  Bird,
  Keyboard
} from 'lucide-react';

export default function Home() {
  // --- 1. STATE ---
  const [student, setStudent] = useState(null)
  const [activeTab, setActiveTab] = useState('beranda')
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')
  const [showGameKetik, setShowGameKetik] = useState(false);
  const [allLockStatuses, setAllLockStatuses] = useState({ game1: {}, game2: {} });
  // Di bagian atas Home.jsx

  const [lockStatusesGame1, setLockStatusesGame1] = useState({});
  const [lockStatusesGame2, setLockStatusesGame2] = useState({});

  // Dan state untuk tombol admin (gembok menyala/mati saat dipilih)
  const [isGame1Locked, setIsGame1Locked] = useState(false);
  const [isGame2Locked, setIsGame2Locked] = useState(false);

  const [showFlappy, setShowFlappy] = useState(false);

  // Tambahkan ini jika belum ada di dalam Home kamu
  useEffect(() => {
    const checkLogin = () => {
      const savedUser = localStorage.getItem('user_siswa')
      if (savedUser) setStudent(JSON.parse(savedUser))
    }
    checkLogin()

    const fetchPosts = async () => {
      const savedUser = localStorage.getItem('user_siswa');
      const currentUser = savedUser ? JSON.parse(savedUser) : null;

      let query = supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      // JIKA BUKAN ADMIN
      if (!currentUser || currentUser.role !== 'admin') {
        if (currentUser) {
          // Siswa: Lihat yang 'approved' ATAU miliknya sendiri
          query = query.or(`status.eq.approved,student_id.eq.${currentUser.id}`);
        } else {
          // Tamu (Tanpa Login): HANYA lihat yang sudah 'approved'
          query = query.eq('status', 'approved');
        }
      }
      // JIKA ADMIN: Query tidak difilter (bisa lihat semua)

      const { data, error } = await query;
      if (!error) setPosts(data || []);
    };
    fetchPosts()

    window.addEventListener('storage', checkLogin)
    return () => window.removeEventListener('storage', checkLogin)
  }, [])

  // --- PERBAIKAN: Realtime Posts (Agar deteksi Update & Delete) ---
  useEffect(() => {
    const postChannel = supabase
      .channel('realtime-posts-secure')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        (payload) => {
          const savedUser = localStorage.getItem('user_siswa');
          const currentUser = savedUser ? JSON.parse(savedUser) : null;

          if (payload.eventType === 'INSERT') {
            const newPost = payload.new;

            // CEK: Siapa yang boleh melihat postingan baru ini?
            const isAdmin = currentUser?.role === 'admin';
            const isMyOwnPost = currentUser?.id === newPost.student_id;
            const isApproved = newPost.status === 'approved';

            if (isAdmin || isMyOwnPost || isApproved) {
              setPosts((prev) => [newPost, ...prev]);
            }
          }
          else if (payload.eventType === 'UPDATE') {
            // Jika status berubah dari pending ke approved, postingan akan muncul di semua orang
            const updatedPost = payload.new;

            setPosts((prev) => {
              const exists = prev.find(p => p.id === updatedPost.id);

              if (exists) {
                // Jika sudah ada (misal di layar admin/pemilik), update datanya
                return prev.map(p => p.id === updatedPost.id ? updatedPost : p);
              } else if (updatedPost.status === 'approved') {
                // Jika belum ada di list (siswa lain) dan statusnya jadi approved, masukkan ke list
                return [updatedPost, ...prev].sort((a, b) =>
                  new Date(b.created_at) - new Date(a.created_at)
                );
              }
              return prev;
            });
          }
          else if (payload.eventType === 'DELETE') {
            setPosts((prev) => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(postChannel); };
  }, []);

  // --- 2. LOGIC: AMBIL DATA USER & POSTS ---
  // --- 3. LOGIC: REALTIME & FETCH STATUS GAME ---
  // --- 3. LOGIC: REALTIME & FETCH STATUS GAME ---
  useEffect(() => {
    const fetchAllData = async () => {
      const { data } = await supabase
        .from('game_controls')
        .select('game_id, class_name, is_locked');

      if (data) {
        // Gabungkan inisialisasi agar bersih
        const statusMap = { game1: {}, game2: {} };

        data.forEach(item => {
          if (statusMap[item.game_id]) {
            statusMap[item.game_id][item.class_name] = item.is_locked;
          }
        });

        setAllLockStatuses(statusMap);

        const userClass = student?.Kelas || 'Tanpa Kelas';

        // Sinkronkan gembok Admin/Siswa untuk Game 1
        const selClass1 = document.getElementById('select-class-game1')?.value || 'Tanpa Kelas';
        setIsGame1Locked(student?.role === 'admin'
          ? (statusMap.game1?.[selClass1] || false)
          : (statusMap.game1?.[userClass] || false)
        );

        // Sinkronkan gembok Admin/Siswa untuk Game 2
        const selClass2 = document.getElementById('select-class-game2')?.value || 'Tanpa Kelas';
        setIsGame2Locked(student?.role === 'admin'
          ? (statusMap.game2?.[selClass2] || false)
          : (statusMap.game2?.[userClass] || false)
        );
      }
    };

    fetchAllData();

    const channel = supabase
      .channel('game_controls_realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'game_controls' },
        (payload) => {
          if (payload.new) {
            const { game_id, class_name, is_locked } = payload.new;

            setAllLockStatuses(prev => ({
              ...prev,
              [game_id]: {
                ...(prev[game_id] || {}),
                [class_name]: is_locked
              }
            }));

            const userClass = student?.Kelas || 'Tanpa Kelas';

            if (game_id === 'game1') {
              const selClass1 = document.getElementById('select-class-game1')?.value;
              if (class_name === selClass1 || class_name === userClass) setIsGame1Locked(is_locked);
            }

            if (game_id === 'game2') {
              const selClass2 = document.getElementById('select-class-game2')?.value;
              if (class_name === selClass2 || class_name === userClass) setIsGame2Locked(is_locked);
            }
          }
        }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeTab, student]);

  // --- 4. FUNCTIONS ---
  const getOptionLabel = (gameId, className, labelText) => {
    // Ambil status spesifik berdasarkan Game dan Kelas
    const isLocked = allLockStatuses[gameId]?.[className];
    return isLocked ? `🔴 ${labelText}` : `🟢 ${labelText}`;
  };

  const handleApprove = async (postId) => {
    const { error } = await supabase
      .from('posts')
      .update({ status: 'approved' })
      .eq('id', postId);

    if (error) alert("Gagal menyetujui");
    // Update state lokal agar langsung berubah tanpa reload
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, status: 'approved' } : p));
  };

  // --- PERBAIKAN: handlePost ---
  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !student) return;

    const { error } = await supabase.from('posts').insert([
      {
        student_id: student.id,
        NAMA: student.NAMA,
        Kelas: student.Kelas,
        content: newPost,
        category: 'umum',
        status: 'pending' // WAJIB: Agar masuk ke moderasi dulu
      }
    ]);

    if (!error) {
      setNewPost('');
      // fetchPosts(); // Hapus ini, biarkan Realtime yang bekerja
    } else {
      console.error("Gagal posting:", error.message);
    }
  };

  // Tambahkan di dalam export default function Home()
  const handleAutoPostAchievement = async (message) => {
    if (!student) return;

    const { error } = await supabase.from('posts').insert([
      {
        student_id: student.id,
        NAMA: student.NAMA,
        // Cek tabel posts kamu, apakah kolomnya 'Kelas' atau 'kelas'?
        // Jika di database kolomnya 'kelas' (kecil), ubah bagian kiri ini:
        Kelas: student.Kelas, 
        content: message,
        category: 'pencapaian',
        status: 'approved'
      }
    ]);

    if (error) {
      console.error("Gagal posting pencapaian:", error.message);
    } else {
      console.log("Pencapaian berhasil diposting!");
    }
  };

  // --- FUNGSI BARU: DELETE ---
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus postingan ini?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      alert("Gagal menghapus: " + error.message);
    } else {
      // Update state lokal
      setPosts(prev => prev.filter(p => p.id !== postId));
    }
  };

  const toggleLockGame = async (gameId, currentStatus, targetClass) => {
    const { error } = await supabase
      .from('game_controls')
      .upsert({
        game_id: gameId,
        class_name: targetClass,
        is_locked: !currentStatus
      }, { onConflict: 'game_id,class_name' });

    if (error) {
      alert("Error: " + error.message);
    } else {
      // 1. Update status gembok admin sesuai gamenya
      if (gameId === 'game1') setIsGame1Locked(!currentStatus);
      else if (gameId === 'game2') setIsGame2Locked(!currentStatus);

      // 2. PERBAIKAN DISINI: Update allLockStatuses tanpa merusak struktur game_id
      setAllLockStatuses(prev => ({
        ...prev,
        [gameId]: {
          ...(prev[gameId] || {}),
          [targetClass]: !currentStatus
        }
      }));
    }
  };

  // Lock scroll saat modal buka
  useEffect(() => {
    document.body.style.overflow = showGameKetik ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showGameKetik]);

  //untuk posisi
  const getCurrentActivity = () => {
    if (showGameKetik) return "🎮 Bermain Ketik Cepat";
    if (showFlappy) return "🐦 Bermain Flappy Bird";
    return activeTab; // Jika tidak main game, tampilkan nama tab (beranda/playground/dll)
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* HERO */}
        <Hero
          student={student}
          onStart={() => (student ? setActiveTab('tugas') : alert('Login dulu yuk!'))}
        />

        {/* TAB MENU */}
        {/* --- 4. MENU TAB (SEKARANG SUDAH DIPISAH) --- */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          student={student}
        />

        {/* CONTENT AREA */}
        <div className="min-h-[300px]">
          {/* Di dalam Home.jsx, bagian Content Area */}
          {activeTab === 'beranda' && (
            <Feed
              posts={posts}
              student={student}
              onApprove={handleApprove}
              onDelete={handleDelete} // Sekarang sudah aman karena fungsi sudah ada
              newPost={newPost}
              setNewPost={setNewPost}
              handlePost={handlePost}
            />
          )}

          {activeTab === 'playground' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
              {/* Kartu Game 1 - Ketik Cepat */}
              <GameCard
                title="Ketik Cepat"
                gameId="game1" // Tambahkan ini
                description="Ketiklah dengan tepat dan cepat!"
                icon={Keyboard} // Pastikan icon dikirim jika GameCard memerlukannya
                color="blue"
                student={student}
                allLockStatuses={allLockStatuses} // Pakai state utama
                isGameLocked={isGame1Locked}
                getOptionLabel={(cls, label) => getOptionLabel('game1', cls, label)} // Tambahkan 'game1'
                onPlay={() => setShowGameKetik(true)}
                onToggleLock={(selectedClass, mode) => {
                  if (mode === 'check') setIsGame1Locked(allLockStatuses.game1?.[selectedClass] || false);
                  else toggleLockGame('game1', isGame1Locked, selectedClass);
                }}
              />

              {/* Kartu Game 2 - Flappy Bird */}
              <GameCard
                title="Flappy Bird"
                gameId="game2" // Tambahkan ini
                description="Terbangkan burung melewati pipa!"
                icon={Bird} // Sesuaikan ikonnya
                color="green"
                student={student}
                allLockStatuses={allLockStatuses} // Pakai state utama
                isGameLocked={isGame2Locked}
                getOptionLabel={(cls, label) => getOptionLabel('game2', cls, label)} // Tambahkan 'game2'
                onPlay={() => setShowFlappy(true)}
                onToggleLock={(selectedClass, mode) => {
                  // PERBAIKAN: tadinya setIsGame1Locked, harusnya setIsGame2Locked
                  if (mode === 'check') setIsGame2Locked(allLockStatuses.game2?.[selectedClass] || false);
                  else toggleLockGame('game2', isGame2Locked, selectedClass);
                }}
              />
            </div>
          )}

          {/* ... Tab Lain (Info, Tugas, Ranking) ... */}
        </div>
      </div>

      {/* MODAL GAME */}
      {showGameKetik && (
        <ModalGame
          title="Game Ketik Cepat"
          gameId="game1"
          userClass={student?.Kelas || "Tanpa Kelas"}
          isAdmin={student?.role === 'admin'}
          onClose={() => setShowGameKetik(false)}
        >
          <GameKetikCepat
            student={student}
            onArchiveAchievement={handleAutoPostAchievement} // <-- Kirim fungsinya di sini
          />
        </ModalGame>
      )}

      {/* MODAL GAME 2 */}
      {showFlappy && (
        <ModalGame
          title="Flappy Bird"
          gameId="game2" // Tambahkan ini
          userClass={student?.Kelas || "Tanpa Kelas"} // Tambahkan ini
          isAdmin={student?.role === 'admin'} // Tambahkan ini
          onClose={() => setShowFlappy(false)}
        >
          <FlappyBird student={student} onGameOver={() => { }} />
        </ModalGame>
      )}


      {/* Kirim getCurrentActivity() ke prop activeTab */}
      <FloatingOnline
        user={student}
        activeTab={getCurrentActivity()}
      />

    </div>
  );
}