import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import { env } from './config/env.js';
import {
  helmetMiddleware,
  corsMiddleware,
  mongoSanitizeMiddleware,
  xssMiddleware,
} from './middleware/security.js';
import { globalLimiter } from './middleware/rateLimit.js';
import { notFound, errorHandler } from './middleware/error.js';
import apiRoutes from './routes/index.js';

/**
 * Builds and configures the Express application. Separated from the
 * server bootstrap so it can be imported by tests without listening.
 */
export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  // Security
  app.use(helmetMiddleware);
  app.use(corsMiddleware);

  // Parsers
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(env.cookieSecret));

  // Sanitisation (after body parsing)
  app.use(mongoSanitizeMiddleware);
  app.use(xssMiddleware);

  // Performance + logging
  app.use(compression());
  if (!env.isProd) app.use(morgan('dev'));

  // Rate limiting (global)
  app.use('/api', globalLimiter);

  // Routes
  app.use('/api/v1', apiRoutes);

  app.get('/', (_req, res) =>
    res.json({ success: true, message: 'Aurora API', docs: '/api/v1/health' }),
  );

  // 404 + central error handler (must be last)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export default createApp;
