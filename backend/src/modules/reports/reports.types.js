/**
 * Reports Types and Enums
 */
const REPORT_TYPES = {
  DAILY_COLLECTION: 'Daily Collection Report',
  WEEKLY_COLLECTION: 'Weekly Collection Report',
  MONTHLY_PERFORMANCE: 'Monthly Performance Report',
  COMPLAINT_SUMMARY: 'Complaint Summary Report',
  FLEET_UTILIZATION: 'Vehicle Fleet Utilization Report',
  STAFF_PERFORMANCE: 'Collection Staff Performance Report'
};

const REPORT_FORMATS = {
  JSON: 'json',
  CSV: 'csv'
};

module.exports = {
  REPORT_TYPES,
  REPORT_FORMATS
};
