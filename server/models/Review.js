import mongoose from 'mongoose';
import { REVIEW_STATUS } from '../config/constants.js';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: Object.values(REVIEW_STATUS),
      default: REVIEW_STATUS.PENDING,
      index: true,
    },
    rejectionReason: { type: String, default: '' },
    helpfulVotes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// One review per user per product.
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);
export default Review;
