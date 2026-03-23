const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['kingdomlikes', 'g2a', 'cj'], required: true },
  apiKey: String,
  apiSecret: String,
  isActive: { type: Boolean, default: true },
  fee: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Provider', providerSchema);
