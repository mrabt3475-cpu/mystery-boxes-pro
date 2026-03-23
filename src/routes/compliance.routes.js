const express = require('express');
const router = express.Router();
const complianceController = require('../controllers/compliance.controller');

router.get('/verify', complianceController.verifyOperation);
router.get('/halal-status', complianceController.getHalalStatus);

module.exports = router;
