const mongoose = require('mongoose');

const referralRewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['commission', 'bonus'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReferralReward', referralRewardSchema);
