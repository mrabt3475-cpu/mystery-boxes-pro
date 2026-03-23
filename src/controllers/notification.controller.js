const Notification = require('../models/Notification');

const notificationController = {
  async getNotifications(req, res) {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  },
  async markAsRead(req, res) {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  }
};
module.exports = notificationController;
