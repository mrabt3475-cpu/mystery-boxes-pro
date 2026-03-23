/**
 * Referral Routes
 */
const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referral.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(verifyToken);

// Get stats
router.get('/stats', referralController.getStats);


// Get referral link
router.get('/link', referralController.getLink);

// Get rewards
router.get('/rewards', referralController.getRewards);

// Claim reward
router.post('/claim', referralController.claimReward);

module.exports = router;
