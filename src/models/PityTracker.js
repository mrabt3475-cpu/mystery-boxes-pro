const mongoose = require('mongoose');

const pityTrackerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  boxId: { type: mongoose.Schema.Types.ObjectId, ref: 'Box' },
  spins: { type: Number, default: 0 },
  lastWin: Date
});

module.exports = mongoose.model('PityTracker', pityTrackerSchema);
