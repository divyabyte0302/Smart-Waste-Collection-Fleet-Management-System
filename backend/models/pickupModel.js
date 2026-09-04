/**
 * Smart Waste Collection Management System - Pickup Request Model
 */
const Database = require('../database/db');
const { PICKUP_STATUS } = require('../config/constants');

const PickupModel = {
  findAll: (filters = {}) => {
    return Database.find('pickup_requests', (item) => {
      if (filters.status && item.status !== filters.status) return false;
      if (filters.waste_type && item.waste_type !== filters.waste_type) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches = (
          (item.request_number && item.request_number.toLowerCase().includes(q)) ||
          (item.citizen_name && item.citizen_name.toLowerCase().includes(q)) ||
          (item.address && item.address.toLowerCase().includes(q)) ||
          (item.waste_type && item.waste_type.toLowerCase().includes(q))
        );
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  findById: (id) => {
    return Database.findById('pickup_requests', id);
  },

  findByRequestNumber: (requestNumber) => {
    return Database.findOne('pickup_requests', (item) => {
      return item.request_number && item.request_number.toUpperCase() === requestNumber.trim().toUpperCase();
    });
  },

  create: (data) => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const requestNumber = `PCK-${new Date().getFullYear()}-0${randomSuffix}`;
    const newRecord = {
      request_number: requestNumber,
      citizen_name: data.citizen_name || 'Resident',
      citizen_email: data.citizen_email || '',
      citizen_phone: data.citizen_phone || '',
      waste_type: data.waste_type || 'Bulky Waste',
      estimated_volume: data.estimated_volume || '1-3 Items',
      address: data.address || '',
      zone_id: data.zone_id || 'zone_01',
      latitude: data.latitude ? parseFloat(data.latitude) : 40.7128,
      longitude: data.longitude ? parseFloat(data.longitude) : -74.0060,
      preferred_date: data.preferred_date || new Date().toISOString().split('T')[0],
      preferred_timeslot: data.preferred_timeslot || 'Morning (09:00 - 12:00)',
      photo_url: data.photo_url || null,
      status: PICKUP_STATUS.REQUESTED,
      assigned_vehicle_id: null,
      assigned_vehicle_number: null,
      scheduled_date: null,
      scheduled_time: null,
      staff_notes: null
    };
    return Database.insert('pickup_requests', newRecord);
  },

  updateStatus: (id, status, notes = '') => {
    const updates = { status };
    if (notes) updates.staff_notes = notes;
    return Database.updateById('pickup_requests', id, updates);
  },

  schedulePickup: (id, vehicleId, vehicleNumber, date, time, notes = '') => {
    return Database.updateById('pickup_requests', id, {
      assigned_vehicle_id: vehicleId,
      assigned_vehicle_number: vehicleNumber,
      scheduled_date: date,
      scheduled_time: time,
      status: PICKUP_STATUS.SCHEDULED,
      staff_notes: notes || 'Scheduled with fleet dispatch'
    });
  },

  delete: (id) => {
    return Database.deleteById('pickup_requests', id);
  }
};

module.exports = PickupModel;
