const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  value: { type: Number, required: true },
  provider: { type: String },
  providerItemId: String,
  category: { type: String, enum: ['digital', 'game_key', 'physical'], default: 'digital' },
  stock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);
