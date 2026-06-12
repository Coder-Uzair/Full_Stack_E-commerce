import slugify from 'slugify';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { ApiError } from '../utils/ApiError.js';

const SORT_MAP = {
  'price-asc': { discountPrice: 1, price: 1 },
  'price-desc': { price: -1 },
  rating: { rating: -1, reviewCount: -1 },
  newest: { createdAt: -1 },
  relevance: { isFeatured: -1, rating: -1 },
};

/**
 * Build a Mongo filter object from validated query params.
 */
function buildFilter(query) {
  const filter = { isDeleted: false };

  if (query.category) {
    // accept slug or id
    filter.$or = undefined;
    filter.category = query.category;
  }
  if (query.brand) filter.brand = { $regex: query.brand, $options: 'i' };
  if (query.minRating != null) filter.rating = { $gte: query.minRating };
  if (query.inStock === 'true') filter.stock = { $gt: 0 };
  if (query.inStock === 'false') filter.stock = { $lte: 0 };
  if (query.featured === 'true') filter.isFeatured = true;
  if (query.trending === 'true') filter.isTrending = true;
  if (query.newArrival === 'true') filter.isNewArrival = true;

  if (query.minPrice != null || query.maxPrice != null) {
    filter.price = {};
    if (query.minPrice != null) filter.price.$gte = query.minPrice;
    if (query.maxPrice != null) filter.price.$lte = query.maxPrice;
  }

  if (query.q) {
    filter.$text = { $search: query.q };
  }

  return filter;
}

export async function listProducts(query) {
  const { page, limit, sort } = query;
  const filter = buildFilter(query);

  // Resolve category slug -> id if needed.
  if (query.category && !/^[a-f\d]{24}$/i.test(query.category)) {
    const cat = await Category.findOne({ slug: query.category });
    if (cat) filter.category = cat._id;
    else return { items: [], total: 0 };
  }

  const sortSpec = SORT_MAP[sort] || SORT_MAP.relevance;

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortSpec)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean({ virtuals: true }),
    Product.countDocuments(filter),
  ]);

  return { items, total };
}

export async function searchProducts(q, limit = 8) {
  if (!q) return [];
  return Product.find({ isDeleted: false, $text: { $search: q } })
    .select('name slug brand price discountPrice images rating')
    .limit(limit)
    .lean({ virtuals: true });
}

export async function getFeatured(limit = 8) {
  return Product.find({ isDeleted: false, isFeatured: true })
    .populate('category', 'name slug')
    .sort({ rating: -1 })
    .limit(limit)
    .lean({ virtuals: true });
}

export async function getProductByIdOrSlug(idOrSlug) {
  const query = /^[a-f\d]{24}$/i.test(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };
  const product = await Product.findOne({ ...query, isDeleted: false }).populate(
    'category',
    'name slug',
  );
  if (!product) throw ApiError.notFound('Product not found');
  return product;
}

export async function getRelated(product, limit = 8) {
  return Product.find({
    _id: { $ne: product._id },
    category: product.category,
    isDeleted: false,
  })
    .sort({ rating: -1 })
    .limit(limit)
    .lean({ virtuals: true });
}

export async function createProduct(data) {
  const exists = await Product.findOne({ sku: data.sku.toUpperCase() });
  if (exists) throw ApiError.conflict('A product with this SKU already exists');
  const product = await Product.create(data);
  return product;
}

export async function updateProduct(id, data) {
  const product = await Product.findById(id);
  if (!product || product.isDeleted) throw ApiError.notFound('Product not found');
  Object.assign(product, data);
  if (data.name) {
    const base = slugify(data.name, { lower: true, strict: true });
    product.slug = `${base}-${product.sku.slice(-4).toLowerCase()}`;
  }
  await product.save();
  return product;
}

export async function softDeleteProduct(id) {
  const product = await Product.findById(id);
  if (!product || product.isDeleted) throw ApiError.notFound('Product not found');
  product.isDeleted = true;
  await product.save();
  return product;
}

export default {
  listProducts,
  searchProducts,
  getFeatured,
  getProductByIdOrSlug,
  getRelated,
  createProduct,
  updateProduct,
  softDeleteProduct,
};
