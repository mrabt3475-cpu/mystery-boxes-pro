const Referral = require('../models/Referral');
const ReferralReward = require('../models/ReferralReward');

const referralController = {
  async getStats(req, res) {
    const referrals = await Referral.find({ referrerId: req.user.id });
    res.json({ count: referrals.length });
  },
  async getLink(req, res) {
    res.json({ link: `https://mysteryboxes.pro/ref/${req.user.referralCode}` });
  },
  async getRewards(req, res) {
    const rewards = await ReferralReward.find({ userId: req.user.id });
    res.json(rewards);
  }
};
module.exports = referralController;
