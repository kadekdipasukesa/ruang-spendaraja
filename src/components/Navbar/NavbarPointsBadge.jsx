import { Sparkles } from 'lucide-react';

export default function NavbarPointsBadge({ user }) {
  if (!user) return null;

  const isEligible =
    user?.role === 'admin' ||
    (user?.Kelas && /^7\.(1[0-1]|[1-9])$/.test(user.Kelas));

  if (!isEligible) return null;

  return (
    <div
      id="navbar-points-badge"
      className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-xl shadow-lg transition-all duration-500"
    >
      <div className="bg-yellow-500/20 p-1 rounded-lg">
        <Sparkles size={14} className="text-yellow-400" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[8px] font-black text-yellow-500/70 uppercase tracking-tighter">
          Poin
        </span>
        <span className="text-sm font-black text-yellow-400">
          {user.total_points ?? 0}
        </span>
      </div>
    </div>
  );
}
