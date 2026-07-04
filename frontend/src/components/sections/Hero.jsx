import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GradientButton from '@/components/ui/GradientButton';
import AuroraBackground from '@/components/ui/AuroraBackground';
import CareerPathScene from '@/components/three/CareerPathScene';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-32 pb-20 px-6">
      <AuroraBackground />

      {/* 3D career path fills the hero as ambient depth */}
      <CareerPathScene className="absolute inset-0 z-0 opacity-90" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8 text-xs font-medium text-[var(--color-ink-soft)]"
        >
          <Sparkles size={14} className="text-[var(--color-gold)]" />
          Built for students who want to see tomorrow, today
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-semibold text-5xl sm:text-6xl md:text-7xl leading-[1.05] text-[var(--color-ink)] tracking-tight"
        >
          Walk through <span className="text-gradient">your</span> career
          <br /> before you live it.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg text-[var(--color-ink-soft)] max-w-xl mx-auto leading-relaxed"
        >
          Vector turns your skills, projects, and choices into a live simulation of your future —
          placement odds, salary bands, and the path to get there.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <GradientButton size="lg" icon={ArrowRight} onClick={() => navigate('/signup')}>
            Start your simulation
          </GradientButton>
          <GradientButton size="lg" variant="ghost" onClick={() => navigate('#how-it-works')}>
            See how it works
          </GradientButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-16 flex items-center justify-center gap-10 sm:gap-16"
        >
          {[
            { value: 42000, suffix: '+', label: 'Students simulated' },
            { value: 91, suffix: '%', label: 'Prediction accuracy' },
            { value: 6, suffix: 'x', label: 'Faster upskilling' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} className="text-2xl sm:text-3xl font-display font-semibold text-[var(--color-ink)] block" />
              <p className="text-xs text-[var(--color-ink-faint)] mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
