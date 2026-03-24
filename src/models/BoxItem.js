const mongoose = require('mongoose');

const boxItemSchema = new mongoose.Schema({
  box: { type: mongoose.Schema.Types.ObjectId, ref: 'Box', required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  category: { type: String },
  rarity: { type: String, enum: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'], required: true },
  value: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  isActive: { type: Boolean, default: true },
  quantity: { type: Number, default: 1 },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

boxItemSchema.index({ box: 1, rarity: 1 });
boxItemSchema.index({ rarity: 1, isActive: 1 });

module.exports = mongoose.model('BoxItem', boxItemSchema);