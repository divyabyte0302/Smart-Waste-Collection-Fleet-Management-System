/**
 * Role-Based Access Control (RBAC) Middleware
 * Enforces permissions based on user roles: Citizen, Administrator, Collection Staff.
 */
const { errorResponse } = require('../utils/response');

module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required before checking permissions.', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. Required role: [${allowedRoles.join(', ')}]. Your role: '${req.user.role}'`,
        403
      );
    }

    next();
  };
};
