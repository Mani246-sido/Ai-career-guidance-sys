import { Loader2, AlertCircle } from 'lucide-react';

export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Loader2 size={22} className="animate-spin text-[var(--color-indigo)] mb-3" />
      <p className="text-sm text-[var(--color-ink-faint)]">{label}</p>
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle size={22} className="text-red-500 mb-3" />
      <p className="text-sm text-[var(--color-ink-soft)] mb-4 max-w-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-sm font-medium text-[var(--color-indigo)]">
          Try again
        </button>
      )}
    </div>
  );
}
