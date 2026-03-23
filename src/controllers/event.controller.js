const SeasonalEvent = require('../models/SeasonalEvent');

const eventController = {
  async getEvents(req, res) {
    const events = await SeasonalEvent.find({ active: true });
    res.json(events);
  },
  async getEvent(req, res) {
    const event = await SeasonalEvent.findById(req.params.id);
    res.json(event);
  }
};
module.exports = eventController;
