const mongoose = require('mongoose');

const agentCommissionSchema = new mongoose.Schema({
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true, index: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  rate: { type: Number, required: true },
  tierAtCommission: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'paid', 'cancelled'], default: 'pending' },
  paidAt: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  note: { type: String }
}, { timestamps: true });

agentCommissionSchema.index({ agent: 1, status: 1 });
agentCommissionSchema.index({ order: 1 });

module.exports = mongoose.model('AgentCommission', agentCommissionSchema);