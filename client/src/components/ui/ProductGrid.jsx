import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard.jsx';
import { ProductGridSkeleton } from '@/components/common/Skeleton.jsx';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export function ProductGrid({ products = [], isLoading, columns = 4, skeletonCount = 8 }) {
  if (isLoading) return <ProductGridSkeleton count={skeletonCount} />;

  const colClass =
    columns === 3
      ? 'sm:grid-cols-2 lg:grid-cols-3'
      : 'sm:grid-cols-3 lg:grid-cols-4';

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className={`grid grid-cols-2 gap-4 ${colClass}`}
    >
      {products.map((product, i) => (
        <ProductCard key={product._id || product.id} product={product} index={i} />
      ))}
    </motion.div>
  );
}

export default ProductGrid;
