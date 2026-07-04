import { motion } from 'framer-motion';

export default function GradientButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  onClick,
  type = 'button',
  disabled = false,
}) {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variants = {
    primary:
      'bg-[linear-gradient(120deg,#5B5FEF,#3E3FC4)] text-white shadow-[0_8px_24px_rgba(91,95,239,0.35)] hover:shadow-[0_12px_32px_rgba(91,95,239,0.45)]',
    ghost:
      'bg-white/70 backdrop-blur text-[var(--color-ink)] border border-[var(--color-line)] hover:bg-white',
    outline:
      'bg-transparent text-[var(--color-indigo)] border-2 border-[var(--color-indigo)] hover:bg-[var(--color-indigo-soft)]',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`font-display font-medium rounded-full inline-flex items-center justify-center gap-2 transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
      {Icon && <Icon size={size === 'lg' ? 20 : 16} />}
    </motion.button>
  );
}
