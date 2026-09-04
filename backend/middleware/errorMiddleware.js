/**
 * Centralized Error Handling Middleware
 */
const { errorResponse } = require('../utils/response');

module.exports = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return errorResponse(res, message, statusCode, err.errors || null);
};
