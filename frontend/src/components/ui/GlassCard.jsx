import { motion } from 'framer-motion';

export default function GlassCard({
  children,
  className = '',
  hover = true,
  strong = false,
  as: Component = motion.div,
  ...props
}) {
  return (
    <Component
      className={`${strong ? 'glass-strong' : 'glass'} rounded-3xl ${
        hover ? 'transition-all duration-300 hover:shadow-[0_16px_48px_rgba(91,95,239,0.12)] hover:-translate-y-1' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
