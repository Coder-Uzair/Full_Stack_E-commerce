import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check } from 'lucide-react';
import { Button } from '@/components/common/Button.jsx';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setDone(true);
  };

  return (
    <section className="border-t border-ink-100 bg-ink-50/50 py-16 dark:border-ink-800 dark:bg-ink-950">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
            <Mail size={14} /> Newsletter
          </span>
          <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Get the good stuff first
          </h2>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
            New arrivals, restocks, and the occasional members-only price. No spam.
          </p>

          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
            >
              <Check size={18} /> You’re on the list — welcome aboard.
            </motion.div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 flex-1 rounded-xl border border-ink-200 bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-ink-700 dark:bg-ink-900"
                required
              />
              <Button type="submit" size="lg" variant="primary">
                Subscribe
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default Newsletter;
