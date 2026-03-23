const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const { auth } = require('../middleware/auth.middleware');

router.get('/', auth, activityController.getActivity);

module.exports = router;
