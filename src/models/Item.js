const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  value: { type: Number, required: true },
  category: String,
  provider: String,
  sku: String,
  stock: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Item', itemSchema);
