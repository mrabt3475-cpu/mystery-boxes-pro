const Commission = require('../models/Commission');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const logger = require('../utils/logger');

class CommissionService {
  constructor() {
    this.tiers = { 1: 0.05, 2: 0.07, 3: 0.10, 4: 0.12, 5: 0.15 };
    this.agentRates = { silver: 0.03, gold: 0.05, platinum: 0.08, diamond: 0.10 };
  }

  async calculateCommission(orderId) {
    const order = await Order.findById(orderId).populate('user');
    if (!order) throw new Error('Order not found');
    const amount = order.amount;
    const tierRate = this.tiers[order.user.referralTier] || this.tiers[1];
    return { orderId, userId: order.user._id, orderAmount: amount, tierRate, commissionAmount: amount * tierRate };
  }

  async awardCommission(referrerId, orderId, amount) {
    const referrer = await User.findById(referrerId);
    if (!referrer) throw new Error('Referrer not found');
    const tierRate = this.tiers[referrer.referralTier] || this.tiers[1];
    const commissionAmount = amount * tierRate;
    const commission = await Commission.create({ referrer: referrerId, order: orderId, amount: commissionAmount, rate: tierRate, status: 'pending' });
    const wallet = await Wallet.findOne({ user: referrerId });
    if (wallet) {
      wallet.balance += commissionAmount;
      wallet.totalEarned += commissionAmount;
      await wallet.save();
      await Transaction.create({ user: referrerId, type: 'commission', amount: commissionAmount, balance: wallet.balance, status: 'completed', note: `Commission from order ${orderId}` });
    }
    commission.status = 'completed';
    commission.paidAt = new Date();
    await commission.save();
    await User.findByIdAndUpdate(referrerId, { $inc: { 'stats.totalReferralEarnings': commissionAmount } });
    logger.info(`Commission awarded: ${commissionAmount} to user ${referrerId}`);
    return commission;
  }

  async awardAgentCommission(agentId, orderId, amount, agentTier) {
    const rate = this.agentRates[agentTier] || this.agentRates.silver;
    const commissionAmount = amount * rate;
    const commission = await Commission.create({ agent: agentId, order: orderId, amount: commissionAmount, rate, type: 'agent', status: 'pending' });
    const wallet = await Wallet.findOne({ user: agentId });
    if (wallet) {
      wallet.balance += commissionAmount;
      wallet.totalEarned += commissionAmount;
      await wallet.save();
      await Transaction.create({ user: agentId, type: 'agent_commission', amount: commissionAmount, balance: wallet.balance, status: 'completed', note: `Agent commission from order ${orderId}` });
    }
    commission.status = 'completed';
    commission.paidAt = new Date();
    await commission.save();
    logger.info(`Agent commission awarded: ${commissionAmount} to agent ${agentId}`);
    return commission;
  }

  async getCommissionStats(userId) {
    const stats = await Commission.aggregate([
      { $match: { referrer: userId } },
      { $group: { _id: null, totalCommission: { $sum: '$amount' }, pendingCommission: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0] } }, completedCommission: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] } }, count: { $sum: 1 } } }
    ]);
    return stats[0] || { totalCommission: 0, pendingCommission: 0, completedCommission: 0, count: 0 };
  }

  async processPendingCommissions() {
    const pendingCommissions = await Commission.find({ status: 'pending' });
    for (const commission of pendingCommissions) {
      const order = await Order.findById(commission.order);
      if (!order) continue;
      const daysSinceOrder = (Date.now() - order.createdAt) / (1000 * 60 * 60 * 24);
      if (daysSinceOrder >= 7) {
        commission.status = 'completed';
        commission.paidAt = new Date();
        await commission.save();
      }
    }
    logger.info(`Processed ${pendingCommissions.length} pending commissions`);
  }
}

module.exports = new CommissionService();