const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEvent);
router.post('/:id/join', eventController.joinEvent);

module.exports = router;
