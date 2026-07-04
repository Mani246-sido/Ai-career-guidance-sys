import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';
import { useAuthStore } from '@/store/authStore';

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Time Machine', href: '#time-machine' },
  { label: 'Stories', href: '#testimonials' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pt-4"
    >
      <nav
        className={`w-full max-w-6xl flex items-center justify-between px-5 py-3 rounded-full transition-all duration-300 ${
          scrolled ? 'glass-strong' : 'bg-transparent'
        }`}
      >
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg text-[var(--color-ink)]">
          <span className="w-8 h-8 rounded-xl bg-[linear-gradient(120deg,#5B5FEF,#3E3FC4)] flex items-center justify-center text-white text-sm">
            V
          </span>
          Vector
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <GradientButton size="sm" onClick={() => navigate('/dashboard')} icon={ArrowUpRight}>
              Dashboard
            </GradientButton>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] px-3"
              >
                Log in
              </button>
              <GradientButton size="sm" onClick={() => navigate('/signup')}>
                Get started
              </GradientButton>
            </>
          )}
        </div>

        <button className="md:hidden text-[var(--color-ink)]" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 left-4 right-4 glass-strong rounded-3xl p-6 flex flex-col gap-4 md:hidden"
          >
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-base font-medium text-[var(--color-ink)]">
                {l.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-3 border-t border-[var(--color-line)]">
              <button onClick={() => navigate('/login')} className="text-sm font-medium text-left text-[var(--color-ink-soft)]">
                Log in
              </button>
              <GradientButton size="sm" onClick={() => navigate('/signup')}>
                Get started
              </GradientButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
