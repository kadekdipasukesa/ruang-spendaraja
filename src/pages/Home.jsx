import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import GameKetikCepat from "../games/Game1_KetikCepat/GameKetikCepat";
// import FlappyBird from '../games/Game2_FlappyBird/FlappyBird';
// import Leaderboard from '../components/Leaderboard';
import ModalGame from '../components/Games/ModalGame';
import GameCard from '../components/Games/GameCard'; // Komponen yang kita pisah
import Hero from '../components/Home/Hero'
import Navigation from '../components/Home/Navigation';
import FloatingOnline from '../components/FloatingOnline'; // Pastikan jalurnya benar
// import ActivityCard from '../components/ActivityCard';
import Feed from '../components/Home/Feed';
import UpdateNotifier from "../components/UpdateNotifier";
import Game3Page from './Game3/Game3Page';

import MateriCard from "../components/Materi/MateriCard";
import Absensi from '../components/Absen/AbsensiTemp';

import ModalInputTugas from '../components/Tugas/ModalInputTugas';
import AssignmentCard from "../components/Tugas/AssignmentCard";
import ModalDetailTugas from "../components/Tugas/ModalDetailTugas";



import {
  Home as HomeIcon,
  Megaphone,
  FileText,
  Trophy,
  Lock,
  Gamepad2,
  Send,
  Bird,
  Keyboard,
  Zap,
  Plus
} from 'lucide-react';

