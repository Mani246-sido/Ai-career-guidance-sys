import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';

const testimonials = [
  {
    quote: 'I could finally see what an extra DSA hour a day actually meant for my placement odds. That made it real.',
    name: 'Ananya R.',
    role: 'Final year, CSE',
  },
  {
    quote: 'The virtual internship missions felt closer to my actual job than my real internship did.',
    name: 'Karthik S.',
    role: 'Pre-final year, IT',
  },
  {
    quote: 'Mock interview caught filler words I did not know I used. Fixed it in two weeks.',
    name: 'Priya M.',
    role: 'Final year, ECE',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-28 px-6 bg-[var(--color-canvas-soft)]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-14"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-indigo)]">Students, not testimonials</span>
          <h2 className="font-display font-semibold text-4xl sm:text-5xl text-[var(--color-ink)] mt-3">
            What changed once they could see ahead.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard className="p-7 h-full flex flex-col justify-between">
                <p className="text-[var(--color-ink)] leading-relaxed mb-6">"{t.quote}"</p>
                <div>
                  <p className="font-display font-medium text-sm text-[var(--color-ink)]">{t.name}</p>
                  <p className="text-xs text-[var(--color-ink-faint)]">{t.role}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
