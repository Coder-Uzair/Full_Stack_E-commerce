import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * 404 handler for unmatched routes.
 */
export function notFound(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Central error handler. Normalises Mongoose/JWT/Zod errors into the
 * standard envelope and never leaks stack traces in production.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let details = err.details || undefined;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `${field} already exists`;
    details = { [field]: `This ${field} is already in use` };
  }

  // Mongoose validation
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.fromEntries(
      Object.values(err.errors).map((e) => [e.path, e.message]),
    );
  }

  // JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  if (!env.isProd && statusCode === 500) {
    // eslint-disable-next-line no-console
    console.error('🔥', err);
  }

  const body = {
    success: false,
    message,
  };
  if (details) body.errors = details;
  if (!env.isProd && err.stack) body.stack = err.stack;

  res.status(statusCode).json(body);
}

export default errorHandler;
