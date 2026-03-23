/**
 * Activity Service
 */
const Activity = require('../models/Activity');
const logger = require('../utils/logger');

class ActivityService {
  /**
   * Log user activity
   */
  async logActivity(userId, action, details = {}, metadata = {}) {
    try {
      const activity = await Activity.create({
        user: userId,
        action,
        details,
        ...metadata,
      });
      return activity;
    } catch (error) {
      logger.error('Error logging activity:', error);
      return null;
    }
  }

  /**
   * Get user activities
   */
  async getUserActivities(userId, limit = 50) {
    try {
      const activities = await Activity.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(limit);
      return activities;
    } catch (error) {
      logger.error('Error fetching activities:', error);
      return [];
    }
  }

  /**
   * Get recent activities (admin)
   */
  async getRecentActivities(limit = 100) {
    try {
      const activities = await Activity.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('user', 'username email');
      return activities;
    } catch (error) {
      logger.error('Error fetching recent activities:', error);
      return [];
    }
  }

  /**
   * Get activity statistics
   */
  async getActivityStats(userId, days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const stats = await Activity.aggregate([
        {
          $match: {
            user: userId,
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: '$action',
            count: { $sum: 1 },
          },
        },
      ]);

      return stats;
    } catch (error) {
      logger.error('Error calculating stats:', error);
      return [];
    }
  }
}

module.exports = new ActivityService();
