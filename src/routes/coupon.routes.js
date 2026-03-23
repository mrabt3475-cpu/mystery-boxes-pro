/**
 * Coupon Routes
 */
const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Validate (public)
router.post('/validate', couponController.validate);

// Apply (authenticated)
router.post('/apply', verifyToken, couponController.apply);

// Get my coupons (authenticated)
router.get('/my', verifyToken, couponController.getMyCoupons);

module.exports = router;
