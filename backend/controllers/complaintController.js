/**
 * Smart Waste Collection Management System - Complaint Controller
 */
const ComplaintModel = require('../models/complaintModel');
const VehicleModel = require('../models/vehicleModel');
const AwsS3Service = require('../services/awsS3Service');
const AwsSnsService = require('../services/awsSnsService');
const { COMPLAINT_STATUS } = require('../config/constants');

const ComplaintController = {
  // GET /api/complaints
  getAll: (req, res, next) => {
    try {
      const { status, zone_id, priority, search } = req.query;
      const list = ComplaintModel.findAll({ status, zone_id, priority, search });
      res.json({ success: true, count: list.length, data: list });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/complaints/:idOrTicket
  getOne: (req, res, next) => {
    try {
      const { idOrTicket } = req.params;
      let record = ComplaintModel.findById(idOrTicket);
      if (!record) {
        record = ComplaintModel.findByTicketNumber(idOrTicket);
      }
      if (!record) {
        return res.status(404).json({ success: false, message: 'Complaint ticket not found' });
      }
      res.json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/complaints (supports multipart image file)
  create: async (req, res, next) => {
    try {
      const { citizen_name, citizen_email, citizen_phone, category, description, priority, zone_id, zone_name, address, latitude, longitude } = req.body;

      let photo_url = req.body.photo_url || null;

      // If an image was uploaded via multipart form
      if (req.file) {
        const uploadResult = await AwsS3Service.uploadFile(req.file, 'complaints');
        if (uploadResult && uploadResult.url) {
          photo_url = uploadResult.url;
        }
      }

      const newComplaint = ComplaintModel.create({
        citizen_name,
        citizen_email,
        citizen_phone,
        category,
        description,
        priority,
        zone_id,
        zone_name,
        address,
        latitude,
        longitude,
        photo_url
      });

      // Dispatch real-time alert via AWS SNS / Notification Engine
      await AwsSnsService.notifyComplaintCreated(newComplaint);

      res.status(201).json({
        success: true,
        message: 'Complaint submitted successfully',
        data: newComplaint
      });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/complaints/:id/status
  updateStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, resolution_notes } = req.body;

      let resolution_photo_url = req.body.resolution_photo_url || null;
      if (req.file) {
        const uploadResult = await AwsS3Service.uploadFile(req.file, 'resolutions');
        if (uploadResult && uploadResult.url) {
          resolution_photo_url = uploadResult.url;
        }
      }

      const updated = ComplaintModel.updateStatus(id, status, resolution_notes, resolution_photo_url);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Complaint not found' });
      }

      if (status === COMPLAINT_STATUS.RESOLVED) {
        await AwsSnsService.notifyComplaintResolved(updated);
      }

      res.json({ success: true, message: `Status updated to ${status}`, data: updated });
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/complaints/:id/assign
  assignVehicle: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { vehicle_id } = req.body;

      const vehicle = VehicleModel.findById(vehicle_id);
      if (!vehicle) {
        return res.status(400).json({ success: false, message: 'Vehicle not found' });
      }

      const updated = ComplaintModel.assignVehicle(id, vehicle.id, vehicle.driver_name || vehicle.vehicle_number);

      // Alert driver / dispatch team
      await AwsSnsService.publishAlert({
        recipientRole: 'DRIVER',
        title: `Vehicle ${vehicle.vehicle_number} Assigned to Ticket`,
        message: `Dispatch assigned ${vehicle.vehicle_number} to resolve complaint: ${updated.ticket_number} at ${updated.address}.`,
        type: 'DISPATCH',
        relatedId: id
      });

      res.json({ success: true, message: 'Vehicle assigned successfully', data: updated });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/complaints/:id
  delete: (req, res, next) => {
    try {
      const { id } = req.params;
      const ok = ComplaintModel.delete(id);
      if (!ok) {
        return res.status(404).json({ success: false, message: 'Complaint not found' });
      }
      res.json({ success: true, message: 'Complaint deleted' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ComplaintController;
