import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import cors from 'cors';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Helmet with a strict Content-Security-Policy suitable for a JSON API.
 */
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: env.isProd ? [] : null,
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

/** Strict CORS allowlist — only configured frontend origins. */
export const corsMiddleware = cors({
  origin(origin, cb) {
    // Allow same-origin / server-to-server (no origin) and allowlisted ones.
    if (!origin || env.clientOrigins.includes(origin)) return cb(null, true);
    return cb(new ApiError(403, `Origin not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

export const mongoSanitizeMiddleware = mongoSanitize();
export const xssMiddleware = xss();
