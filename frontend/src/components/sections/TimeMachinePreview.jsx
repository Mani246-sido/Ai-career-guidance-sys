import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import ProgressRing from '@/components/ui/ProgressRing';

export default function TimeMachinePreview() {
  const [studyHours, setStudyHours] = useState(4);
  const [projects, setProjects] = useState(3);
  const [certifications, setCertifications] = useState(2);

  const { placement, salary } = useMemo(() => {
    const score = studyHours * 4 + projects * 8 + certifications * 5;
    const placement = Math.min(96, 30 + score);
    const salary = Math.round((4 + score * 0.18) * 10) / 10;
    return { placement, salary };
  }, [studyHours, projects, certifications]);

  const sliders = [
    { label: 'Daily study hours', value: studyHours, set: setStudyHours, min: 1, max: 10, unit: 'hrs' },
    { label: 'Live projects', value: projects, set: setProjects, min: 0, max: 8, unit: '' },
    { label: 'Certifications', value: certifications, set: setCertifications, min: 0, max: 6, unit: '' },
  ];

  return (
    <section id="time-machine" className="relative py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-indigo)]">Try it now</span>
          <h2 className="font-display font-semibold text-4xl sm:text-5xl text-[var(--color-ink)] mt-3">
            Move the sliders. Watch your future move with them.
          </h2>
        </motion.div>

        <GlassCard strong className="p-8 sm:p-12 grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            {sliders.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-[var(--color-ink)]">{s.label}</label>
                  <span className="text-sm font-mono text-[var(--color-indigo)]">{s.value}{s.unit}</span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  value={s.value}
                  onChange={(e) => s.set(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-[var(--color-line)] accent-[var(--color-indigo)] cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-8 items-center justify-center">
            <ProgressRing value={Math.round(placement)} label="Placement" color="var(--color-indigo)" />
            <div className="text-center">
              <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-widest font-mono mb-1">Projected salary</p>
              <div className="flex items-baseline gap-1 justify-center">
                <span className="text-3xl font-display font-semibold text-[var(--color-ink)]">₹</span>
                <AnimatedCounter value={salary} suffix=" LPA" className="text-3xl font-display font-semibold text-[var(--color-ink)]" />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
