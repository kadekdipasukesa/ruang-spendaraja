import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { getStoredUserSession, updateUserSession, clearUserSession } from '../utils/authStorage';
import NavbarBrand from './Navbar/NavbarBrand';
import NavbarUserSection from './Navbar/NavbarUserSection';
import ModalLogin from './Navbar/ModalLogin';
import ModalProfilUser from './Navbar/ModalProfilUser';

export default function Navbar() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [user, setUser] = useState(null);
  const [isAtTop, setIsAtTop] = useState(true);

  const headerRef = useRef(null);
  const translateY = useMotionValue(0);

  const location = useLocation();
  const isHome = location.pathname === '/';
  const isRuangBelajar = location.pathname.startsWith('/ruang-belajar');

  const lightPaths = [
    '/ruang-belajar',
    '/bee-2026',
    '/analisis-pelanggaran',
    '/analisis-nilai',
    '/ekstra-tik',
    '/simulasi-interaktif',
    '/portfolio-leaderboard',
    '/dashboard-guru',
    '/input-nilai',
    '/face-absen',
  ];
  const isLightPage = lightPaths.some((p) => location.pathname.toLowerCase().startsWith(p));

  const { scrollY } = useScroll();

  // Reset navbar saat berpindah halaman
  useEffect(() => {
    translateY.set(0);
    setIsAtTop(window.scrollY <= 15);
  }, [location.pathname, translateY]);

  // Presisi 1:1 murni ala YouTube Mobile: Navbar bergerak murni mengikuti scroll tanpa timer/animasi sendiri
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const delta = latest - previous;
    const navHeight = headerRef.current?.offsetHeight || 56;

    // Saat di posisi puncak layar (seamless, menyatu dengan konten)
    if (latest <= 5) {
      translateY.set(0);
      setIsAtTop(true);
      return;
    }

    if (isAtTop && latest > 15) {
      setIsAtTop(false);
    }

    // Hitung posisi translateY secara presisi 1:1 terhadap delta scroll
    const currentY = translateY.get();
    // Saat scroll up (delta < 0), beri akselerasi responsif 1.25x agar cepat muncul kembali
    const effectiveDelta = delta < 0 ? delta * 1.25 : delta;
    const nextY = Math.max(-navHeight, Math.min(0, currentY - effectiveDelta));
    translateY.set(nextY);
  });

  const getContextBadge = () => {
    if (isHome) {
      return (
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/10 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Portal Belajar Terpadu</span>
        </div>
      );
    }
    if (isRuangBelajar) {
      return (
        <div
          className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            isLightPage
              ? 'bg-slate-100/90 text-slate-700 border border-slate-200/80 shadow-xs'
              : 'bg-white/5 text-slate-200 border border-white/10'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Ruang Belajar</span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
              isLightPage ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-blue-300'
            }`}
          >
            Informatika 7
          </span>
        </div>
      );
    }
    if (location.pathname.startsWith('/ekstra-tik')) {
      return (
        <div
          className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
            isLightPage
              ? 'bg-slate-100/90 text-slate-700 border border-slate-200/80'
              : 'bg-white/5 text-slate-200 border border-white/10'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span>Ekstra TIK</span>
        </div>
      );
    }
    if (location.pathname.startsWith('/jurnal-lab')) {
      return (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-slate-200 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Jurnal Lab Komputer</span>
        </div>
      );
    }
    return null;
  };

  // Sinkronisasi realtime data siswa (poin & foto profil) dari Supabase
  useEffect(() => {
    if (!user?.id) return;
    const channelId = `navbar_user_${user.id}_${Math.random().toString(36).substring(2, 7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'master_siswa',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new) {
            setUser((prev) => {
              if (!prev) return payload.new;
              const updated = {
                ...prev,
                total_points: payload.new.total_points ?? prev.total_points,
                foto_profile:
                  payload.new.foto_profile !== undefined
                    ? payload.new.foto_profile
                    : prev.foto_profile,
              };
              updateUserSession(updated);
              return updated;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Load user dari authStorage & verifikasi keabsahan kata sandi ke master_siswa
  useEffect(() => {
    const storedUser = getStoredUserSession();
    if (storedUser) {
      try {
        setUser(storedUser);

        // Verifikasi keabsahan akun & kecocokan kata sandi ke master_siswa
        if (storedUser?.id) {
          supabase
            .from('master_siswa')
            .select('*')
            .eq('id', storedUser.id)
            .single()
            .then(({ data, error }) => {
              if (error || !data) {
                // Akun sudah tidak ditemukan di database
                console.warn('Akun tidak ditemukan di database. Mengakhiri sesi.');
                clearUserSession();
                setUser(null);
                return;
              }

              // Cek apakah password di database masih cocok dengan yang tersimpan di sesi
              // Jika sandi telah diubah/direset oleh guru atau siswa di perangkat lain:
              if (storedUser.password && data.password && data.password !== storedUser.password) {
                console.warn('Kata sandi akun telah berubah di database. Mengakhiri sesi otomatis.');
                clearUserSession();
                setUser(null);
                alert('⚠️ Kata sandi akun Anda telah diperbarui atau direset. Silakan masuk kembali dengan kata sandi terbaru.');
                return;
              }

              // Cek jika akun dinonaktifkan
              if (data.is_registered === false) {
                clearUserSession();
                setUser(null);
                return;
              }

              // Sesi terverifikasi sah! Perbarui data terbaru
              setUser(data);
              updateUserSession(data);
            })
            .catch((err) => {
              console.warn('Gagal verifikasi status akun ke database:', err);
            });
        }
      } catch (e) {
        console.error('Error memproses sesi pengguna:', e);
        clearUserSession();
        setUser(null);
      }
    } else {
      setUser(null);
    }

    const handleOpenLogin = () => setShowLoginModal(true);
    const handleOpenProfile = () => setShowProfileModal(true);
    const handleUserUpdated = (e) => {
      if (e.detail) {
        setUser(e.detail);
        updateUserSession(e.detail);
      }
    };

    window.addEventListener('open-login-modal', handleOpenLogin);
    window.addEventListener('open-profile-modal', handleOpenProfile);
    window.addEventListener('user-updated', handleUserUpdated);

    return () => {
      window.removeEventListener('open-login-modal', handleOpenLogin);
      window.removeEventListener('open-profile-modal', handleOpenProfile);
      window.removeEventListener('user-updated', handleUserUpdated);
    };
  }, []);

  const handleLogout = () => {
    clearUserSession();
    setUser(null);
    setShowProfileModal(false);
    window.location.reload();
  };

  const handleUserUpdated = (updatedUser) => {
    setUser(updatedUser);
    updateUserSession(updatedUser);
  };

  return (
    <>
      <motion.nav
        ref={headerRef}
        id="main-navbar"
        style={{ y: translateY }}
        className={`fixed top-0 left-0 right-0 w-full z-[100] transition-colors duration-200 ${
          isAtTop
            ? 'bg-transparent border-b border-transparent shadow-none'
            : isLightPage
            ? 'bg-slate-50/95 sm:bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.05)] text-slate-800'
            : 'bg-slate-950/95 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.45)] text-white'
        }`}
      >
        {/* Subtle Ambient Border Line hanya muncul saat di-scroll */}
        {!isAtTop && (
          <div
            className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r ${
              isLightPage
                ? 'from-transparent via-blue-500/20 to-transparent'
                : 'from-transparent via-amber-500/20 to-transparent'
            }`}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-2.5 flex justify-between items-center w-full">
          {/* Brand Logo & Versi / Navigasi Beranda */}
          <NavbarBrand isLightPage={isLightPage} isHome={isHome} />

          {/* Center Context Pill (Badge Halaman Dinamis) */}
          {getContextBadge()}

          {/* Sesi Pengguna: Poin, Avatar Profil (Story Ring), & Tombol Aksi */}
          <NavbarUserSection
            user={user}
            onOpenLogin={() => setShowLoginModal(true)}
            onOpenProfile={() => setShowProfileModal(true)}
            onLogout={handleLogout}
            isLightPage={isLightPage}
            isRuangBelajar={isRuangBelajar}
          />
        </div>
      </motion.nav>

      {/* Modal Masuk / Registrasi Akun */}
      <ModalLogin
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={(newUser) => {
          setUser(newUser);
          setShowLoginModal(false);
          window.location.reload();
        }}
      />

      {/* Modal Detail Profil Siswa & Ganti Foto Profil */}
      <ModalProfilUser
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onUserUpdated={handleUserUpdated}
        onLogout={handleLogout}
      />
    </>
  );
}
