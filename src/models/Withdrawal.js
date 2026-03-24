const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  netAmount: { type: Number, required: true },
  method: { type: String, enum: ['ton', 'usdt_trc20', 'usdt_erc20', 'bank'], required: true },
  walletAddress: { type: String },
  bankDetails: {
    bankName: { type: String },
    accountNumber: { type: String },
    accountName: { type: String },
    routingNumber: { type: String }
  },
  status: { type: String, enum: ['pending', 'approved', 'processing', 'completed', 'rejected', 'cancelled'], default: 'pending' },
  rejectionReason: { type: String },
  processedAt: { type: Date },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  transactionHash: { type: String },
  note: { type: String }
}, { timestamps: true });

withdrawalSchema.index({ user: 1, status: 1 });
withdrawalSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Withdrawal', withdrawalSchema);