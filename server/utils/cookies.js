import { env } from '../config/env.js';
import { COOKIE_NAMES, REFRESH_COOKIE_MAX_AGE } from '../config/constants.js';

/**
 * Refresh token cookie: httpOnly, SameSite=Strict, Secure in production.
 */
export function setRefreshCookie(res, token) {
  res.cookie(COOKIE_NAMES.REFRESH, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'strict',
    maxAge: REFRESH_COOKIE_MAX_AGE,
    path: '/api/v1/auth',
    signed: true,
  });
}

export function clearRefreshCookie(res) {
  res.clearCookie(COOKIE_NAMES.REFRESH, { path: '/api/v1/auth' });
}

export function readRefreshCookie(req) {
  return req.signedCookies?.[COOKIE_NAMES.REFRESH] || null;
}
