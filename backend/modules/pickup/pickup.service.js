/**
 * Pickup Service - Business Logic
 */
const PickupModel = require('./pickup.model');
const { PICKUP_STATUS } = require('./pickup.types');
const { ROLES } = require('../../config/constants');

class PickupService {
  /**
   * Citizen files a new waste pickup request
   */
  static async createPickup(user, data) {
    const pickupData = {
      citizenId: user.id,
      citizenName: user.name,
      citizenEmail: user.email,
      citizenPhone: user.phone || '',
      wasteType: data.wasteType,
      estimatedWasteQuantity: data.estimatedWasteQuantity || 'Standard',
      pickupAddress: data.pickupAddress.trim(),
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime.trim(),
      description: data.description ? data.description.trim() : ''
    };

    return await PickupModel.create(pickupData);
  }

  /**
   * Retrieve pickups with filtering (supports citizen-specific or all)
   */
  static async getPickups(filters = {}, currentUser) {
    const queryFilters = { ...filters };

    // Citizens only see their own requests
    if (currentUser.role === ROLES.CITIZEN) {
      queryFilters.citizenId = currentUser.id;
    }

    return await PickupModel.findAll(queryFilters);
  }

  /**
   * Get single pickup by ID or requestId (e.g. REQ-2026-1001)
   */
  static async getPickupById(id, currentUser) {
    const pickup = await PickupModel.findById(id);
    if (!pickup) return null;

    if (currentUser.role === ROLES.CITIZEN && pickup.citizenId !== currentUser.id) {
      const err = new Error('Access denied: You can only view your own pickup requests.');
      err.statusCode = 403;
      throw err;
    }

    return pickup;
  }

  /**
   * Update pickup details or assign vehicle/staff (Admin)
   */
  static async updatePickup(id, updates, currentUser) {
    const existing = await PickupModel.findById(id);
    if (!existing) return null;

    const sanitized = {};

    if (updates.pickupAddress) sanitized.pickupAddress = updates.pickupAddress.trim();
    if (updates.preferredDate) sanitized.preferredDate = updates.preferredDate;
    if (updates.preferredTime) sanitized.preferredTime = updates.preferredTime;
    if (updates.estimatedWasteQuantity) sanitized.estimatedWasteQuantity = updates.estimatedWasteQuantity;
    if (updates.description !== undefined) sanitized.description = updates.description;

    // Vehicle and Staff Assignment
    if (updates.assignedVehicle !== undefined) sanitized.assignedVehicle = updates.assignedVehicle;
    if (updates.assignedStaff !== undefined) sanitized.assignedStaff = updates.assignedStaff;

    // Auto-transition to Assigned or Scheduled if crew allocated
    if (sanitized.assignedStaff && sanitized.assignedVehicle) {
      sanitized.status = PICKUP_STATUS.ASSIGNED;
    }

    return await PickupModel.update(existing.id, sanitized);
  }

  /**
   * Update pickup status (Approve, Schedule, Complete, Cancel)
   */
  static async updateStatus(id, newStatus, currentUser) {
    const existing = await PickupModel.findById(id);
    if (!existing) return null;

    // Citizen can only cancel before assignment (i.e. while Pending or Approved)
    if (currentUser.role === ROLES.CITIZEN) {
      if (existing.citizenId !== currentUser.id) {
        const err = new Error('Access denied.');
        err.statusCode = 403;
        throw err;
      }
      if (newStatus !== PICKUP_STATUS.CANCELLED) {
        const err = new Error('Citizens are only permitted to cancel pending requests.');
        err.statusCode = 403;
        throw err;
      }
      if (existing.status === PICKUP_STATUS.ASSIGNED || existing.status === PICKUP_STATUS.COMPLETED) {
        const err = new Error('Cannot cancel request after crew assignment or service completion.');
        err.statusCode = 400;
        throw err;
      }
    }

    return await PickupModel.update(existing.id, { status: newStatus });
  }

  /**
   * Delete or cancel pickup request
   */
  static async deletePickup(id, currentUser) {
    const existing = await PickupModel.findById(id);
    if (!existing) return false;

    if (currentUser.role === ROLES.CITIZEN) {
      if (existing.citizenId !== currentUser.id) {
        const err = new Error('Access denied.');
        err.statusCode = 403;
        throw err;
      }
      if (existing.status === PICKUP_STATUS.ASSIGNED || existing.status === PICKUP_STATUS.COMPLETED) {
        const err = new Error('Cannot delete pickup request after driver assignment.');
        err.statusCode = 400;
        throw err;
      }
    }

    return await PickupModel.delete(existing.id);
  }
}

module.exports = PickupService;
