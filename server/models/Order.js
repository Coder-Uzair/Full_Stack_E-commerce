import mongoose from 'mongoose';
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
} from '../config/constants.js';

const lineItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    sku: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const shippingAddressSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String,
  },
  { _id: false },
);

const timelineSchema = new mongoose.Schema(
  {
    status: { type: String, enum: Object.values(ORDER_STATUS), required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String, default: '' },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    orderNumber: { type: String, unique: true, index: true },
    items: { type: [lineItemSchema], required: true },
    shippingAddress: { type: shippingAddressSchema, required: true },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      index: true,
    },
    subtotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, required: true, min: 0, default: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    promoCode: { type: String, default: '' },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.UNPAID,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      default: PAYMENT_METHOD.CARD,
    },
    notes: { type: String, default: '' },
    timeline: { type: [timelineSchema], default: [] },
    deliveredAt: { type: Date, default: null },
  },
  { timestamps: true },
);

orderSchema.index({ createdAt: -1 });

/** Generate a human-friendly, time-sortable order number. */
orderSchema.pre('validate', function setOrderNumber(next) {
  if (!this.orderNumber) {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `AUR-${ts}-${rand}`;
  }
  if (this.isNew && this.timeline.length === 0) {
    this.timeline.push({ status: this.status, note: 'Order placed' });
  }
  next();
});

export const Order = mongoose.model('Order', orderSchema);
export default Order;
