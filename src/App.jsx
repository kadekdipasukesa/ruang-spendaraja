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