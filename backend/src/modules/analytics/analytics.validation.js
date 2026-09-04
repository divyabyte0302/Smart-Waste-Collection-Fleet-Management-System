/**
 * Analytics Query Validation Middleware
 */
const { errorResponse } = require('../../utils/response');

const analyticsValidation = {
  validateDateRange(req, res, next) {
    const { startDate, endDate } = req.query;

    if (startDate && !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      return errorResponse(res, 'Invalid startDate format. Expected YYYY-MM-DD.', 400);
    }

    if (endDate && !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      return errorResponse(res, 'Invalid endDate format. Expected YYYY-MM-DD.', 400);
    }

    next();
  }
};

module.exports = analyticsValidation;
