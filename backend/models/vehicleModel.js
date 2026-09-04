/**
 * Smart Waste Collection Management System - Vehicle Model
 */
const Database = require('../database/db');

const VehicleModel = {
  findAll: (filters = {}) => {
    return Database.find('vehicles', (item) => {
      if (filters.status && item.status !== filters.status) return false;
      if (filters.zone_id && item.assigned_zone_id !== filters.zone_id) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches = (
          (item.vehicle_number && item.vehicle_number.toLowerCase().includes(q)) ||
          (item.model && item.model.toLowerCase().includes(q)) ||
          (item.driver_name && item.driver_name.toLowerCase().includes(q)) ||
          (item.type && item.type.toLowerCase().includes(q))
        );
        if (!matches) return false;
      }
      return true;
    });
  },

  findById: (id) => {
    return Database.findById('vehicles', id);
  },

  create: (data) => {
    const newRecord = {
      vehicle_number: data.vehicle_number,
      model: data.model || 'Standard Collection Truck',
      type: data.type || 'Rear Loader Compactor',
      capacity_tons: parseFloat(data.capacity_tons || 10.0),
      current_load_tons: 0.0,
      fuel_percentage: parseInt(data.fuel_percentage || 100),
      status: data.status || 'AVAILABLE',
      driver_id: data.driver_id || null,
      driver_name: data.driver_name || 'Unassigned',
      assigned_zone_id: data.assigned_zone_id || null,
      current_lat: data.current_lat ? parseFloat(data.current_lat) : 40.7128,
      current_lng: data.current_lng ? parseFloat(data.current_lng) : -74.0060,
      last_maintenance_date: data.last_maintenance_date || new Date().toISOString().split('T')[0]
    };
    return Database.insert('vehicles', newRecord);
  },

  update: (id, updates) => {
    return Database.updateById('vehicles', id, updates);
  },

  assignDriver: (id, driverId, driverName) => {
    return Database.updateById('vehicles', id, {
      driver_id: driverId,
      driver_name: driverName
    });
  },

  updateLocationAndLoad: (id, lat, lng, loadTons, fuelPct) => {
    const updates = {};
    if (lat !== undefined) updates.current_lat = parseFloat(lat);
    if (lng !== undefined) updates.current_lng = parseFloat(lng);
    if (loadTons !== undefined) updates.current_load_tons = parseFloat(loadTons);
    if (fuelPct !== undefined) updates.fuel_percentage = parseInt(fuelPct);
    return Database.updateById('vehicles', id, updates);
  },

  delete: (id) => {
    return Database.deleteById('vehicles', id);
  }
};

module.exports = VehicleModel;
