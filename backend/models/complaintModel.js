/**
 * Smart Waste Collection Management System - Complaint Model
 */
const Database = require('../database/db');
const { COMPLAINT_STATUS } = require('../config/constants');

const ComplaintModel = {
  findAll: (filters = {}) => {
    return Database.find('complaints', (item) => {
      if (filters.status && item.status !== filters.status) return false;
      if (filters.zone_id && item.zone_id !== filters.zone_id) return false;
      if (filters.priority && item.priority !== filters.priority) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches = (
          (item.ticket_number && item.ticket_number.toLowerCase().includes(q)) ||
          (item.citizen_name && item.citizen_name.toLowerCase().includes(q)) ||
          (item.category && item.category.toLowerCase().includes(q)) ||
          (item.address && item.address.toLowerCase().includes(q)) ||
          (item.description && item.description.toLowerCase().includes(q))
        );
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  findById: (id) => {
    return Database.findById('complaints', id);
  },

  findByTicketNumber: (ticketNumber) => {
    return Database.findOne('complaints', (item) => {
      return item.ticket_number && item.ticket_number.toUpperCase() === ticketNumber.trim().toUpperCase();
    });
  },

  create: (data) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `WST-${new Date().getFullYear()}-${randomSuffix}`;
    const newRecord = {
      ticket_number: ticketNumber,
      citizen_name: data.citizen_name || 'Anonymous Citizen',
      citizen_email: data.citizen_email || '',
      citizen_phone: data.citizen_phone || '',
      category: data.category || 'General Waste Issue',
      description: data.description || '',
      priority: data.priority || 'MEDIUM',
      zone_id: data.zone_id || null,
      zone_name: data.zone_name || 'Downtown Central',
      address: data.address || 'Curbside',
      latitude: data.latitude ? parseFloat(data.latitude) : 40.7128,
      longitude: data.longitude ? parseFloat(data.longitude) : -74.0060,
      photo_url: data.photo_url || null,
      status: COMPLAINT_STATUS.REPORTED,
      assigned_vehicle_id: null,
      assigned_driver_name: null,
      resolution_notes: null,
      resolution_photo_url: null,
      resolved_at: null
    };
    return Database.insert('complaints', newRecord);
  },

  updateStatus: (id, status, notes = '', resolutionPhoto = null) => {
    const updates = { status };
    if (notes) updates.resolution_notes = notes;
    if (resolutionPhoto) updates.resolution_photo_url = resolutionPhoto;
    if (status === COMPLAINT_STATUS.RESOLVED) {
      updates.resolved_at = new Date().toISOString();
    }
    return Database.updateById('complaints', id, updates);
  },

  assignVehicle: (id, vehicleId, driverName = '') => {
    return Database.updateById('complaints', id, {
      assigned_vehicle_id: vehicleId,
      assigned_driver_name: driverName,
      status: COMPLAINT_STATUS.ASSIGNED
    });
  },

  delete: (id) => {
    return Database.deleteById('complaints', id);
  }
};

module.exports = ComplaintModel;
