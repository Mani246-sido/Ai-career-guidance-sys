import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GradientButton from '@/components/ui/GradientButton';
import AuroraBackground from '@/components/ui/AuroraBackground';

export default function CTA() {
  const navigate = useNavigate();
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <AuroraBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl mx-auto text-center"
      >
        <h2 className="font-display font-semibold text-4xl sm:text-5xl text-[var(--color-ink)] leading-tight">
          Your future is one simulation away.
        </h2>
        <p className="mt-4 text-[var(--color-ink-soft)] text-lg">
          Free to start. No credit card. Just your ambition and a few minutes.
        </p>
        <div className="mt-9 flex justify-center">
          <GradientButton size="lg" icon={ArrowRight} onClick={() => navigate('/signup')}>
            Start your simulation
          </GradientButton>
        </div>
      </motion.div>
    </section>
  );
}
