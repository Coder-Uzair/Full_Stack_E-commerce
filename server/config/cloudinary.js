import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

/**
 * Cloudinary is configured lazily and only when credentials are present.
 * Upload helpers throw a typed error if Cloudinary is disabled so callers
 * can return a clean 503 instead of crashing.
 */
if (env.cloudinary.enabled) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
}

export class CloudinaryDisabledError extends Error {
  constructor() {
    super('Media uploads are not configured on this server.');
    this.name = 'CloudinaryDisabledError';
    this.statusCode = 503;
  }
}

/**
 * Upload a base64 / data-URI / remote URL to Cloudinary.
 * @param {string} file - data URI or URL
 * @param {string} folder - target folder
 * @returns {Promise<{public_id: string, url: string}>}
 */
export async function uploadImage(file, folder = 'aurora') {
  if (!env.cloudinary.enabled) throw new CloudinaryDisabledError();
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: 'image',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  });
  return { public_id: result.public_id, url: result.secure_url };
}

export async function deleteImage(publicId) {
  if (!env.cloudinary.enabled) throw new CloudinaryDisabledError();
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
export default cloudinary;
