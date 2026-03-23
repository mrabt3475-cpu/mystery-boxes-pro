/**
 * Wallet Model
 */
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true,
    index: true 
  },
  balance: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  frozenBalance: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  totalDeposited: { 
    type: Number, 
    default: 0 
  },
  totalWithdrawn: { 
    type: Number, 
    default: 0 
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  totalWon: {
    type: Number,
    default: 0
  },
  pin: String,
  pinSetAt: Date,
  lastTransactionAt: Date,
  withdrawalMethod: {
    type: String,
    enum: ['ton', 'usdt', 'card'],
    default: 'ton'
  },
  withdrawalAddress: String,
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.pin;
      delete ret.__v;
    }
  }
});

// Virtual for available balance
walletSchema.virtual('availableBalance').get(function() {
  return this.balance - this.frozenBalance;
});

// Index for queries
walletSchema.index({ balance: -1 });

module.exports = mongoose.model('Wallet', walletSchema);
