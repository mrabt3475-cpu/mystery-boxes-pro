/**
 * Order Routes
 */
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(verifyToken);

// Get orders
router.get('/', orderController.getOrders);

// Get single order
router.get('/:id', orderController.getOrder);

// Get order stats
router.get('/stats/summary', orderController.getOrderStats);

module.exports = router;
