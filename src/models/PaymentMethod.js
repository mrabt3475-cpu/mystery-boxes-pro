const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true, required: true },
  type: { type: String, enum: ['crypto', 'bank', 'wallet', 'card'], required: true },
  currency: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isDefault: { type: Boolean, default: false },
  minDeposit: { type: Number, default: 0 },
  maxDeposit: { type: Number },
  minWithdrawal: { type: Number, default: 0 },
  maxWithdrawal: { type: Number },
  depositFee: { type: Number, default: 0 },
  withdrawalFee: { type: Number, default: 0 },
  feeType: { type: String, enum: ['fixed', 'percentage'], default: 'percentage' },
  instructions: { type: String },
  logo: { type: String },
  sortOrder: { type: Number, default: 0 },
  config: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

paymentMethodSchema.index({ code: 1 });
paymentMethodSchema.index({ isActive: 1, sortOrder: 1 });

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);