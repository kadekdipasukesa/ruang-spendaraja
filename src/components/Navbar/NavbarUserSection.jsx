import { useState, useEffect } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import NavbarPointsBadge from './NavbarPointsBadge';

export default function NavbarUserSection({
  user,
  onOpenLogin,
  onOpenProfile,
  onLogout,
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [user?.foto_profile]);

  const formatShortName = (fullName) => {
    if (!fullName) return '';
    const words = fullName.trim().split(/\s+/);
    if (words.length <= 2) return fullName;
    return words.slice(-2).join(' ');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  if (!user) {
    return (
      <button
        id="btn-navbar-login"
        onClick={onOpenLogin}
        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-900/40 transition-all font-bold text-sm cursor-pointer active:scale-95"
      >
        <LogIn size={18} />
        <span>Masuk</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3" id="navbar-user-section">
      {/* Points Badge */}
      <NavbarPointsBadge user={user} />

      {/* User Profile Trigger Button */}
      <button
        id="btn-navbar-profile"
        type="button"
        onClick={onOpenProfile}
        className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group text-left cursor-pointer active:scale-98"
        title="Buka Profil Pengguna"
      >
        {/* User Avatar Circle */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full ring-2 ring-blue-500/40 group-hover:ring-blue-400 overflow-hidden shrink-0 bg-slate-800 shadow-md flex items-center justify-center transition-all">
          {user.foto_profile && !imgError ? (
            <img
              src={user.foto_profile}
              alt={user.NAMA}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs select-none">
              {getInitials(user.NAMA)}
            </div>
          )}
        </div>

        {/* User Name & Class (Desktop) */}
        <div className="hidden md:flex flex-col justify-center leading-tight">
          <p className="text-xs font-bold capitalize text-white drop-shadow-[0_0_4px_rgba(0,0,0,0.6)] group-hover:text-blue-300 transition-colors max-w-[140px] truncate">
            {formatShortName(user.NAMA)}
          </p>
          <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 drop-shadow-[0_0_4px_rgba(0,0,0,0.5)]">
            {user.Kelas}
          </p>
        </div>
      </button>

      {/* Quick Logout Button */}
      <button
        id="btn-navbar-logout"
        onClick={onLogout}
        className="group flex items-center justify-center bg-red-500/10 hover:bg-red-600 p-2.5 rounded-xl transition-all border border-red-500/20 shadow-lg shadow-red-900/20 cursor-pointer active:scale-95"
        title="Keluar dari Akun"
      >
        <LogOut size={18} className="text-red-500 group-hover:text-white transition-colors" />
      </button>
    </div>
  );
}
