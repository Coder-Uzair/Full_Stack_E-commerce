import dotenv from 'dotenv';

dotenv.config();

/**
 * Centralised, validated environment configuration.
 * The process exits immediately if any required variable is missing,
 * so misconfiguration fails fast rather than at first request.
 */

const REQUIRED = [
  'MONGO_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'COOKIE_SECRET',
];

const missing = REQUIRED.filter((key) => !process.env[key]);

if (missing.length > 0) {
  // eslint-disable-next-line no-console
  console.error(
    `\n❌ Missing required environment variables:\n   - ${missing.join(
      '\n   - ',
    )}\n\nCopy .env.example to .env and fill these in.\n`,
  );
  process.exit(1);
}

const toList = (value) =>
  (value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT) || 5000,

  mongoUri: process.env.MONGO_URI,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  cookieSecret: process.env.COOKIE_SECRET,

  clientOrigins: toList(process.env.CLIENT_URL || 'http://localhost:5173'),

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    enabled: Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET,
    ),
  },

  email: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || 'Aurora <no-reply@aurora.shop>',
    enabled: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
  },

  seed: {
    adminEmail: process.env.SEED_ADMIN_EMAIL || 'admin@aurora.shop',
    adminPassword: process.env.SEED_ADMIN_PASSWORD || 'Admin@12345',
    demoEmail: process.env.SEED_DEMO_EMAIL || 'demo@aurora.shop',
    demoPassword: process.env.SEED_DEMO_PASSWORD || 'Demo@12345',
  },

  commerce: {
    freeShippingThreshold: Number(process.env.FREE_SHIPPING_THRESHOLD) || 150,
    flatShippingRate: Number(process.env.FLAT_SHIPPING_RATE) || 12,
  },
};

export default env;
