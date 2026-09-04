/**
 * Smart Waste Collection Management System - Pickup Request Controller
 */
const PickupModel = require('../models/pickupModel');
const VehicleModel = require('../models/vehicleModel');
const AwsS3Service = require('../services/awsS3Service');
const AwsSnsService = require('../services/awsSnsService');
const { PICKUP_STATUS } = require('../config/constants');

const PickupController = {
  // GET /api/pickups
  getAll: (req, res, next) => {
    try {
      const { status, waste_type, search } = req.query;
      const list = PickupModel.findAll({ status, waste_type, search });
      res.json({ success: true, count: list.length, data: list });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/pickups/:idOrNumber
  getOne: (req, res, next) => {
    try {
      const { idOrNumber } = req.params;
      let record = PickupModel.findById(idOrNumber);
      if (!record) {
        record = PickupModel.findByRequestNumber(idOrNumber);
      }
      if (!record) {
        return res.status(404).json({ success: false, message: 'Pickup request not found' });
      }
      res.json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/pickups (supports multipart image file)
  create: async (req, res, next) => {
    try {
      const { citizen_name, citizen_email, citizen_phone, waste_type, estimated_volume, address, zone_id, latitude, longitude, preferred_date, preferred_timeslot } = req.body;

      let photo_url = req.body.photo_url || null;
      if (req.file) {
        const uploadResult = await AwsS3Service.uploadFile(req.file, 'pickups');
        if (uploadResult && uploadResult.url) {
          photo_url = uploadResult.url;
        }
      }

      const newPickup = PickupModel.create({
        citizen_name,
        citizen_email,
        citizen_phone,
        waste_type,
        estimated_volume,
        address,
        zone_id,
        latitude,
        longitude,
        preferred_date,
        preferred_timeslot,
        photo_url
      });

      // Dispatch alert to admin
      await AwsSnsService.publishAlert({
        recipientRole: 'ADMIN',
        title: `Special Pickup Request: ${newPickup.request_number}`,
        message: `${newPickup.citizen_name} requested ${newPickup.waste_type} collection on ${newPickup.preferred_date}.`,
        type: 'DISPATCH',
        relatedId: newPickup.id
      });

      res.status(201).json({
        success: true,
        message: 'Special pickup request submitted successfully',
        data: newPickup
      });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/pickups/:id/status
  updateStatus: (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const updated = PickupModel.updateStatus(id, status, notes);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Pickup request not found' });
      }

      res.json({ success: true, message: `Status updated to ${status}`, data: updated });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/pickups/:id/schedule
  schedulePickup: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { vehicle_id, scheduled_date, scheduled_time, notes } = req.body;

      const vehicle = VehicleModel.findById(vehicle_id);
      if (!vehicle) {
        return res.status(400).json({ success: false, message: 'Vehicle not found' });
      }

      const updated = PickupModel.schedulePickup(
        id,
        vehicle.id,
        vehicle.vehicle_number,
        scheduled_date,
        scheduled_time,
        notes
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Pickup request not found' });
      }

      await AwsSnsService.notifyPickupScheduled(updated);

      res.json({ success: true, message: 'Pickup successfully scheduled and vehicle dispatched', data: updated });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/pickups/:id
  delete: (req, res, next) => {
    try {
      const { id } = req.params;
      const ok = PickupModel.delete(id);
      if (!ok) {
        return res.status(404).json({ success: false, message: 'Pickup request not found' });
      }
      res.json({ success: true, message: 'Pickup request deleted' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = PickupController;
