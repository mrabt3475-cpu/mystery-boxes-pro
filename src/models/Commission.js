const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', index: true },
  amount: { type: Number, required: true },
  rate: { type: Number, required: true },
  type: { type: String, enum: ['referral', 'agent'], default: 'referral' },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  paidAt: { type: Date }
}, { timestamps: true });

commissionSchema.index({ referrer: 1, status: 1 });
commissionSchema.index({ agent: 1, status: 1 });

module.exports = mongoose.model('Commission', commissionSchema);