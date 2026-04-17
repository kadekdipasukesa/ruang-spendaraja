import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GempitasPage from './pages/Gempitas';
import CatatPelanggaran from './pages/CatatPelanggaran';
import FloatingOnline from './components/FloatingOnline'; // 1. Import komponennya

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
    if (path === '/') return 'Beranda';
    if (path === '/gempitas') return 'Gempitas';
    if (path === '/pelanggaran') return 'Pelanggaran';
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
        <Route path="/login" element={<div className="p-10 text-center">Gunakan form di Home untuk Login sementara.</div>} />
        <Route path="/gempitas" element={<GempitasPage />} caseSensitive={false} />
        <Route path="/pelanggaran" element={<CatatPelanggaran />} caseSensitive={false} />
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