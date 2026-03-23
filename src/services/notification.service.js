/**
 * Notification Service
 */
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

class NotificationService {
  async send(userId, type, message, data = {}) {
    const notification = await Notification.create({
      userId, type, message, data, read: false
    });
    return notification;
  }

  async getUserNotifications(userId, limit = 20) {
    return Notification.find({ userId }).sort({ createdAt: -1 }).limit(limit);
  }

  async markAsRead(notificationId) {
    return Notification.findByIdAndUpdate(notificationId, { read: true });
  }
}

module.exports = new NotificationService();
