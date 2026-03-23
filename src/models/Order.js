/**
 * Order Model
 */
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Box',
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  cost: {
    type: Number,
    default: 0,
  },
  profit: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending',
    index: true,
  },
  paymentMethod: {
    type: String,
    enum: ['wallet', 'ton', 'usdt', 'card', 'coupon'],
    default: 'wallet',
  },
  paymentId: String,
  transactionHash: String,
  itemValue: {
    type: Number,
    default: 0,
  },
  isWin: {
    type: Boolean,
    default: false,
  },
  isPity: {
    type: Boolean,
    default: false,
  },
  serverSeed: String,
  clientSeed: String,
  resultHash: String,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for profit/loss
orderSchema.virtual('profitLoss').get(function() {
  return this.amount - this.itemValue;
});

// Index for queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ box: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
