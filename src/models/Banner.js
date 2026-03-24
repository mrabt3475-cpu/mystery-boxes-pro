const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  image: { type: String, required: true },
  link: { type: String },
  linkType: { type: String, enum: ['box', 'category', 'external', 'none'], default: 'none' },
  targetId: { type: mongoose.Schema.Types.ObjectId },
  position: { type: String, enum: ['home', 'category', 'footer', 'popup'], default: 'home' },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date },
  sortOrder: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 }
}, { timestamps: true });

bannerSchema.index({ isActive: 1, position: 1, sortOrder: 1 });

module.exports = mongoose.model('Banner', bannerSchema);