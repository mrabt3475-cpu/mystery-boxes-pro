const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ['physical', 'digital', 'crypto', 'mixed'], default: 'digital' },
  apiEndpoint: { type: String },
  apiKey: { type: String },
  webhookSecret: { type: String },
  isActive: { type: Boolean, default: true },
  config: { type: mongoose.Schema.Types.Mixed },
  supportedCurrencies: [{ type: String }],
  minDeposit: { type: Number, default: 0 },
  maxDeposit: { type: Number },
  fee: { type: Number, default: 0 },
  processingTime: { type: String },
  instructions: { type: String },
  logo: { type: String }
}, { timestamps: true });

providerSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('Provider', providerSchema);