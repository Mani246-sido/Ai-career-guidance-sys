import { motion } from 'framer-motion';

export default function ProgressRing({
  value = 0,
  size = 120,
  strokeWidth = 10,
  color = 'var(--color-indigo)',
  trackColor = 'var(--color-line)',
  label,
  sublabel,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="font-display font-semibold text-2xl text-[var(--color-ink)]">{value}%</span>
        {label && <span className="text-xs text-[var(--color-ink-faint)] mt-0.5">{label}</span>}
      </div>
      {sublabel && (
        <span className="absolute -bottom-6 text-xs text-[var(--color-ink-faint)] whitespace-nowrap">{sublabel}</span>
      )}
    </div>
  );
}
