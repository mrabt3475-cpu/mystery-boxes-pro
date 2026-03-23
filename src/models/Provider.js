/**
 * Provider Model
 */
const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Provider name is required'],
    unique: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['kingdomdomliker', 'g2a', 'cj', 'aliexpress', 'custom'],
    required: true,
  },
  apiKey: String,
  apiSecret: String,
  webhookUrl: String,
  markup: {
    type: Number,
    default: 0.15,
    min: 0,
    max: 1,
  },
  active: {
    type: Boolean,
    default: true,
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  lastSync: Date,
  syncStatus: {
    type: String,
    enum: ['idle', 'syncing', 'success', 'failed'],
    default: 'idle',
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.apiKey;
      delete ret.apiSecret;
      return ret;
    },
  },
});

// Index
providerSchema.index({ active: 1, priority: 1 });

module.exports = mongoose.model('Provider', providerSchema);
