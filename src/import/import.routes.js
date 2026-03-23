const express = require('express');
const router = express.Router();
const importController = require('./import.controller');

router.post('/cj', importController.importCJ);
router.post('/aliexpress', importController.importAliExpress);
router.post('/catalog', importController.importCatalog);

module.exports = router;
