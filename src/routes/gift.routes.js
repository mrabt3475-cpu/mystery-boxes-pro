const express = require('express');
const router = express.Router();
const giftController = require('../controllers/gift.controller');
const { auth } = require('../middleware/auth.middleware');

router.post('/send', auth, giftController.sendGift);
router.get('/received', auth, giftController.getReceived);
router.post('/:id/claim', auth, giftController.claimGift);

module.exports = router;
