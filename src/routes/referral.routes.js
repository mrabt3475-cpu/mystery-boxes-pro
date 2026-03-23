/**
 * Referral Routes
 */
const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referral.controller');
const auth = require('../middleware/auth');

router.get('/', auth, referralController.getReferrals);
router.get('/stats', auth, referralController.getStats);

module.exports = router;
