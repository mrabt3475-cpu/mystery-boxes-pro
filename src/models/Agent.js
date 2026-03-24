const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  tier: { type: String, enum: ['silver', 'gold', 'platinum', 'diamond'], default: 'silver' },
  agentCode: { type: String, unique: true, required: true },
  totalSales: { type: Number, default: 0 },
  totalCommission: { type: Number, default: 0 },
  activeClients: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'suspended', 'inactive'], default: 'active' },
  tierUpgradedAt: { type: Date },
  lastActiveAt: { type: Date }
}, { timestamps: true });

agentSchema.index({ agentCode: 1 });
agentSchema.index({ tier: 1, status: 1 });

module.exports = mongoose.model('Agent', agentSchema);