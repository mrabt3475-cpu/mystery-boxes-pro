const express = require('express');
const router = express.Router();
const boxController = require('../controllers/box.controller');
const { auth } = require('../middleware/auth.middleware');

router.get('/', boxController.getBoxes);
router.get('/:id', boxController.getBox);
router.post('/', auth, boxController.createBox);
router.post('/:id/open', auth, boxController.openBox);
router.put('/:id', auth, boxController.updateBox);
router.delete('/:id', auth, boxController.deleteBox);

module.exports = router;
