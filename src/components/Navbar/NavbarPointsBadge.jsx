import { Sparkles } from 'lucide-react';

export default function NavbarPointsBadge({ user, isLightPage = false }) {
  if (!user) return null;

  const isEligible =
    user?.role === 'admin' ||
    (user?.Kelas && /^7\.(1[0-1]|[1-9])$/.test(user.Kelas));

  if (!isEligible) return null;

  return (
    <div
      id="navbar-points-badge"
      className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-full transition-all duration-300 font-sans shrink-0 ${
        isLightPage
          ? 'bg-amber-500/10 border border-amber-500/25 text-amber-700 shadow-xs'
          : 'bg-amber-400/10 border border-amber-400/25 text-amber-300 shadow-lg shadow-amber-950/20'
      }`}
    >
      <div className={`p-0.5 rounded-full ${isLightPage ? 'text-amber-600' : 'text-amber-400'}`}>
        <Sparkles size={11} className="sm:w-3.5 sm:h-3.5 animate-pulse" />
      </div>
      <div className="flex items-baseline gap-0.5 sm:gap-1 leading-none">
        <span className="text-xs sm:text-sm font-black tracking-tight">
          {user.total_points ?? 0}
        </span>
        <span className={`text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider ${
          isLightPage ? 'text-amber-600/80' : 'text-amber-400/75'
        }`}>
          XP
        </span>
      </div>
    </div>
  );
}
