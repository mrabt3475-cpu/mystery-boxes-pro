/**
 * Order Routes
 */
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const auth = require('../middleware/auth');

router.get('/', auth, orderController.getOrders);
router.get('/:id', auth, orderController.getOrder);

module.exports = router;
