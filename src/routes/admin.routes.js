const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { auth, adminAuth } = require('../middleware/auth.middleware');

router.get('/stats', auth, adminAuth, adminController.getStats);
router.get('/users', auth, adminAuth, adminController.getUsers);
router.post('/boxes', auth, adminAuth, adminController.createBox);
router.put('/boxes/:id', auth, adminAuth, adminController.updateBox);
router.delete('/boxes/:id', auth, adminAuth, adminController.deleteBox);

module.exports = router;
