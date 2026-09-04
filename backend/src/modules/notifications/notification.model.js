/**
 * Notification Model - Data Access Layer
 */
const db = require('../../config/database');

const NotificationModel = {
  findAll: async (filters = {}) => {
    return db.find('notifications', (item) => {
      if (filters.recipientId && item.recipientId !== filters.recipientId) return false;
      if (filters.type && item.type !== filters.type) return false;
      return true;
    });
  },

  findById: async (id) => {
    return db.findById('notifications', id);
  },

  create: async (data) => {
    const id = `NTF-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const record = {
      id,
      notificationId: id,
      timestamp: new Date().toISOString(),
      ...data
    };
    return db.insert('notifications', record);
  },

  delete: async (id) => {
    return db.delete('notifications', id);
  }
};

module.exports = NotificationModel;
