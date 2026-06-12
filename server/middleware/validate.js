import { ApiError } from '../utils/ApiError.js';

/**
 * Zod validation middleware factory. Validates and replaces req[part]
 * with the parsed (and coerced) value. Rejects with 400 + field errors.
 * @param {import('zod').ZodSchema} schema
 * @param {'body'|'query'|'params'} part
 */
export const validate = (schema, part = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[part]);
  if (!result.success) {
    const details = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join('.') || part;
      if (!details[key]) details[key] = issue.message;
    }
    return next(ApiError.badRequest('Validation failed', details));
  }
  // query/params getters can be read-only on some Express versions —
  // assign defensively.
  try {
    req[part] = result.data;
  } catch {
    Object.defineProperty(req, part, { value: result.data, writable: true });
  }
  return next();
};

export default validate;
