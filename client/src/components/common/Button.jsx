import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn.js';

const VARIANTS = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-500 shadow-glow disabled:bg-brand-300',
  secondary:
    'bg-ink-900 text-white hover:bg-ink-800 dark:bg-white dark:text-ink-900 dark:hover:bg-ink-100',
  outline:
    'border border-ink-200 dark:border-ink-700 text-ink-900 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-ink-900',
  ghost:
    'text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800',
  danger: 'bg-red-600 text-white hover:bg-red-500',
};

const SIZES = {
  sm: 'h-9 px-3 text-sm rounded-lg gap-1.5',
  md: 'h-11 px-5 text-sm rounded-xl gap-2',
  lg: 'h-13 px-7 text-base rounded-xl gap-2.5 py-3.5',
  icon: 'h-11 w-11 rounded-xl',
};

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    className,
    isLoading = false,
    disabled,
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-colors',
        'focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-70',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </motion.button>
  );
});

export default Button;
