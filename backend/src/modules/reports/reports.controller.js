/**
 * Reports Controller - Request Handling Layer
 */
const ReportsService = require('./reports.service');
const { successResponse } = require('../../utils/response');

const ReportsController = {
  getDailyReport: async (req, res, next) => {
    try {
      const { date, area, format } = req.query;
      const data = await ReportsService.getDailyReport({ date, area });

      if (format === 'csv') {
        const headers = [
          { label: 'Task ID', key: 'id' },
          { label: 'Category', key: 'category' },
          { label: 'Title / Description', key: 'title' },
          { label: 'Area / Sector', key: 'area' },
          { label: 'Assigned Vehicle', key: 'assignedAsset' },
          { label: 'Assigned Crew', key: 'assignedTo' },
          { label: 'Status', key: 'status' },
          { label: 'Time Window', key: 'timestamp' }
        ];
        const csvContent = ReportsService.convertToCSV(headers, data.rows);
        const fileName = `daily-collection-report-${data.summary.reportDate}.csv`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        return res.status(200).send(csvContent);
      }

      return successResponse(res, data, 'Daily collection report generated.');
    } catch (err) {
      next(err);
    }
  },

  getWeeklyReport: async (req, res, next) => {
    try {
      const { area, format } = req.query;
      const data = await ReportsService.getWeeklyReport({ area });

      if (format === 'csv') {
        const headers = [
          { label: 'Day of Week', key: 'day' },
          { label: 'Total Routes', key: 'totalRoutes' },
          { label: 'Routes Completed', key: 'routesCompleted' },
          { label: 'Pickups Completed', key: 'pickupsCompleted' },
          { label: 'Tonnage Collected (Tons)', key: 'tonnageCollected' },
          { label: 'Efficiency Rate (%)', key: 'efficiencyRate' }
        ];
        const csvContent = ReportsService.convertToCSV(headers, data.weeklyBreakdown);
        const fileName = `weekly-collection-report.csv`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        return res.status(200).send(csvContent);
      }

      return successResponse(res, data, 'Weekly collection performance report generated.');
    } catch (err) {
      next(err);
    }
  },

  getMonthlyReport: async (req, res, next) => {
    try {
      const { month, year, area, format } = req.query;
      const data = await ReportsService.getMonthlyReport({ month, year, area });

      if (format === 'csv') {
        const headers = [
          { label: 'Operational Sector', key: 'sector' },
          { label: 'Routes Cleared', key: 'routesCleared' },
          { label: 'Tonnage Collected (Tons)', key: 'tonnage' },
          { label: 'Complaints Resolved', key: 'complaintsResolved' },
          { label: 'Citizen Satisfaction', key: 'satisfaction' }
        ];
        const csvContent = ReportsService.convertToCSV(headers, data.sectorPerformance);
        const fileName = `monthly-performance-report.csv`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        return res.status(200).send(csvContent);
      }

      return successResponse(res, data, 'Monthly municipal performance report generated.');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ReportsController;
