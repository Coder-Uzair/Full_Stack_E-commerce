import { cn } from '@/utils/cn.js';

export function Spinner({ className, size = 24 }) {
  return (
    <span
      style={{ width: size, height: size }}
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-brand-500 border-t-transparent',
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export default Spinner;
