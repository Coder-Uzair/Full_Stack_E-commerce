import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const TONES = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-brand-500',
};

let counter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ message, type = 'success', duration = 3500, action }) => {
      const id = ++counter;
      setToasts((prev) => [...prev, { id, message, type, action }]);
      if (duration) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[200] flex w-full max-w-sm flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type] || Info;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 60, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                className="pointer-events-auto flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-3.5 shadow-card dark:border-ink-800 dark:bg-ink-900"
              >
                <Icon size={20} className={TONES[t.type]} />
                <p className="flex-1 text-sm font-medium text-ink-800 dark:text-ink-100">
                  {t.message}
                </p>
                {t.action && (
                  <button
                    onClick={() => {
                      t.action.onClick?.();
                      dismiss(t.id);
                    }}
                    className="text-sm font-semibold text-brand-600 hover:text-brand-500"
                  >
                    {t.action.label}
                  </button>
                )}
                <button
                  onClick={() => dismiss(t.id)}
                  className="text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
                  aria-label="Dismiss"
                >
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default ToastProvider;
