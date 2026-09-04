/**
 * User Module Validation
 */
const { errorResponse } = require('../../utils/response');
const { USER_STATUS, ROLES } = require('../../config/constants');

module.exports = {
  validateStatusUpdate: (req, res, next) => {
    const { status } = req.body;
    if (!status || !Object.values(USER_STATUS).includes(status)) {
      return errorResponse(res, `Status must be either '${USER_STATUS.ACTIVE}' or '${USER_STATUS.INACTIVE}'`, 400);
    }
    next();
  },

  validateCreateUser: (req, res, next) => {
    const { name, email, password, role } = req.body;
    const errors = [];

    if (!name || name.trim().length < 2) errors.push('Name is required.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required.');
    if (!password || password.length < 6) errors.push('Password must be at least 6 characters.');
    if (!role || !Object.values(ROLES).includes(role)) errors.push(`Role must be one of: ${Object.values(ROLES).join(', ')}`);

    if (errors.length > 0) {
      return errorResponse(res, 'Validation error', 400, errors);
    }
    next();
  }
};
