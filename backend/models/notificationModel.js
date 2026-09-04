/**
 * Smart Waste Collection Management System - Notification Model
 */
const Database = require('../database/db');

const NotificationModel = {
  findAll: (filters = {}) => {
    return Database.find('notifications', (item) => {
      if (filters.role && item.recipient_role !== 'ALL' && item.recipient_role !== filters.role) {
        return false;
      }
      return true;
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  create: (data) => {
    const newRecord = {
      recipient_role: data.recipient_role || 'ALL',
      recipient_email: data.recipient_email || null,
      title: data.title,
      message: data.message,
      type: data.type || 'INFO', // INFO, ALERT, DISPATCH, RESOLUTION
      related_id: data.related_id || null,
      is_read: false
    };
    return Database.insert('notifications', newRecord);
  },

  markAsRead: (id) => {
    return Database.updateById('notifications', id, { is_read: true });
  },

  markAllAsRead: () => {
    const list = Database.get('notifications');
    list.forEach(n => { n.is_read = true; });
    Database.flush();
    return true;
  }
};

module.exports = NotificationModel;
