/** Centralised TanStack Query keys — no magic strings. */
export const QUERY_KEYS = {
  products: (params) => ['products', params],
  product: (slug) => ['product', slug],
  featured: () => ['products', 'featured'],
  search: (q) => ['products', 'search', q],
  categories: () => ['categories'],
  cart: () => ['cart'],
  wishlist: () => ['wishlist'],
  orders: (params) => ['orders', params],
  order: (id) => ['order', id],
  reviews: (productId, page) => ['reviews', productId, page],
  profile: () => ['profile'],
  addresses: () => ['addresses'],
  adminStats: () => ['admin', 'stats'],
  adminOrders: (params) => ['admin', 'orders', params],
  adminUsers: (params) => ['admin', 'users', params],
  adminReviews: (params) => ['admin', 'reviews', params],
};

export default QUERY_KEYS;
