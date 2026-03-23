const Gift = require('../models/Gift');

const giftController = {
  async sendGift(req, res) {
    const gift = await Gift.create({ ...req.body, sender: req.user.id });
    res.json(gift);
  },
  async getReceived(req, res) {
    const gifts = await Gift.find({ receiver: req.user.id }).populate('item');
    res.json(gifts);
  }
};
module.exports = giftController;
