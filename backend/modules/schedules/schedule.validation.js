/**
 * Schedule Request Validation
 */
const { SCHEDULE_STATUS, SCHEDULE_WASTE_TYPES } = require('./schedule.types');
const { errorResponse } = require('../../utils/response');

const scheduleValidation = {
  validateCreate(req, res, next) {
    const { area, zone, collectionDate, startTime, endTime, wasteType, collectionType } = req.body;
    const finalArea = area || zone;
    const finalWasteType = wasteType || collectionType;

    if (!finalArea || typeof finalArea !== 'string' || finalArea.trim().length < 2) {
      return errorResponse(res, 'Collection area or zone is required.', 400);
    }

    if (!collectionDate || !/^\d{4}-\d{2}-\d{2}$/.test(collectionDate)) {
      return errorResponse(res, 'Valid collection date is required in YYYY-MM-DD format.', 400);
    }

    if (!startTime || !endTime) {
      return errorResponse(res, 'Start time and End time windows are required.', 400);
    }

    if (!finalWasteType) {
      return errorResponse(res, 'Waste type is required.', 400);
    }

    next();
  },

  validateStatusUpdate(req, res, next) {
    const { status } = req.body;
    const allowed = Object.values(SCHEDULE_STATUS);
    if (!status || !allowed.includes(status)) {
      return errorResponse(
        res,
        `Invalid status. Allowed statuses: ${allowed.join(', ')}`,
        400
      );
    }
    next();
  }
};

module.exports = scheduleValidation;
