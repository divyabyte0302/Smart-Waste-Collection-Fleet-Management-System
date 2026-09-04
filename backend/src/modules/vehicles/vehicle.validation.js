/**
 * Vehicle Module - Validation Middleware & Schemas
 */
const { VEHICLE_TYPES, VEHICLE_STATUS } = require('./vehicle.types');

const vehicleValidation = {
  validateCreate: (req, res, next) => {
    const { vehicleNumber, vehicleType, capacity } = req.body;
    const errors = [];

    if (!vehicleNumber || typeof vehicleNumber !== 'string' || !vehicleNumber.trim()) {
      errors.push('Vehicle number/identifier is required.');
    }

    const validTypes = Object.values(VEHICLE_TYPES);
    if (!vehicleType || !validTypes.includes(vehicleType)) {
      errors.push(`Vehicle type must be one of: ${validTypes.join(', ')}`);
    }

    if (!capacity || typeof capacity !== 'string' || !capacity.trim()) {
      errors.push('Vehicle capacity specification is required (e.g., "10 Tons" or "5000 kg").');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle validation failed.',
        errors
      });
    }

    next();
  },

  validateStatusUpdate: (req, res, next) => {
    const { status } = req.body;
    const validStatuses = Object.values(VEHICLE_STATUS);

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
        errors: [`Invalid status: ${status}`]
      });
    }

    next();
  }
};

module.exports = vehicleValidation;
