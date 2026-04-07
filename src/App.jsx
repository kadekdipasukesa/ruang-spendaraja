import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GempitasPage from './pages/Gempitas';
import CatatPelanggaran from './pages/CatatPelanggaran'; // Import halaman baru

// Kita buat komponen wrapper untuk konten utama
function AppContent() {
  const location = useLocation();

  // Hanya sembunyikan Navbar di halaman /gempitas saja (jika memang diperlukan)
  const hideNavbarPaths = ['/gempitas'];
  
  // Tambahkan .toLowerCase() pada location.pathname
  const showNavbar = !hideNavbarPaths.includes(location.pathname.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar sekarang akan muncul di /pelanggaran */}
      {showNavbar && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<div className="p-10 text-center">Gunakan form di Home untuk Login sementara.</div>} />
        
        {/* Route Gempitas */}
        <Route path="/gempitas" element={<GempitasPage />} caseSensitive={false} />
        
        {/* Route Catat Pelanggaran (Tetap dengan Navbar) */}
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