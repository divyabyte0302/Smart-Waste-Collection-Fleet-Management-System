/**
 * Schedule Model - Data Layer for Routes & Schedules
 */
const db = require('../../config/database');
const { SCHEDULE_STATUS, SCHEDULE_WASTE_TYPES } = require('./schedule.types');

let scheduleCounter = 1001;

class ScheduleModel {
  static generateScheduleId() {
    const year = new Date().getFullYear();
    const count = scheduleCounter++;
    return `SCH-${year}-${count}`;
  }

  static async seedEnhancedSchedules() {
    const existing = await db.find('schedules');
    if (existing && existing.length > 0 && existing[0].scheduleId) {
      scheduleCounter = existing.length + 1001;
      return;
    }

    // Seed enhanced schedules if not present
    const enhancedSeed = [
      {
        id: 'sch_seed_001',
        scheduleId: 'SCH-2026-1001',
        area: 'Downtown Central',
        zone: 'Downtown Central',
        collectionDate: '2026-09-07',
        startTime: '07:00 AM',
        endTime: '11:30 AM',
        wasteType: SCHEDULE_WASTE_TYPES.ORGANIC,
        collectionType: 'Organic Waste',
        vehicleId: 'TRK-101 (Compactor)',
        staffId: 'usr_staff_001',
        staffName: 'Marcus Chen',
        assignedStaffId: 'usr_staff_001',
        assignedStaffName: 'Marcus Chen',
        status: SCHEDULE_STATUS.COMPLETED,
        checkpoints: ['Broadway Market', 'Civic Center Plaza', 'Financial Towers'],
        createdAt: '2026-09-01T06:00:00.000Z',
        updatedAt: '2026-09-01T11:45:00.000Z'
      },
      {
        id: 'sch_seed_002',
        scheduleId: 'SCH-2026-1002',
        area: 'Metro North Residential',
        zone: 'Metro North Residential',
        collectionDate: '2026-09-09',
        startTime: '08:00 AM',
        endTime: '01:00 PM',
        wasteType: SCHEDULE_WASTE_TYPES.RECYCLABLE,
        collectionType: 'Recyclable Materials',
        vehicleId: 'TRK-102 (Recycler)',
        staffId: 'usr_staff_001',
        staffName: 'Marcus Chen',
        assignedStaffId: 'usr_staff_001',
        assignedStaffName: 'Marcus Chen',
        status: SCHEDULE_STATUS.ACTIVE,
        checkpoints: ['Maplewood Avenue', 'North Park School', 'Highland Ridge'],
        createdAt: '2026-09-02T06:00:00.000Z',
        updatedAt: '2026-09-04T08:30:00.000Z'
      },
      {
        id: 'sch_seed_003',
        scheduleId: 'SCH-2026-1003',
        area: 'Green Valley Eco-District',
        zone: 'Green Valley Eco-District',
        collectionDate: '2026-09-11',
        startTime: '09:00 AM',
        endTime: '02:00 PM',
        wasteType: SCHEDULE_WASTE_TYPES.ELECTRONIC,
        collectionType: 'Electronic & Bulky Waste',
        vehicleId: 'TRK-103 (Electric Mini)',
        staffId: 'usr_staff_001',
        staffName: 'Marcus Chen',
        assignedStaffId: 'usr_staff_001',
        assignedStaffName: 'Marcus Chen',
        status: SCHEDULE_STATUS.SCHEDULED,
        checkpoints: ['Pine Grove Village', 'Eco Hub Community Center'],
        createdAt: '2026-09-03T06:00:00.000Z',
        updatedAt: '2026-09-03T06:00:00.000Z'
      }
    ];

    for (const s of enhancedSeed) {
      await db.insert('schedules', s);
    }
    scheduleCounter = 1004;
  }

  static async create(data) {
    await this.seedEnhancedSchedules();
    const now = new Date().toISOString();
    const scheduleId = this.generateScheduleId();

    const assignedVehicle = data.assignedVehicle || data.vehicleId || data.vehicleNumber || 'TRK-101';
    const assignedDriver = data.assignedDriver || data.driverName || data.staffName || data.assignedStaffName || 'Assigned Crew';
    const assignedStaffId = data.staffId || data.assignedStaffId || 'usr_staff_001';

    const record = {
      scheduleId,
      area: data.area || data.zone || 'Metro District',
      zone: data.area || data.zone || 'Metro District',
      collectionDate: data.collectionDate || new Date().toISOString().split('T')[0],
      startTime: data.startTime || '08:00 AM',
      endTime: data.endTime || '12:00 PM',
      wasteType: data.wasteType || data.collectionType || SCHEDULE_WASTE_TYPES.HOUSEHOLD,
      collectionType: data.wasteType || data.collectionType || SCHEDULE_WASTE_TYPES.HOUSEHOLD,
      vehicleId: assignedVehicle,
      vehicleNumber: assignedVehicle,
      assignedVehicle: assignedVehicle,
      staffId: assignedStaffId,
      staffName: assignedDriver,
      assignedStaffId: assignedStaffId,
      assignedStaffName: assignedDriver,
      assignedDriver: assignedDriver,
      status: data.status || SCHEDULE_STATUS.SCHEDULED,
      checkpoints: data.checkpoints || [],
      createdAt: now,
      updatedAt: now
    };

    return await db.insert('schedules', record);
  }

  static async findAll(filters = {}) {
    await this.seedEnhancedSchedules();
    let schedules = await db.find('schedules');

    if (filters.area) {
      const a = filters.area.toLowerCase();
      schedules = schedules.filter(s =>
        (s.area && s.area.toLowerCase().includes(a)) ||
        (s.zone && s.zone.toLowerCase().includes(a))
      );
    }

    if (filters.date || filters.collectionDate) {
      const d = filters.date || filters.collectionDate;
      schedules = schedules.filter(s => s.collectionDate === d);
    }

    if (filters.wasteType) {
      schedules = schedules.filter(s =>
        s.wasteType === filters.wasteType || s.collectionType === filters.wasteType
      );
    }

    if (filters.status) {
      schedules = schedules.filter(s => s.status === filters.status);
    }

    if (filters.staffId || filters.assignedStaffId) {
      const st = filters.staffId || filters.assignedStaffId;
      schedules = schedules.filter(s => s.staffId === st || s.assignedStaffId === st);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      schedules = schedules.filter(s =>
        (s.scheduleId && s.scheduleId.toLowerCase().includes(q)) ||
        (s.area && s.area.toLowerCase().includes(q)) ||
        (s.wasteType && s.wasteType.toLowerCase().includes(q)) ||
        (s.vehicleId && s.vehicleId.toLowerCase().includes(q)) ||
        (s.staffName && s.staffName.toLowerCase().includes(q))
      );
    }

    schedules.sort((a, b) => new Date(a.collectionDate) - new Date(b.collectionDate));
    return schedules;
  }

  static async findById(id) {
    await this.seedEnhancedSchedules();
    const schedules = await db.find('schedules');
    return schedules.find(s => s.id === id || s.scheduleId === id) || null;
  }

  static async update(id, updates) {
    const existing = await this.findById(id);
    if (!existing) return null;
    return await db.update('schedules', existing.id, updates);
  }

  static async delete(id) {
    const existing = await this.findById(id);
    if (!existing) return false;
    return await db.delete('schedules', existing.id);
  }
}

ScheduleModel.seedEnhancedSchedules();

module.exports = ScheduleModel;
