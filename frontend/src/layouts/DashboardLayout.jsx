import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--color-canvas)]">
      <Sidebar />
      <main className="flex-1 px-6 sm:px-10 py-8 max-w-[1400px]">
        <Outlet />
      </main>
    </div>
  );
}
