/**
 * Referral Model
 */
const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  referee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
  bonusClaimed: {
    type: Boolean,
    default: false,
  },
  bonusAmount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index
referralSchema.index({ referrer: 1, status: 1 });
referralSchema.index({ referee: 1 });

module.exports = mongoose.model('Referral', referralSchema);
