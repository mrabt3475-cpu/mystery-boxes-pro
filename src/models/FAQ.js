const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, enum: ['general', 'payment', 'order', 'account', 'technical'], default: 'general' },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  views: { type: Number, default: 0 }
}, { timestamps: true });

faqSchema.index({ category: 1, isActive: 1, sortOrder: 1 });

module.exports = mongoose.model('FAQ', faqSchema);