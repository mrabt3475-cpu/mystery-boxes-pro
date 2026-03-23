const mongoose = require('mongoose');

const missionProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  missionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' },
  current: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  claimed: { type: Boolean, default: false }
});

module.exports = mongoose.model('MissionProgress', missionProgressSchema);
