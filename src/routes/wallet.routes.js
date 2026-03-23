/**
 * Wallet Routes
 */
const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const auth = require('../middleware/auth');

router.get('/balance', auth, walletController.getBalance);
router.post('/deposit/crypto', auth, walletController.depositCrypto);
router.post('/withdraw', auth, walletController.withdraw);

module.exports = router;
