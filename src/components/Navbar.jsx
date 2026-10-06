import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
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
  const [isHidden, setIsHidden] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious();
    // Jika scroll ke bawah lebih dari 150px, sembunyikan.
    // Jika scroll ke atas, munculkan.
    if (latest > previous && latest > 150) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

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
    const handleUserUpdated = (e) => {
      if (e.detail) {
        setUser(e.detail);
        updateUserSession(e.detail);
      }
    };

    window.addEventListener('open-login-modal', handleOpenLogin);
    window.addEventListener('user-updated', handleUserUpdated);

    return () => {
      window.removeEventListener('open-login-modal', handleOpenLogin);
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
        id="main-navbar"
        variants={{
          visible: { y: 0 },
          hidden: { y: '-100%' },
        }}
        animate={isHidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="fixed top-0 left-0 w-full bg-slate-950/20 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3.5 flex justify-between items-center z-[100] transition-all duration-300"
      >
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent shadow-[0_1px_10px_rgba(245,158,11,0.2)]" />

        {/* Brand Logo & Versi */}
        <NavbarBrand />

        {/* Sesi Pengguna: Poin, Avatar Profil, & Tombol Aksi */}
        <NavbarUserSection
          user={user}
          onOpenLogin={() => setShowLoginModal(true)}
          onOpenProfile={() => setShowProfileModal(true)}
          onLogout={handleLogout}
        />
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
