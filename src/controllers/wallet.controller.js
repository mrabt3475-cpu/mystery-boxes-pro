/**
 * Wallet Controller
 */
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Activity = require('../models/Activity');
const logger = require('../utils/logger');

class WalletController {
  /**
   * Get wallet balance
   */
  async getBalance(req, res) {
    try {
      const wallet = await Wallet.findOne({ user: req.user.id });
      if (!wallet) {
        return res.status(404).json({ success: false, error: 'Wallet not found' });
      }
      res.json({
        success: true,
        data: {
          balance: wallet.balance,
          frozenBalance: wallet.frozenBalance,
          availableBalance: wallet.availableBalance,
          totalDeposited: wallet.totalDeposited,
          totalWithdrawn: wallet.totalWithdrawn,
          totalSpent: wallet.totalSpent,
          totalWon: wallet.totalWon,
        },
      });
    } catch (error) {
      logger.error('Get balance error:', error);
      res.status(500).json({ success: false, error: 'Failed to get balance' });
    }
  }

  /**
   * Get transaction history
   */
  async getTransactions(req, res) {
    try {
      const { type, limit = 50, page = 1 } = req.query;
      const query = { user: req.user.id };
      if (type) query.type = type;

      const transactions = await Transaction.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

      const total = await Transaction.countDocuments(query);

      res.json({
        success: true,
        data: {
          transactions,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      logger.error('Get transactions error:', error);
      res.status(500).json({ success: false, error: 'Failed to get transactions' });
    }
  }

  /**
   * Deposit funds
   */
  async deposit(req, res) {
    try {
      const { amount, paymentMethod, transactionHash } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, error: 'Invalid amount' });
      }

      const wallet = await Wallet.findOne({ user: req.user.id });
      if (!wallet) {
        return res.status(404).json({ success: false, error: 'Wallet not found' });
      }

      // Update wallet
      wallet.balance += amount;
      wallet.totalDeposited += amount;
      wallet.lastTransactionAt = new Date();
      await wallet.save();

      // Create transaction
      await Transaction.create({
        user: req.user.id,
        type: 'deposit',
        amount,
        balance: wallet.balance,
        paymentMethod,
        transactionHash,
        status: 'completed',
      });

      // Log activity
      await Activity.create({
        user: req.user.id,
        action: 'deposit',
        details: { amount, paymentMethod },
        ipAddress: req.ip,
      });

      res.json({
        success: true,
        data: {
          balance: wallet.balance,
          amount,
        },
      });
    } catch (error) {
      logger.error('Deposit error:', error);
      res.status(500).json({ success: false, error: 'Deposit failed' });
    }
  }

  /**
   * Withdraw funds
   */
  async withdraw(req, res) {
    try {
      const { amount, address, method } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, error: 'Invalid amount' });
      }

      const wallet = await Wallet.findOne({ user: req.user.id });
      if (!wallet) {
        return res.status(404).json({ success: false, error: 'Wallet not found' });
      }

      if (wallet.balance < amount) {
        return res.status(400).json({ success: false, error: 'Insufficient balance' });
      }

      // Minimum withdrawal
      if (amount < 1) {
        return res.status(400).json({ success: false, error: 'Minimum withdrawal is 1 USDT' });
      }

      // Update wallet
      wallet.balance -= amount;
      wallet.totalWithdrawn += amount;
      wallet.lastTransactionAt = new Date();
      await wallet.save();

      // Create transaction
      await Transaction.create({
        user: req.user.id,
        type: 'withdraw',
        amount,
        balance: wallet.balance,
        paymentMethod: method,
        withdrawalAddress: address,
        status: 'pending',
      });

      // Log activity
      await Activity.create({
        user: req.user.id,
        action: 'withdraw',
        details: { amount, method, address },
        ipAddress: req.ip,
      });


      res.json({
        success: true,
        data: {
          balance: wallet.balance,
          amount,
        },
      });
    } catch (error) {
      logger.error('Withdraw error:', error);
      res.status(500).json({ success: false, error: 'Withdrawal failed' });
    }
  }

  /**
   * Set wallet PIN
   */
  async setPin(req, res) {
    try {
      const { pin } = req.body;

      if (!pin || pin.length < 4 || pin.length > 6) {
        return res.status(400).json({ success: false, error: 'PIN must be 4-6 digits' });
      }

      const wallet = await Wallet.findOne({ user: req.user.id });
      wallet.pin = pin;
      wallet.pinSetAt = new Date();
      await wallet.save();

      res.json({ success: true, message: 'PIN set successfully' });
    } catch (error) {
      logger.error('Set PIN error:', error);
      res.status(500).json({ success: false, error: 'Failed to set PIN' });
    }
  }

  /**
   * Verify PIN
   */
  async verifyPin(req, res) {
    try {
      const { pin } = req.body;

      const wallet = await Wallet.findOne({ user: req.user.id });
      if (wallet.pin !== pin) {
        return res.status(400).json({ success: false, error: 'Invalid PIN' });
      }

      res.json({ success: true, message: 'PIN verified' });
    } catch (error) {
      logger.error('Verify PIN error:', error);
      res.status(500).json({ success: false, error: 'Failed to verify PIN' });
    }
  }
}

module.exports = new WalletController();
