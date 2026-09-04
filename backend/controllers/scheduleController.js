/**
 * Smart Waste Collection Management System - Schedule Controller
 */
const ScheduleModel = require('../models/scheduleModel');
const VehicleModel = require('../models/vehicleModel');
const ZoneModel = require('../models/zoneModel');

const ScheduleController = {
  // GET /api/schedules
  getAll: (req, res, next) => {
    try {
      const { zone_id, vehicle_id, day_of_week, status } = req.query;
      const list = ScheduleModel.findAll({ zone_id, vehicle_id, day_of_week, status });
      res.json({ success: true, count: list.length, data: list });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/schedules/:id
  getOne: (req, res, next) => {
    try {
      const { id } = req.params;
      const schedule = ScheduleModel.findById(id);
      if (!schedule) {
        return res.status(404).json({ success: false, message: 'Schedule not found' });
      }
      res.json({ success: true, data: schedule });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/schedules
  create: (req, res, next) => {
    try {
      const { zone_id, vehicle_id, collection_type, day_of_week, start_time, end_time, frequency, route_checkpoints } = req.body;

      const zone = ZoneModel.findById(zone_id);
      const vehicle = vehicle_id ? VehicleModel.findById(vehicle_id) : null;

      const newSchedule = ScheduleModel.create({
        zone_id,
        zone_name: zone ? zone.name : 'Sector',
        vehicle_id,
        vehicle_number: vehicle ? vehicle.vehicle_number : 'Unassigned',
        collection_type,
        day_of_week,
        start_time,
        end_time,
        frequency,
        route_checkpoints
      });

      res.status(201).json({ success: true, message: 'Schedule created', data: newSchedule });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/schedules/:id
  update: (req, res, next) => {
    try {
      const { id } = req.params;
      const updated = ScheduleModel.update(id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Schedule not found' });
      }
      res.json({ success: true, message: 'Schedule updated', data: updated });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/schedules/:id/checkpoint
  updateCheckpoint: (req, res, next) => {
    try {
      const { id } = req.params;
      const { checkpoint_index, status } = req.body;

      const updated = ScheduleModel.updateCheckpointStatus(id, parseInt(checkpoint_index), status);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Schedule or checkpoint not found' });
      }
      res.json({ success: true, message: 'Checkpoint status updated', data: updated });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/schedules/:id
  delete: (req, res, next) => {
    try {
      const { id } = req.params;
      const ok = ScheduleModel.delete(id);
      if (!ok) {
        return res.status(404).json({ success: false, message: 'Schedule not found' });
      }
      res.json({ success: true, message: 'Schedule deleted' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ScheduleController;
