import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import AuroraBackground from '@/components/ui/AuroraBackground';
import { useAuthStore } from '@/store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form);
    if (res.success) navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      <AuroraBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg text-[var(--color-ink)] justify-center mb-8">
          <span className="w-8 h-8 rounded-xl bg-[linear-gradient(120deg,#5B5FEF,#3E3FC4)] flex items-center justify-center text-white text-sm">
            V
          </span>
          Vector
        </Link>

        <GlassCard strong className="p-8">
          <h1 className="font-display font-semibold text-2xl text-[var(--color-ink)] mb-1">Welcome back</h1>
          <p className="text-sm text-[var(--color-ink-faint)] mb-7">Pick up right where your simulation left off.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[var(--color-ink)] mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@university.edu"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[var(--color-line)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo)] transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--color-ink)] mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[var(--color-line)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo)] transition-shadow"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <GradientButton type="submit" className="w-full" disabled={loading} icon={ArrowRight}>
              {loading ? 'Signing in…' : 'Sign in'}
            </GradientButton>
          </form>

          <p className="text-sm text-[var(--color-ink-faint)] text-center mt-6">
            New here?{' '}
            <Link to="/signup" className="text-[var(--color-indigo)] font-medium">
              Create an account
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
