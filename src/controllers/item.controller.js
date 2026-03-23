const Item = require('../models/Item');

const itemController = {
  async getItems(req, res) {
    const items = await Item.find({ active: true });
    res.json(items);
  },
  async getItem(req, res) {
    const item = await Item.findById(req.params.id);
    res.json(item);
  }
};
module.exports = itemController;
