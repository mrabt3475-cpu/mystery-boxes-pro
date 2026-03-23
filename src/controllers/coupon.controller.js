const Coupon = require('../models/Coupon');

const couponController = {
  async validate(req, res) {
    const coupon = await Coupon.findOne({ code: req.body.code });
    if (!coupon) return res.status(400).json({ error: 'Invalid coupon' });
    res.json({ valid: true, discount: coupon.discount });
  },
  async apply(req, res) {
    res.json({ success: true });
  }
};
module.exports = couponController;
