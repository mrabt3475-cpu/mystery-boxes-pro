const express = require('express');
const router = express.Router();
const catalogAdminController = require('./catalog.admin.controller');

router.get('/items', catalogAdminController.getItems);
router.post('/items', catalogAdminController.createItem);
router.put('/items/:id', catalogAdminController.updateItem);
router.delete('/items/:id', catalogAdminController.deleteItem);

module.exports = router;
