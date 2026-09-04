/**
 * Vehicle Controller - Request Handling Layer
 */
const VehicleService = require('./vehicle.service');
const { successResponse, errorResponse } = require('../../utils/response');

const VehicleController = {
  create: async (req, res, next) => {
    try {
      const vehicle = await VehicleService.createVehicle(req.body);
      return successResponse(res, vehicle, 'Vehicle registered successfully into fleet.', 201);
    } catch (err) {
      next(err);
    }
  },

  getAll: async (req, res, next) => {
    try {
      const { status, vehicleType, currentArea, driverId, search } = req.query;
      const { vehicles, stats } = await VehicleService.getVehicles({
        status,
        vehicleType,
        currentArea,
        driverId,
        search
      });
      return res.status(200).json({
        success: true,
        message: 'Vehicles retrieved successfully.',
        data: vehicles,
        stats
      });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const vehicle = await VehicleService.getVehicleById(req.params.id);
      return successResponse(res, vehicle, 'Vehicle details retrieved.');
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const updated = await VehicleService.updateVehicle(req.params.id, req.body);
      return successResponse(res, updated, 'Vehicle updated successfully.');
    } catch (err) {
      next(err);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const { status, notes } = req.body;
      const updated = await VehicleService.updateVehicleStatus(req.params.id, status, notes);
      return successResponse(res, updated, `Vehicle status updated to "${status}".`);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await VehicleService.deleteVehicle(req.params.id);
      return successResponse(res, null, 'Vehicle removed from fleet successfully.');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = VehicleController;
