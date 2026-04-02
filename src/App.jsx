import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FlappyBirdPage from './pages/game2_flappy'; // Import file yang kita buat tadi

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<div className="p-10 text-center">Gunakan form di Home untuk Login sementara.</div>} />
          <Route path="/game2_flappy" element={<FlappyBirdPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;