import { catchAsync } from '../utils/catchAsync.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as authService from '../services/auth.service.js';
import {
  setRefreshCookie,
  clearRefreshCookie,
  readRefreshCookie,
} from '../utils/cookies.js';

/** POST /auth/register */
export const register = catchAsync(async (req, res) => {
  const user = await authService.register(req.body);
  return ApiResponse.created(
    res,
    { user },
    'Account created. Check your email to verify your account.',
  );
});

/** POST /auth/login */
export const login = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  setRefreshCookie(res, refreshToken);
  return ApiResponse.ok(res, { user, accessToken }, 'Logged in successfully');
});

/** POST /auth/refresh */
export const refresh = catchAsync(async (req, res) => {
  const raw = readRefreshCookie(req);
  const { user, accessToken, refreshToken } = await authService.refresh(raw);
  setRefreshCookie(res, refreshToken);
  return ApiResponse.ok(res, { user, accessToken }, 'Token refreshed');
});

/** POST /auth/logout */
export const logout = catchAsync(async (req, res) => {
  const raw = readRefreshCookie(req);
  if (raw && req.user) await authService.logout(req.user._id, raw);
  clearRefreshCookie(res);
  return ApiResponse.ok(res, null, 'Logged out');
});

/** POST /auth/forgot-password */
export const forgotPassword = catchAsync(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  return ApiResponse.ok(
    res,
    null,
    'If an account exists, a reset link has been sent.',
  );
});

/** POST /auth/reset-password/:token */
export const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.params.token, req.body.password);
  return ApiResponse.ok(res, null, 'Password reset. You can now log in.');
});

/** GET /auth/verify-email/:token */
export const verifyEmail = catchAsync(async (req, res) => {
  const user = await authService.verifyEmail(req.params.token);
  return ApiResponse.ok(res, { user }, 'Email verified');
});

export default {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
