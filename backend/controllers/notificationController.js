/**
 * Smart Waste Collection Management System - Notification Controller
 */
const NotificationModel = require('../models/notificationModel');

const NotificationController = {
  // GET /api/notifications
  getAll: (req, res, next) => {
    try {
      const { role } = req.query;
      const list = NotificationModel.findAll({ role });
      const unreadCount = list.filter(n => !n.is_read).length;
      res.json({ success: true, count: list.length, unreadCount, data: list });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/notifications/:id/read
  markAsRead: (req, res, next) => {
    try {
      const { id } = req.params;
      const updated = NotificationModel.markAsRead(id);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/notifications/mark-all-read
  markAllRead: (req, res, next) => {
    try {
      NotificationModel.markAllAsRead();
      res.json({ success: true, message: 'All notifications marked as read' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = NotificationController;
