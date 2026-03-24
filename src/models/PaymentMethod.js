const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['ton', 'usdt_trc20', 'usdt_erc20', 'bank', 'card'], required: true },
  name: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  walletAddress: { type: String },
  network: { type: String },
  bankDetails: {
    bankName: { type: String },
    accountNumber: { type: String },
    accountName: { type: String },
    routingNumber: { type: String },
    swiftCode: { type: String }
  },
  cardDetails: {
    last4: { type: String },
    brand: { type: String },
    expiryMonth: { type: Number },
    expiryYear: { type: Number }
  },
  isVerified: { type: Boolean, default: false },
  verifiedAt: { type: Date }
}, { timestamps: true });

paymentMethodSchema.index({ user: 1, type: 1 });
paymentMethodSchema.index({ user: 1, isDefault: 1 });

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);