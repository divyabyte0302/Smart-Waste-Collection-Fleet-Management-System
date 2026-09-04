/**
 * Pickup Model - Persistence Layer with Auto-ID Generation
 */
const db = require('../../config/database');
const { WASTE_TYPES, PICKUP_STATUS } = require('./pickup.types');

let pickupCounter = 1001;

class PickupModel {
  /**
   * Generate human-friendly unique request ID: REQ-2026-XXXX
   */
  static generateRequestId() {
    const year = new Date().getFullYear();
    const count = pickupCounter++;
    return `REQ-${year}-${count}`;
  }

  /**
   * Seed initial sample pickup requests if store is empty
   */
  static async seedSamplePickups() {
    const existing = await db.find('pickups');
    if (existing && existing.length > 0) {
      pickupCounter = existing.length + 1001;
      return;
    }

    const initialPickups = [
      {
        id: 'pkp_seed_001',
        requestId: 'REQ-2026-1001',
        citizenId: 'usr_citizen_001',
        citizenName: 'Sophia Martinez',
        citizenEmail: 'citizen@smartwaste.gov',
        citizenPhone: '+1 (555) 234-5678',
        wasteType: WASTE_TYPES.ELECTRONIC,
        estimatedWasteQuantity: '3-5 Items (Medium)',
        pickupAddress: '742 Evergreen Terrace, Metro City',
        preferredDate: '2026-09-06',
        preferredTime: '09:00 AM - 12:00 PM',
        description: 'Old CRT monitor, 2 desktop tower units, and microwave oven for e-waste recycling.',
        status: PICKUP_STATUS.SCHEDULED,
        assignedVehicle: 'TRK-103 (Electric Mini)',
        assignedStaff: 'Marcus Chen',
        createdAt: '2026-09-02T08:00:00.000Z',
        updatedAt: '2026-09-03T10:00:00.000Z'
      },
      {
        id: 'pkp_seed_002',
        requestId: 'REQ-2026-1002',
        citizenId: 'usr_citizen_001',
        citizenName: 'Sophia Martinez',
        citizenEmail: 'citizen@smartwaste.gov',
        citizenPhone: '+1 (555) 234-5678',
        wasteType: WASTE_TYPES.BULK,
        estimatedWasteQuantity: '1 Large Item (Sofa)',
        pickupAddress: '742 Evergreen Terrace, Metro City',
        preferredDate: '2026-09-08',
        preferredTime: '01:00 PM - 04:00 PM',
        description: 'Three-seater living room fabric couch replacement.',
        status: PICKUP_STATUS.PENDING,
        assignedVehicle: null,
        assignedStaff: null,
        createdAt: '2026-09-04T07:30:00.000Z',
        updatedAt: '2026-09-04T07:30:00.000Z'
      },
      {
        id: 'pkp_seed_003',
        requestId: 'REQ-2026-1003',
        citizenId: 'usr_citizen_001',
        citizenName: 'Sophia Martinez',
        citizenEmail: 'citizen@smartwaste.gov',
        citizenPhone: '+1 (555) 234-5678',
        wasteType: WASTE_TYPES.GARDEN,
        estimatedWasteQuantity: '6-8 Heavy Bags',
        pickupAddress: '742 Evergreen Terrace, Metro City',
        preferredDate: '2026-09-01',
        preferredTime: '08:00 AM - 11:00 AM',
        description: 'Hedge trimmings, palm fronds, and garden pruning debris.',
        status: PICKUP_STATUS.COMPLETED,
        assignedVehicle: 'TRK-101 (Compactor)',
        assignedStaff: 'Marcus Chen',
        createdAt: '2026-08-30T09:00:00.000Z',
        updatedAt: '2026-09-01T11:15:00.000Z'
      }
    ];

    for (const p of initialPickups) {
      await db.insert('pickups', p);
    }
    pickupCounter = 1004;
  }

  static async create(data) {
    await this.seedSamplePickups();
    const now = new Date().toISOString();
    const requestId = this.generateRequestId();

    const record = {
      requestId,
      citizenId: data.citizenId,
      citizenName: data.citizenName || 'Citizen',
      citizenEmail: data.citizenEmail || '',
      citizenPhone: data.citizenPhone || '',
      wasteType: data.wasteType || WASTE_TYPES.HOUSEHOLD,
      estimatedWasteQuantity: data.estimatedWasteQuantity || 'Standard',
      pickupAddress: data.pickupAddress,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      description: data.description || '',
      status: PICKUP_STATUS.PENDING,
      assignedVehicle: null,
      assignedStaff: null,
      createdAt: now,
      updatedAt: now
    };

    return await db.insert('pickups', record);
  }

  static async findAll(filters = {}) {
    await this.seedSamplePickups();
    let pickups = await db.find('pickups');

    if (filters.citizenId) {
      pickups = pickups.filter(p => p.citizenId === filters.citizenId);
    }
    if (filters.wasteType) {
      pickups = pickups.filter(p => p.wasteType === filters.wasteType);
    }
    if (filters.status) {
      pickups = pickups.filter(p => p.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      pickups = pickups.filter(p =>
        (p.requestId && p.requestId.toLowerCase().includes(q)) ||
        (p.pickupAddress && p.pickupAddress.toLowerCase().includes(q)) ||
        (p.citizenName && p.citizenName.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    pickups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return pickups;
  }

  static async findById(id) {
    await this.seedSamplePickups();
    const pickups = await db.find('pickups');
    return pickups.find(p => p.id === id || p.requestId === id) || null;
  }

  static async update(id, updates) {
    const existing = await this.findById(id);
    if (!existing) return null;
    return await db.update('pickups', existing.id, updates);
  }

  static async delete(id) {
    const existing = await this.findById(id);
    if (!existing) return false;
    return await db.delete('pickups', existing.id);
  }
}

PickupModel.seedSamplePickups();

module.exports = PickupModel;
