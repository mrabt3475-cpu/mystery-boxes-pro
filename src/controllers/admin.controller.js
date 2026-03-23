const User = require('../models/User');
const Box = require('../models/Box');

const adminController = {
  async getStats(req, res) {
    const users = await User.countDocuments();
    const boxes = await Box.countDocuments();
    res.json({ users, boxes });
  },
  async getUsers(req, res) {
    const users = await User.find();
    res.json(users);
  },
  async createBox(req, res) {
    const box = await Box.create(req.body);
    res.json(box);
  }
};
module.exports = adminController;
