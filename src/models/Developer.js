const mongoose = require('mongoose');

const developerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  apiKey: { type: String, required: true, unique: true },
  apps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'App' }],
  totalEarnings: { type: Number, default: 0 }
});

module.exports = mongoose.model('Developer', developerSchema);
