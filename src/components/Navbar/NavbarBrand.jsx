import { Link } from 'react-router-dom';
import { School } from 'lucide-react';

export default function NavbarBrand() {
  return (
    <Link to="/" className="flex items-center gap-3 group" id="navbar-brand-link">
      <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-900/40 group-hover:scale-110 transition-transform">
        <School size={22} />
      </div>
      <div className="flex flex-col justify-center">
        <span className="font-black text-xl tracking-tighter leading-tight">
          <span className="text-white drop-shadow-[0_0_6px_rgba(0,0,0,0.6)]">
            Ruang
          </span>{' '}
          <span className="text-blue-400 drop-shadow-[0_0_6px_rgba(0,0,0,0.5)] drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]">
            Spendaraja
          </span>
        </span>

        <div className="flex items-center pt-1">
          <span className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none">
            v.{__APP_VERSION__}
          </span>
        </div>
      </div>
    </Link>
  );
}
