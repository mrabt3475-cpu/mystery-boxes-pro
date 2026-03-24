const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['deposit', 'withdrawal', 'purchase', 'refund', 'commission', 'bonus', 'adjustment'], required: true },
  amount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  netAmount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  method: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'cancelled'], default: 'pending' },
  reference: { type: String, index: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' },
  metadata: { type: mongoose.Schema.Types.Mixed },
  completedAt: { type: Date },
  failureReason: { type: String }
}, { timestamps: true });

transactionSchema.index({ user: 1, type: 1, createdAt: -1 });
transactionSchema.index({ reference: 1 });
transactionSchema.index({ order: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);