const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true, index: true },
  totalUsers: { type: Number, default: 0 },
  newUsers: { type: Number, default: 0 },
  activeUsers: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 },
  totalDeposits: { type: Number, default: 0 },
  totalWithdrawals: { type: Number, default: 0 },
  totalBets: { type: Number, default: 0 },
  totalWins: { type: Number, default: 0 },
  boxesSold: { type: Number, default: 0 },
  topBoxes: [{
    box: { type: mongoose.Schema.Types.ObjectId, ref: 'Box' },
    count: { type: Number }
  }],
  topProviders: [{
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    revenue: { type: Number }
  }],
  conversionRate: { type: Number, default: 0 },
  averageOrderValue: { type: Number, default: 0 }
}, { timestamps: true });

analyticsSchema.index({ date: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);