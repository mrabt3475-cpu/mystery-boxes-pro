const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  box: { type: mongoose.Schema.Types.ObjectId, ref: 'Box' },
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'refunded'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
