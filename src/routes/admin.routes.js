/**
 * Admin Routes
 */
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/dashboard', auth, admin, adminController.dashboard);
router.get('/users', auth, admin, adminController.getUsers);
router.post('/boxes', auth, admin, adminController.createBox);

module.exports = router;
