/** Frontend route paths — single source of truth. */
export const ROUTES = Object.freeze({
  HOME: '/',
  SHOP: '/shop',
  PRODUCT: '/product/:slug',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT: '/forgot-password',
  RESET: '/reset-password/:token',
  VERIFY: '/verify-email',
  WISHLIST: '/wishlist',
  ACCOUNT: '/account',
  ACCOUNT_ORDERS: '/account/orders',
  ACCOUNT_ADDRESSES: '/account/addresses',
  ACCOUNT_SECURITY: '/account/security',
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_USERS: '/admin/users',
  ADMIN_REVIEWS: '/admin/reviews',
});

export const productPath = (slug) => `/product/${slug}`;
export const categoryPath = (slug) => `/shop?category=${slug}`;

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

export const PAGE_SIZES = [12, 24, 48];
