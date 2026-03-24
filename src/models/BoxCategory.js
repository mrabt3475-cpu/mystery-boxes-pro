const mongoose = require('mongoose');

const boxCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true, required: true },
  description: { type: String },
  icon: { type: String },
  image: { type: String },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'BoxCategory' },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  seoTitle: { type: String },
  seoDescription: { type: String }
}, { timestamps: true });

boxCategorySchema.index({ slug: 1 });
boxCategorySchema.index({ parentCategory: 1, sortOrder: 1 });

module.exports = mongoose.model('BoxCategory', boxCategorySchema);