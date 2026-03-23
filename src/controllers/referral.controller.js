const Referral = require('../models/Referral');
const User = require('../models/User');

class ReferralController {
  static async getReferrals(req, res) {
    const referrals = await Referral.find({ referrer: req.user.id }).populate('referred');
    res.json(referrals);
  }

  static async getStats(req, res) {
    const count = await Referral.countDocuments({ referrer: req.user.id });
    const rewards = await Referral.aggregate([
      { $match: { referrer: req.user.id } },
      { $group: { _id: null, total: { $sum: '$reward' } } }
    ]);
    res.json({ count, totalReward: rewards[0]?.total || 0 });
  }
}

module.exports = ReferralController;
