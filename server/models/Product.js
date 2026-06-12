import mongoose from 'mongoose';
import slugify from 'slugify';

const imageSchema = new mongoose.Schema(
  {
    public_id: { type: String, default: '' },
    url: { type: String, required: true },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 160,
      index: 'text',
    },
    slug: { type: String, unique: true, index: true, lowercase: true },
    brand: { type: String, required: true, trim: true, index: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    subcategory: { type: String, trim: true, default: '' },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    features: { type: [String], default: [] },
    specifications: { type: Map, of: String, default: {} },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      default: null,
      validate: {
        validator(v) {
          return v == null || v < this.price;
        },
        message: 'Discount price must be lower than price',
      },
    },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: {
      type: [imageSchema],
      validate: {
        validator: (arr) => arr.length >= 1,
        message: 'At least one image is required',
      },
    },
    tags: { type: [String], default: [], index: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false, index: true },
    isNewArrival: { type: Boolean, default: false, index: true },
    isTrending: { type: Boolean, default: false, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

// Compound text index for search across name, brand, tags.
productSchema.index({ name: 'text', brand: 'text', tags: 'text', description: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

productSchema.virtual('effectivePrice').get(function effectivePrice() {
  return this.discountPrice ?? this.price;
});

productSchema.virtual('discountPercent').get(function discountPercent() {
  if (!this.discountPrice) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

productSchema.pre('validate', function setSlug(next) {
  if (this.isModified('name') || !this.slug) {
    const base = slugify(this.name, { lower: true, strict: true });
    // Append short sku fragment to guarantee uniqueness across similar names.
    const suffix = (this.sku || '').slice(-4).toLowerCase();
    this.slug = suffix ? `${base}-${suffix}` : base;
  }
  next();
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export const Product = mongoose.model('Product', productSchema);
export default Product;
