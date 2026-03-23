const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

class WalletController {
  static async getBalance(req, res) {
    const wallet = await Wallet.findOne({ userId: req.user.id });
    res.json({ balance: wallet?.balance || 0 });
  }

  static async depositCrypto(req, res) {
    const { amount, txHash } = req.body;
    const wallet = await Wallet.findOne({ userId: req.user.id });
    wallet.balance += amount;
    wallet.totalDeposited += amount;
    await wallet.save();
    
    await Transaction.create({
      userId: req.user.id,
      type: 'deposit',
      amount,
      method: 'crypto',
      txHash,
      status: 'completed'
    });
    
    res.json({ success: true, balance: wallet.balance });
  }

  static async withdraw(req, res) {
    const { amount } = req.body;
    const wallet = await Wallet.findOne({ userId: req.user.id });
    
    if (wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    
    wallet.balance -= amount;
    wallet.totalWithdrawn += amount;
    await wallet.save();
    
    res.json({ success: true, balance: wallet.balance });
  }
}

module.exports = WalletController;
