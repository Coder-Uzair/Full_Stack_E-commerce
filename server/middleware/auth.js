import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { verifyAccessToken } from '../utils/tokens.js';
import { ROLES } from '../config/constants.js';
import { User } from '../models/User.js';

/**
 * Requires a valid access token. Attaches `req.user` (lean-ish doc).
 */
export const requireAuth = catchAsync(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) throw ApiError.unauthorized('Authentication required');

  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded.sub);

  if (!user) throw ApiError.unauthorized('User no longer exists');
  if (user.isBlocked) throw ApiError.forbidden('Account is blocked');

  req.user = user;
  next();
});

/**
 * Requires the authenticated user to be an admin. Role is checked
 * server-side on every request — never trusted from the client.
 */
export const requireAdmin = (req, _res, next) => {
  if (!req.user) return next(ApiError.unauthorized('Authentication required'));
  if (req.user.role !== ROLES.ADMIN) {
    return next(ApiError.forbidden('Admin access required'));
  }
  return next();
};

/**
 * Optional auth — attaches req.user when a valid token is present but
 * never rejects. Useful for endpoints with guest + member behaviour.
 */
export const optionalAuth = catchAsync(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();
  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.sub);
    if (user && !user.isBlocked) req.user = user;
  } catch {
    /* ignore invalid token for optional auth */
  }
  return next();
});

export default requireAuth;
