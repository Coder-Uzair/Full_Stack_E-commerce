import { Star } from 'lucide-react';
import { cn } from '@/utils/cn.js';

export function Rating({ value = 0, count, size = 14, className, showValue = true }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full || (i === full && hasHalf);
          return (
            <Star
              key={i}
              size={size}
              className={cn(
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-transparent text-ink-300 dark:text-ink-600',
              )}
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-ink-500 dark:text-ink-400">
          {Number(value).toFixed(1)}
          {count != null && <span className="text-ink-400"> ({count})</span>}
        </span>
      )}
    </div>
  );
}

export default Rating;
