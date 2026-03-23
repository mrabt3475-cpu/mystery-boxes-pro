/**
 * Admin Routes
 */
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

// All routes require admin
router.use(verifyToken, requireAdmin);

// Dashboard
router.get('/stats', adminController.getStats);

// Users
router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);

// Orders
router.get('/orders', adminController.getOrders);

// Boxes
router.post('/boxes', adminController.createBox);
router.put('/boxes/:id', adminController.updateBox);
router.delete('/boxes/:id', adminController.deleteBox);

module.exports = router;
