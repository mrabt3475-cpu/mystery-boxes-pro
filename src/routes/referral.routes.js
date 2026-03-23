const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referral.controller');
const { auth } = require('../middleware/auth.middleware');

router.get('/stats', auth, referralController.getStats);
router.get('/link', auth, referralController.getLink);
router.get('/rewards', auth, referralController.getRewards);
router.post('/claim', auth, referralController.claimReward);

module.exports = router;
