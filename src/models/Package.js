const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  boxes: [{
    box: { type: mongoose.Schema.Types.ObjectId, ref: 'Box', required: true },
    quantity: { type: Number, default: 1 }
  }],
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  validFrom: { type: Date },
  validUntil: { type: Date },
  maxUses: { type: Number },
  usedCount: { type: Number, default: 0 },
  image: { type: String },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

packageSchema.index({ isActive: 1, sortOrder: 1 });

module.exports = mongoose.model('Package', packageSchema);