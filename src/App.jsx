import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GempitasPage from './pages/Gempitas';

// Kita buat komponen wrapper untuk konten utama
function AppContent() {
  const location = useLocation();

  // Tentukan path dalam huruf kecil saja
  const hideNavbarPaths = ['/gempitas'];
  
  // Tambahkan .toLowerCase() pada location.pathname
  const showNavbar = !hideNavbarPaths.includes(location.pathname.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<div className="p-10 text-center">Gunakan form di Home untuk Login sementara.</div>} />
        {/* Tambahkan caseSensitive={false} agar route-nya juga fleksibel */}
        <Route path="/gempitas" element={<GempitasPage />} caseSensitive={false} />
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