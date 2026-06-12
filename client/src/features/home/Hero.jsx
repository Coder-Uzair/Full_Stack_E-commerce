import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/Button.jsx';
import { ROUTES } from '@/utils/constants.js';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-aurora-radial">
      <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300"
          >
            <Sparkles size={14} /> New season, considered design
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            Things worth
            <br />
            <span className="text-gradient">keeping.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-md text-lg text-ink-500 dark:text-ink-300"
          >
            Instruments, footwear, carry goods, and a curated space collection —
            chosen for craft, built to last, and priced honestly.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <Link to={ROUTES.SHOP}>
              <Button size="lg" variant="primary">
                Shop the collection <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/shop?category=space-collection">
              <Button size="lg" variant="outline">
                Explore Space
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex gap-8 border-t border-ink-100 pt-6 dark:border-ink-800"
          >
            {[
              ['30+', 'Curated products'],
              ['4.7★', 'Average rating'],
              ['Free', 'Shipping over $150'],
            ].map(([stat, label]) => (
              <div key={label}>
                <p className="text-2xl font-extrabold text-ink-900 dark:text-white">
                  {stat}
                </p>
                <p className="text-xs text-ink-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card">
            <img
              src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1000&q=80"
              alt="Featured product"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent" />
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-5 -left-5 glass rounded-2xl p-4 shadow-glow"
          >
            <p className="text-xs text-ink-500">Featured</p>
            <p className="font-bold">Solstice GA-200</p>
            <p className="text-sm font-semibold text-brand-600">$749.00</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
