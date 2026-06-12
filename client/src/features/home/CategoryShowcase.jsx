import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader.jsx';

const CATEGORIES = [
  {
    name: 'Musical Instruments',
    slug: 'musical-instruments',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
    span: 'lg:col-span-2 lg:row-span-2',
  },
  {
    name: 'Premium Footwear',
    slug: 'premium-footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    span: '',
  },
  {
    name: 'Carry & Bags',
    slug: 'carry-bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    span: '',
  },
  {
    name: 'Space Collection',
    slug: 'space-collection',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
    span: 'lg:col-span-2',
  },
];

export function CategoryShowcase() {
  return (
    <section className="container-page py-16">
      <SectionHeader
        eyebrow="Browse"
        title="Shop by category"
        subtitle="Four collections, each chosen with the same eye for craft."
      />
      <div className="grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={cat.span}
          >
            <Link
              to={`/shop?category=${cat.slug}`}
              className="group relative block h-full overflow-hidden rounded-2xl"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-lg font-bold text-white">
                  {cat.name}
                </h3>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-white/80 transition group-hover:gap-2">
                  Shop now →
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default CategoryShowcase;
