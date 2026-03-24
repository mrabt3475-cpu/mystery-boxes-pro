const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['deposit', 'withdrawal', 'bet', 'win', 'refund', 'bonus', 'commission', 'agent_commission'], required: true },
  amount: { type: Number, required: true },
  balanceBefore: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String },
  paymentMethodId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  box: { type: mongoose.Schema.Types.ObjectId, ref: 'Box' },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
  referenceId: { type: String },
  transactionHash: { type: String },
  description: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  processedAt: { type: Date }
}, { timestamps: true });

transactionSchema.index({ user: 1, type: 1, createdAt: -1 });
transactionSchema.index({ referenceId: 1 }, { unique: true, sparse: true });
transactionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);