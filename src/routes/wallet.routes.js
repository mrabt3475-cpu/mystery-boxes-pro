const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const { auth } = require('../middleware/auth.middleware');

router.get('/balance', auth, walletController.getBalance);
router.post('/deposit', auth, walletController.deposit);
router.post('/withdraw', auth, walletController.withdraw);
router.get('/transactions', auth, walletController.getTransactions);
router.post('/transfer', auth, walletController.transfer);

module.exports = router;
