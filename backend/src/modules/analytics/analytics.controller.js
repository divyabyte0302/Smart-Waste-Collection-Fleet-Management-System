/**
 * Analytics Controller - Request Handling Layer
 */
const AnalyticsService = require('./analytics.service');
const { successResponse } = require('../../utils/response');

const AnalyticsController = {
  getDashboard: async (req, res, next) => {
    try {
      const { startDate, endDate, area } = req.query;
      const data = await AnalyticsService.getDashboardMetrics({ startDate, endDate, area });
      return successResponse(res, data, 'Dashboard analytics retrieved successfully.');
    } catch (err) {
      next(err);
    }
  },

  getComplaintsAnalytics: async (req, res, next) => {
    try {
      const { startDate, endDate, area } = req.query;
      const data = await AnalyticsService.getComplaintAnalytics({ startDate, endDate, area });
      return successResponse(res, data, 'Complaint analytics retrieved.');
    } catch (err) {
      next(err);
    }
  },

  getPickupsAnalytics: async (req, res, next) => {
    try {
      const { startDate, endDate, area } = req.query;
      const data = await AnalyticsService.getPickupAnalytics({ startDate, endDate, area });
      return successResponse(res, data, 'Pickup analytics retrieved.');
    } catch (err) {
      next(err);
    }
  },

  getVehiclesAnalytics: async (req, res, next) => {
    try {
      const { startDate, endDate, area } = req.query;
      const data = await AnalyticsService.getVehicleAnalytics({ startDate, endDate, area });
      return successResponse(res, data, 'Vehicle analytics retrieved.');
    } catch (err) {
      next(err);
    }
  },

  getStaffAnalytics: async (req, res, next) => {
    try {
      const { startDate, endDate, area } = req.query;
      const data = await AnalyticsService.getStaffAnalytics({ startDate, endDate, area });
      return successResponse(res, data, 'Staff analytics retrieved.');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = AnalyticsController;
