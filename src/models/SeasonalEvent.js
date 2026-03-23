const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  startDate: Date,
  endDate: Date,
  boxes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Box' }],
  bonus: Number,
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('SeasonalEvent', eventSchema);
