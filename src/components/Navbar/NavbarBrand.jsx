import { Link } from 'react-router-dom';
import { School } from 'lucide-react';

export default function NavbarBrand({ isLightPage = false, isHome = true }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0" id="navbar-brand-link">
      <div className={`p-1.5 sm:p-2 rounded-xl text-white shadow-md transition-transform group-hover:scale-105 active:scale-95 ${
        isLightPage
          ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/25'
          : 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-900/40'
      }`}>
        <School size={18} className="sm:w-5 sm:h-5" />
      </div>

      <div className="flex flex-col justify-center leading-none">
        <span className="font-black text-base sm:text-lg tracking-tight leading-none flex items-center gap-1">
          <span className={isLightPage ? 'text-slate-900 font-extrabold tracking-tight' : 'text-white drop-shadow-[0_0_6px_rgba(0,0,0,0.6)]'}>
            Ruang
          </span>
          <span className={isLightPage ? 'text-blue-600 font-extrabold' : 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]'}>
            Spendaraja
          </span>
        </span>

        <div className="flex items-center pt-1">
          <span className={`text-[7px] font-bold uppercase tracking-widest leading-none ${
            isLightPage ? 'text-slate-400 group-hover:text-blue-600' : 'text-slate-500 group-hover:text-slate-400'
          }`}>
            {isHome ? `v.${__APP_VERSION__}` : '← Beranda'}
          </span>
        </div>
      </div>
    </Link>
  );
}
