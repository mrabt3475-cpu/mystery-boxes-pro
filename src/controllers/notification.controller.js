/**
 * Notification Controller
 */
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

class NotificationController {
  /**
   * Get user's notifications
   */
  async getNotifications(req, res) {
    try {
      const { limit = 50, page = 1, unread } = req.query;
      const query = { user: req.user.id };
      if (unread === 'true') query.read = false;

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

      const total = await Notification.countDocuments(query);
      const unreadCount = await Notification.countDocuments({
        user: req.user.id,
        read: false,
      });

      res.json({
        success: true,
        data: {
          notifications,
          unreadCount,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
          },
        },
      });
    } catch (error) {
      logger.error('Get notifications error:', error);
      res.status(500).json({ success: false, error: 'Failed to get notifications' });
    }
  }

  /**
   * Mark as read
   */
  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      
      const notification = await Notification.findOneAndUpdate(
        { _id: id, user: req.user.id },
        { read: true, readAt: new Date() },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({ success: false, error: 'Notification not found' });
      }

      res.json({ success: true, data: notification });
    } catch (error) {
      logger.error('Mark as read error:', error);
      res.status(500).json({ success: false, error: 'Failed to mark as read' });
    }
  }

  /**
   * Mark all as read
   */
  async markAllAsRead(req, res) {
    try {
      await Notification.updateMany(
        { user: req.user.id, read: false },
        { read: true, readAt: new Date() }
      );

      res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
      logger.error('Mark all as read error:', error);
      res.status(500).json({ success: false, error: 'Failed to mark as read' });
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(req, res) {
    try {
      const notification = await Notification.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
      });

      if (!notification) {
        return res.status(404).json({ success: false, error: 'Notification not found' });
      }

      res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
      logger.error('Delete notification error:', error);
      res.status(500).json({ success: false, error: 'Failed to delete notification' });
    }
  }
}

module.exports = new NotificationController();
