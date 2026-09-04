/**
 * Vehicle Model - Data Layer for Municipal Fleet
 */
const db = require('../../config/database');
const { VEHICLE_TYPES, VEHICLE_STATUS } = require('./vehicle.types');

let vehicleCounter = 101;

class VehicleModel {
  static generateVehicleId() {
    const year = new Date().getFullYear();
    const count = vehicleCounter++;
    return `VEH-${year}-${count}`;
  }

  static async seedSampleVehicles() {
    const existing = await db.find('vehicles');
    if (existing && existing.length > 0) {
      vehicleCounter = existing.length + 101;
      return;
    }

    const initialVehicles = [
      {
        id: 'veh_seed_001',
        vehicleId: 'VEH-2026-101',
        vehicleNumber: 'METRO-TRK-101',
        vehicleType: VEHICLE_TYPES.GARBAGE_TRUCK,
        capacity: '12 Tons (Hydraulic Compactor)',
        status: VEHICLE_STATUS.ASSIGNED,
        currentArea: 'Downtown Central',
        driverId: 'usr_staff_001',
        driverName: 'Marcus Chen',
        completedServices: 142,
        assignmentHistory: [
          {
            id: 'asg_001',
            driverId: 'usr_staff_001',
            driverName: 'Marcus Chen',
            area: 'Downtown Central',
            assignedAt: '2026-09-01T07:00:00.000Z',
            notes: 'Assigned for Downtown Central daily commercial and residential route.'
          }
        ],
        createdAt: '2026-08-01T06:00:00.000Z',
        updatedAt: '2026-09-04T07:00:00.000Z'
      },
      {
        id: 'veh_seed_002',
        vehicleId: 'VEH-2026-102',
        vehicleNumber: 'METRO-RCY-102',
        vehicleType: VEHICLE_TYPES.RECYCLING_VEHICLE,
        capacity: '8.5 Tons (Dual Compartment)',
        status: VEHICLE_STATUS.AVAILABLE,
        currentArea: 'Metro North Residential',
        driverId: null,
        driverName: null,
        completedServices: 89,
        assignmentHistory: [
          {
            id: 'asg_002',
            driverId: 'usr_staff_001',
            driverName: 'Marcus Chen',
            area: 'Metro North Residential',
            assignedAt: '2026-08-25T08:00:00.000Z',
            notes: 'Completed bi-weekly recyclable materials collection run.'
          }
        ],
        createdAt: '2026-08-05T06:00:00.000Z',
        updatedAt: '2026-09-03T16:00:00.000Z'
      },
      {
        id: 'veh_seed_003',
        vehicleId: 'VEH-2026-103',
        vehicleNumber: 'METRO-MIN-103',
        vehicleType: VEHICLE_TYPES.MINI_TRUCK,
        capacity: '3.5 Tons (Eco Electric)',
        status: VEHICLE_STATUS.ON_ROUTE,
        currentArea: 'Green Valley Eco-District',
        driverId: 'usr_staff_001',
        driverName: 'Marcus Chen',
        completedServices: 64,
        assignmentHistory: [
          {
            id: 'asg_003',
            driverId: 'usr_staff_001',
            driverName: 'Marcus Chen',
            area: 'Green Valley Eco-District',
            assignedAt: '2026-09-04T08:00:00.000Z',
            notes: 'Active on narrow streets and eco-zone on-demand pickups.'
          }
        ],
        createdAt: '2026-08-10T06:00:00.000Z',
        updatedAt: '2026-09-04T08:30:00.000Z'
      },
      {
        id: 'veh_seed_004',
        vehicleId: 'VEH-2026-104',
        vehicleNumber: 'METRO-SPW-104',
        vehicleType: VEHICLE_TYPES.SPECIAL_WASTE_VEHICLE,
        capacity: '5.0 Tons (Hazardous & E-Waste Spec)',
        status: VEHICLE_STATUS.MAINTENANCE,
        currentArea: 'Industrial Harbor Yard',
        driverId: null,
        driverName: null,
        completedServices: 37,
        assignmentHistory: [
          {
            id: 'asg_004',
            driverId: 'usr_staff_001',
            driverName: 'Marcus Chen',
            area: 'Industrial Harbor',
            assignedAt: '2026-08-28T09:00:00.000Z',
            notes: 'Scheduled 50,000 km hydraulic suspension service and inspection.'
          }
        ],
        createdAt: '2026-08-15T06:00:00.000Z',
        updatedAt: '2026-09-03T11:00:00.000Z'
      }
    ];

    for (const v of initialVehicles) {
      await db.insert('vehicles', v);
    }
    vehicleCounter = 105;
  }

