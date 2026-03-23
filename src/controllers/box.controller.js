/**
 * Box Controller - Handle box operations
 */
const Box = require('../models/Box');
const Order = require('../models/Order');
const User = require('../models/User');
const Activity = require('../models/Activity');
const logger = require('../utils/logger');

class BoxController {
  /**
   * Get all active boxes
   */
  async getBoxes(req, res) {
    try {
      const boxes = await Box.find({ active: true }).sort({ createdAt: -1 });
      res.json({ success: true, data: boxes });
    } catch (error) {
      logger.error('Error fetching boxes:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch boxes' });
    }
  }

  /**
   * Get single box by ID
   */
  async getBox(req, res) {
    try {
      const box = await Box.findById(req.params.id);
      if (!box) {
        return res.status(404).json({ success: false, error: 'Box not found' });
      }
      res.json({ success: true, data: box });
    } catch (error) {
      logger.error('Error fetching box:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch box' });
    }
  }

  /**
   * Create new box (admin only)
   */
  async createBox(req, res) {
    try {
      const box = await Box.create(req.body);
      res.status(201).json({ success: true, data: box });
    } catch (error) {
      logger.error('Error creating box:', error);
      res.status(500).json({ success: false, error: 'Failed to create box' });
    }
  }

  /**
   * Update box (admin only)
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
      logger.error('Error updating box:', error);
      res.status(500).json({ success: false, error: 'Failed to update box' });
    }
  }

  /**
   * Open a box - main game logic
   */
  async openBox(req, res) {
    try {
      const { boxId } = req.body;
      const userId = req.user.id;

      // Validate input
      if (!boxId) {
        return res.status(400).json({ success: false, error: 'Box ID is required' });
      }

      // Get box
      const box = await Box.findById(boxId);
      if (!box) {
        return res.status(404).json({ success: false, error: 'Box not found' });
      }

      if (!box.active) {
        return res.status(400).json({ success: false, error: 'Box is not active' });
      }

      // Get user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      // Check balance
      if (user.wallet.balance < box.price) {
        return res.status(400).json({ success: false, error: 'Insufficient balance' });
      }

      // Deduct balance
      user.wallet.balance -= box.price;
      user.wallet.totalDeposited += box.price;
      await user.save();

      // Select random item (weighted by probability)
      const item = this.selectRandomItem(box.items);

      // Create order
      const order = await Order.create({
        user: user._id,
        box: box._id,
        item: item._id,
        amount: box.price,
        status: 'completed',
      });

      // Log activity
      await Activity.create({
        user: user._id,
        action: 'open_box',
        details: { boxId: box._id, itemId: item._id, amount: box.price },
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      });

      res.json({
        success: true,
        data: {
          order,
          item,
          remainingBalance: user.wallet.balance,
        },
      });
    } catch (error) {
      logger.error('Error opening box:', error);
      res.status(500).json({ success: false, error: 'Failed to open box' });
    }
  }

  /**
   * Select random item based on probability weights
   */
  selectRandomItem(items) {
    const totalWeight = items.reduce((sum, item) => sum + (item.probability || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (const item of items) {
      random -= (item.probability || 1);
      if (random <= 0) {
        return item;
      }
    }
    return items[0];
  }
}

module.exports = new BoxController();
