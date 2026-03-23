const mongoose = require('mongoose');

const adminKeySchema = new mongoose.Schema({
  key: { type: String, required: true },
  permissions: [String],
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminCatalogKey', adminKeySchema);
