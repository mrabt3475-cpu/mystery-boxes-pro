const Box = require('../models/Box');
const Order = require('../models/Order');
const User = require('../models/User');

const boxController = {
  async getBoxes(req, res) {
    const boxes = await Box.find({ active: true });
    res.json(boxes);
  },
  async getBox(req, res) {
    const box = await Box.findById(req.params.id);
    res.json(box);
  },
  async createBox(req, res) {
    const box = await Box.create(req.body);
    res.json(box);
  },
  async openBox(req, res) {
    const box = await Box.findById(req.params.id);
    const user = await User.findById(req.user.id);
    if (user.wallet < box.price) return res.status(400).json({ error: 'Insufficient balance' });
    user.wallet -= box.price;
    await user.save();
    const item = box.items[Math.floor(Math.random() * box.items.length)];
    const order = await Order.create({ user: user._id, box: box._id, item: item._id, amount: box.price });
    res.json({ order, item });
  }
};
module.exports = boxController;
