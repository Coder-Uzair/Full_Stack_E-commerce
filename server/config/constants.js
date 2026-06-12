/**
 * Shared enums and magic-string-free constants used across the API.
 */

export const ROLES = Object.freeze({
  USER: 'user',
  ADMIN: 'admin',
});

export const ORDER_STATUS = Object.freeze({
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
});

export const ORDER_STATUS_FLOW = Object.freeze([
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
]);

export const PAYMENT_STATUS = Object.freeze({
  UNPAID: 'unpaid',
  PAID: 'paid',
  REFUNDED: 'refunded',
});

export const PAYMENT_METHOD = Object.freeze({
  CARD: 'card',
  PAYPAL: 'paypal',
  COD: 'cod',
});

export const REVIEW_STATUS = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
});

export const CATEGORIES = Object.freeze({
  INSTRUMENTS: 'Musical Instruments',
  FOOTWEAR: 'Premium Footwear',
  BAGS: 'Carry & Bags',
  SPACE: 'Space Collection',
});

export const COOKIE_NAMES = Object.freeze({
  REFRESH: 'aurora_rt',
});

export const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
