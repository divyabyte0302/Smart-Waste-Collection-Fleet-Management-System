/**
 * Complaint Request Validation Middleware
 */
const { COMPLAINT_CATEGORIES, COMPLAINT_STATUS, COMPLAINT_PRIORITY } = require('./complaint.types');
const { errorResponse } = require('../../utils/response');

const complaintValidation = {
  validateCreate(req, res, next) {
    const { title, description, category, location, priority } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return errorResponse(res, 'Title is required and must be at least 3 characters long.', 400);
    }

    if (!description || typeof description !== 'string' || description.trim().length < 5) {
      return errorResponse(res, 'Description is required and must be at least 5 characters long.', 400);
    }

    if (!location || typeof location !== 'string' || location.trim().length < 3) {
      return errorResponse(res, 'Location is required to dispatch municipal collection units.', 400);
    }

    const validCategories = Object.values(COMPLAINT_CATEGORIES);
    if (category && !validCategories.includes(category)) {
      return errorResponse(
        res,
        `Invalid category. Allowed categories are: ${validCategories.join(', ')}`,
        400
      );
    }

    const validPriorities = Object.values(COMPLAINT_PRIORITY);
    if (priority && !validPriorities.includes(priority)) {
      return errorResponse(
        res,
        `Invalid priority. Allowed priorities are: ${validPriorities.join(', ')}`,
        400
      );
    }

    next();
  },

  validateStatusUpdate(req, res, next) {
    const { status } = req.body;
    const validStatuses = Object.values(COMPLAINT_STATUS);

    if (!status || !validStatuses.includes(status)) {
      return errorResponse(
        res,
        `Invalid status. Allowed statuses are: ${validStatuses.join(', ')}`,
        400
      );
    }

    next();
  },

  validateComment(req, res, next) {
    const { comment } = req.body;
    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return errorResponse(res, 'Comment text cannot be empty.', 400);
    }
    next();
  }
};

module.exports = complaintValidation;
