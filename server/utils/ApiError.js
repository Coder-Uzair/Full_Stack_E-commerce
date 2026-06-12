/**
 * Operational error type carrying an HTTP status code and optional
 * field-level details. Thrown anywhere; caught by the central handler.
 */
export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.isOperational = true;
    if (details) this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg = 'Bad request', details) {
    return new ApiError(400, msg, details);
  }
  static unauthorized(msg = 'Unauthorized') {
    return new ApiError(401, msg);
  }
  static forbidden(msg = 'Forbidden') {
    return new ApiError(403, msg);
  }
  static notFound(msg = 'Resource not found') {
    return new ApiError(404, msg);
  }
  static conflict(msg = 'Conflict') {
    return new ApiError(409, msg);
  }
  static tooMany(msg = 'Too many requests') {
    return new ApiError(429, msg);
  }
  static internal(msg = 'Something went wrong') {
    return new ApiError(500, msg);
  }
}

export default ApiError;
