const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');
const { auth } = require('../middleware/auth.middleware');

router.post('/validate', couponController.validate);
router.post('/apply', auth, couponController.apply);
router.get('/my', auth, couponController.getMyCoupons);

module.exports = router;
