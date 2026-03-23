const Order = require('../models/Order');

class OrderController {
  static async getOrders(req, res) {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  }

  static async getOrder(req, res) {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  }
}

module.exports = OrderController;
