/**
 * Smart Waste Collection Management System - Report & Analytics Controller
 */
const ReportModel = require('../models/reportModel');
const ReportService = require('../services/reportService');
const RouteOptimizationService = require('../services/routeOptimizationService');

const ReportController = {
  // GET /api/reports/summary
  getSummary: (req, res, next) => {
    try {
      const summary = ReportModel.getOperationalSummary();
      const sustainability = RouteOptimizationService.calculateSustainabilityMetrics(
        summary.overview.totalWasteCollectedTons,
        185.4
      );
      res.json({
        success: true,
        data: {
          ...summary,
          sustainability
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/reports/export/:type (complaints | pickups | vehicles)
  exportCsv: (req, res, next) => {
    try {
      const { type } = req.params;
      const csvData = ReportService.generateCsvReport(type);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=smartwaste-${type}-report-${Date.now()}.csv`);
      res.status(200).send(csvData);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/reports/logs
  getServiceLogs: (req, res, next) => {
    try {
      const logs = ReportModel.getServiceLogs();
      res.json({ success: true, count: logs.length, data: logs });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/reports/logs
  createServiceLog: (req, res, next) => {
    try {
      const log = ReportModel.logServiceRun(req.body);
      res.status(201).json({ success: true, message: 'Service run logged', data: log });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ReportController;
