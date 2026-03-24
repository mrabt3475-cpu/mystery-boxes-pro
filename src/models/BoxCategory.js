const mongoose = require('mongoose');

const boxCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true, required: true },
  description: { type: String },
  icon: { type: String },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'BoxCategory' },
  boxCount: { type: Number, default: 0 }
}, { timestamps: true });

boxCategorySchema.index({ slug: 1 });
boxCategorySchema.index({ isActive: 1, sortOrder: 1 });

module.exports = mongoose.model('BoxCategory', boxCategorySchema);