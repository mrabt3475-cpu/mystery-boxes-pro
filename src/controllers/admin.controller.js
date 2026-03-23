const User = require('../models/User');
const Box = require('../models/Box');
const Order = require('../models/Order');

class AdminController {
  static async dashboard(req, res) {
    const users = await User.countDocuments();
    const boxes = await Box.countDocuments();
    const orders = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    res.json({
      users,
      boxes,
      revenue: orders[0]?.total || 0
    });
  }

  static async getUsers(req, res) {
    const users = await User.find().select('-password');
    res.json(users);
  }

  static async createBox(req, res) {
    const box = await Box.create(req.body);
    res.json(box);
  }
}

module.exports = AdminController;