export default function Home() {
  // --- 1. STATE ---
  const [student, setStudent] = useState(null);
  // --- SYNC STUDENT DATA DARI LOCAL STORAGE ---
  useEffect(() => {
    const savedUser = localStorage.getItem('user_siswa');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setStudent(parsedUser);
      // Log ini untuk memastikan No_Absen ada di console
      console.log("Data Student Loaded:", parsedUser);
    }
  }, []);
  const [activeTab, setActiveTab] = useState('beranda');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  const [showGameKetik, setShowGameKetik] = useState(false);
  const [showFlappy, setShowFlappy] = useState(false);
  const [showGameLCC, setShowGameLCC] = useState(false);

  const [allLockStatuses, setAllLockStatuses] = useState({ game1: {}, game2: {}, game3: {} });
  // Di bagian atas Home.jsx

  // Dan state untuk tombol admin (gembok menyala/mati saat dipilih)
  const [isGame1Locked, setIsGame1Locked] = useState(false);
  const [isGame2Locked, setIsGame2Locked] = useState(false);
  const [isGame3Locked, setIsGame3Locked] = useState(false);

  const [lockStatusesGame1, setLockStatusesGame1] = useState({});
  const [lockStatusesGame2, setLockStatusesGame2] = useState({});

  const [assignments, setAssignments] = useState([]);
  const [selectedTugas, setSelectedTugas] = useState(null); // Untuk modal detail

  // Letakkan di deretan state lainnya
  const [showInputTugas, setShowInputTugas] = useState(false);

  const CLASSES = ["Tanpa Kelas", "7.1", "7.2", "7.3", "7.4", "7.5", "7.6", "7.7", "7.8", "7.9", "7.10", "7.11"];

  // Fungsi untuk Admin mengubah status Lock/Unlocka
  const toggleClassChat = async (className, currentStatus) => {
    const { error } = await supabase
      .from('game_controls')
      .upsert({
        game_id: 'livechat_control',
        class_name: className,
        is_locked: !currentStatus
      }, { onConflict: 'game_id, class_name' });

    if (error) alert("Gagal update kontrol: " + error.message);
  };

  // ---  LOGIC: AMBIL DATA TUGAS ---
  useEffect(() => {
    const fetchAssignments = async () => {
      if (!student) return;
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .or(`target_kelas.eq.${student.Kelas},target_kelas.eq.Semua`)
        .order('deadline', { ascending: true });

      if (!error) setAssignments(data);
    };

    if (activeTab === 'tugas') fetchAssignments();
  }, [activeTab, student]);

  // Tambahkan ini jika belum ada di dalam Home kamu
  

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

  
  // --- 3. LOGIC: REALTIME & FETCH STATUS GAME ---
  useEffect(() => {
    const fetchAllData = async () => {
      const { data } = await supabase
        .from('game_controls')
        .select('game_id, class_name, is_locked');

      if (data) {
        // Gabungkan inisialisasi agar bersih
        const statusMap = { game1: {}, game2: {}, game3: {} };

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

        // Sinkronkan gembok Admin/Siswa untuk Game 3
        const selClass3 = document.getElementById('select-class-game3')?.value || 'Tanpa Kelas';
        setIsGame3Locked(student?.role === 'admin'
          ? (statusMap.game3?.[selClass3] || false)
          : (statusMap.game3?.[userClass] || false)
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

            if (game_id === 'game3') {
              const selClass3 = document.getElementById('select-class-game3')?.value;
              if (class_name === selClass3 || class_name === userClass) setIsGame3Locked(is_locked);
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
      else if (gameId === 'game3') setIsGame3Locked(!currentStatus); // TAMBAHKAN INI

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
    if (showGameLCC) return "🎮 Bermain lomba cerdas cermat";
    if (showFlappy) return "🐦 Bermain Flappy Bird";
    return activeTab; // Jika tidak main game, tampilkan nama tab (beranda/playground/dll)
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 font-sans">
      {/* 1. LOGIKA FULLSCREEN GAME 3 (Tanpa Modal) */}
      {showGameLCC ? (
        <Game3Page
          userSiswa={student}
          onBack={() => setShowGameLCC(false)}
        />
      ) : (
        <div className="max-w-4xl mx-auto">

          {/* --- LOGIKA OPSI 1: SEMBUNYIKAN KONTEN UTAMA JIKA GAME AKTIF --- */}
          {!showGameKetik && !showFlappy ? (
            <>
              {/* HERO */}
              <Hero
                student={student}
                onStart={() => (student ? setActiveTab('tugas') : alert('Login dulu yuk!'))}
              />

              {/* TAB MENU */}
              <Navigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                student={student}
              />

              {/* CONTENT AREA */}
              <div className="min-h-[300px]">
                {activeTab === 'beranda' && (
                  <Feed
                    posts={posts}
                    student={student}
                    onApprove={handleApprove}
                    onDelete={handleDelete}
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
                      gameId="game1"
                      description="Ketiklah dengan tepat dan cepat!"
                      icon={Keyboard}
                      color="blue"
                      student={student}
                      allLockStatuses={allLockStatuses}
                      isGameLocked={isGame1Locked}
                      getOptionLabel={(cls, label) => getOptionLabel('game1', cls, label)}
                      onPlay={() => setShowGameKetik(true)}
                      onToggleLock={(selectedClass, mode) => {
                        if (mode === 'check') setIsGame1Locked(allLockStatuses.game1?.[selectedClass] || false);
                        else toggleLockGame('game1', isGame1Locked, selectedClass);
                      }}
                    />

                    {/* Kartu Game 2 - Flappy Bird */}
                    <GameCard
                      title="Flappy Bird"
                      gameId="game2"
                      description="Terbangkan burung melewati pipa!"
                      icon={Bird}
                      color="green"
                      student={student}
                      allLockStatuses={allLockStatuses}
                      isGameLocked={isGame2Locked}
                      getOptionLabel={(cls, label) => getOptionLabel('game2', cls, label)}
                      // onPlay={() => setShowFlappy(true)}
                      onPlay={() => window.open('/chess.html', '_blank')}
                      onToggleLock={(selectedClass, mode) => {
                        if (mode === 'check') setIsGame2Locked(allLockStatuses.game2?.[selectedClass] || false);
                        else toggleLockGame('game2', isGame2Locked, selectedClass);
                      }}
                    />

                    {/* Kartu Game 3 - Cerdas Cermat */}
                    <GameCard
                      title="Cerdas Cermat"
                      gameId="game3"
                      description="Adu cepat pencet bel dan jawab soal!"
                      icon={Zap} // Menggunakan ikon Petir agar terasa nuansa rebutan cepat
                      color="purple" // Warna ungu memberikan kesan eksklusif dan cerdas
                      student={student} // Prop ini harus ada & tidak boleh null
                      allLockStatuses={allLockStatuses}
                      isGameLocked={isGame3Locked} // Pastikan Bapak sudah buat state [isGame3Locked, setIsGame3Locked]
                      getOptionLabel={(cls, label) => getOptionLabel('game3', cls, label)}
                      onPlay={() => setShowGameLCC(true)}
                      onToggleLock={(selectedClass, mode) => {
                        if (mode === 'check') {
                          setIsGame3Locked(allLockStatuses.game3?.[selectedClass] || false);
                        } else {
                          toggleLockGame('game3', isGame3Locked, selectedClass);
                        }
                      }}
                    />
                  </div>
                )}

                {activeTab === 'tugas' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                          <FileText className="text-blue-400" /> Tugas {student?.Kelas}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">{assignments.length} Tugas tersedia untukmu</p>
                      </div>

                      {/* TOMBOL ADMIN: Hanya muncul jika role admin */}
                      {student?.role === 'admin' && (
                        <button
                          onClick={() => setShowInputTugas(true)} // Pastikan state ini sudah dibuat
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                        >
                          <Plus size={18} />
                          <span className="hidden md:inline">Tambah Tugas</span>
                        </button>
                      )}
                    </div>

                    {assignments.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {assignments.map((t) => (
                          <AssignmentCard
                            key={t.id}
                            data={t}
                            onOpen={(val) => setSelectedTugas(val)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-[#1e293b]/50 rounded-3xl border border-dashed border-slate-700">
                        <div className="bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="text-slate-600" size={30} />
                        </div>
                        <p className="text-slate-500 italic">Belum ada tugas untuk kelasmu. Santai dulu!</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ... menu materi ... */}
                {activeTab === 'materi' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
                    {/* Kartu Materi Jaringan Komputer */}
                    <MateriCard
                      title="Jaringan Komputer"
                      description="Pelajari konsep dasar jaringan, topologi, dan cara komputer saling berkomunikasi."
                      type="link"
                      color="blue"
                      onOpen={() => window.open('https://mediapembelajarantekscerpenkelasixsmp.my.canva.site/c54xpr3xwymkfzrh', '_blank')}
                    />

                    {/* Kamu bisa menambahkan materi lain di sini nanti */}
                  </div>
                )}
                {/* ... menu absensi ... */}
                {activeTab === 'absen' && <Absensi student={student} />}

                {/* ... Tab Lain Tetap Berfungsi di Sini ... */}
              </div>
            </>
          ) : (
            /* --- TAMPILAN SAAT GAME LAGI JALAN (Home Kosong) --- */
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 animate-pulse">
              <p className="text-sm font-medium tracking-widest uppercase">Game sedang aktif...</p>
            </div>
          )}
        </div>
      )}

      {showInputTugas && (
        <ModalInputTugas
          onClose={() => setShowInputTugas(false)}
          onRefresh={() => fetchAssignments()} // Pastikan fungsi fetchAssignments tersedia
        />
      )}

      {/* Modal Detail Tugas untuk Siswa */}
      {selectedTugas && (
        <ModalDetailTugas
          tugas={selectedTugas}
          student={student}
          onClose={() => setSelectedTugas(null)}
        />
      )}

      {/* MODAL GAME 1 (Ketik Cepat) */}
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
            onArchiveAchievement={handleAutoPostAchievement}
          />
        </ModalGame>
      )}

      {/* MODAL GAME 2 (Flappy Bird) */}
      {showFlappy && (
        <ModalGame
          title="Flappy Bird"
          gameId="game2"
          userClass={student?.Kelas || "Tanpa Kelas"}
          isAdmin={student?.role === 'admin'}
          onClose={() => setShowFlappy(false)}
        >
          <FlappyBird student={student} onGameOver={() => { }} />
        </ModalGame>
      )}

      {/* Floating tetap muncul untuk status */}
      <FloatingOnline
        user={student}
        activeTab={getCurrentActivity()}
      />

      {/* notif update */}
      <UpdateNotifier /> {/* Letakkan di sini */}

    </div>
  );
}