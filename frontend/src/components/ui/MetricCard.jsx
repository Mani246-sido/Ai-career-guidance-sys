import GlassCard from './GlassCard';
import AnimatedCounter from './AnimatedCounter';

export default function MetricCard({ icon: Icon, label, value, suffix = '', trend, accent = 'indigo' }) {
  const accents = {
    indigo: 'text-[var(--color-indigo)] bg-[var(--color-indigo-soft)]',
    gold: 'text-[var(--color-gold)] bg-[var(--color-gold-soft)]',
    mint: 'text-[var(--color-mint)] bg-[var(--color-mint-soft)]',
    sky: 'text-[#3B7BC9] bg-[var(--color-sky-soft)]',
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${accents[accent]}`}>
          {Icon && <Icon size={20} strokeWidth={2} />}
        </div>
        {trend && (
          <span className={`text-xs font-mono px-2 py-1 rounded-full ${trend > 0 ? 'text-[var(--color-mint)] bg-[var(--color-mint-soft)]' : 'text-red-500 bg-red-50'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <AnimatedCounter value={value} suffix={suffix} className="text-3xl font-display font-semibold text-[var(--color-ink)] block" />
      <p className="text-sm text-[var(--color-ink-faint)] mt-1">{label}</p>
    </GlassCard>
  );
}
