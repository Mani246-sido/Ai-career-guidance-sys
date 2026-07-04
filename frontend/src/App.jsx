import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import NotFound from '@/pages/NotFound';

import DashboardLayout from '@/layouts/DashboardLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';

import Dashboard from '@/pages/Dashboard';
import TimeMachine from '@/pages/dashboard/TimeMachine';
import Internship from '@/pages/dashboard/Internship';
import Resume from '@/pages/dashboard/Resume';
import Interview from '@/pages/dashboard/Interview';
import SkillGap from '@/pages/dashboard/SkillGap';
import Roadmap from '@/pages/dashboard/Roadmap';
import Profile from '@/pages/dashboard/Profile';

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="time-machine" element={<TimeMachine />} />
          <Route path="internship" element={<Internship />} />
          <Route path="resume" element={<Resume />} />
          <Route path="interview" element={<Interview />} />
          <Route path="skill-gap" element={<SkillGap />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
