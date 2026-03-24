const Referral = require('../models/Referral');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const logger = require('../utils/logger');

class ReferralService {
  constructor() {
    this.tierRequirements = {
      1: { minReferrals: 0, minVolume: 0 },
      2: { minReferrals: 5, minVolume: 500 },
      3: { minReferrals: 15, minVolume: 2000 },
      4: { minReferrals: 30, minVolume: 5000 },
      5: { minReferrals: 50, minVolume: 10000 }
    };
  }

  async createReferral(referrerId, referredId) {
    const existing = await Referral.findOne({ referrer: referrerId, referred: referredId });
    if (existing) throw new Error('Referral already exists');
    
    const referral = await Referral.create({
      referrer: referrerId,
      referred: referredId,
      status: 'active',
      bonusAwarded: false
    });
    
    await User.findByIdAndUpdate(referrerId, { $inc: { 'stats.totalReferrals': 1 } });
    logger.info(`Referral created: ${referrerId} -> ${referredId}`);
    return referral;
  }

  async awardReferralBonus(referrerId, orderAmount) {
    const referral = await Referral.findOne({ referrer: referrerId, bonusAwarded: false });
    if (!referral) return null;
    
    const bonusRate = this.getBonusRate(orderAmount);
    const bonusAmount = orderAmount * bonusRate;
    
    referral.bonusAmount = bonusAmount;
    referral.bonusAwarded = true;
    referral.bonusAwardedAt = new Date();
    await referral.save();
    
    const wallet = await Wallet.findOne({ user: referrerId });
    if (wallet) {
      wallet.balance += bonusAmount;
      wallet.totalEarned += bonusAmount;
      await wallet.save();
      await Transaction.create({
        user: referrerId,
        type: 'referral_bonus',
        amount: bonusAmount,
        balance: wallet.balance,
        status: 'completed',
        note: 'Referral bonus'
      });
    }
    
    logger.info(`Referral bonus awarded: ${bonusAmount} to ${referrerId}`);
    return referral;
  }

  getBonusRate(orderAmount) {
    if (orderAmount >= 1000) return 0.10;
    if (orderAmount >= 500) return 0.07;
    if (orderAmount >= 200) return 0.05;
    return 0.03;
  }

  async checkAndUpgradeTier(userId) {
    const user = await User.findById(userId);
    const stats = await this.getReferralStats(userId);
    const currentTier = user.referralTier || 1;
    
    for (let tier = 5; tier >= currentTier; tier--) {
      const req = this.tierRequirements[tier];
      if (stats.totalReferrals >= req.minReferrals && stats.totalVolume >= req.minVolume) {
        if (tier > currentTier) {
          await User.findByIdAndUpdate(userId, { referralTier: tier });
          logger.info(`User ${userId} upgraded to tier ${tier}`);
          return tier;
        }
      }
    }
    return currentTier;
  }

  async getReferralStats(userId) {
    const referrals = await Referral.find({ referrer: userId });
    const referredUsers = await User.find({ _id: { $in: referrals.map(r => r.referred) } });
    const totalVolume = referredUsers.reduce((sum, u) => sum + (u.stats?.totalSpent || 0), 0);
    
    return {
      totalReferrals: referrals.length,
      activeReferrals: referrals.filter(r => r.status === 'active').length,
      totalVolume,
      tier: (await User.findById(userId))?.referralTier || 1
    };
  }
}

module.exports = new ReferralService();