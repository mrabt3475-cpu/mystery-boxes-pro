/**
 * Coupon Model
 */
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    enum: ['percent', 'fixed'],
    default: 'percent',
  },
  minAmount: {
    type: Number,
    default: 0,
  },
  maxUses: {
    type: Number,
    default: 1,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  expiresAt: Date,
  startsAt: Date,
  usedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Check if coupon is valid
couponSchema.methods.isValid = function() {
  if (!this.active) return false;
  if (this.expiresAt && this.expiresAt < new Date()) return false;
  if (this.startsAt && this.startsAt > new Date()) return false;
  if (this.usedCount >= this.maxUses) return false;
  return true;
};

// Calculate discount
couponSchema.methods.calculateDiscount = function(amount) {
  if (this.type === 'percent') {
    return amount * (this.discount / 100);
  }
  return Math.min(this.discount, amount);
};

module.exports = mongoose.model('Coupon', couponSchema);
