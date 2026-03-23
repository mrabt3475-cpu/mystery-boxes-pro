/**
 * Referral Service
 */
const Referral = require('../models/Referral');
const ReferralReward = require('../models/ReferralReward');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Activity = require('../models/Activity');
const logger = require('../utils/logger');

class ReferralService {
  /**
   * Create referral relationship
   */
  async createReferral(referrerId, refereeId) {
    // Check if already referred
    const existing = await Referral.findOne({ refereeId });
    if (existing) {
      logger.warn(`User ${refereeId} already has a referrer`);
      return null;
    }

    const referral = await Referral.create({
      referrer: referrerId,
      referee: refereeId,
      status: 'active',
    });

    // Update referrer's tier
    await this.updateReferrerTier(referrerId);

    logger.info(`Referral created: ${referrerId} -> ${refereeId}`);
    return referral;
  }

  /**
   * Calculate commission for referrer
   */
  async calculateCommission(referrerId, orderAmount) {
    const user = await User.findById(referrerId);
    const tier = user?.referralTier || 1;
    
    const rates = {
      1: 0.05,  // 5%
      2: 0.10,  // 10%
      3: 0.15,  // 15%
      4: 0.20,  // 20%
      5: 0.25,  // 25%
    };
    
    return orderAmount * (rates[tier] || 0.05);
  }

  /**
   * Award referral reward
   */
  async awardReward(referrerId, amount, type = 'commission') {
    try {
      // Create reward record
      await ReferralReward.create({
        user: referrerId,
        amount,
        type,
      });

      // Add to wallet
      const wallet = await Wallet.findOne({ user: referrerId });
      if (wallet) {
        wallet.balance += amount;
        await wallet.save();
      }

      // Log activity
      await Activity.create({
        user: referrerId,
        action: 'referral',
        details: { amount, type },
      });

      logger.info(`Awarded ${amount} to referrer ${referrerId}`);
    } catch (error) {
      logger.error('Award reward error:', error);
    }
  }

  /**
   * Update referrer's tier based on number of referrals
   */
  async updateReferrerTier(referrerId) {
    const count = await Referral.countDocuments({ referrer: referrerId, status: 'active' });
    
    let tier = 1;
    if (count >= 50) tier = 5;
    else if (count >= 20) tier = 4;
    else if (count >= 10) tier = 3;
    else if (count >= 5) tier = 2;

    await User.findByIdAndUpdate(referrerId, { referralTier: tier });
  }

  /**
   * Get referral stats
   */
  async getReferralStats(userId) {
    const referrals = await Referral.find({ referrer: userId, status: 'active' })
      .populate('referee', 'username createdAt');


    const rewards = await ReferralReward.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      referralCount: referrals.length,
      totalRewards: rewards[0]?.totalAmount || 0,
      referrals,
    };
  }
}

module.exports = new ReferralService();
