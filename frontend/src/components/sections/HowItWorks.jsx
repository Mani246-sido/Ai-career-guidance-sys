import { motion } from 'framer-motion';

const steps = [
  {
    mark: 'Today',
    title: 'Tell it where you stand',
    description: 'Your profile, resume, and current skills — Vector reads what you already have.',
  },
  {
    mark: 'Simulate',
    title: 'Run the Time Machine',
    description: 'Adjust study hours, projects, internships. See placement probability and salary shift in real time.',
  },
  {
    mark: 'Practice',
    title: 'Close the gaps',
    description: 'Virtual internship missions, mock interviews, and a roadmap built from what is actually missing.',
  },
  {
    mark: 'Arrive',
    title: 'Walk in prepared',
    description: 'A resume, a portfolio, and interview reps that match the role you simulated toward.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28 px-6 bg-[var(--color-canvas-soft)]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-indigo)]">The path</span>
          <h2 className="font-display font-semibold text-4xl sm:text-5xl text-[var(--color-ink)] mt-3">
            Four stages, one continuous walk.
          </h2>
        </motion.div>

        <div className="relative pl-8 sm:pl-12">
          <div className="absolute left-[7px] sm:left-[11px] top-2 bottom-2 w-px bg-[var(--color-line)]" />
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative pb-14 last:pb-0"
            >
              <span className="absolute -left-8 sm:-left-12 top-1 w-4 h-4 rounded-full bg-[var(--color-indigo)] ring-4 ring-[var(--color-indigo-soft)]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-ink-faint)]">{s.mark}</span>
              <h3 className="font-display font-medium text-2xl text-[var(--color-ink)] mt-1 mb-2">{s.title}</h3>
              <p className="text-[var(--color-ink-soft)] leading-relaxed max-w-lg">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
