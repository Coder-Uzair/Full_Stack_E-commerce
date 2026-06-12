import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      maxlength: 80,
    },
    slug: { type: String, unique: true, index: true, lowercase: true },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    image: {
      public_id: { type: String, default: '' },
      url: { type: String, default: '' },
    },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    displayOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

categorySchema.pre('validate', function setSlug(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const Category = mongoose.model('Category', categorySchema);
export default Category;
