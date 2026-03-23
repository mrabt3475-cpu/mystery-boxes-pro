/**
 * Box Routes
 */
const express = require('express');
const router = express.Router();
const boxController = require('../controllers/box.controller');
const auth = require('../middleware/auth');

router.get('/', boxController.getBoxes);
router.get('/:id', boxController.getBox);
router.post('/:id/open', auth, boxController.openBox);

module.exports = router;
