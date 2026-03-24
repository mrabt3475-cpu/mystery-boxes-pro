const mongoose = require('mongoose');

const spinSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  box: { type: mongoose.Schema.Types.ObjectId, ref: 'Box', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  spinNumber: { type: Number, required: true },
  result: { type: mongoose.Schema.Types.Mixed },
  prize: { type: mongoose.Schema.Types.Mixed },
  isWin: { type: Boolean, default: false },
  multiplier: { type: Number, default: 1 },
  prizeAmount: { type: Number, default: 0 },
  playedAt: { type: Date, default: Date.now }
}, { timestamps: true });

spinSchema.index({ user: 1, playedAt: -1 });
spinSchema.index({ order: 1 });

module.exports = mongoose.model('Spin', spinSchema);