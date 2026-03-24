const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['game', 'casino', 'lottery', 'sports'], required: true },
  code: { type: String, unique: true, required: true },
  apiEndpoint: { type: String },
  apiKey: { type: String },
  apiSecret: { type: String },
  webhookUrl: { type: String },
  isActive: { type: Boolean, default: true },
  isTestMode: { type: Boolean, default: false },
  commission: { type: Number, default: 0 },
  minBet: { type: Number, default: 0 },
  maxBet: { type: Number, default: 0 },
  supportedCurrencies: [{ type: String }],
  logo: { type: String },
  description: { type: String },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

providerSchema.index({ code: 1 });
providerSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('Provider', providerSchema);