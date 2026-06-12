import { useMemo } from 'react';
import { Hero } from '@/features/home/Hero.jsx';
import { CategoryShowcase } from '@/features/home/CategoryShowcase.jsx';
import { TrendingStrip } from '@/features/home/TrendingStrip.jsx';
import { PromoBanner } from '@/features/home/PromoBanner.jsx';
import { Newsletter } from '@/features/home/Newsletter.jsx';
import { SectionHeader } from '@/components/ui/SectionHeader.jsx';
import { ProductGrid } from '@/components/ui/ProductGrid.jsx';
import { useProducts, useFeatured } from '@/hooks/useProducts.js';

export function HomePage() {
  const featured = useFeatured();
  const trending = useProducts({ trending: 'true', limit: 8, sort: 'rating' });
  const newArrivals = useProducts({ newArrival: 'true', limit: 8, sort: 'newest' });
  const topRated = useProducts({ sort: 'rating', limit: 8 });

  const featuredItems = featured.data?.data || [];
  const trendingItems = trending.data?.data || [];
  const newItems = newArrivals.data?.data || [];
  const topItems = topRated.data?.data || [];

  const offline = useMemo(
    () => featured.isError && trending.isError,
    [featured.isError, trending.isError],
  );

  return (
    <div>
      <Hero />
      <CategoryShowcase />

      {offline && (
        <div className="container-page">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            Couldn’t reach the API. Start the backend (<code>npm run dev</code> in
            <code> /server</code>) and seed the database to see live products.
          </div>
        </div>
      )}

      {/* Featured */}
      <section className="container-page py-16">
        <SectionHeader
          eyebrow="Hand-picked"
          title="Featured products"
          subtitle="A curated edit from across the catalog."
          ctaLabel="Shop all"
          ctaTo="/shop?featured=true"
        />
        <ProductGrid products={featuredItems} isLoading={featured.isLoading} />
      </section>

      {/* Trending */}
      <TrendingStrip products={trendingItems} isLoading={trending.isLoading} />

      {/* New arrivals */}
      <section className="container-page py-16">
        <SectionHeader
          eyebrow="Fresh in"
          title="New arrivals"
          subtitle="The latest additions, just landed."
          ctaLabel="See what's new"
          ctaTo="/shop?newArrival=true"
        />
        <ProductGrid products={newItems} isLoading={newArrivals.isLoading} />
      </section>

      <PromoBanner />

      {/* Top rated */}
      <section className="container-page py-16">
        <SectionHeader
          eyebrow="Customer favourites"
          title="Top rated"
          subtitle="Loved by the people who bought them."
          ctaLabel="Browse top rated"
          ctaTo="/shop?sort=rating"
        />
        <ProductGrid products={topItems} isLoading={topRated.isLoading} />
      </section>

      <Newsletter />
    </div>
  );
}

export default HomePage;
