import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import {
  sendEmail,
  verificationEmail,
  resetPasswordEmail,
} from '../utils/email.js';
import { env } from '../config/env.js';

const REFRESH_HASH_ROUNDS = 10;

function issueAccessToken(user) {
  return signAccessToken({ sub: user._id.toString(), role: user.role });
}

/** Refresh tokens are stored hashed so a DB leak can't be replayed. */
async function persistRefreshToken(user, rawToken) {
  const hashed = await bcrypt.hash(rawToken, REFRESH_HASH_ROUNDS);
  // Cap stored sessions to avoid unbounded growth.
  user.refreshTokens = [...(user.refreshTokens || []), hashed].slice(-5);
  await user.save();
}

async function rotateRefreshToken(user, oldRaw, newRaw) {
  const remaining = [];
  for (const hashed of user.refreshTokens || []) {
    // Keep tokens that are NOT the one being rotated out.
    // eslint-disable-next-line no-await-in-loop
    const matches = await bcrypt.compare(oldRaw, hashed);
    if (!matches) remaining.push(hashed);
  }
  const newHashed = await bcrypt.hash(newRaw, REFRESH_HASH_ROUNDS);
  user.refreshTokens = [...remaining, newHashed].slice(-5);
  await user.save();
}

export async function register({ firstName, lastName, email, password }) {
  const exists = await User.findOne({ email });
  if (exists) throw ApiError.conflict('An account with this email already exists');

  const verificationRaw = randomToken();
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    verificationToken: hashToken(verificationRaw),
  });

  const url = `${env.clientOrigins[0]}/verify-email?token=${verificationRaw}`;
  await sendEmail({ to: email, ...verificationEmail({ name: firstName, url }) });

  return user;
}

export async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+password +refreshTokens');
  if (!user) throw ApiError.unauthorized('Invalid email or password');
  if (user.isBlocked) throw ApiError.forbidden('Your account has been blocked');

  const ok = await user.comparePassword(password);
  if (!ok) throw ApiError.unauthorized('Invalid email or password');

  const accessToken = issueAccessToken(user);
  const refreshToken = signRefreshToken({ sub: user._id.toString() });
  await persistRefreshToken(user, refreshToken);

  return { user, accessToken, refreshToken };
}

export async function refresh(rawRefreshToken) {
  if (!rawRefreshToken) throw ApiError.unauthorized('No refresh token provided');

  let decoded;
  try {
    decoded = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.sub).select('+refreshTokens');
  if (!user) throw ApiError.unauthorized('User no longer exists');

  // Verify the presented token matches a stored (hashed) session.
  let matched = false;
  for (const hashed of user.refreshTokens || []) {
    // eslint-disable-next-line no-await-in-loop
    if (await bcrypt.compare(rawRefreshToken, hashed)) {
      matched = true;
      break;
    }
  }
  if (!matched) throw ApiError.unauthorized('Refresh token has been revoked');

  const accessToken = issueAccessToken(user);
  const newRefreshToken = signRefreshToken({ sub: user._id.toString() });
  await rotateRefreshToken(user, rawRefreshToken, newRefreshToken);

  return { user, accessToken, refreshToken: newRefreshToken };
}

export async function logout(userId, rawRefreshToken) {
  if (!userId || !rawRefreshToken) return;
  const user = await User.findById(userId).select('+refreshTokens');
  if (!user) return;
  const remaining = [];
  for (const hashed of user.refreshTokens || []) {
    // eslint-disable-next-line no-await-in-loop
    if (!(await bcrypt.compare(rawRefreshToken, hashed))) remaining.push(hashed);
  }
  user.refreshTokens = remaining;
  await user.save();
}

export async function forgotPassword(email) {
  const user = await User.findOne({ email });
  // Always behave the same to avoid user enumeration.
  if (!user) return;

  const raw = randomToken();
  user.resetPasswordToken = hashToken(raw);
  user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1h
  await user.save();

  const url = `${env.clientOrigins[0]}/reset-password/${raw}`;
  await sendEmail({
    to: email,
    ...resetPasswordEmail({ name: user.firstName, url }),
  });
}

export async function resetPassword(rawToken, newPassword) {
  const hashed = hashToken(rawToken);
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpiry: { $gt: new Date() },
  }).select('+password +resetPasswordToken +resetPasswordExpiry +refreshTokens');

  if (!user) throw ApiError.badRequest('Reset link is invalid or has expired');

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  user.refreshTokens = []; // invalidate all sessions on password change
  await user.save();
}

export async function verifyEmail(rawToken) {
  const hashed = hashToken(rawToken);
  const user = await User.findOne({ verificationToken: hashed }).select(
    '+verificationToken',
  );
  if (!user) throw ApiError.badRequest('Verification link is invalid');
  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();
  return user;
}

export default {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
