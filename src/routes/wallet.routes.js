/**
 * Wallet Routes
 */
const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(verifyToken);

// Get balance
router.get('/balance', walletController.getBalance);

// Get transactions
router.get('/transactions', walletController.getTransactions);

// Deposit
router.post('/deposit', walletController.deposit);

// Withdraw
router.post('/withdraw', walletController.withdraw);

// Set PIN
router.post('/pin', walletController.setPin);

// Verify PIN
router.post('/pin/verify', walletController.verifyPin);

module.exports = router;
