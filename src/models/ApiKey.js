const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  key: { type: String, unique: true, required: true },
  prefix: { type: String, unique: true, required: true },
  permissions: [{ type: String, enum: ['read', 'write', 'admin'] }],
  rateLimit: { type: Number, default: 100 },
  rateLimitWindow: { type: Number, default: 60000 },
  isActive: { type: Boolean, default: true },
  lastUsedAt: { type: Date },
  expiresAt: { type: Date },
  lastUsedIp: { type: String },
  usageCount: { type: Number, default: 0 }
}, { timestamps: true });

apiKeySchema.index({ key: 1 });
apiKeySchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model('ApiKey', apiKeySchema);