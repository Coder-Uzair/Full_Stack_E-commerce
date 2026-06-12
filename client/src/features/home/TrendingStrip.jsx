import { SectionHeader } from '@/components/ui/SectionHeader.jsx';
import { ProductCard } from '@/components/ui/ProductCard.jsx';
import { ProductCardSkeleton } from '@/components/common/Skeleton.jsx';

export function TrendingStrip({ products = [], isLoading }) {
  return (
    <section className="container-page py-16">
      <SectionHeader
        eyebrow="Hot right now"
        title="Trending now"
        subtitle="What everyone’s adding to cart this week."
        ctaLabel="View all"
        ctaTo="/shop?trending=true"
      />
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-64 shrink-0 snap-start">
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((p) => (
              <div key={p._id || p.id} className="w-64 shrink-0 snap-start">
                <ProductCard product={p} />
              </div>
            ))}
      </div>
    </section>
  );
}

export default TrendingStrip;
