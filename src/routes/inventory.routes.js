const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { auth, adminAuth } = require('../middleware/auth.middleware');

router.get('/', auth, inventoryController.getInventory);
router.post('/add', auth, adminAuth, inventoryController.addItem);
router.put('/:id', auth, adminAuth, inventoryController.updateItem);

module.exports = router;
