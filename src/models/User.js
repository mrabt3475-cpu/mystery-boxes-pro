const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'developer'], default: 'user' },
  wallet: { type: Number, default: 0 },
  referralCode: { type: String, unique: true },
  referralTier: { type: Number, default: 1 },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
