/**
 * Notify Service - Real-time notifications
 */
const logger = require('../utils/logger');

class NotifyService {
  notifyUser(userId, message, type = 'info') {
    logger.info(`Notifying user ${userId}: ${message}`);
    // Socket.io or push notification
  }

  broadcast(message) {
    logger.info(`Broadcast: ${message}`);
  }
}

module.exports = new NotifyService();
