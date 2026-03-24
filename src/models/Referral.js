const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  referred: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['active', 'inactive', 'cancelled'], default: 'active' },
  bonusAmount: { type: Number, default: 0 },
  bonusAwarded: { type: Boolean, default: false },
  bonusAwardedAt: { type: Date }
}, { timestamps: true });

referralSchema.index({ referrer: 1, referred: 1 }, { unique: true });
referralSchema.index({ referrer: 1, status: 1 });

module.exports = mongoose.model('Referral', referralSchema);