import { motion } from 'framer-motion';
import { Clock, Briefcase, FileText, Mic, Map, BarChart3 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const features = [
  {
    icon: Clock,
    title: 'Career Time Machine',
    description: 'Drag sliders on study hours, projects, and certifications — watch your placement odds and salary band update live.',
    accent: 'indigo',
  },
  {
    icon: Briefcase,
    title: 'Virtual Internship',
    description: 'Real-world missions reviewed by AI, with a workspace that feels like the job you are training for.',
    accent: 'mint',
  },
  {
    icon: FileText,
    title: 'Resume Analyzer',
    description: 'Line-by-line feedback against roles you actually want, not generic templates.',
    accent: 'gold',
  },
  {
    icon: Mic,
    title: 'Mock Interview',
    description: 'Practice with an AI interviewer that adapts follow-ups to your answers, then scores your delivery.',
    accent: 'sky',
  },
  {
    icon: Map,
    title: 'Learning Roadmap',
    description: 'A milestone path generated from your skill gaps — not a generic course list.',
    accent: 'indigo',
  },
  {
    icon: BarChart3,
    title: 'Skill Gap Analytics',
    description: 'See exactly which skills separate you from your target role, ranked by impact.',
    accent: 'mint',
  },
];

const accentMap = {
  indigo: 'text-[var(--color-indigo)] bg-[var(--color-indigo-soft)]',
  gold: 'text-[var(--color-gold)] bg-[var(--color-gold-soft)]',
  mint: 'text-[var(--color-mint)] bg-[var(--color-mint-soft)]',
  sky: 'text-[#3B7BC9] bg-[var(--color-sky-soft)]',
};

export default function Features() {
  return (
    <section id="features" className="relative py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-indigo)]">The system</span>
          <h2 className="font-display font-semibold text-4xl sm:text-5xl text-[var(--color-ink)] mt-3 leading-tight">
            Six tools. One continuous picture of your future.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
              <GlassCard className="p-7 h-full">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${accentMap[f.accent]}`}>
                  <f.icon size={22} strokeWidth={2} />
                </div>
                <h3 className="font-display font-medium text-lg text-[var(--color-ink)] mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">{f.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
