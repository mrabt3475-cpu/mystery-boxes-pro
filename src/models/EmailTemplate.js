const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  variables: [{ type: String }],
  isActive: { type: Boolean, default: true },
  category: { type: String, enum: ['welcome', 'order', 'payment', 'referral', 'agent', 'support', 'promotion'], default: 'general' }
}, { timestamps: true });

emailTemplateSchema.index({ name: 1 });
emailTemplateSchema.index({ isActive: 1, category: 1 });

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);