/**
 * Auth Request Validation Schemas & Helpers
 */
const { errorResponse } = require('../../utils/response');

module.exports = {
  validateRegister: (req, res, next) => {
    const { name, email, password, phone, address, city } = req.body;
    const errors = [];

    if (!name || name.trim().length < 2) {
      errors.push('Full name must be at least 2 characters.');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('A valid email address is required.');
    }
    if (!password || password.length < 6) {
      errors.push('Password must be at least 6 characters long.');
    }

    if (errors.length > 0) {
      return errorResponse(res, 'Validation error', 400, errors);
    }
    next();
  },

  validateLogin: (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email) errors.push('Email is required.');
    if (!password) errors.push('Password is required.');

    if (errors.length > 0) {
      return errorResponse(res, 'Validation error', 400, errors);
    }
    next();
  },

  validateProfileUpdate: (req, res, next) => {
    const { name } = req.body;
    if (name !== undefined && name.trim().length < 2) {
      return errorResponse(res, 'Name must be at least 2 characters long.', 400);
    }
    next();
  },

  validatePasswordChange: (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const errors = [];

    if (!currentPassword) errors.push('Current password is required.');
    if (!newPassword || newPassword.length < 6) {
      errors.push('New password must be at least 6 characters long.');
    }

    if (errors.length > 0) {
      return errorResponse(res, 'Validation error', 400, errors);
    }
    next();
  }
};
