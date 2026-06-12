import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Rating } from '@/components/common/Rating.jsx';
import { Badge } from '@/components/common/Badge.jsx';
import { useCart } from '@/context/CartContext.jsx';
import { useWishlist } from '@/hooks/useWishlist.js';
import { useToast } from '@/components/common/Toast.jsx';
import { formatCurrency, effectivePrice, discountPercent } from '@/utils/format.js';
import { productPath } from '@/utils/constants.js';
import { cn } from '@/utils/cn.js';

export const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

function ProductCardBase({ product, index = 0 }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { toast } = useToast();
  const id = product._id || product.id;
  const discount = discountPercent(product);
  const wished = has(id);

  const onAdd = (e) => {
    e.preventDefault();
    addItem(product, 1);
    toast({ message: `${product.name} added to cart`, type: 'success' });
  };

  const onWish = (e) => {
    e.preventDefault();
    toggle(id);
    toast({
      message: wished ? 'Removed from wishlist' : 'Added to wishlist',
      type: 'info',
      duration: 2000,
    });
  };

  return (
    <motion.div variants={cardVariants} className="group relative">
      <Link
        to={productPath(product.slug)}
        className="block card-surface overflow-hidden transition-shadow duration-300 hover:shadow-card"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-ink-50 dark:bg-ink-800">
          <img
            src={product.images?.[0]?.url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNewArrival && <Badge tone="accent">New</Badge>}
            {discount > 0 && <Badge tone="danger">-{discount}%</Badge>}
            {product.stock === 0 && <Badge tone="neutral">Sold out</Badge>}
          </div>
          {/* Wishlist */}
          <button
            onClick={onWish}
            aria-label="Toggle wishlist"
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/80 backdrop-blur transition hover:scale-110 dark:bg-ink-900/80"
          >
            <Heart
              size={18}
              className={cn(
                wished ? 'fill-red-500 text-red-500' : 'text-ink-500',
              )}
            />
          </button>
          {/* Add to cart on hover (desktop) */}
          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={onAdd}
              disabled={product.stock === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900/90 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-brand-600 disabled:opacity-50 dark:bg-white/90 dark:text-ink-900 dark:hover:bg-brand-500 dark:hover:text-white"
            >
              <ShoppingBag size={16} />
              {product.stock === 0 ? 'Sold out' : 'Add to cart'}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-1.5 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
            {product.brand}
          </p>
          <h3 className="line-clamp-1 font-semibold text-ink-900 dark:text-white">
            {product.name}
          </h3>
          <Rating value={product.rating} count={product.reviewCount} />
          <div className="flex items-center gap-2 pt-1">
            <span className="text-lg font-bold text-ink-900 dark:text-white">
              {formatCurrency(effectivePrice(product))}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-ink-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export const ProductCard = memo(ProductCardBase);
export default ProductCard;
