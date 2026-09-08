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
import InputNilaiPage from './pages/input-nilai';

import RemidiPage from './pages/RemidiPage';
import AdminRemidi from './pages/AdminRemidi';

import HalamanPengumuman from './pages/HalamanPengumuman';

import ResetPasswordAdmin from './pages/Admin/ResetPasswordAdmin';
import ResetRemidiAdmin from './pages/Admin/ResetRemidiAdmin';

// 📝 IMPOR HALAMAN AGENDA GURU YANG BARU
import AgendaGuruPage from './pages/AgendaGuruPage';
import KelolaSiswaPage from './pages/Admin/KelolaSiswaPage';

import JurnalLabPage from './pages/JurnalLabPage';      // Halaman Jurnal Lab Baru

// 📂 IMPOR HALAMAN TUGAS KHUSUS RUANG BELAJAR
import TugasSimulasiFolder from './pages/TugasKhusus/TugasSimulasiFolder';
import TugasKuisAlgoritma from './pages/TugasKhusus/TugasKuisAlgoritma';
import TugasBerpikirKomputasional from './pages/TugasKhusus/TugasBerpikirKomputasional';
import TugasSistemKomputer from './pages/TugasKhusus/TugasSistemKomputer';


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

    // 2. Ruang Belajar Informatika
    if (path === '/ruang-belajar') return 'Ruang Belajar TIK';

    // 📚 Tugas Khusus Praktikum & Modul Pembelajaran
    if (path.includes('/tugas/simulasi-folder')) return 'Tugas 1: Simulasi Folder';
    if (path.includes('/tugas/berpikir-komputasional') || path.includes('/tugas/kuis-algoritma')) return 'Tugas 2: Berpikir Komputasional';
    if (path.includes('/tugas/sistem-komputer') || path.includes('/tugas/perkakas-digital')) return 'Tugas 3: Sistem Komputer';

    // 🗓️ Laboratorium & Agenda
    if (path === '/jurnal-lab') return 'Jurnal Lab Komputer';
    if (path === '/agenda-guru') return 'Mengisi Agenda Guru';

    // 3. Halaman Gempitas & Expo
    if (path === '/gempitas') return 'Gempitas 2026';
    if (path === '/bee-2026') return 'Melihat Expo BEE';

    // 4. Halaman Kedisiplinan & Pelanggaran
    if (path === '/pelanggaran') return 'Catatan Disiplin';
    if (path === '/analisis-pelanggaran') return 'Analisis Pelanggaran';

    // 5. Ulangan & Remedial
    if (path === '/ulangan') return 'Mengerjakan Ulangan';
    if (path === '/admin-ujian') return 'Control Ujian';
    if (path === '/remidi') return 'Mengerjakan Remidi';
    if (path === '/admin-remidi') return 'Control Remidi';

    // 6. Mini Game & Praktik
    if (path === '/typing-challenge') return 'Typing Challenge';

    // 7. Guru & Admin
    if (path === '/guru') return 'Dashboard Guru';
    if (path === '/admin/kelola-siswa') return 'Kelola Akun Siswa';
    if (path.startsWith('/admin_ruangspendara/')) return 'Admin Spendaraja';

    // 8. Modul Khusus Lainnya
    if (path === '/monitoring-realtime') return 'Monitoring Realtime';
    if (path === '/simulasi-interaktif') return 'Simulasi Interaktif';
    if (path === '/portfolio-leaderboard') return 'Portfolio Leaderboard';
    if (path === '/analisis-nilai') return 'Analisis Nilai';
    if (path === '/face-absen') return 'Face Absen';
    if (path === '/input-nilai') return 'Input Nilai';
    if (path === '/pengumuman-sas') return 'Pengumuman SAS';

    // 9. Default jika berada di halaman lain
    return 'Menjelajah Portal';
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

        {/* --------------------------------------------------------
            ⚡ ROUTING REMIDI BARU (MENGIKUTI POLA SEBELUMNYA)
           -------------------------------------------------------- */}
        <Route path="/remidi" element={<RemidiPage />} />
        <Route path="/admin-remidi" element={<AdminRemidi />} />

        {/* 🌟 RUTE BARU: Halaman Pengumuman SAS & Tugas Scratch */}
        <Route path="/pengumuman-sas" element={<HalamanPengumuman />} />

        <Route path="/admin_ruangspendara/reset-password" element={<ResetPasswordAdmin />} />
        <Route path="/admin_ruangspendara/reset-remidi" element={<ResetRemidiAdmin />} />

        <Route path="/typing-challenge" element={<TypingChallengePage />} />
        <Route path="/bee-2026" element={<BEE2026 />} />
        <Route path="/guru" element={<DashboardGuru />} />
        <Route path="/analisis-pelanggaran" element={<AnalisisPelanggaran />} />
        <Route path="/monitoring-realtime" element={<MonitoringRealtime />} />
        <Route path="/simulasi-interaktif" element={<SimulasiInteraktif />} />
        <Route path="/portfolio-leaderboard" element={<PortfolioLeaderboard />} />
        <Route path="/analisis-nilai" element={<AnalisisNilai />} />
        <Route path="/face-absen" element={<FaceAbsenPage />} />
        <Route path="/input-nilai" element={<InputNilaiPage />} />

        {/* ─── 🗓️ RUTE BARU: JURNAL & AGENDA KERJA GURU ─── */}
        <Route path="/agenda-guru" element={<AgendaGuruPage />} />
        <Route path="/admin/kelola-siswa" element={<KelolaSiswaPage />} />
        <Route path="/jurnal-lab" element={<JurnalLabPage />} />

        {/* ─── 📚 RUTE TUGAS KHUSUS RUANG BELAJAR ─── */}
        <Route path="/ruang-belajar/tugas/simulasi-folder" element={<TugasSimulasiFolder />} />
        <Route path="/ruang-belajar/tugas/kuis-algoritma" element={<TugasBerpikirKomputasional />} />
        <Route path="/ruang-belajar/tugas/sistem-komputer" element={<TugasSistemKomputer />} />
        <Route path="/tugas/simulasi-folder" element={<TugasSimulasiFolder />} />
        <Route path="/tugas/kuis-algoritma" element={<TugasBerpikirKomputasional />} />
        <Route path="/tugas/berpikir-komputasional" element={<TugasBerpikirKomputasional />} />
        <Route path="/tugas/sistem-komputer" element={<TugasSistemKomputer />} />
        <Route path="/tugas/perkakas-digital" element={<TugasSistemKomputer />} />

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