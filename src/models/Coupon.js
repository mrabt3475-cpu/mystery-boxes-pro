const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true, uppercase: true },
  type: { type: String, enum: ['percentage', 'fixed', 'special'], required: true },
  value: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  maxUses: { type: Number },
  usedCount: { type: Number, default: 0 },
  validFrom: { type: Date },
  validUntil: { type: Date },
  isActive: { type: Boolean, default: true },
  applicableBoxes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Box' }],
  applicableCategories: [{ type: String }],
  excludedBoxes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Box' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });

module.exports = mongoose.model('Coupon', couponSchema);