  static async create(data) {
    await this.seedSampleVehicles();
    const now = new Date().toISOString();
    const vehicleId = this.generateVehicleId();

    const record = {
      vehicleId,
      vehicleNumber: data.vehicleNumber.trim(),
      vehicleType: data.vehicleType,
      capacity: data.capacity.trim(),
      status: data.status || VEHICLE_STATUS.AVAILABLE,
      currentArea: data.currentArea || 'Central Depot',
      driverId: data.driverId || null,
      driverName: data.driverName || null,
      completedServices: 0,
      assignmentHistory: data.driverId ? [
        {
          id: `asg_${Date.now()}`,
          driverId: data.driverId,
          driverName: data.driverName || 'Assigned Driver',
          area: data.currentArea || 'Central Depot',
          assignedAt: now,
          notes: 'Initial driver assignment.'
        }
      ] : [],
      createdAt: now,
      updatedAt: now
    };

    return await db.insert('vehicles', record);
  }

  static async findAll(filters = {}) {
    await this.seedSampleVehicles();
    let vehicles = await db.find('vehicles');

    if (filters.status) {
      vehicles = vehicles.filter(v => v.status === filters.status);
    }
    if (filters.vehicleType) {
      vehicles = vehicles.filter(v => v.vehicleType === filters.vehicleType);
    }
    if (filters.currentArea) {
      vehicles = vehicles.filter(v => v.currentArea && v.currentArea.toLowerCase().includes(filters.currentArea.toLowerCase()));
    }
    if (filters.driverId) {
      vehicles = vehicles.filter(v => v.driverId === filters.driverId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      vehicles = vehicles.filter(v =>
        (v.vehicleId && v.vehicleId.toLowerCase().includes(q)) ||
        (v.vehicleNumber && v.vehicleNumber.toLowerCase().includes(q)) ||
        (v.vehicleType && v.vehicleType.toLowerCase().includes(q)) ||
        (v.currentArea && v.currentArea.toLowerCase().includes(q)) ||
        (v.driverName && v.driverName.toLowerCase().includes(q))
      );
    }

    vehicles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return vehicles;
  }

  static async findById(id) {
    await this.seedSampleVehicles();
    const vehicles = await db.find('vehicles');
    return vehicles.find(v => v.id === id || v.vehicleId === id) || null;
  }

  static async findByVehicleNumber(vehicleNumber) {
    await this.seedSampleVehicles();
    const vehicles = await db.find('vehicles');
    return vehicles.find(v => v.vehicleNumber.toLowerCase() === vehicleNumber.toLowerCase()) || null;
  }

  static async update(id, updates) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // If driver was reassigned, append to assignment history
    if (updates.driverId !== undefined && updates.driverId !== existing.driverId) {
      const history = existing.assignmentHistory || [];
      if (updates.driverId) {
        history.push({
          id: `asg_${Date.now()}`,
          driverId: updates.driverId,
          driverName: updates.driverName || 'Assigned Driver',
          area: updates.currentArea || existing.currentArea,
          assignedAt: new Date().toISOString(),
          notes: updates.assignmentNotes || 'Driver reassigned.'
        });
      }
      updatedData.assignmentHistory = history;
    }

    return await db.update('vehicles', existing.id, updatedData);
  }

  static async delete(id) {
    const existing = await this.findById(id);
    if (!existing) return false;
    return await db.delete('vehicles', existing.id);
  }

  static async incrementCompletedServices(id) {
    const existing = await this.findById(id);
    if (!existing) return null;
    const completedServices = (existing.completedServices || 0) + 1;
    return await db.update('vehicles', existing.id, { completedServices, updatedAt: new Date().toISOString() });
  }
}

VehicleModel.seedSampleVehicles();

module.exports = VehicleModel;
