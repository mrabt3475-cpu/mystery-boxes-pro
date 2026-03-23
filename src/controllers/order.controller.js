const Order = require('../models/Order');

const orderController = {
  async getOrders(req, res) {
    const orders = await Order.find({ user: req.user.id }).populate('box item');
    res.json(orders);
  },
  async getOrder(req, res) {
    const order = await Order.findById(req.params.id).populate('box item');
    res.json(order);
  },
  async createOrder(req, res) {
    const order = await Order.create({ ...req.body, user: req.user.id });
    res.json(order);
  }
};
module.exports = orderController;
