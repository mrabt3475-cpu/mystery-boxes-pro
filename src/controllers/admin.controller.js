/**
 * Admin Controller
 */
const User = require('../models/User');
const Box = require('../models/Box');
const Order = require('../models/Order');
const Wallet = require('../models/Wallet');
const logger = require('../utils/logger');

class AdminController {
  /**
   * Get dashboard stats
   */
  async getStats(req, res) {
    try {
      const [users, boxes, orders, wallets] = await Promise.all([
        User.countDocuments(),
        Box.countDocuments({ active: true }),
        Order.countDocuments({ status: 'completed' }),
        Wallet.aggregate([{ $group: { _id: null, total: { $sum: '$balance' } } }]),
      ]);

      res.json({
        success: true,
        data: {
          users,
          activeBoxes: boxes,
          totalOrders: orders,
          totalBalance: wallets[0]?.total || 0,
        },
      });
    } catch (error) {
      logger.error('Get stats error:', error);
      res.status(500).json({ success: false, error: 'Failed to get stats' });
    }
  }

  /**
   * Get all users
   */
  async getUsers(req, res) {
    try {
      const { page = 1, limit = 50, role } = req.query;
      const query = {};
      if (role) query.role = role;

      const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

      const total = await User.countDocuments(query);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      logger.error('Get users error:', error);
      res.status(500).json({ success: false, error: 'Failed to get users' });
    }
  }

  /**
   * Get all orders
   */
  async getOrders(req, res) {
    try {
      const { page = 1, limit = 50, status } = req.query;
      const query = {};
      if (status) query.status = status;

      const orders = await Order.find(query)
        .populate('user', 'username email')
        .populate('box', 'name price')
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
   * Create box
   */
  async createBox(req, res) {
    try {
      const box = await Box.create(req.body);
      res.status(201).json({ success: true, data: box });
    } catch (error) {
      logger.error('Create box error:', error);
      res.status(500).json({ success: false, error: 'Failed to create box' });
    }
  }

  /**
   * Update box
   */
  async updateBox(req, res) {
    try {
      const box = await Box.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!box) {
        return res.status(404).json({ success: false, error: 'Box not found' });
      }
      res.json({ success: true, data: box });
    } catch (error) {
      logger.error('Update box error:', error);
      res.status(500).json({ success: false, error: 'Failed to update box' });
    }
  }

  /**
   * Delete box
   */
  async deleteBox(req, res) {
    try {
      const box = await Box.findByIdAndDelete(req.params.id);
      if (!box) {
        return res.status(404).json({ success: false, error: 'Box not found' });
      }
      res.json({ success: true, message: 'Box deleted' });
    } catch (error) {
      logger.error('Delete box error:', error);
      res.status(500).json({ success: false, error: 'Failed to delete box' });
    }
  }

  /**
   * Update user role
   */
  async updateUser(req, res) {
    try {
      const { role, isActive } = req.body;
      const updates = {};
      if (role) updates.role = role;
      if (isActive !== undefined) updates.isActive = isActive;

      const user = await User.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
      ).select('-password');


      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.json({ success: true, data: user });
    } catch (error) {
      logger.error('Update user error:', error);
      res.status(500).json({ success: false, error: 'Failed to update user' });
    }
  }
}

module.exports = new AdminController();
