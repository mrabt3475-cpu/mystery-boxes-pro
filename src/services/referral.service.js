/**
 * Referral Service
 */
const Referral = require('../models/Referral');
const ReferralReward = require('../models/ReferralReward');
const User = require('../models/User');
const logger = require('../utils/logger');

class ReferralService {
  async createReferral(referrerId, refereeId) {
    const referral = await Referral.create({ referrerId, refereeId, status: 'active' });
    return referral;
  }

  async calculateCommission(referrerId, orderAmount) {
    const user = await User.findById(referrerId);
    const tier = user?.referralTier || 1;
    const rates = { 1: 0.05, 2: 0.10, 3: 0.15 };
    return orderAmount * (rates[tier] || 0.05);
  }

  async awardReward(referrerId, amount) {
    await ReferralReward.create({ userId: referrerId, amount, type: 'commission' });
    logger.info(`Awarded ${amount} to user ${referrerId}`);
  }
}

module.exports = new ReferralService();
