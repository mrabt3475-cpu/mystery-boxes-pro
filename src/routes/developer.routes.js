const express = require('express');
const router = express.Router();
const developerController = require('../developer/developer.api.controller');
const { auth } = require('../middleware/auth.middleware');

router.get('/apps', auth, developerController.getApps);
router.post('/apps', auth, developerController.createApp);
router.get('/apps/:id/commissions', auth, developerController.getCommissions);

module.exports = router;
