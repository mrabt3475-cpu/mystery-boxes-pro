/**
 * Order Controller
 */
const Order = require('../models/Order');
const Box = require('../models/Box');
const Item = require('../models/Item');
const logger = require('../utils/logger');

class OrderController {
  /**
   * Get user's orders
   */
  async getOrders(req, res) {
    try {
      const { limit = 50, page = 1, status } = req.query;
      const query = { user: req.user.id };
      if (status) query.status = status;

      const orders = await Order.find(query)
        .populate('box', 'name image price')
        .populate('item', 'name image value rarity')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));


      const total = await Order.countDocuments(query);


      res.json({
        success: true,
        data: {
          orders,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      logger.error('Get orders error:', error);
      res.status(500).json({ success: false, error: 'Failed to get orders' });
    }
  }

  /**
   * Get single order
   */
  async getOrder(req, res) {
    try {
      const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
        .populate('box', 'name image price')
        .populate('item', 'name image value rarity');


      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }

      res.json({ success: true, data: order });
    } catch (error) {
      logger.error('Get order error:', error);
      res.status(500).json({ success: false, error: 'Failed to get order' });
    }
  }

  /**
   * Get order statistics
   */
  async getOrderStats(req, res) {
    try {
      const userId = req.user.id;


      const stats = await Order.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: '$amount' },
            totalWon: { $sum: { $cond: ['$isWin', '$itemValue', 0] } },
            totalProfit: { $sum: '$profit' },
          },
        },
      ]);

      const recentOrders = await Order.find({ user: userId })
        .populate('box', 'name')
        .populate('item', 'name value')
        .sort({ createdAt: -1 })
        .limit(10);


      res.json({
        success: true,
        data: {
          stats: stats[0] || { totalOrders: 0, totalSpent: 0, totalWon: 0, totalProfit: 0 },
          recentOrders,
        },
      });
    } catch (error) {
      logger.error('Get order stats error:', error);
      res.status(500).json({ success: false, error: 'Failed to get stats' });
    }
  }
}

module.exports = new OrderController();
