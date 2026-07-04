import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import GradientButton from '@/components/ui/GradientButton';
import AuroraBackground from '@/components/ui/AuroraBackground';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      <AuroraBackground />
      <div className="relative z-10">
        <span className="font-display font-semibold text-8xl text-gradient">404</span>
        <h1 className="font-display font-semibold text-2xl text-[var(--color-ink)] mt-4 mb-2">This path doesn't exist yet</h1>
        <p className="text-[var(--color-ink-faint)] mb-8 max-w-sm">
          Even the Time Machine can't simulate a page that was never built.
        </p>
        <Link to="/">
          <GradientButton icon={ArrowLeft}>Back home</GradientButton>
        </Link>
      </div>
    </div>
  );
}
