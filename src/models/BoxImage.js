const mongoose = require('mongoose');

const boxImageSchema = new mongoose.Schema({
  box: { type: mongoose.Schema.Types.ObjectId, ref: 'Box', required: true, index: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['main', 'thumbnail', 'gallery', 'preview'], default: 'main' },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

boxImageSchema.index({ box: 1, type: 1, sortOrder: 1 });

module.exports = mongoose.model('BoxImage', boxImageSchema);