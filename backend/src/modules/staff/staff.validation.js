/**
 * Collection Staff Module - Validation Middleware & Schemas
 */
const { STAFF_ROLES, STAFF_STATUS } = require('./staff.types');

const staffValidation = {
  validateCreate: (req, res, next) => {
    const { name, email, role, employeeId } = req.body;
    const errors = [];

    if (!name || typeof name !== 'string' || !name.trim()) {
      errors.push('Staff member name is required.');
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      errors.push('Valid staff email address is required.');
    }

    const validRoles = Object.values(STAFF_ROLES);
    if (!role || !validRoles.includes(role)) {
      errors.push(`Staff role must be one of: ${validRoles.join(', ')}`);
    }

    if (!employeeId || typeof employeeId !== 'string' || !employeeId.trim()) {
      errors.push('Municipal employee ID is required (e.g. EMP-2026-081).');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Staff validation failed.',
        errors
      });
    }

    next();
  },

  validateUpdate: (req, res, next) => {
    const { role, status } = req.body;
    const errors = [];

    if (role && !Object.values(STAFF_ROLES).includes(role)) {
      errors.push(`Invalid role. Valid options: ${Object.values(STAFF_ROLES).join(', ')}`);
    }

    if (status && !Object.values(STAFF_STATUS).includes(status)) {
      errors.push(`Invalid status. Valid options: ${Object.values(STAFF_STATUS).join(', ')}`);
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Staff update validation failed.',
        errors
      });
    }

    next();
  }
};

module.exports = staffValidation;
