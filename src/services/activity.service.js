/**
 * Activity Service - User activity tracking
 */
const Activity = require('../models/Activity');
const logger = require('../utils/logger');

class ActivityService {
  async log(userId, action, details = {}) {
    return Activity.create({ userId, action, details });
  }

  async getUserActivity(userId, limit = 50) {
    return Activity.find({ userId }).sort({ createdAt: -1 }).limit(limit);
  }
}

module.exports = new ActivityService();
