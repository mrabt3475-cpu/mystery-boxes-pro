const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  items: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    weight: { type: Number, default: 1 }
  }],
  provider: { type: String, enum: ['kingdomlikes', 'g2a', 'cj'], default: 'kingdomlikes' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Box', boxSchema);
