/**
 * Smart Waste Collection Management System - Schedule & Route Model
 */
const Database = require('../database/db');

const ScheduleModel = {
  findAll: (filters = {}) => {
    return Database.find('schedules', (item) => {
      if (filters.zone_id && item.zone_id !== filters.zone_id) return false;
      if (filters.vehicle_id && item.vehicle_id !== filters.vehicle_id) return false;
      if (filters.day_of_week && item.day_of_week.toLowerCase() !== filters.day_of_week.toLowerCase()) return false;
      if (filters.status && item.status !== filters.status) return false;
      return true;
    });
  },

  findById: (id) => {
    return Database.findById('schedules', id);
  },

  create: (data) => {
    const newRecord = {
      zone_id: data.zone_id,
      zone_name: data.zone_name || 'Downtown Central',
      vehicle_id: data.vehicle_id || null,
      vehicle_number: data.vehicle_number || 'Unassigned',
      collection_type: data.collection_type || 'General Waste',
      day_of_week: data.day_of_week || 'Monday',
      start_time: data.start_time || '07:00',
      end_time: data.end_time || '12:00',
      frequency: data.frequency || 'Weekly',
      status: data.status || 'ACTIVE',
      route_checkpoints: data.route_checkpoints || [
        { name: 'Start Depo', status: 'PENDING', time: data.start_time || '07:00' },
        { name: 'Central Sector Block', status: 'PENDING', time: '09:00' },
        { name: 'Disposal Facility Hub', status: 'PENDING', time: data.end_time || '12:00' }
      ]
    };
    return Database.insert('schedules', newRecord);
  },

  update: (id, updates) => {
    return Database.updateById('schedules', id, updates);
  },

  updateCheckpointStatus: (scheduleId, checkpointIndex, status) => {
    const schedule = Database.findById('schedules', scheduleId);
    if (!schedule || !schedule.route_checkpoints) return null;

    const checkpoints = [...schedule.route_checkpoints];
    if (checkpoints[checkpointIndex]) {
      checkpoints[checkpointIndex].status = status;
      checkpoints[checkpointIndex].updated_at = new Date().toISOString();
    }
    return Database.updateById('schedules', scheduleId, { route_checkpoints: checkpoints });
  },

  delete: (id) => {
    return Database.deleteById('schedules', id);
  }
};

module.exports = ScheduleModel;
