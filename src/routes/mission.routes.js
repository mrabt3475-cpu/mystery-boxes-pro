const express = require('express');
const router = express.Router();
const missionController = require('../controllers/mission.controller');
const { auth } = require('../middleware/auth.middleware');

router.get('/', auth, missionController.getMissions);
router.post('/:id/progress', auth, missionController.updateProgress);
router.post('/:id/claim', auth, missionController.claimReward);

module.exports = router;
