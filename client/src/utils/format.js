/** Format a number as USD currency. */
export function formatCurrency(value, currency = 'USD') {
  if (value == null || Number.isNaN(Number(value))) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Number(value));
}

/** Human-friendly date, e.g. "Jun 6, 2026". */
export function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

/** Relative-ish compact date for tables. */
export function formatDateTime(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

/** Effective (discounted) price helper. */
export function effectivePrice(product) {
  return product?.discountPrice ?? product?.price ?? 0;
}

/** Discount percentage helper. */
export function discountPercent(product) {
  if (!product?.discountPrice || !product?.price) return 0;
  return Math.round(((product.price - product.discountPrice) / product.price) * 100);
}
