/**
 * Notification Service - Orchestrates SNS publishing and persistence
 */
const snsService = require('../../services/notifications/sns.service');
const NotificationModel = require('./notification.model');

class NotificationService {
  /**
   * Broadcast an urgent municipal service advisory
   */
  static async broadcastAdvisory(title, message, priority = 'NORMAL', targetArea = 'All Sectors') {
    const published = await snsService.broadcastServiceNotification(title, message, priority, targetArea);
    
    // Persist in notification logs
    const saved = await NotificationModel.create({
      subject: published.subject,
      message: published.message,
      type: 'SERVICE_BROADCAST',
      priority,
      targetArea,
      channel: published.channel,
      snsMessageId: published.messageId || null
    });

    return { ...published, persistedId: saved.id };
  }

  /**
   * Get recent system notification events
   */
  static async getRecentNotifications(limit = 30) {
    const memoryEvents = snsService.getRecentNotifications(limit);
    const persisted = await NotificationModel.findAll();
    
    // Merge or return unique recent notifications
    const combined = [...persisted, ...memoryEvents];
    return combined.slice(0, limit);
  }
}

module.exports = NotificationService;
