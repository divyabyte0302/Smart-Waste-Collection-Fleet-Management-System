/**
 * Notification Request Validation Middleware
 */
const { errorResponse } = require('../../utils/response');

const notificationValidation = {
  validateBroadcast(req, res, next) {
    const { title, message } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return errorResponse(res, 'Valid advisory title (at least 3 characters) is required.', 400);
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return errorResponse(res, 'Valid advisory message body (at least 5 characters) is required.', 400);
    }

    next();
  }
};

module.exports = notificationValidation;
