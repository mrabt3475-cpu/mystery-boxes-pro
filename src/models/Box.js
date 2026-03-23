const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  image: String,
  category: String,
  active: { type: Boolean, default: true },
  minPayout: Number,
  maxPayout: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Box', boxSchema);
