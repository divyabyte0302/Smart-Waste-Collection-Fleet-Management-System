/**
 * Notification Controller - Handles HTTP requests
 */
const NotificationService = require('./notification.service');
const { successResponse, errorResponse } = require('../../utils/response');

class NotificationController {
  static async broadcast(req, res, next) {
    try {
      const { title, message, priority, targetArea } = req.body;
      const result = await NotificationService.broadcastAdvisory(title, message, priority, targetArea);
      return successResponse(res, result, 'Municipal notification broadcast successfully dispatched via Amazon SNS.');
    } catch (err) {
      next(err);
    }
  }

  static async getRecent(req, res, next) {
    try {
      const limit = parseInt(req.query.limit, 10) || 30;
      const notifications = await NotificationService.getRecentNotifications(limit);
      return successResponse(res, notifications, 'Recent notifications retrieved.');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = NotificationController;
