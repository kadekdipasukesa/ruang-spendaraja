import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, UserCheck, UploadCloud, Cpu, Sparkles, BookOpen, 
  Database, Trophy, Star, Award, Edit3, Shield
} from 'lucide-react';
import EkstraHeader from '../components/EkstraTik/EkstraHeader';
import EkstraAdminControl from '../components/EkstraTik/EkstraAdminControl';
import FormPresensiEkstra from '../components/EkstraTik/FormPresensiEkstra';
import FormKumpulTugasEkstra from '../components/EkstraTik/FormKumpulTugasEkstra';
import PenilaianTugasEkstra from '../components/EkstraTik/PenilaianGuru/PenilaianTugasEkstra';
import LeaderboardEkstra from '../components/EkstraTik/LeaderboardEkstra';
import { 
  getStatusAbsenEkstra, 
  subscribeStatusAbsenEkstra,
  getAnggotaEkstra,
  getPresensiEkstra,
  subscribePresensiEkstra,
  getTugasPengumpulanEkstra,
  subscribeTugasPengumpulanEkstra
} from '../services/ekstraTikService';

export default function EkstraTikPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('presensi'); // 'presensi' | 'tugas' | 'leaderboard' | 'penilaian'
  const [isLocked, setIsLocked] = useState(false);
  const [anggotaList, setAnggotaList] = useState([]);
  const [allPresensiList, setAllPresensiList] = useState([]);
  const [allPengumpulanList, setAllPengumpulanList] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Ambil data user yang sedang login
  useEffect(() => {
    const savedUser = localStorage.getItem('user_siswa');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.warn('Gagal parse user_siswa:', e);
      }
    }
  }, []);

  // Muat data anggota, presensi, dan pengumpulan dari Supabase
  const loadInitialData = useCallback(async () => {
    try {
      setLoadingData(true);
      const [anggota, presensi, pengumpulan] = await Promise.all([
        getAnggotaEkstra(),
        getPresensiEkstra(),
        getTugasPengumpulanEkstra()
      ]);
      setAnggotaList(anggota || []);
      setAllPresensiList(presensi || []);
      setAllPengumpulanList(pengumpulan || []);
    } catch (err) {
      console.error('Gagal memuat data ekstra dari Supabase:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Cek status kunci absensi dari Supabase & Realtime Subscription
  useEffect(() => {
    let unsubscribeStatus = () => {};
    let unsubscribePresensi = () => {};
    let unsubscribeTugas = () => {};

    const initStatus = async () => {
      const res = await getStatusAbsenEkstra();
      setIsLocked(res.isLocked);

      unsubscribeStatus = subscribeStatusAbsenEkstra((locked) => {
        setIsLocked(locked);
      });

      // Realtime subscription saat ada presensi baru masuk
      unsubscribePresensi = subscribePresensiEkstra((payload) => {
        if (payload?.eventType === 'INSERT' || payload?.eventType === 'UPDATE') {
          getPresensiEkstra().then((updated) => {
            setAllPresensiList(updated || []);
          });
        }
      });

      // Realtime subscription saat tugas baru dikumpulkan / dinilai
      unsubscribeTugas = subscribeTugasPengumpulanEkstra(() => {
        getTugasPengumpulanEkstra().then((updated) => {
          setAllPengumpulanList(updated || []);
        });
      });
    };

    initStatus();
    return () => {
      unsubscribeStatus();
      unsubscribePresensi();
      unsubscribeTugas();
    };
  }, []);

  const handleOpenLogin = () => {
    window.dispatchEvent(new CustomEvent('open-login-modal'));
  };

  const isAdmin =
    user?.role === 'admin' ||
    user?.role === 'guru' ||
    user?.role_2 === 'admin' ||
    user?.role_2 === 'guru';

  // Role yang berhak menilai tugas: role 'admin' atau role_2 'pengurus_lab' (juga guru)
  const canGrade =
    user?.role === 'admin' ||
    user?.role_2 === 'pengurus_lab' ||
    user?.role === 'guru' ||
    user?.role_2 === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 pt-20 sm:pt-24 px-3 sm:px-6 max-w-7xl mx-auto space-y-5">
      {/* Top Navigation Bar / Breadcrumb (Anti-Overlap Navbar) */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/80 shadow-2xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 flex-wrap">
          <span className="hidden sm:inline">Ruang Spendaraja</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-violet-700 font-bold flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" />
            Ekstra TIK
          </span>
          <span className="px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded-full font-bold border border-emerald-200 flex items-center gap-1">
            <Database className="w-3 h-3" />
            Supabase DB
          </span>
        </div>
      </div>

      {/* Header Utama Portal Ekstra TIK */}
      <EkstraHeader
        user={user}
        isLocked={isLocked}
        onOpenLogin={handleOpenLogin}
      />

      {/* Panel Kontrol Khusus Admin / Guru */}
      {isAdmin && (
        <EkstraAdminControl
          isLocked={isLocked}
          setIsLocked={setIsLocked}
          anggotaList={anggotaList}
          presensiList={allPresensiList}
          onRefreshData={loadInitialData}
        />
      )}

      {/* Tab Navigasi Fleksibel (HP & Laptop): Presensi, Kumpul Tugas, Leaderboard, Penilaian Guru */}
      <div className="p-1.5 bg-slate-200/80 rounded-2xl flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
        <button
          onClick={() => setActiveTab('presensi')}
          className={`flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'presensi'
              ? 'bg-white text-violet-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <UserCheck className="w-4 h-4 text-violet-600 shrink-0" />
          <span>Presensi</span>
        </button>

        <button
          onClick={() => setActiveTab('tugas')}
          className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'tugas'
              ? 'bg-white text-indigo-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <UploadCloud className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Kumpul Tugas</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'leaderboard'
              ? 'bg-white text-amber-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Leaderboard</span>
        </button>

        {/* Tab Penilaian Guru (Hanya untuk role admin / pengurus_lab / guru) */}
        {canGrade && (
          <button
            onClick={() => setActiveTab('penilaian')}
            className={`flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'penilaian'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Penilaian Guru</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Evaluasi
            </span>
          </button>
        )}
      </div>

      {/* Konten Tab Aktif */}
      <div className="mt-3">
        {activeTab === 'presensi' && (
          <FormPresensiEkstra
            user={user}
            isLocked={isLocked}
            anggotaList={anggotaList}
            allPresensiList={allPresensiList}
            onRefreshData={loadInitialData}
            onOpenLogin={handleOpenLogin}
          />
        )}

        {activeTab === 'tugas' && (
          <FormKumpulTugasEkstra
            user={user}
            anggotaList={anggotaList}
            onOpenLogin={handleOpenLogin}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardEkstra
            user={user}
            anggotaList={anggotaList}
            pengumpulanList={allPengumpulanList}
            presensiList={allPresensiList}
          />
        )}

        {activeTab === 'penilaian' && canGrade && (
          <PenilaianTugasEkstra
            user={user}
            anggotaList={anggotaList}
          />
        )}
      </div>
    </div>
  );
}
