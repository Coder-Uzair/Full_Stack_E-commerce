import { catchAsync } from '../utils/catchAsync.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';

/** GET /categories  (public) — includes live product counts */
export const listCategories = catchAsync(async (_req, res) => {
  const categories = await Category.find({ isActive: true })
    .sort({ displayOrder: 1, name: 1 })
    .lean();

  const counts = await Product.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const countMap = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));

  const withCounts = categories.map((c) => ({
    ...c,
    productCount: countMap[String(c._id)] || 0,
  }));

  return ApiResponse.ok(res, withCounts, 'Categories fetched');
});

/** GET /categories/:slug */
export const getCategory = catchAsync(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).lean();
  if (!category) throw ApiError.notFound('Category not found');
  return ApiResponse.ok(res, category, 'Category fetched');
});

/** POST /categories (admin) */
export const createCategory = catchAsync(async (req, res) => {
  const category = await Category.create(req.body);
  return ApiResponse.created(res, category, 'Category created');
});

/** PUT /categories/:id (admin) */
export const updateCategory = catchAsync(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw ApiError.notFound('Category not found');
  Object.assign(category, req.body);
  await category.save();
  return ApiResponse.ok(res, category, 'Category updated');
});

/** DELETE /categories/:id (admin) */
export const deleteCategory = catchAsync(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw ApiError.notFound('Category not found');
  const inUse = await Product.countDocuments({
    category: category._id,
    isDeleted: false,
  });
  if (inUse > 0) {
    throw ApiError.conflict('Cannot delete a category that still has products');
  }
  await category.deleteOne();
  return ApiResponse.ok(res, null, 'Category deleted');
});

export default {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
