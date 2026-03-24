const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true, uppercase: true },
  balance: { type: Number, required: true },
  initialBalance: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  isActive: { type: Boolean, default: true },
  validFrom: { type: Date },
  validUntil: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  purchasedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  giftedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  redeemedAt: { type: Date },
  redeemedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  transactions: [{
    type: { type: String, enum: ['create', 'redeem', 'topup'] },
    amount: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

giftCardSchema.index({ code: 1 });
giftCardSchema.index({ isActive: 1, validUntil: 1 });

module.exports = mongoose.model('GiftCard', giftCardSchema);