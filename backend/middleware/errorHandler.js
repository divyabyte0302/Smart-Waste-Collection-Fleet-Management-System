/**
 * Smart Waste Collection Management System - Centralized Error Handler
 */
module.exports = (err, req, res, next) => {
  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err.stack || err.message);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    }
  });
};
