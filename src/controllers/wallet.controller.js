const User = require('../models/User');
const Transaction = require('../models/Transaction');

const walletController = {
  async getBalance(req, res) {
    const user = await User.findById(req.user.id);
    res.json({ balance: user.wallet });
  },
  async deposit(req, res) {
    const user = await User.findById(req.user.id);
    user.wallet += req.body.amount;
    await user.save();
    await Transaction.create({ user: user._id, type: 'deposit', amount: req.body.amount, balance: user.wallet });
    res.json({ balance: user.wallet });
  },
  async withdraw(req, res) {
    const user = await User.findById(req.user.id);
    if (user.wallet < req.body.amount) return res.status(400).json({ error: 'Insufficient balance' });
    user.wallet -= req.body.amount;
    await user.save();
    res.json({ balance: user.wallet });
  }
};
module.exports = walletController;
