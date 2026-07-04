import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const faqs = [
  {
    q: 'How does the Career Time Machine predict placement odds?',
    a: 'It weighs your study consistency, project depth, certifications, and internship history against outcomes from students with similar profiles, then updates live as you adjust any input.',
  },
  {
    q: 'Do I need a resume to get started?',
    a: 'No. You can build your profile first and add a resume later — the Resume Analyzer will score it once uploaded.',
  },
  {
    q: 'Is the virtual internship a real job?',
    a: 'It is a simulated workspace with real-world missions reviewed by AI, designed to mirror what an actual internship expects from you.',
  },
  {
    q: 'Can I use this alongside campus placement prep?',
    a: 'Yes — most students use it as a supplement, running simulations before major decisions like which certification or project to prioritize.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="relative py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-indigo)]">Questions</span>
          <h2 className="font-display font-semibold text-4xl sm:text-5xl text-[var(--color-ink)] mt-3">Before you start</h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <GlassCard key={f.q} hover={false} className="overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-display font-medium text-[var(--color-ink)]">{f.q}</span>
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.2 }}>
                  <Plus size={18} className="text-[var(--color-indigo)]" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm text-[var(--color-ink-soft)] leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
