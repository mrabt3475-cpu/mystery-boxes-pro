const Box = require('../models/Box');
const Order = require('../models/Order');
const Wallet = require('../models/Wallet');
const Item = require('../models/Item');

class BoxController {
  static async getBoxes(req, res) {
    const boxes = await Box.find({ isActive: true });
    res.json(boxes);
  }

  static async getBox(req, res) {
    const box = await Box.findById(req.params.id);
    if (!box) return res.status(404).json({ error: 'Box not found' });
    res.json(box);
  }

  static async openBox(req, res) {
    const box = await Box.findById(req.params.id);
    const wallet = await Wallet.findOne({ userId: req.user.id });
    
    if (wallet.balance < box.price) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    
    // Deduct balance
    wallet.balance -= box.price;
    await wallet.save();
    
    // Select random item (weighted)
    const totalWeight = box.items.reduce((sum, i) => sum + i.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedItem = null;
    
    for (const item of box.items) {
      random -= item.weight;
      if (random <= 0) {
        selectedItem = await Item.findById(item.itemId);
        break;
      }
    }
    
    // Create order
    const order = await Order.create({
      userId: req.user.id,
      boxId: box._id,
      itemId: selectedItem?._id,
      amount: box.price,
      status: 'completed'
    });
    
    res.json({ order, item: selectedItem });
  }
}

module.exports = BoxController;
