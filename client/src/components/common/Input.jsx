import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/cn.js';

export const Input = forwardRef(function Input(
  { label, error, type = 'text', className, hint, id, ...props },
  ref,
) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (show ? 'text' : 'password') : type;
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          className={cn(
            'w-full rounded-xl border bg-white px-4 text-sm text-ink-900 transition-all',
            'h-11 placeholder:text-ink-400',
            'dark:bg-ink-900 dark:text-ink-100 dark:placeholder:text-ink-500',
            'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 outline-none',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/30'
              : 'border-ink-200 dark:border-ink-700',
            isPassword && 'pr-11',
            className,
          )}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
});

export default Input;
