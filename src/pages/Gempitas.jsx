import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Smartphone,
  Users,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  MessageCircle,
  Globe,
  ChevronRight,
  ChevronDown, // TAMBAHKAN INI
  Microscope,
  X,
  BarChart2,
  FileText, 
  FileCheck
} from 'lucide-react';
import "../App.css"; // Gunakan titik dua (..) untuk keluar dari folder pages ke folder src
import PosterGempitas from '../assets/Gempitas/foster_gempitas.jpeg'; // Tambahkan ini

const GempitasPage = () => {
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [showKisiKisi, setShowKisiKisi] = useState(false);

  // 1. Hook untuk Loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // 2. Hook untuk Countdown
  useEffect(() => {
    const targetDate = new Date("May 2, 2026 08:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  // Early return dipindahkan ke bawah setelah semua Hook dipanggil
  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0f172a] z-[2000] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <h6 className="mt-4 text-blue-400 font-bold animate-pulse tracking-widest">
          MENYINKRONKAN DATA GEMPITAS...
        </h6>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans relative overflow-x-hidden pb-20">
      {/* --- EFEK KUNANG-KUNANG (PREMIUM, DI LATAR BELAKANG) --- */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }} // Gunakan z-1 agar di atas background dasar tetapi di bawah konten z-10
      >
        {[
          { t: '80%', l: '10%', d: '12s', del: '0s' },
          { t: '60%', l: '80%', d: '15s', del: '2s' },
          { t: '90%', l: '40%', d: '18s', del: '4s' },
          { t: '40%', l: '20%', d: '14s', del: '1s' },
          { t: '70%', l: '60%', d: '20s', del: '3s' },
          { t: '85%', l: '30%', d: '16s', del: '5s' },
          { t: '50%', l: '90%', d: '13s', del: '1.5s' },
          { t: '95%', l: '75%', d: '19s', del: '2.5s' },
        ].map((item, i) => (
          <div
            key={i}
            className="firefly-legacy"
            style={{
              top: item.t,
              left: item.l,
              willChange: 'transform',
              animation: `fly-simple ${item.d} infinite ease-in-out ${item.del}`,
            }}
          />
        ))}
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-16 pb-32 text-center px-4 overflow-hidden"
        style={{
          background: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url('https://uks.bulelengkab.go.id/uploads/sekolah/Foto-smp-negeri-2-singaraja-B.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top'
        }}>

        {/* --- CREDIT TEXT POJOK KANAN ATAS --- */}
        <div className="absolute top-5 right-5 md:top-8 md:right-8 z-30">
          <div className="text-right border-r-2 border-blue-500 pr-3 backdrop-blur-[2px] bg-black/5 py-1">
            <p className="text-[9px] md:text-[11px] text-blue-300 font-bold uppercase tracking-[0.2em] mb-0.5 drop-shadow-md">
              developed by
            </p>
            <p className="text-[11px] md:text-[13px] text-white font-bold tracking-wide drop-shadow-lg">
              ruang-spendaraja.vercel.app
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <img
            src="https://smpn2singaraja.sch.id/wp-content/uploads/2025/05/cropped-cropped-cropped-LOGO-SMP-NEGERI-2-SINGARAJA-1.png"
            className="w-20 mx-auto mb-6 drop-shadow-2xl"
            alt="Logo SMPN 2 Singaraja"
          />

          <p className="text-white font-bold tracking-[0.3em] mb-2 text-sm md:text-base">
            SMP NEGERI 2 SINGARAJA
          </p>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter uppercase">
            GEMPITAS 2026
          </h1>

          <p className="text-blue-400 text-lg md:text-xl font-bold tracking-widest uppercase mb-8">
            Gema Lomba Matematika, IPA & IPS
          </p>

          {/* --- COUNTDOWN TIMER --- */}
          <div className="flex justify-center gap-3 md:gap-6 mb-8">
            {[
              { label: 'Hari', value: timeLeft.days },
              { label: 'Jam', value: timeLeft.hours },
              { label: 'Menit', value: timeLeft.minutes },
              { label: 'Detik', value: timeLeft.seconds },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-2 shadow-xl">
                  <span className="text-2xl md:text-4xl font-black text-white leading-none">
                    {String(item.value).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] md:text-xs font-bold text-blue-300 uppercase tracking-widest">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-xs font-bold uppercase tracking-wider">
            <span className="bg-blue-500/20 text-blue-300 px-5 py-2 rounded-full border border-blue-500/30 backdrop-blur-sm">SD/MI Sederajat</span>
            <span className="bg-blue-500/20 text-blue-300 px-5 py-2 rounded-full border border-blue-500/30 backdrop-blur-sm">Se-Kabupaten Buleleng</span>
          </div>
        </motion.div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full leading-[0]">
          <svg viewBox="0 0 1440 120" className="relative block w-full h-[80px] fill-[#0f172a]">
            <path d="M0,96L80,90.7C160,85,320,75,480,69.3C640,64,800,64,960,69.3C1120,75,1280,85,1360,90.7L1440,96L1440,120L0,120Z"></path>
          </svg>
        </div>
      </section>
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {[
            {
              label: 'Pembina',
              color: 'from-slate-900 via-slate-950 to-slate-900', // Deep Black/Slate
              hoverBorder: 'group-hover:border-slate-500',
              hoverGlow: 'group-hover:shadow-slate-500/30',
              textColor: 'text-slate-200',
              accentColor: 'text-slate-400',
              link: 'https://forms.gle/6z1HZdxBTDQu4Bx16',
              icon: <Users />,
              bgIcon: <Users size={120} className="absolute -bottom-8 -right-8 opacity-5 group-hover:opacity-15 group-hover:-rotate-12 transition-all duration-500" />
            },
            {
              label: 'Matematika',
              color: 'from-rose-950 via-red-950 to-rose-950', // Deep Dark Red
              hoverBorder: 'group-hover:border-red-400',
              hoverGlow: 'group-hover:shadow-red-500/40',
              textColor: 'text-red-100',
              accentColor: 'text-red-300',
              link: 'https://forms.gle/CS4ShqPWLdSdQCXt9',
              icon: <BookOpen />,
              bgIcon: <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 font-black text-6xl md:text-7xl select-none text-white italic">∑π</div>
            },
            {
              label: 'IPA',
              color: 'from-emerald-950 via-green-950 to-emerald-950', // Deep Dark Green
              hoverBorder: 'group-hover:border-emerald-400',
              hoverGlow: 'group-hover:shadow-emerald-500/40',
              textColor: 'text-emerald-100',
              accentColor: 'text-emerald-300',
              link: 'https://forms.gle/cWgoTYujVv6hnNBaA',
              icon: <Microscope />, // SEKARANG MENGGUNAKAN MIKROSKOP
              bgIcon: <Microscope size={130} className="absolute -bottom-8 -right-6 opacity-5 group-hover:opacity-15 group-hover:rotate-12 transition-all duration-500" />
            },
            {
              label: 'IPS',
              color: 'from-amber-950 via-orange-950 to-amber-950', // Deep Dark Orange
              hoverBorder: 'group-hover:border-orange-400',
              hoverGlow: 'group-hover:shadow-orange-500/40',
              textColor: 'text-amber-100',
              accentColor: 'text-amber-300',
              link: 'https://forms.gle/8Ma8qQY6StgcMAf3A',
              icon: <Globe />,
              bgIcon: <Globe size={130} className="absolute -bottom-8 -right-8 opacity-5 group-hover:opacity-15 group-hover:rotate-45 transition-all duration-500" />
            },
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              // Responsive Padding: py-5 di HP (Ramping), p-8 di Desktop
              className={`relative group block py-5 px-6 md:p-8 rounded-3xl md:rounded-[2.5rem] bg-gradient-to-br ${item.color} border border-white/5 md:border-2 ${item.hoverBorder} ${item.hoverGlow} transition-all duration-500 shadow-2xl overflow-hidden`}
            >
              {/* 1. Background Dekoratif Besar (Ikon Bayangan) */}
              {item.bgIcon}

              {/* 2. Garis Outline Cahaya (Animated Border Effect) */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
              </div>

              {/* 3. Main Content Wrapper (Flex untuk Ramping di HP) */}
              <div className="relative z-10 flex items-center md:items-start gap-5 md:gap-0 md:flex-col">
                {/* Responsive Icon Utama: Lebih kecil di HP, Glassmorphism Efek */}
                <div className={`flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 group-hover:scale-105 group-hover:bg-white/10 transition-all duration-500 shrink-0 ${item.accentColor}`}>
                  {React.cloneElement(item.icon, { className: 'w-6 h-6 md:w-8 md:h-8', strokeWidth: 1.5 })}
                </div>

                {/* 4. Text Content: Ramping di HP */}
                <div className="flex-grow md:mt-6">
                  <p className="text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] mb-0.5">
                    Pendaftaran
                  </p>
                  <h3 className={`text-2xl md:text-3xl font-black ${item.textColor} tracking-tight italic leading-tight`}>
                    {item.label}
                  </h3>
                </div>

                {/* 5. Dekorasi Panah Kecil (Sembunyi di HP agar ramping) */}
                <div className="mt-8 hidden md:flex items-center gap-2">
                  <div className="h-[2px] w-8 bg-white/20 group-hover:w-16 group-hover:bg-white transition-all duration-500" />
                  <ChevronRight size={16} className="text-white/50 group-hover:text-white" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* LINK MONITORING DALAM BENTUK LABEL KECIL DI POJOK KANAN BAWAH */}
        <div className="flex justify-end -mt-6 mb-10 px-2">
          <a
            href="https://script.google.com/macros/s/AKfycbxv0JC4PzEsD3fFfcuzBXuJakaJO0sUvelGt0xjgkRrBjUh6rn2bkU-FGPWD-zqu1yRZw/exec"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 text-[10px] md:text-xs font-bold text-white/40 hover:text-amber-400 transition-all duration-300 bg-white/5 hover:bg-amber-400/10 px-4 py-2 rounded-full border border-white/5 hover:border-amber-400/20"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="uppercase tracking-[0.2em]">Cek Data Pendaftaran Realtime</span>
            <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </a>
        </div>

        {/* CSS Animasi Shimmer (Jika belum ada di global CSS) */}
        <style dangerouslySetInnerHTML={{
          __html: `
  @keyframes shimmer {
    100% { transform: translateX(100%); }
  }
`}} />

        {/* --- TOMBOL UTAMA KISI-KISI (PREMIUM VERSION) --- */}
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setShowKisiKisi(!showKisiKisi)}
            className={`
      group relative flex items-center gap-4 px-10 py-5 rounded-[2rem] 
      transition-all duration-500 overflow-hidden
      ${showKisiKisi
                ? 'bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.4)] border-blue-400'
                : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-blue-500/50'}
      border backdrop-blur-md
    `}
          >
            {/* Efek Sorot Cahaya (Shine Effect) saat Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />

            {/* Lingkaran Icon */}
            <div className={`
      w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500
      ${showKisiKisi ? 'bg-white/20 rotate-12' : 'bg-blue-500/20 text-blue-400'}
    `}>
              <BookOpen size={20} className={showKisiKisi ? 'text-white' : ''} />
            </div>

            {/* Label Teks */}
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 text-white">
                Materi Lomba
              </span>
              <span className="text-white font-black tracking-wider uppercase text-base -mt-1">
                {showKisiKisi ? 'Tutup Materi' : 'Lihat Kisi-kisi'}
              </span>
            </div>

            {/* Icon Panah dengan Animasi Bounce Pelan */}
            <div className={`
      ml-4 transition-all duration-500 transform
      ${showKisiKisi ? 'rotate-180 text-white' : 'text-blue-400 group-hover:translate-y-1'}
    `}>
              <ChevronDown size={22} strokeWidth={3} />
            </div>
          </button>
        </div>

        {/* --- PANEL LABEL MATERI (SHOW/HIDE) --- */}
        <AnimatePresence>
          {showKisiKisi && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-8 md:p-12 mb-12 backdrop-blur-2xl shadow-2xl"
            >
              {/* JUDUL HEADER DALAM PANEL */}
              <div className="text-center mb-10">
                <h2 className="text-white font-black tracking-[0.3em] text-sm uppercase mb-2">Materi</h2>
                <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full shadow-[0_0_10px_#3b82f6]"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">

                {/* MAP MATERI */}
                {[
                  {
                    label: 'Matematika',
                    icon: <div className="italic font-black text-xs">∑</div>,
                    color: 'rose',
                    materi: ['Bilangan', 'Aritmatika', 'Geometri', 'Statistika Data', 'Pengukuran']
                  },
                  {
                    label: 'IPA',
                    icon: <Microscope size={14} />,
                    color: 'emerald',
                    materi: ['Metode Ilmiah', 'Hayati', 'Mekanisme', 'Ekologi', 'Kesehatan', 'Mekanika', 'Listrik', 'Optik', 'Suhu', 'Antariksa']
                  },
                  {
                    label: 'IPS',
                    icon: <Globe size={14} />,
                    color: 'amber',
                    materi: ['Budaya', 'Alam', 'Kerajaan', 'Perjuangan', 'Geografi', 'Ekonomi', 'ASEAN']
                  }
                ].map((item, idx) => (
                  <div key={idx} className="relative px-4 border-r last:border-r-0 border-white/5">
                    {/* Header Per Subjek */}
                    <div className={`flex items-center gap-3 mb-6 justify-center md:justify-start text-${item.color}-400`}>
                      <div className={`w-8 h-8 rounded-full bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center`}>
                        {item.icon}
                      </div>
                      <span className="font-black text-sm uppercase tracking-widest text-white">{item.label}</span>
                    </div>

                    {/* List Materi (Pills Style) */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {item.materi.map((m, i) => (
                        <div
                          key={i}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all duration-300
                    bg-white/5 border-white/10 text-slate-400 hover:border-${item.color}-500/50 hover:text-white hover:bg-${item.color}-500/10`}
                        >
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOTER PANEL */}
              <div className="mt-10 pt-6 border-t border-white/5 text-center">
                <p className="text-slate-500 text-[10px] font-medium tracking-widest uppercase flex items-center justify-center gap-2">
                  <BookOpen size={12} /> Materi standar olimpiade sains tingkat kabupaten
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* --- SEKSI DOKUMEN PENDUKUNG --- */}
<motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4"
>
  {/* Card Juknis */}
  <a
    href="https://drive.google.com/file/d/1pxXJt_ZqgKzftsqumFQZOWDuuESt2W5K/view?usp=sharing"
    target="_blank"
    rel="noreferrer"
    className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-blue-600/10 hover:border-blue-500/50 transition-all duration-300"
  >
    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
      <FileText size={24} />
    </div>
    <div className="flex-grow">
      <h4 className="text-white text-xs font-black uppercase tracking-widest">Juknis Lomba</h4>
      <p className="text-white/40 text-[10px]">Panduan Teknis Pelaksanaan (PDF)</p>
    </div>
    <Download size={16} className="text-white/20 group-hover:text-white transition-all" />
  </a>

  {/* Card Surat Rekomendasi */}
  <a
    href="https://drive.google.com/file/d/1r7ZSOz-ABuRlHEnBDl36KpFj0noO3kLy/view?usp=sharing"
    target="_blank"
    rel="noreferrer"
    className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-indigo-600/10 hover:border-indigo-500/50 transition-all duration-300"
  >
    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
      <FileCheck size={24} />
    </div>
    <div className="flex-grow">
      <h4 className="text-white text-xs font-black uppercase tracking-widest">Surat Rekomendasi</h4>
      <p className="text-white/40 text-[10px]">Format Surat Utusan Sekolah</p>
    </div>
    <Download size={16} className="text-white/20 group-hover:text-white transition-all" />
  </a>
</motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* BOX JADWAL & POSTER WRAPPER */}
            <div className="bg-[#1e293b] rounded-[2rem] p-6 md:p-8 border border-white/5 shadow-xl">
              <div className="flex flex-col md:flex-row gap-8">

                {/* --- KOLOM KIRI: JADWAL DENGAN GARIS TIMELINE --- */}
                <div className="flex-1">
                  <h3 className="text-2xl font-black mb-10 flex items-center gap-3 text-blue-400">
                    <Calendar className="text-blue-500" /> JADWAL PELAKSANAAN
                  </h3>

                  <div className="relative">
                    {/* GARIS VERTIKAL TENGAH (TIMELINE) */}
                    <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent"></div>

                    <div className="space-y-10">
                      {[
                        { event: 'Masa Pendaftaran', date: '6 - 27 April 2026', desc: 'Pendaftaran dilakukan secara mandiri melalui link Google Form di atas.' },
                        { event: 'Technical Meeting', date: 'Rabu, 29 April 2026 (13.00)', desc: 'Dilaksanakan via Zoom Meeting (Dinas Pendidikan Buleleng).' },
                        { event: 'Hari Pelaksanaan Lomba', date: 'Sabtu, 2 Mei 2026', desc: 'Bertempat di SMP Negeri 2 Singaraja.' },
                      ].map((item, i) => (
                        <div key={i} className="relative flex gap-6 items-start group">

                          {/* NOMOR URUT DENGAN EFEK GLOW */}
                          <div className="relative z-10">
                            <div className="bg-[#0f172a] text-blue-400 w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 border-2 border-blue-500/30 group-hover:border-blue-400 transition-colors duration-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                              {i + 1}
                            </div>
                            {/* Titik Cahaya Kecil di Tengah Garis (Opsional) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500/10 rounded-full blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>

                          {/* KONTEN JADWAL */}
                          <div className="flex-1 pt-1">
                            <div className="text-white font-bold text-lg leading-none mb-1 group-hover:text-blue-300 transition-colors">
                              {item.event}
                            </div>
                            <div className="inline-block bg-blue-500/10 text-blue-400 font-mono text-[10px] px-2 py-0.5 rounded border border-blue-500/20 mb-2 uppercase tracking-tighter">
                              {item.date}
                            </div>
                            <div className="text-slate-400 text-sm leading-relaxed max-w-md">
                              {item.desc}
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* KOLOM KANAN: FOTO POSTER (BISA DIKLIK) */}
                <div className="w-full md:w-64 shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setIsPosterOpen(true)} // AKTIFKAN MODAL SAAT DIKLIK
                    className="relative group shadow-2xl rounded-2xl overflow-hidden border-4 border-white/10 cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <img
                      src={PosterGempitas}
                      alt="Poster Gempitas 2026"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ aspectRatio: '2/3' }}
                    />

                    {/* Overlay Info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 to-transparent flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] font-black text-white bg-blue-600 px-4 py-1.5 rounded-full uppercase shadow-lg backdrop-blur-sm flex items-center gap-1.5">
                        <Globe size={12} /> KLIK UNTUK MEMPERBESAR
                      </span>
                    </div>
                  </motion.div>
                </div>

              </div>
            </div>

            <div className="bg-green-600/10 rounded-[2rem] p-8 border border-green-500/20 flex flex-col md:flex-row items-center gap-6">
              <div className="text-center md:text-left flex-1">
                <h3 className="text-xl font-black mb-2 text-green-400 flex items-center gap-3 justify-center md:justify-start">
                  <MessageCircle /> GRUP WHATSAPP
                </h3>
                <p className="text-slate-400 text-sm">Bergabunglah ke grup resmi untuk mendapatkan link Zoom Technical Meeting dan pengumuman lomba.</p>
              </div>
              <a href="https://chat.whatsapp.com/DtksLgLLYZWCO5kO0XDDgt" target="_blank" rel="noreferrer" className="bg-green-600 hover:bg-green-700 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-lg shadow-green-900/20 shrink-0">
                JOIN GRUP WA
              </a>
            </div>
          </div>

          <div className="space-y-6">
            {/* Hadiah Juara */}
            <div className="bg-[#1e293b] rounded-[2rem] p-8 border border-white/5 shadow-xl">
              <h3 className="text-xl font-black mb-6 text-amber-400 flex items-center gap-3">
                <Award /> BENEFIT JUARA
              </h3>

              <div className="space-y-4">
                {/* Kelompok Juara Utama */}
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { title: 'Juara I', items: 'Piala, Piagam, & Uang Pembinaan', color: 'text-amber-400' },
                    { title: 'Juara II', items: 'Piala, Piagam, & Uang Pembinaan', color: 'text-slate-300' },
                    { title: 'Juara III', items: 'Piala, Piagam, & Uang Pembinaan', color: 'text-orange-400' },
                  ].map((j, i) => (
                    <div key={i} className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className={`text-xs font-black uppercase tracking-widest ${j.color} mb-1`}>{j.title}</div>
                      <div className="text-sm text-slate-200 font-bold">{j.items}</div>
                    </div>
                  ))}
                </div>

                {/* Kelompok Juara Harapan */}
                <div className="bg-slate-900/40 rounded-2xl p-4 border border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Juara Harapan I, II, & III</p>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                      <Award size={16} className="text-blue-400" />
                    </div>
                    <span className="font-medium leading-tight">Mendapatkan Piagam Penghargaan Resmi</span>
                  </div>
                </div>

                {/* Golden Tiket Section */}
                <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/10 p-5 rounded-2xl border border-amber-500/30 relative overflow-hidden group">
                  {/* Efek Cahaya Belakang */}
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />

                  <p className="text-amber-400 font-black text-sm mb-1 uppercase tracking-tighter flex items-center gap-2">
                    <span className="animate-pulse">✨</span> Golden Tiket (Prioritas)
                  </p>
                  <p className="text-[11px] text-amber-100/80 leading-relaxed italic">
                    "10 Peserta finalis tiap bidang akan langsung diterima sebagai siswa baru di <b>SMPN 2 Singaraja 2026/2027</b> melalui jalur prestasi."
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1e293b] rounded-[2rem] p-8 border border-white/5 shadow-xl">
              <h3 className="text-xl font-black mb-4 text-blue-400 flex items-center gap-3"><MapPin /> LOKASI LOMBA</h3>
              <div className="text-white font-bold text-sm">SMP Negeri 2 Singaraja</div>
              <p className="text-slate-400 text-xs leading-relaxed mt-1">
                Jalan Jend. Sudirman No. 78, Kelurahan Banyuasri, Kec. Buleleng, Kab. Buleleng.
              </p>
              <div className="mt-4 aspect-video bg-slate-900 rounded-xl overflow-hidden border border-white/10 shadow-inner relative group">
                <iframe
                  title="Lokasi SMPN 2 Singaraja"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.62013898144!2d115.07816837586548!3d-8.115324681206121!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd190695123d53b%3A0x6b5c03f569302604!2sSMP%20Negeri%202%20Singaraja!5e0!3m2!1sid!2sid!4v1712332800000!5m2!1sid!2sid"
                  className="w-full h-full border-0 grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-700"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=-8.115330,115.080357"
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 shadow-xl border border-white/20"
                >
                  <MapPin size={12} /> PETUNJUK ARAH
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Taruh ini di paling bawah, tepat sebelum tag penutup </div> terakhir */}
      <AnimatePresence>
        {isPosterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPosterOpen(false)}
            className="fixed inset-0 bg-black/90 z-[9999] backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full flex justify-center"
            >
              {/* Tombol Close X */}
              <button
                onClick={() => setIsPosterOpen(false)}
                className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors flex items-center gap-2 font-bold"
              >
                TUTUP <X size={24} />
              </button>

              <img
                src={PosterGempitas}
                alt="Full Poster"
                className="max-h-[85vh] w-auto rounded-lg shadow-2xl border border-white/10"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div> // Ini adalah penutup div min-h-screen
  );
};

export default GempitasPage;