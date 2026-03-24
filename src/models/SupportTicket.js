const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  ticketNumber: { type: String, unique: true, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: String, enum: ['payment', 'order', 'technical', 'referral', 'agent', 'other'], required: true },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  status: { type: String, enum: ['open', 'in_progress', 'waiting_user', 'resolved', 'closed'], default: 'open' },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  attachments: [{ type: String }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    attachments: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
  }],
  resolvedAt: { type: Date },
  closedAt: { type: Date }
}, { timestamps: true });

supportTicketSchema.index({ ticketNumber: 1 });
supportTicketSchema.index({ user: 1, status: 1 });
supportTicketSchema.index({ status: 1, priority: 1 });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);