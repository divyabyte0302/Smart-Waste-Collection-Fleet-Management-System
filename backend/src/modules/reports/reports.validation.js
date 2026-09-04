/**
 * Reports Request Validation Middleware
 */
const { errorResponse } = require('../../utils/response');

const reportsValidation = {
  validateExportQuery(req, res, next) {
    const { format } = req.query;

    if (format && format !== 'json' && format !== 'csv') {
      return errorResponse(res, 'Invalid format parameter. Allowed values: "json", "csv".', 400);
    }

    next();
  }
};

module.exports = reportsValidation;
