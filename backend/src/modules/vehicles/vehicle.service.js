/**
 * Vehicle Service - Business Logic Layer with Operational Rules
 */
const VehicleModel = require('./vehicle.model');
const { VEHICLE_STATUS } = require('./vehicle.types');

class VehicleService {
  static async createVehicle(data) {
    const existing = await VehicleModel.findByVehicleNumber(data.vehicleNumber);
    if (existing) {
      const err = new Error(`A vehicle with registration number "${data.vehicleNumber}" already exists.`);
      err.statusCode = 409;
      throw err;
    }

    return await VehicleModel.create(data);
  }

  static async getVehicles(filters = {}) {
    const vehicles = await VehicleModel.findAll(filters);

    // Compute fleet overview statistics
    const stats = {
      total: vehicles.length,
      available: vehicles.filter(v => v.status === VEHICLE_STATUS.AVAILABLE).length,
      assigned: vehicles.filter(v => v.status === VEHICLE_STATUS.ASSIGNED).length,
      onRoute: vehicles.filter(v => v.status === VEHICLE_STATUS.ON_ROUTE).length,
      maintenance: vehicles.filter(v => v.status === VEHICLE_STATUS.MAINTENANCE).length,
      inactive: vehicles.filter(v => v.status === VEHICLE_STATUS.INACTIVE).length,
    };

    return { vehicles, stats };
  }

  static async getVehicleById(id) {
    const vehicle = await VehicleModel.findById(id);
    if (!vehicle) {
      const err = new Error(`Vehicle "${id}" not found.`);
      err.statusCode = 404;
      throw err;
    }
    return vehicle;
  }

  static async updateVehicle(id, updates) {
    const vehicle = await VehicleModel.findById(id);
    if (!vehicle) {
      const err = new Error(`Vehicle "${id}" not found.`);
      err.statusCode = 404;
      throw err;
    }

    if (updates.vehicleNumber && updates.vehicleNumber.toLowerCase() !== vehicle.vehicleNumber.toLowerCase()) {
      const duplicate = await VehicleModel.findByVehicleNumber(updates.vehicleNumber);
      if (duplicate && duplicate.id !== vehicle.id) {
        const err = new Error(`Vehicle number "${updates.vehicleNumber}" is already in use.`);
        err.statusCode = 409;
        throw err;
      }
    }

    // Phase 7 Rule: Vehicle cannot be assigned when in Maintenance or Inactive
    const effectiveStatus = updates.status || vehicle.status;
    if (updates.driverId && (effectiveStatus === VEHICLE_STATUS.MAINTENANCE || effectiveStatus === VEHICLE_STATUS.INACTIVE)) {
      const err = new Error(`Cannot assign driver to vehicle "${vehicle.vehicleNumber}" while its status is "${effectiveStatus}".`);
      err.statusCode = 400;
      throw err;
    }

    return await VehicleModel.update(id, updates);
  }

  static async updateVehicleStatus(id, status, notes) {
    const vehicle = await VehicleModel.findById(id);
    if (!vehicle) {
      const err = new Error(`Vehicle "${id}" not found.`);
      err.statusCode = 404;
      throw err;
    }

    // Cannot take offline if actively on route
    if ((status === VEHICLE_STATUS.MAINTENANCE || status === VEHICLE_STATUS.INACTIVE) && vehicle.status === VEHICLE_STATUS.ON_ROUTE) {
      const err = new Error(`Cannot set vehicle "${vehicle.vehicleNumber}" to ${status} while it is currently On Route.`);
      err.statusCode = 400;
      throw err;
    }

    const updates = { status };
    if (notes) {
      updates.statusNotes = notes;
    }

    return await VehicleModel.update(id, updates);
  }

  static async deleteVehicle(id) {
    const vehicle = await VehicleModel.findById(id);
    if (!vehicle) {
      const err = new Error(`Vehicle "${id}" not found.`);
      err.statusCode = 404;
      throw err;
    }

    if (vehicle.status === VEHICLE_STATUS.ON_ROUTE) {
      const err = new Error(`Cannot decommission vehicle "${vehicle.vehicleId || vehicle.vehicleNumber}" while it is active on a route.`);
      err.statusCode = 400;
      throw err;
    }

    return await VehicleModel.delete(id);
  }
}

module.exports = VehicleService;
