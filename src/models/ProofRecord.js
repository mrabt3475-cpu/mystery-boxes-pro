const mongoose = require('mongoose');

const proofRecordSchema = new mongoose.Schema({
  boxId: { type: mongoose.Schema.Types.ObjectId, ref: 'Box' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  seed: String,
  hash: String,
  result: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProofRecord', proofRecordSchema);
