import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hammer, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/common/Button.jsx';

/**
 * Honest placeholder for surfaces scheduled in a later milestone.
 * (Shop, Product detail, Checkout, Account, Admin.)
 */
export function ComingSoon({ title = 'Coming soon', note }) {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md"
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
          <Hammer size={28} />
        </div>
        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight">
          {title}
        </h1>
        <p className="mt-3 text-ink-500 dark:text-ink-400">
          {note ||
            'This surface is being built in the next milestone. The homepage and product API are fully live now.'}
        </p>
        <Link to="/" className="mt-8 inline-block">
          <Button variant="outline">
            <ArrowLeft size={16} /> Back to home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

export default ComingSoon;
