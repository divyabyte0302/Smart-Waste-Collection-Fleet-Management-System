/**
 * JWT Authentication Middleware
 * Validates the Authorization Bearer token on protected endpoints.
 */
const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');
const db = require('../config/database');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication required. No Bearer token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return errorResponse(res, 'Invalid or expired authentication token.', 401);
    }

    const user = await db.findById('users', decoded.id);
    if (!user) {
      return errorResponse(res, 'User associated with token no longer exists.', 401);
    }

    if (user.status === 'Inactive') {
      return errorResponse(res, 'Your account has been deactivated by an Administrator. Please contact support.', 403);
    }

    // Attach user to request (excluding password)
    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    return errorResponse(res, 'Internal authentication error.', 500);
  }
};
