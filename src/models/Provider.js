const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['kingdomlikes', 'g2a', 'cj'] },
  apiKey: String,
  markup: { type: Number, default: 0.15 },
  active: { type: Boolean, default: true },
  priority: { type: Number, default: 1 }
});

module.exports = mongoose.model('Provider', providerSchema);
