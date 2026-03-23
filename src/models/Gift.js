/**
 * Gift Model
 */
const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
  },
  message: String,
  claimed: {
    type: Boolean,
    default: false,
  },
  claimedAt: Date,
  code: {
    type: String,
    unique: true,
  },
  expiresAt: Date,
}, {
  timestamps: true,
});

// Generate gift code before saving
giftSchema.pre('save', function(next) {
  if (!this.code) {
    this.code = Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Gift', giftSchema);
