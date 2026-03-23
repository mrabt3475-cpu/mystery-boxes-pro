/**
 * Referral Controller
 */
const ReferralService = require('../services/referral.service');
const User = require('../models/User');
const logger = require('../utils/logger');

class ReferralController {
  /**
   * Get referral stats
   */
  async getStats(req, res) {
    try {
      const stats = await ReferralService.getReferralStats(req.user.id);
      res.json({ success: true, data: stats });
    } catch (error) {
      logger.error('Get referral stats error:', error);
      res.status(500).json({ success: false, error: 'Failed to get stats' });
    }
  }

  /**
   * Get user's referral link
   */
  async getLink(req, res) {
    try {
      const user = await User.findById(req.user.id);
      const referralLink = `${process.env.APP_URL || 'https://example.com'}?ref=${user.referralCode}`;
      
      res.json({
        success: true,
        data: {
          code: user.referralCode,
          link: referralLink,
        },
      });
    } catch (error) {
      logger.error('Get referral link error:', error);
      res.status(500).json({ success: false, error: 'Failed to get link' });
    }
  }

  /**
   * Get referral rewards
   */
  async getRewards(req, res) {
    try {
      const ReferralReward = require('../models/ReferralReward');
      const rewards = await ReferralReward.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .limit(50);
      
      res.json({ success: true, data: rewards });
    } catch (error) {
      logger.error('Get rewards error:', error);
      res.status(500).json({ success: false, error: 'Failed to get rewards' });
    }
  }

  /**
   * Claim referral reward
   */
  async claimReward(req, res) {
    try {
      // Implementation depends on business logic
      res.json({ success: true, message: 'No pending rewards to claim' });
    } catch (error) {
      logger.error('Claim reward error:', error);
      res.status(500).json({ success: false, error: 'Failed to claim reward' });
    }
  }
}

module.exports = new ReferralController();
