import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Clock, Briefcase, FileText, Mic, Map, TrendingUp, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const items = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/dashboard/time-machine', icon: Clock, label: 'Time Machine' },
  { to: '/dashboard/internship', icon: Briefcase, label: 'Internship' },
  { to: '/dashboard/resume', icon: FileText, label: 'Resume' },
  { to: '/dashboard/interview', icon: Mic, label: 'Interview' },
  { to: '/dashboard/skill-gap', icon: TrendingUp, label: 'Skill Gap' },
  { to: '/dashboard/roadmap', icon: Map, label: 'Roadmap' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-[var(--color-line)] bg-[var(--color-canvas-soft)] px-5 py-6">
      <div className="flex items-center gap-2 font-display font-semibold text-lg text-[var(--color-ink)] mb-10 px-2">
        <span className="w-8 h-8 rounded-xl bg-[linear-gradient(120deg,#5B5FEF,#3E3FC4)] flex items-center justify-center text-white text-sm">
          V
        </span>
        Vector
      </div>

      <nav className="flex-1 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--color-indigo-soft)] text-[var(--color-indigo)]'
                  : 'text-[var(--color-ink-soft)] hover:bg-white hover:text-[var(--color-ink)]'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[var(--color-line)] pt-4 mt-4">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-[var(--color-indigo-soft)] flex items-center justify-center font-display font-medium text-[var(--color-indigo)] text-sm">
            {user?.name?.[0]?.toUpperCase() || 'S'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-[var(--color-ink)] truncate">{user?.name || 'Student'}</p>
            <p className="text-xs text-[var(--color-ink-faint)] truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--color-ink-soft)] hover:bg-white hover:text-red-500 transition-colors"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </aside>
  );
}
