/**
 * Pickup Controller - Handles HTTP requests
 */
const PickupService = require('./pickup.service');
const { successResponse, errorResponse } = require('../../utils/response');

class PickupController {
  /**
   * POST /api/pickups
   */
  static async createPickup(req, res, next) {
    try {
      const pickup = await PickupService.createPickup(req.user, req.body);
      return successResponse(res, pickup, 'Pickup request submitted successfully.', 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/pickups
   */
  static async getPickups(req, res, next) {
    try {
      const { wasteType, status, search } = req.query;
      const pickups = await PickupService.getPickups({ wasteType, status, search }, req.user);
      return successResponse(res, pickups, 'Pickup requests retrieved successfully.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/pickups/:id
   */
  static async getPickupById(req, res, next) {
    try {
      const { id } = req.params;
      const pickup = await PickupService.getPickupById(id, req.user);
      if (!pickup) {
        return errorResponse(res, `Pickup request '${id}' not found.`, 404);
      }
      return successResponse(res, pickup, 'Pickup request details retrieved.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/pickups/:id
   */
  static async updatePickup(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await PickupService.updatePickup(id, req.body, req.user);
      if (!updated) {
        return errorResponse(res, `Pickup request '${id}' not found.`, 404);
      }
      return successResponse(res, updated, 'Pickup request updated successfully.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/pickups/:id/status
   */
  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await PickupService.updateStatus(id, status, req.user);
      if (!updated) {
        return errorResponse(res, `Pickup request '${id}' not found.`, 404);
      }
      return successResponse(res, updated, `Pickup request status updated to ${status}.`);
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/pickups/:id
   */
  static async deletePickup(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await PickupService.deletePickup(id, req.user);
      if (!deleted) {
        return errorResponse(res, `Pickup request '${id}' could not be deleted.`, 400);
      }
      return successResponse(res, { id }, 'Pickup request removed successfully.');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PickupController;
