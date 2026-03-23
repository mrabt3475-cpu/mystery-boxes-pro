/**
 * Box Routes
 */
const express = require('express');
const router = express.Router();
const boxController = require('../controllers/box.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

// Public routes
router.get('/', boxController.getBoxes);
router.get('/:id', boxController.getBox);

// Protected routes
router.post('/', verifyToken, requireAdmin, boxController.createBox);
router.put('/:id', verifyToken, requireAdmin, boxController.updateBox);
router.delete('/:id', verifyToken, requireAdmin, boxController.deleteBox);

// Open box - requires auth but not admin
router.post('/open', verifyToken, boxController.openBox);

module.exports = router;
