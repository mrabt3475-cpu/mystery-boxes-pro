/**
 * Item Model
 */
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: 100,
  },
  description: String,
  image: String,
  images: [String],
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  cost: {
    type: Number,
    default: 0,
    min: 0,
  },
  category: {
    type: String,
    enum: ['physical', 'digital', 'crypto', 'voucher', 'subscription', 'other'],
    default: 'digital',
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
  },
  sku: String,
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  maxStock: {
    type: Number,
    default: 1000,
  },
  isLimited: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
    index: true,
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'],
    default: 'common',
  },
  tier: {
    type: Number,
    default: 1,
    min: 1,
    max: 10,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for profit margin
itemSchema.virtual('profitMargin').get(function() {
  if (this.value === 0) return 0;
  return ((this.value - this.cost) / this.value * 100).toFixed(2);
});

// Index
itemSchema.index({ active: 1, category: 1 });
itemSchema.index({ value: -1 });
itemSchema.index({ rarity: 1 });

module.exports = mongoose.model('Item', itemSchema);
