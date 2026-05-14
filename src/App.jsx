import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RuangBelajar from './pages/RuangBelajar'; // File lama yang di-rename
import GempitasPage from './pages/Gempitas';
import CatatPelanggaran from './pages/CatatPelanggaran';
import FloatingOnline from './components/FloatingOnline'; // 1. Import komponennya
import UlanganPage from './pages/UlanganPage'; // Pastikan path import benar
import AdminUjian from './pages/AdminUjian'; // Pastikan path import benar
import TypingChallengePage from './pages/typing-challenge';
import BEE2026 from './pages/bee-2026';
import DashboardGuru from './pages/DashboardGuru';
import AnalisisPelanggaran from './pages/AnalisisPelanggaran';
import MonitoringRealtime from './pages/MonitoringRealTime';
import SimulasiInteraktif from './pages/SimulasiInteraktif';
import PortfolioLeaderboard from './pages/PortfolioLeaderboard';
import AnalisisNilai from './pages/AnalisisNilai';
import FaceAbsenPage from './pages/face-absen';

function AppContent() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // 2. Ambil data user secara global agar FloatingOnline tahu siapa yang aktif
  useEffect(() => {
    const savedUser = localStorage.getItem('user_siswa'); // Sesuaikan key storage kamu
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const hideNavbarPaths = ['/gempitas'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname.toLowerCase());

  // 3. Logika untuk menentukan label posisi di statistik online secara otomatis
  const getActiveTabLabel = () => {
    const path = location.pathname.toLowerCase();

    // 1. Root Home (Daftar Aplikasi)
    if (path === '/') return 'Home';

    // 2. Ruang Belajar Informatika (Eks Home.jsx lama)
    if (path === '/ruang-belajar') return 'Ruang Belajar TIK';

    // 3. Halaman Gempitas
    if (path === '/gempitas') return 'Gempitas 2026';

    // 4. Halaman Pelanggaran
    if (path === '/pelanggaran') return 'Catatan Disiplin';

    if (path === '/admin-ujian') return 'Control Ujian';
    if (path === '/ulangan') return 'Ulangan';
    if (path === '/typing-challenge') return 'Typing Challenge';
    if (path === '/bee-2026') return 'Melihat Expo BEE';
    if (path === '/guru') return 'dasboard guru';
    if (path === '/analisis-pelanggaran') return 'Analisis Pelanggaran';
    if (path === '/monitoring-realtime') return 'Monitoring Realtime';
    if (path === '/simulasi-interaktif') return 'Simulasi Interaktif';
    if (path === '/portfolio-leaderboard') return 'Portfolio Leaderboard';
    if (path === '/analisis-nilai') return 'Analisis Nilai';
    if (path === '/face-absen') return 'Face Absen';
    // 5. Default jika tidak ada yang cocok
    return 'Menjelajah';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}

      {/* 4. Pasang FloatingOnline di sini (di luar Routes) */}
      {/* Dia akan muncul di setiap halaman otomatis */}
      <FloatingOnline
        user={user}
        activeTab={getActiveTabLabel()}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ruang-belajar" element={<RuangBelajar />} />
        <Route path="/login" element={<div className="p-10 text-center">Gunakan form di Home untuk Login sementara.</div>} />
        <Route path="/gempitas" element={<GempitasPage />} caseSensitive={false} />
        <Route path="/pelanggaran" element={<CatatPelanggaran />} caseSensitive={false} />

        {/* Tambahkan rute baru di bawah ini */}
        <Route path="/ulangan" element={<UlanganPage />} />
        <Route path="/admin-ujian" element={<AdminUjian />} />
        <Route path="/typing-challenge" element={<TypingChallengePage />} />
        <Route path="/bee-2026" element={<BEE2026 />} />
        <Route path="/guru" element={<DashboardGuru />} />
        <Route path="/analisis-pelanggaran" element={<AnalisisPelanggaran />} />
        <Route path="/monitoring-realtime" element={<MonitoringRealtime />} />
        <Route path="/simulasi-interaktif" element={<SimulasiInteraktif />} />
        <Route path="/portfolio-leaderboard" element={<PortfolioLeaderboard />} />
        <Route path="/analisis-nilai" element={<AnalisisNilai />} />
        <Route path="/face-absen" element={<FaceAbsenPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;