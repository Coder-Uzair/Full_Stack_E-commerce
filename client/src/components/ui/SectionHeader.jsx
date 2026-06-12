import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function SectionHeader({ eyebrow, title, subtitle, ctaLabel, ctaTo }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
      >
        {eyebrow && (
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink-900 dark:text-white sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-xl text-sm text-ink-500 dark:text-ink-400">
            {subtitle}
          </p>
        )}
      </motion.div>
      {ctaLabel && ctaTo && (
        <Link
          to={ctaTo}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400"
        >
          {ctaLabel}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

export default SectionHeader;
