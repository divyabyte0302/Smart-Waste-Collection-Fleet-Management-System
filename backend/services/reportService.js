/**
 * Smart Waste Collection Management System - Report Export Service
 * Generates structured CSV and JSON operational reports for administrative auditing.
 */
const ReportModel = require('../models/reportModel');
const Database = require('../database/db');

const ReportService = {
  generateCsvReport: (type = 'complaints') => {
    let rows = [];
    let headers = [];

    if (type === 'complaints') {
      headers = ['Ticket Number', 'Citizen Name', 'Category', 'Priority', 'Zone', 'Address', 'Status', 'Driver', 'Created Date', 'Resolved Date'];
      const complaints = Database.get('complaints');
      rows = complaints.map(c => [
        `"${c.ticket_number || ''}"`,
        `"${c.citizen_name || ''}"`,
        `"${c.category || ''}"`,
        `"${c.priority || ''}"`,
        `"${c.zone_name || ''}"`,
        `"${(c.address || '').replace(/"/g, '""')}"`,
        `"${c.status || ''}"`,
        `"${c.assigned_driver_name || 'None'}"`,
        `"${c.created_at || ''}"`,
        `"${c.resolved_at || 'Pending'}"`
      ]);
    } else if (type === 'pickups') {
      headers = ['Request Number', 'Citizen Name', 'Waste Type', 'Volume', 'Address', 'Preferred Date', 'Status', 'Assigned Vehicle', 'Scheduled Date'];
      const pickups = Database.get('pickup_requests');
      rows = pickups.map(p => [
        `"${p.request_number || ''}"`,
        `"${p.citizen_name || ''}"`,
        `"${p.waste_type || ''}"`,
        `"${p.estimated_volume || ''}"`,
        `"${(p.address || '').replace(/"/g, '""')}"`,
        `"${p.preferred_date || ''}"`,
        `"${p.status || ''}"`,
        `"${p.assigned_vehicle_number || 'Unassigned'}"`,
        `"${p.scheduled_date || 'Pending'}"`
      ]);
    } else if (type === 'vehicles') {
      headers = ['Vehicle No', 'Model', 'Type', 'Capacity (Tons)', 'Current Load (Tons)', 'Fuel %', 'Status', 'Driver', 'Last Maintenance'];
      const vehicles = Database.get('vehicles');
      rows = vehicles.map(v => [
        `"${v.vehicle_number || ''}"`,
        `"${v.model || ''}"`,
        `"${v.type || ''}"`,
        `"${v.capacity_tons || 0}"`,
        `"${v.current_load_tons || 0}"`,
        `"${v.fuel_percentage || 0}%"`,
        `"${v.status || ''}"`,
        `"${v.driver_name || 'Unassigned'}"`,
        `"${v.last_maintenance_date || ''}"`
      ]);
    }

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    return csvContent;
  },

  getAnalyticsSummary: () => {
    return ReportModel.getOperationalSummary();
  }
};

module.exports = ReportService;
