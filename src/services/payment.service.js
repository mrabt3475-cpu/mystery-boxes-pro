const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const logger = require('../utils/logger');

class PaymentService {
  constructor() {
    this.providers = {
      ton: { name: 'TON', minDeposit: 1, minWithdraw: 2, fee: 0.01 },
      usdt: { name: 'USDT (TRC20)', minDeposit: 5, minWithdraw: 10, fee: 1 },
      card: { name: 'Credit Card', minDeposit: 10, fee: 2.9 },
    };
  }

  async createDepositAddress(userId, currency = 'TON') {
    const provider = this.providers[currency.toLowerCase()];
    if (!provider) throw new Error('Unsupported currency');
    const address = `0x${Math.random().toString(16).slice(2, 42)}`;
    logger.info(`Created deposit address for user ${userId}: ${address}`);
    return { address, currency, network: currency === 'USDT' ? 'TRC20' : 'TON', expiresAt: new Date(Date.now() + 30 * 60 * 1000) };
  }

  async processDeposit(userId, amount, currency, txHash, method = 'crypto') {
    const provider = this.providers[currency.toLowerCase()];
    if (!provider) throw new Error('Unsupported currency');
    if (amount < provider.minDeposit) throw new Error(`Minimum deposit is ${provider.minDeposit} ${currency}`);
    const fee = method === 'card' ? (amount * provider.fee / 100) : 0;
    const netAmount = amount - fee;
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) throw new Error('Wallet not found');
    wallet.balance += netAmount;
    wallet.totalDeposited += netAmount;
    wallet.lastTransactionAt = new Date();
    await wallet.save();
    const transaction = await Transaction.create({
      user: userId, type: 'deposit', amount: netAmount, currency, method, fee,
      balance: wallet.balance, txHash, status: 'completed'
    });
    await User.findByIdAndUpdate(userId, { $inc: { 'stats.totalDeposited': netAmount } });
    logger.info(`Deposit processed: ${netAmount} ${currency} for user ${userId}`);
    return { transaction, newBalance: wallet.balance, amount: netAmount, fee };
  }

  async processWithdrawal(userId, amount, address, currency, method = 'crypto') {
    const provider = this.providers[currency.toLowerCase()];
    if (!provider) throw new Error('Unsupported currency');
    if (amount < provider.minWithdraw) throw new Error(`Minimum withdrawal is ${provider.minWithdraw} ${currency}`);
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) throw new Error('Wallet not found');
    const fee = method === 'card' ? (amount * provider.fee / 100) : provider.fee;
    const netAmount = amount - fee;
    if (wallet.balance < amount) throw new Error('Insufficient balance');
    wallet.balance -= amount;
    wallet.totalWithdrawn += netAmount;
    wallet.lastTransactionAt = new Date();
    await wallet.save();
    const transaction = await Transaction.create({
      user: userId, type: 'withdrawal', amount: netAmount, currency, method, fee,
      balance: wallet.balance, withdrawalAddress: address, status: 'pending'
    });
    const txHash = await this.sendToBlockchain(address, netAmount, currency);
    transaction.txHash = txHash;
    transaction.status = 'completed';
    await transaction.save();
    logger.info(`Withdrawal processed: ${netAmount} ${currency} for user ${userId}`);
    return { transaction, newBalance: wallet.balance, amount: netAmount, fee, txHash };
  }

  async sendToBlockchain(address, amount, currency) {
    const txHash = `${currency.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    logger.info(`Blockchain tx: ${txHash} - ${amount} ${currency} to ${address}`);
    return txHash;
  }

  getSupportedCurrencies() {
    return Object.entries(this.providers).map(([key, value]) => ({
      currency: key.toUpperCase(), name: value.name, minDeposit: value.minDeposit,
      minWithdraw: value.minWithdraw, fee: value.fee,
    }));
  }
}

module.exports = new PaymentService();