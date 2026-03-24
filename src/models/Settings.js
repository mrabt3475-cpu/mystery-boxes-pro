const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true, index: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  type: { type: String, enum: ['string', 'number', 'boolean', 'json', 'array'], default: 'string' },
  category: { type: String, enum: ['general', 'payment', 'referral', 'agent', 'notification', 'security'], default: 'general' },
  description: { type: String },
  isPublic: { type: Boolean, default: false },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

settingsSchema.index({ category: 1, key: 1 });

module.exports = mongoose.model('Settings', settingsSchema);