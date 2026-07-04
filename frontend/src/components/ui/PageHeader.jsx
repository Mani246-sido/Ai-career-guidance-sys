import { motion } from 'framer-motion';

export default function PageHeader({ title, description }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
      <h1 className="font-display font-semibold text-3xl text-[var(--color-ink)]">{title}</h1>
      {description && <p className="text-[var(--color-ink-faint)] mt-1">{description}</p>}
    </motion.div>
  );
}
