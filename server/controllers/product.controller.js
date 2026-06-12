import { catchAsync } from '../utils/catchAsync.js';
import { ApiResponse, buildPagination } from '../utils/ApiResponse.js';
import * as productService from '../services/product.service.js';

/** GET /products */
export const listProducts = catchAsync(async (req, res) => {
  const { items, total } = await productService.listProducts(req.query);
  const pagination = buildPagination({
    page: req.query.page,
    limit: req.query.limit,
    total,
  });
  return ApiResponse.ok(res, items, 'Products fetched', pagination);
});

/** GET /products/search?q= */
export const searchProducts = catchAsync(async (req, res) => {
  const results = await productService.searchProducts(req.query.q);
  return ApiResponse.ok(res, results, 'Search results');
});

/** GET /products/featured */
export const featuredProducts = catchAsync(async (req, res) => {
  const items = await productService.getFeatured();
  return ApiResponse.ok(res, items, 'Featured products');
});

/** GET /products/:id  (id or slug) */
export const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductByIdOrSlug(req.params.id);
  const related = await productService.getRelated(product);
  return ApiResponse.ok(res, { product, related }, 'Product fetched');
});

/** POST /products (admin) */
export const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  return ApiResponse.created(res, product, 'Product created');
});

/** PUT /products/:id (admin) */
export const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  return ApiResponse.ok(res, product, 'Product updated');
});

/** DELETE /products/:id (admin soft delete) */
export const deleteProduct = catchAsync(async (req, res) => {
  await productService.softDeleteProduct(req.params.id);
  return ApiResponse.ok(res, null, 'Product deleted');
});

export default {
  listProducts,
  searchProducts,
  featuredProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
