/**
 * Smart Waste Collection Management System - Vehicle & Fleet Controller
 */
const VehicleModel = require('../models/vehicleModel');
const UserModel = require('../models/userModel');

const VehicleController = {
  // GET /api/vehicles
  getAll: (req, res, next) => {
    try {
      const { status, zone_id, search } = req.query;
      const list = VehicleModel.findAll({ status, zone_id, search });
      res.json({ success: true, count: list.length, data: list });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/vehicles/:id
  getOne: (req, res, next) => {
    try {
      const { id } = req.params;
      const vehicle = VehicleModel.findById(id);
      if (!vehicle) {
        return res.status(404).json({ success: false, message: 'Vehicle not found' });
      }
      res.json({ success: true, data: vehicle });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/vehicles
  create: (req, res, next) => {
    try {
      const { vehicle_number, model, type, capacity_tons, assigned_zone_id, driver_id, driver_name, fuel_percentage } = req.body;

      if (!vehicle_number) {
        return res.status(400).json({ success: false, message: 'Vehicle number is required' });
      }

      const newVehicle = VehicleModel.create({
        vehicle_number,
        model,
        type,
        capacity_tons,
        assigned_zone_id,
        driver_id,
        driver_name,
        fuel_percentage
      });

      res.status(201).json({ success: true, message: 'Vehicle added to fleet', data: newVehicle });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/vehicles/:id
  update: (req, res, next) => {
    try {
      const { id } = req.params;
      const updated = VehicleModel.update(id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Vehicle not found' });
      }
      res.json({ success: true, message: 'Vehicle updated', data: updated });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/vehicles/:id/assign-driver
  assignDriver: (req, res, next) => {
    try {
      const { id } = req.params;
      const { driver_id, driver_name } = req.body;

      let name = driver_name;
      if (driver_id && !name) {
        const user = UserModel.findById(driver_id);
        if (user) name = user.name;
      }

      const updated = VehicleModel.assignDriver(id, driver_id, name || 'Assigned Driver');
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Vehicle not found' });
      }

      res.json({ success: true, message: 'Driver assigned to vehicle', data: updated });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/vehicles/:id/telemetry (Simulated or GPS IoT ping)
  updateTelemetry: (req, res, next) => {
    try {
      const { id } = req.params;
      const { lat, lng, load_tons, fuel_pct } = req.body;

      const updated = VehicleModel.updateLocationAndLoad(id, lat, lng, load_tons, fuel_pct);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Vehicle not found' });
      }
      res.json({ success: true, message: 'Telemetry updated', data: updated });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/vehicles/:id
  delete: (req, res, next) => {
    try {
      const { id } = req.params;
      const ok = VehicleModel.delete(id);
      if (!ok) {
        return res.status(404).json({ success: false, message: 'Vehicle not found' });
      }
      res.json({ success: true, message: 'Vehicle decommissioned' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = VehicleController;
