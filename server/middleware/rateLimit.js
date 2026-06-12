import rateLimit from 'express-rate-limit';

/** Global limiter: 100 requests / 15 min per IP. */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

/** Strict limiter for auth routes: 5 requests / 15 min per IP. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  message: { success: false, message: 'Too many attempts, please try again in 15 minutes.' },
});
