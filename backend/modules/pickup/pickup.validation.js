/**
 * Pickup Request Validation Middleware
 */
const { WASTE_TYPES, PICKUP_STATUS } = require('./pickup.types');
const { errorResponse } = require('../../utils/response');

const pickupValidation = {
  validateCreate(req, res, next) {
    const { wasteType, pickupAddress, preferredDate, preferredTime } = req.body;

    if (!wasteType || !Object.values(WASTE_TYPES).includes(wasteType)) {
      return errorResponse(
        res,
        `Invalid waste type. Allowed types: ${Object.values(WASTE_TYPES).join(', ')}`,
        400
      );
    }

    if (!pickupAddress || typeof pickupAddress !== 'string' || pickupAddress.trim().length < 3) {
      return errorResponse(res, 'Valid pickup address is required.', 400);
    }

    if (!preferredDate || !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
      return errorResponse(res, 'Preferred date is required in YYYY-MM-DD format.', 400);
    }

    if (!preferredTime || typeof preferredTime !== 'string' || preferredTime.trim().length < 2) {
      return errorResponse(res, 'Preferred pickup time window is required.', 400);
    }

    next();
  },

  validateStatusUpdate(req, res, next) {
    const { status } = req.body;
    if (!status || !Object.values(PICKUP_STATUS).includes(status)) {
      return errorResponse(
        res,
        `Invalid status. Allowed statuses: ${Object.values(PICKUP_STATUS).join(', ')}`,
        400
      );
    }
    next();
  }
};

module.exports = pickupValidation;
