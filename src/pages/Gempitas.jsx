import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  ChevronRight
} from 'lucide-react';

const GempitasPage = () => {
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  // Komponen Animasi Kunang-kunang
  const Firefly = () => (
    <motion.span
      className="fixed w-1 h-1 bg-amber-400 rounded-full pointer-events-none z-[-1]"
      style={{
        boxShadow: '0 0 10px 2px #f59e0b, 0 0 20px 5px rgba(245, 158, 11, 0.4)',
      }}
      animate={{
        x: [0, Math.random() * 100, -Math.random() * 50, 0],
        y: [0, -200, -400, -600],
        opacity: [0, 0.8, 0.4, 0.8, 0],
        scale: [1, 1.2, 1, 1.2, 1],
      }}
      transition={{
        duration: 10 + Math.random() * 10,
        repeat: Infinity,
        delay: Math.random() * 5,
        ease: "easeInOut"
      }}
    />
  );

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
      {/* Background Fireflies */}
      {[...Array(15)].map((_, i) => <Firefly key={i} />)}

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
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2rem] p-8 mb-10 shadow-2xl border border-white/10 relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                <Smartphone size={32} className="text-blue-300" /> WAJIB INSTAL APLIKASI
              </h2>
              <p className="text-blue-100 mb-6 leading-relaxed text-sm opacity-90">
                Babak penyisihan dilakukan secara daring di lokasi lomba. Seluruh peserta <b>wajib</b> mengunduh salah satu Exambrowser di bawah ini untuk perangkat HP Android masing-masing.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a href="https://play.google.com/store/apps/details?id=com.exambrowser.client" target="_blank" rel="noreferrer" className="bg-black/40 hover:bg-black/60 text-white p-4 rounded-2xl flex items-center gap-3 transition-all border border-white/10 group">
                  <Download size={20} className="text-blue-400 group-hover:bounce" />
                  <div className="text-left leading-none">
                    <span className="text-[10px] block opacity-50 mb-1">GOOGLE PLAY</span>
                    <span className="font-bold text-xs uppercase">Exambro Client</span>
                  </div>
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.cbt.exam.browser" target="_blank" rel="noreferrer" className="bg-black/40 hover:bg-black/60 text-white p-4 rounded-2xl flex items-center gap-3 transition-all border border-white/10 group">
                  <Download size={20} className="text-blue-400 group-hover:bounce" />
                  <div className="text-left leading-none">
                    <span className="text-[10px] block opacity-50 mb-1">GOOGLE PLAY</span>
                    <span className="font-bold text-xs uppercase">CBT Browser</span>
                  </div>
                </a>
              </div>
            </div>

            <div className="hidden lg:flex bg-white p-4 rounded-3xl flex-col items-center justify-center shadow-2xl transition-transform hover:rotate-2">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://play.google.com/store/apps/details?id=com.exambrowser.client" alt="QR Exambro" className="w-28 h-28 mb-3" />
              <p className="text-[10px] text-slate-800 font-black uppercase text-center">Scan QR<br/>Exambro Client</p>
            </div>

            <div className="hidden lg:flex bg-white p-4 rounded-3xl flex-col items-center justify-center shadow-2xl transition-transform hover:-rotate-2">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://play.google.com/store/apps/details?id=com.cbt.exam.browser" alt="QR CBT" className="w-28 h-28 mb-3" />
              <p className="text-[10px] text-slate-800 font-black uppercase text-center">Scan QR<br/>CBT Browser</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Pembina', color: 'bg-slate-800', link: 'https://forms.gle/6z1HZdxBTDQu4Bx16', icon: <Users /> },
            { label: 'Matematika', color: 'bg-red-900', link: 'https://forms.gle/CS4ShqPWLdSdQCXt9', icon: <BookOpen /> },
            { label: 'IPA', color: 'bg-emerald-900', link: 'https://forms.gle/cWgoTYujVv6hnNBaA', icon: <Smartphone /> },
            { label: 'IPS', color: 'bg-orange-900', link: 'https://forms.gle/8Ma8qQY6StgcMAf3A', icon: <Globe /> },
          ].map((item, idx) => (
            <a key={idx} href={item.link} target="_blank" rel="noreferrer" className={`${item.color} p-6 rounded-3xl border border-white/5 hover:border-blue-400/50 transition-all group relative overflow-hidden`}>
              <div className="text-blue-300 mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
              <div className="text-[10px] text-white/50 uppercase font-black tracking-widest">Pendaftaran</div>
              <div className="text-xl font-black text-white">{item.label}</div>
              <ChevronRight className="absolute bottom-4 right-4 text-white/20 group-hover:translate-x-1 transition-transform" />
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1e293b] rounded-[2rem] p-8 border border-white/5 shadow-xl">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-blue-400">
                <Calendar className="text-blue-500" /> JADWAL PELAKSANAAN
              </h3>
              <div className="space-y-6">
                {[
                  { event: 'Masa Pendaftaran', date: '6 - 27 April 2026', desc: 'Pendaftaran dilakukan secara mandiri melalui link Google Form di atas.' },
                  { event: 'Technical Meeting', date: 'Rabu, 29 April 2026 (13.00)', desc: 'Dilaksanakan via Zoom Meeting (Dinas Pendidikan Buleleng).' },
                  { event: 'Hari Pelaksanaan Lomba', date: 'Sabtu, 2 Mei 2026', desc: 'Bertempat di SMP Negeri 2 Singaraja (Membawa HP Berkuota).' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="bg-blue-500/10 text-blue-400 w-12 h-12 rounded-2xl flex items-center justify-center font-black shrink-0 border border-blue-500/20">
                      {i+1}
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg leading-none mb-1">{item.event}</div>
                      <div className="text-blue-400 font-mono text-sm mb-2">{item.date}</div>
                      <div className="text-slate-400 text-sm leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
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
            <div className="bg-[#1e293b] rounded-[2rem] p-8 border border-white/5 shadow-xl">
              <h3 className="text-xl font-black mb-6 text-amber-400 flex items-center gap-3"><Award /> BENEFIT JUARA</h3>
              <ul className="space-y-4">
                {[
                  'Piala & Piagam Penghargaan',
                  'Uang Pembinaan (Juara 1, 2, 3)',
                  'Piagam Finalis (Juara Harapan 1-3)',
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-300">
                    <span className="text-amber-500">★</span> {text}
                  </li>
                ))}
                <li className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20">
                  <p className="text-amber-400 font-black text-sm mb-1 uppercase tracking-tighter">Golden Tiket (Prioritas)</p>
                  <p className="text-[11px] text-amber-200/70 leading-relaxed">10 Peserta finalis tiap bidang akan langsung diterima sebagai siswa baru di SMPN 2 Singaraja 2026/2027.</p>
                </li>
              </ul>
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
    </div>
  );
};

export default GempitasPage;