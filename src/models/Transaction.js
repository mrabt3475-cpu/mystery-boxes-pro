/**
 * Transaction Model
 */
const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['deposit', 'withdraw', 'bet', 'win', 'refund', 'bonus', 'commission', 'gift_sent', 'gift_received'],
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  balance: {
    type: Number,
    required: true,
  },
  previousBalance: {
    type: Number,
  },
  description: String,
  paymentMethod: {
    type: String,
    enum: ['ton', 'usdt', 'card', 'wallet', 'coupon'],
  },
  transactionHash: String,
  withdrawalAddress: String,
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending',
    index: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  processedAt: Date,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Index for queries
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ type: 1, status: 1 });
transactionSchema.index({ transactionHash: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
