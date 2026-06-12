/**
 * Wraps an async Express handler so rejected promises are forwarded
 * to the central error middleware — eliminates repetitive try/catch.
 * @param {Function} fn
 * @returns {Function}
 */
export const catchAsync = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default catchAsync;
