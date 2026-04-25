import React, { useState, useEffect, useMemo } from 'react'; // Tambahkan useMemo di sini
import { AnimatePresence } from 'framer-motion';
import Hero from '../components/Home/Hero';
import ShortcutCard from '../components/Home/ShortcutCard';
import FeedbackForm from '../components/Home/FeedbackForm';
import { Monitor, Globe, BookOpen, UserCheck, ShieldAlert } from 'lucide-react';
import { checkAppAccess } from '../utils/appPermissions'; // Pastikan helper ini sudah dibuat
import Footer from '../components/Home/Footer'; // Sesuaikan path

const HomeRoot = () => {
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('Semua');

  useEffect(() => {
    const savedUser = localStorage.getItem('user_siswa');
    if (savedUser) setStudent(JSON.parse(savedUser));
  }, []);

  // Data Aplikasi diletakkan di luar useMemo atau di luar komponen jika datanya statis
  const availableApps = [
    {
      id: 'tik7',
      tag: 'Akademik',
      title: 'Ruang Belajar',
      subtitle: 'Informatika 7',
      icon: <Monitor size={28} />,
      color: 'from-blue-400/30 to-transparent',
      glow: 'group-hover:border-blue-400',
      shadow: 'hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)]',
      glowColor: 'text-blue-400',
      path: '/ruang-belajar',
      desc: 'Materi, Tugas, & Ulangan interaktif.',
      isLocked: true // Default state, akan diproses di processedApps
    },
    {
      id: 'gempitas',
      tag: 'Event',
      title: 'GEMPITAS 2026',
      subtitle: 'Lomba Sekolah',
      icon: <Globe size={28} />,
      color: 'from-amber-400/30 to-transparent',
      glow: 'group-hover:border-amber-400',
      shadow: 'hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.5)]',
      glowColor: 'text-amber-400',
      path: '/gempitas',
      desc: 'Pendaftaran & informasi Gema Lomba.'
    },
    {
      id: 'pelanggaran',
      tag: 'Sistem',
      title: 'Catatan Disiplin',
      subtitle: 'Poin Siswa',
      icon: <ShieldAlert size={28} />,
      color: 'from-rose-400/30 to-transparent',
      glow: 'group-hover:border-rose-400',
      shadow: 'hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.5)]',
      glowColor: 'text-rose-400',
      path: '/pelanggaran',
      desc: 'Sistem poin pelanggaran real-time.'
    },
    {
      id: 'liburan',
      tag: 'Liburan',
      title: 'Monitoring',
      subtitle: 'Laporan Mandiri',
      icon: <UserCheck size={28} />,
      color: 'from-emerald-400/30 to-transparent',
      glow: 'group-hover:border-emerald-400',
      shadow: 'hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)]',
      glowColor: 'text-emerald-400',
      path: 'https://script.google.com/a/macros/guru.smp.belajar.id/s/AKfycbzlKlYSmo5WIcd6If6botntfyGc0E30ttGGHhL14Fhd98IoFqnEfY0iuR4tS6AWTUu0/exec',
      isExternal: true,
      desc: 'Monitoring belajar mandiri siswa masa liburan.'
    },
    {
      id: 'presensi',
      tag: 'Fasilitas',
      title: 'Presensi Siswa',
      subtitle: 'Harian QR Code',
      icon: <UserCheck size={28} />,
      color: 'from-rose-400/30 to-transparent',
      glow: 'group-hover:border-rose-400',
      shadow: 'hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.5)]',
      glowColor: 'text-rose-400',
      path: '#',
      isComingSoon: true,
      desc: 'Sistem absensi kehadiran siswa dengan scan QR Code.'
    },
    {
      id: 'perpus',
      tag: 'Fasilitas',
      title: 'E-Library',
      subtitle: 'Buku Digital',
      icon: <BookOpen size={28} />,
      color: 'from-indigo-400/30 to-transparent',
      glow: 'group-hover:border-indigo-400',
      shadow: 'hover:shadow-[0_0_30px_-5px_rgba(129,140,248,0.5)]',
      glowColor: 'text-indigo-400',
      path: '#',
      isComingSoon: true,
      desc: 'Koleksi literasi digital sekolah.'
    }
  ];

  // Olah status locked berdasarkan helper
  const processedApps = useMemo(() => {
    return availableApps.map(app => ({
      ...app,
      // Jika helper mengembalikan false, maka isLocked = true
      isLocked: app.id === 'tik7' ? !checkAppAccess(app.id, student) : false
    }));
  }, [student]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="container mx-auto px-5 pt-24">
        
        <Hero
          student={student}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Gunakan processedApps hasil filter, bukan availableApps langsung */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          <AnimatePresence mode="popLayout">
            {processedApps
              .filter(app => activeTab === 'Semua' || app.tag === activeTab)
              .map((app, index) => (
                <ShortcutCard key={app.id} app={app} index={index} />
              ))}
          </AnimatePresence>
        </div>

        <FeedbackForm />
        
      </main>
      <Footer />
    </div>
  );
};

export default HomeRoot;