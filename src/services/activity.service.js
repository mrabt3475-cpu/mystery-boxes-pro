/**
 * activity.service.js
 * Shows recent activity in the platform.
 */
const Activity = require('../models/Activity');

class ActivityService {
  static async log(userId, type, data) {
    return Activity.create({ userId, type, data });
  }

  static async getRecent(limit = 20) {
    return Activity.find().sort({ createdAt: -1 }).limit(limit);
  }
}

module.exports = ActivityService;
