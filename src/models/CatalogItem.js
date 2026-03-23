const mongoose = require('mongoose');

const catalogItemSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  name: String,
  price: Number,
  provider: String,
  category: String,
  importedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CatalogItem', catalogItemSchema);
