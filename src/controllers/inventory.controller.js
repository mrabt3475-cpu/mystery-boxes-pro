const Inventory = require('../models/Inventory');

const inventoryController = {
  async getInventory(req, res) {
    const inventory = await Inventory.find().populate('item');
    res.json(inventory);
  },
  async addItem(req, res) {
    const inventory = await Inventory.create(req.body);
    res.json(inventory);
  }
};
module.exports = inventoryController;
