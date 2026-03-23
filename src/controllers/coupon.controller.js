/**
 * Coupon Controller
 */
const Coupon = require('../models/Coupon');
const Order = require('../models/Order');
const logger = require('../utils/logger');

class CouponController {
  /**
   * Validate coupon
   */
  async validate(req, res) {
    try {
      const { code } = req.body;
      const coupon = await Coupon.findOne({ code: code.toUpperCase() });
      
      if (!coupon || !coupon.isValid()) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid or expired coupon' 
        });
      }

      res.json({
        success: true,
        data: {
          code: coupon.code,
          discount: coupon.discount,
          type: coupon.type,
          minAmount: coupon.minAmount,
        },
      });
    } catch (error) {
      logger.error('Validate coupon error:', error);
      res.status(500).json({ success: false, error: 'Failed to validate coupon' });
    }
  }

  /**
   * Apply coupon to order
   */
  async apply(req, res) {
    try {
      const { code, orderId } = req.body;
      const coupon = await Coupon.findOne({ code: code.toUpperCase() });
      
      if (!coupon || !coupon.isValid()) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid or expired coupon' 
        });
      }

      // Check if already used by user
      if (coupon.usedBy.includes(req.user.id)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Coupon already used' 
        });
      }

      // Get order
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ 
          success: false, 
          error: 'Order not found' 
        });
      }

      // Calculate discount
      const discount = coupon.calculateDiscount(order.total);
      
      // Update coupon
      coupon.usedCount += 1;
      coupon.usedBy.push(req.user.id);
      await coupon.save();

      res.json({
        success: true,
        data: {
          discount,
          newTotal: order.total - discount,
        },
      });
    } catch (error) {
      logger.error('Apply coupon error:', error);
      res.status(500).json({ success: false, error: 'Failed to apply coupon' });
    }
  }

  /**
   * Get user's coupons
   */
  async getMyCoupons(req, res) {
    try {
      const coupons = await Coupon.find({ 
        usedBy: req.user.id 
      }).sort({ createdAt: -1 });

      res.json({ success: true, data: coupons });
    } catch (error) {
      logger.error('Get my coupons error:', error);
      res.status(500).json({ success: false, error: 'Failed to get coupons' });
    }
  }
}

module.exports = new CouponController();
