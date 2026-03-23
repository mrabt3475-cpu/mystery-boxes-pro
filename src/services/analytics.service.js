/**
 * Analytics Service
 */
const Order = require('../models/Order');
const User = require('../models/User');
const Box = require('../models/Box');
const logger = require('../utils/logger');

class AnalyticsService {
  /**
   * Track event
   */
  async trackEvent(eventType, userId, data) {
    logger.info(`Analytics: ${eventType}`, { userId, data });
    return { tracked: true };
  }

  /**
   * Get user stats
   */
  async getUserStats(userId) {
    const orders = await Order.find({ user: userId, status: 'completed' });
    
    return {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, o) => sum + o.total, 0),
      boxesOpened: orders.reduce((sum, o) => sum + o.items.length, 0),
      referrals: 0,
    };
  }

  /**
   * Get box stats
   */
  async getBoxStats(boxId) {
    const orders = await Order.find({ box: boxId, status: 'completed' });
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalItems = orders.reduce((sum, o) => sum + o.items.length, 0);
    
    return {
      totalOpens: orders.length,
      revenue: totalRevenue,
      avgItemValue: totalItems > 0 ? totalRevenue / totalItems : 0,
    };
  }

  /**
   * Get dashboard stats
   */
  async getDashboardStats() {
    const [users, orders, boxes] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments({ status: 'completed' }),
      Box.countDocuments({ active: true }),
    ]);

    const revenue = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    return {
      totalUsers: users,
      totalOrders: orders,
      activeBoxes: boxes,
      totalRevenue: revenue[0]?.total || 0,
    };
  }
}

module.exports = new AnalyticsService();
