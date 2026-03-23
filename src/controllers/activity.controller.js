const Activity = require('../models/Activity');

const activityController = {
  async getActivity(req, res) {
    const activities = await Activity.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json(activities);
  }
};
module.exports = activityController;
