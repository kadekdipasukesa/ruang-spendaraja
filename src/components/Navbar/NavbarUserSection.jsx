import { useState, useEffect } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import NavbarPointsBadge from './NavbarPointsBadge';

export default function NavbarUserSection({
  user,
  onOpenLogin,
  onOpenProfile,
  onLogout,
  isLightPage = false,
  isRuangBelajar = false,
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
        className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md shadow-blue-500/20 transition-all font-bold text-xs sm:text-sm cursor-pointer active:scale-95 shrink-0"
      >
        <LogIn size={15} />
        <span>Masuk</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0" id="navbar-user-section">
      {/* Points Badge (Gaming XP Chip) */}
      <NavbarPointsBadge user={user} isLightPage={isLightPage} />

      {/* User Profile Trigger Button with Instagram Story Ring */}
      <button
        id="btn-navbar-profile"
        type="button"
        onClick={onOpenProfile}
        className={`flex items-center gap-2 p-0.5 sm:pr-2.5 rounded-full transition-all group text-left cursor-pointer active:scale-95 ${
          isLightPage
            ? 'hover:bg-slate-100/80 border border-slate-200/60'
            : 'hover:bg-white/10 border border-white/10'
        }`}
        title="Buka Profil Pengguna"
      >
        {/* Instagram Story Gradient Ring */}
        <div className="p-[2px] rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 group-hover:scale-105 transition-transform shrink-0 shadow-xs">
          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex items-center justify-center border-2 ${
            isLightPage ? 'border-white bg-slate-100' : 'border-slate-900 bg-slate-800'
          }`}>
            {user.foto_profile && !imgError ? (
              <img
                src={user.foto_profile}
                alt={user.NAMA}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-[10px] select-none">
                {getInitials(user.NAMA)}
              </div>
            )}
          </div>
        </div>

        {/* User Name & Class (Di Ruang Belajar disederhanakan agar tidak duplikat dengan header halaman) */}
        <div className={`hidden ${isRuangBelajar ? 'lg:flex' : 'md:flex'} flex-col justify-center leading-tight`}>
          <p className={`text-xs font-bold capitalize max-w-[120px] truncate transition-colors ${
            isLightPage
              ? 'text-slate-800 group-hover:text-blue-600'
              : 'text-white drop-shadow-[0_0_4px_rgba(0,0,0,0.6)] group-hover:text-blue-300'
          }`}>
            {formatShortName(user.NAMA)}
          </p>
          <p className={`text-[8px] font-black uppercase tracking-wider ${
            isLightPage ? 'text-blue-600' : 'text-blue-400'
          }`}>
            {user.Kelas}
          </p>
        </div>
      </button>

      {/* Quick Logout Button */}
      <button
        id="btn-navbar-logout"
        onClick={onLogout}
        className={`p-1.5 sm:p-2 rounded-full transition-all cursor-pointer active:scale-95 shrink-0 ${
          isLightPage
            ? 'text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200/80 hover:border-red-200 shadow-xs'
            : 'text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/20 shadow-sm'
        }`}
        title="Keluar dari Akun"
      >
        <LogOut size={15} />
      </button>
    </div>
  );
}
