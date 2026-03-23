/**
 * Box Model
 */
const mongoose = require('mongoose');

const boxItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  probability: {
    type: Number,
    default: 1,
    min: 0,
    max: 100,
  },
  isGuaranteed: {
    type: Boolean,
    default: false,
  },
  minPity: {
    type: Number,
    default: 0,
  },
});

const boxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Box name is required'],
    trim: true,
    maxlength: 100,
  },
  description: String,
  price: {
    type: Number,
    required: [true, 'Box price is required'],
    min: [0, 'Price cannot be negative'],
  },
  cost: {
    type: Number,
    default: 0,
    min: 0,
  },
  items: [boxItemSchema],
  image: String,
  images: [String],
  category: {
    type: String,
    enum: ['standard', 'premium', 'vip', 'limited', 'seasonal'],
    default: 'standard',
  },
  active: {
    type: Boolean,
    default: true,
  },
  minPayout: {
    type: Number,
    default: 0,
  },
  maxPayout: {
    type: Number,
    default: 0,
  },
  totalValue: {
    type: Number,
    default: 0,
  },
  totalOpens: {
    type: Number,
    default: 0,
  },
  totalRevenue: {
    type: Number,
    default: 0,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
  },
  startDate: Date,
  endDate: Date,
  isLimited: {
    type: Boolean,
    default: false,
  },
  maxOpens: Number,
  currentOpens: {
    type: Number,
    default: 0,
  },
  cooldown: {
    type: Number,
    default: 0,
  },
  requirements: {
    minLevel: { type: Number, default: 1 },
    minXP: { type: Number, default: 0 },
  },
  rewards: {
    xp: { type: Number, default: 0 },
    referralPoints: { type: Number, default: 0 },
  },
  settings: {
    showItems: { type: Boolean, default: true },
    allowGift: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for profit margin
boxSchema.virtual('profitMargin').get(function() {
  if (this.price === 0) return 0;
  return ((this.price - this.cost) / this.price * 100).toFixed(2);
});

// Index
boxSchema.index({ active: 1, category: 1 });
boxSchema.index({ price: 1 });

module.exports = mongoose.model('Box', boxSchema);
