/**
 * Consistent success envelope for all API responses.
 * Shape: { success, message, data, pagination }
 */
export class ApiResponse {
  constructor(data = null, message = 'OK', pagination = null) {
    this.success = true;
    this.message = message;
    this.data = data;
    if (pagination) this.pagination = pagination;
  }

  static send(res, statusCode, data, message, pagination) {
    return res.status(statusCode).json(new ApiResponse(data, message, pagination));
  }

  static ok(res, data, message = 'OK', pagination) {
    return ApiResponse.send(res, 200, data, message, pagination);
  }

  static created(res, data, message = 'Created') {
    return ApiResponse.send(res, 201, data, message);
  }
}

/**
 * Build a pagination metadata object.
 */
export function buildPagination({ page, limit, total }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export default ApiResponse;
