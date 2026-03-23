const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { auth } = require('../middleware/auth.middleware');

router.get('/', auth, orderController.getOrders);
router.get('/:id', auth, orderController.getOrder);
router.post('/', auth, orderController.createOrder);
router.post('/:id/refund', auth, orderController.refundOrder);

module.exports = router;
