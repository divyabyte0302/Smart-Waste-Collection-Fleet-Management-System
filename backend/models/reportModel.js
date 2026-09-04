/**
 * Smart Waste Collection Management System - Report & Operational Analytics Model
 */
const Database = require('../database/db');

const ReportModel = {
  getOperationalSummary: () => {
    const complaints = Database.get('complaints');
    const pickups = Database.get('pickup_requests');
    const vehicles = Database.get('vehicles');
    const serviceLogs = Database.get('service_logs');
    const zones = Database.get('zones');

    const totalComplaints = complaints.length;
    const resolvedComplaints = complaints.filter(c => c.status === 'RESOLVED').length;
    const inProgressComplaints = complaints.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
    const reportedComplaints = complaints.filter(c => c.status === 'REPORTED').length;

    const totalPickups = pickups.length;
    const completedPickups = pickups.filter(p => p.status === 'COMPLETED').length;
    const scheduledPickups = pickups.filter(p => p.status === 'SCHEDULED' || p.status === 'CONFIRMED').length;
    const requestedPickups = pickups.filter(p => p.status === 'REQUESTED').length;

    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter(v => v.status === 'ON_ROUTE').length;
    const availableVehicles = vehicles.filter(v => v.status === 'AVAILABLE').length;
    const maintenanceVehicles = vehicles.filter(v => v.status === 'MAINTENANCE').length;

    const totalWasteCollectedTons = serviceLogs.reduce((acc, log) => acc + (parseFloat(log.waste_collected_tons) || 0), 0) +
      vehicles.reduce((acc, v) => acc + (parseFloat(v.current_load_tons) || 0), 0);

    const resolutionRate = totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1) : 100;
    const pickupCompletionRate = totalPickups > 0 ? ((completedPickups / totalPickups) * 100).toFixed(1) : 100;

    // Waste by Category breakdown
    const categoryCounts = {};
    complaints.forEach(c => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    // Pickups by Waste Type breakdown
    const pickupTypeCounts = {};
    pickups.forEach(p => {
      pickupTypeCounts[p.waste_type] = (pickupTypeCounts[p.waste_type] || 0) + 1;
    });

    // Zone statistics
    const zoneStats = zones.map(z => {
      const zoneComplaints = complaints.filter(c => c.zone_id === z.id);
      const zonePickups = pickups.filter(p => p.zone_id === z.id);
      const zoneVehicles = vehicles.filter(v => v.assigned_zone_id === z.id);
      return {
        id: z.id,
        name: z.name,
        code: z.code,
        complaintCount: zoneComplaints.length,
        resolvedCount: zoneComplaints.filter(c => c.status === 'RESOLVED').length,
        pickupCount: zonePickups.length,
        assignedVehicles: zoneVehicles.length,
        efficiencyScore: zoneComplaints.length > 0
          ? Math.round((zoneComplaints.filter(c => c.status === 'RESOLVED').length / zoneComplaints.length) * 100)
          : 100
      };
    });

    return {
      overview: {
        totalComplaints,
        resolvedComplaints,
        inProgressComplaints,
        reportedComplaints,
        resolutionRate: parseFloat(resolutionRate),
        totalPickups,
        completedPickups,
        scheduledPickups,
        requestedPickups,
        pickupCompletionRate: parseFloat(pickupCompletionRate),
        totalVehicles,
        activeVehicles,
        availableVehicles,
        maintenanceVehicles,
        totalWasteCollectedTons: parseFloat(totalWasteCollectedTons.toFixed(2))
      },
      categoryBreakdown: categoryCounts,
      pickupTypeBreakdown: pickupTypeCounts,
      zonePerformance: zoneStats,
      serviceLogs: serviceLogs.slice(-10).reverse()
    };
  },

  getServiceLogs: () => {
    return Database.get('service_logs');
  },

  logServiceRun: (logData) => {
    return Database.insert('service_logs', logData);
  }
};

module.exports = ReportModel;
