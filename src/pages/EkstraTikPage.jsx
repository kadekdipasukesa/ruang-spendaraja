import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserCheck, UploadCloud, Cpu, Sparkles, BookOpen, Database } from 'lucide-react';
import EkstraHeader from '../components/EkstraTik/EkstraHeader';
import EkstraAdminControl from '../components/EkstraTik/EkstraAdminControl';
import FormPresensiEkstra from '../components/EkstraTik/FormPresensiEkstra';
import FormKumpulTugasEkstra from '../components/EkstraTik/FormKumpulTugasEkstra';
import { 
  getStatusAbsenEkstra, 
  subscribeStatusAbsenEkstra,
  getAnggotaEkstra,
  getPresensiEkstra,
  subscribePresensiEkstra
} from '../services/ekstraTikService';

export default function EkstraTikPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('presensi'); // 'presensi' | 'tugas'
  const [isLocked, setIsLocked] = useState(false);
  const [anggotaList, setAnggotaList] = useState([]);
  const [allPresensiList, setAllPresensiList] = useState([]);
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

  // Muat data anggota dan presensi dari database Supabase
  const loadInitialData = useCallback(async () => {
    try {
      setLoadingData(true);
      const [anggota, presensi] = await Promise.all([
        getAnggotaEkstra(),
        getPresensiEkstra()
      ]);
      setAnggotaList(anggota || []);
      setAllPresensiList(presensi || []);
    } catch (err) {
      console.error('Gagal memuat data ekstra dari Supabase:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Cek status kunci absensi dari database Supabase & Realtime Subscription
  useEffect(() => {
    let unsubscribeStatus = () => {};
    let unsubscribePresensi = () => {};

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
    };

    initStatus();
    return () => {
      unsubscribeStatus();
      unsubscribePresensi();
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 pt-4 sm:pt-6 px-3 sm:px-6 max-w-7xl mx-auto space-y-5">
      {/* Top Navigation Bar / Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/80 shadow-2xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
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

      {/* Tab Navigasi: Presensi vs Kumpul Tugas */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab('presensi')}
          className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === 'presensi'
              ? 'bg-white text-violet-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4 text-violet-600" />
          <span>Presensi Kehadiran</span>
        </button>

        <button
          onClick={() => setActiveTab('tugas')}
          className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === 'tugas'
              ? 'bg-white text-indigo-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UploadCloud className="w-4 h-4 text-indigo-600" />
          <span>Kumpul Tugas</span>
        </button>
      </div>

      {/* Konten Tab Aktif */}
      <div className="mt-4">
        {activeTab === 'presensi' ? (
          <FormPresensiEkstra
            user={user}
            isLocked={isLocked}
            anggotaList={anggotaList}
            allPresensiList={allPresensiList}
            onRefreshData={loadInitialData}
            onOpenLogin={handleOpenLogin}
          />
        ) : (
          <FormKumpulTugasEkstra
            user={user}
            anggotaList={anggotaList}
            onOpenLogin={handleOpenLogin}
          />
        )}
      </div>
    </div>
  );
}
