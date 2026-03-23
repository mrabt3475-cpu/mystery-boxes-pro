const express = require('express');
const router = express.Router();
const levelsController = require('../controllers/levels.controller');
const { auth } = require('../middleware/auth.middleware');

router.get('/', auth, levelsController.getLevels);
router.get('/my', auth, levelsController.getMyLevel);
router.post('/xp', auth, levelsController.addXP);

module.exports = router;
