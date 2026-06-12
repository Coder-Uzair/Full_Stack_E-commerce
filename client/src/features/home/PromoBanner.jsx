import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/common/Button.jsx';

const PERKS = [
  { icon: Truck, title: 'Free shipping', sub: 'On orders over $150' },
  { icon: RotateCcw, title: '30-day returns', sub: 'No-questions policy' },
  { icon: ShieldCheck, title: '2-year warranty', sub: 'On every product' },
];

export function PromoBanner() {
  return (
    <section className="container-page py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-brand-gradient px-6 py-12 text-white sm:px-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_80%_-20%,rgba(255,255,255,0.25),transparent)]" />
        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Free shipping over $150
            </h2>
            <p className="mt-3 max-w-md text-white/85">
              Plus free returns and a two-year warranty on everything we sell.
              Considered commerce, end to end.
            </p>
            <Link to="/shop" className="mt-6 inline-block">
              <Button
                size="lg"
                className="bg-white text-brand-700 shadow-none hover:bg-ink-100"
              >
                Start shopping
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {PERKS.map((perk) => (
              <div
                key={perk.title}
                className="rounded-2xl bg-white/10 p-4 backdrop-blur"
              >
                <perk.icon size={24} />
                <p className="mt-3 font-bold">{perk.title}</p>
                <p className="text-sm text-white/80">{perk.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default PromoBanner;
