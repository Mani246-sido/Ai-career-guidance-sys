import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import GradientButton from '@/components/ui/GradientButton';
import AuroraBackground from '@/components/ui/AuroraBackground';
import { useAuthStore } from '@/store/authStore';

export default function Signup() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(form);
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
          <h1 className="font-display font-semibold text-2xl text-[var(--color-ink)] mb-1">Start your simulation</h1>
          <p className="text-sm text-[var(--color-ink-faint)] mb-7">Free — takes about two minutes to set up.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[var(--color-ink)] mb-1.5 block">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)]" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[var(--color-line)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo)] transition-shadow"
                />
              </div>
            </div>

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
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 8 characters"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[var(--color-line)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-indigo)] transition-shadow"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <GradientButton type="submit" className="w-full" disabled={loading} icon={ArrowRight}>
              {loading ? 'Creating account…' : 'Create account'}
            </GradientButton>
          </form>

          <p className="text-sm text-[var(--color-ink-faint)] text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--color-indigo)] font-medium">
              Log in
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
