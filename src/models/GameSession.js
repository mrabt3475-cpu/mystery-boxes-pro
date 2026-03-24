const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  box: { type: mongoose.Schema.Types.ObjectId, ref: 'Box', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  providerSessionId: { type: String },
  status: { type: String, enum: ['pending', 'playing', 'completed', 'failed', 'cancelled'], default: 'pending' },
  betAmount: { type: Number, required: true },
  winAmount: { type: Number, default: 0 },
  multiplier: { type: Number, default: 1 },
  items: [{ type: mongoose.Schema.Types.Mixed }],
  result: { type: mongoose.Schema.Types.Mixed },
  startedAt: { type: Date },
  endedAt: { type: Date },
  duration: { type: Number }
}, { timestamps: true });

gameSessionSchema.index({ user: 1, createdAt: -1 });
gameSessionSchema.index({ provider: 1, providerSessionId: 1 });
gameSessionSchema.index({ order: 1 });

module.exports = mongoose.model('GameSession', gameSessionSchema);