/**
 * Staff Model - Data Layer for Collection Crew
 */
const db = require('../../config/database');
const { STAFF_ROLES, STAFF_STATUS } = require('./staff.types');

let staffCounter = 101;

class StaffModel {
  static generateStaffId() {
    const year = new Date().getFullYear();
    const count = staffCounter++;
    return `STF-${year}-${count}`;
  }

  static async seedSampleStaff() {
    const existing = await db.find('staff');
    if (existing && existing.length > 0) {
      staffCounter = existing.length + 101;
      return;
    }

    const initialStaff = [
      {
        id: 'stf_seed_001',
        staffId: 'STF-2026-101',
        name: 'Marcus Chen',
        email: 'staff@smartwaste.gov',
        phone: '+1 (555) 018-9921',
        employeeId: 'EMP-2026-001',
        role: STAFF_ROLES.DRIVER,
        assignedVehicle: 'METRO-TRK-101',
        assignedArea: 'Downtown Central',
        status: STAFF_STATUS.ON_DUTY,
        userId: 'usr_staff_001',
        shiftNotes: 'Commercial route in progress. Checkpoints 1 and 2 cleared.',
        createdAt: '2026-08-01T07:00:00.000Z',
        updatedAt: '2026-09-04T07:30:00.000Z'
      },
      {
        id: 'stf_seed_002',
        staffId: 'STF-2026-102',
        name: 'Sarah Jenkins',
        email: 'sarah.j@smartwaste.gov',
        phone: '+1 (555) 018-4422',
        employeeId: 'EMP-2026-014',
        role: STAFF_ROLES.WASTE_COLLECTOR,
        assignedVehicle: 'METRO-TRK-101',
        assignedArea: 'Downtown Central',
        status: STAFF_STATUS.ON_DUTY,
        userId: null,
        shiftNotes: 'Partnered with driver Marcus Chen on compactor crew.',
        createdAt: '2026-08-05T07:00:00.000Z',
        updatedAt: '2026-09-04T07:30:00.000Z'
      },
      {
        id: 'stf_seed_003',
        staffId: 'STF-2026-103',
        name: 'David Kim',
        email: 'david.kim@smartwaste.gov',
        phone: '+1 (555) 018-7719',
        employeeId: 'EMP-2026-009',
        role: STAFF_ROLES.SUPERVISOR,
        assignedVehicle: null,
        assignedArea: 'Metro North Residential',
        status: STAFF_STATUS.AVAILABLE,
        userId: null,
        shiftNotes: 'Field inspections and route dispatch coordination.',
        createdAt: '2026-08-10T07:00:00.000Z',
        updatedAt: '2026-09-03T14:00:00.000Z'
      },
      {
        id: 'stf_seed_004',
        staffId: 'STF-2026-104',
        name: 'Carlos Rodriguez',
        email: 'carlos.r@smartwaste.gov',
        phone: '+1 (555) 018-3310',
        employeeId: 'EMP-2026-032',
        role: STAFF_ROLES.DRIVER,
        assignedVehicle: 'METRO-MIN-103',
        assignedArea: 'Green Valley Eco-District',
        status: STAFF_STATUS.AVAILABLE,
        userId: null,
        shiftNotes: 'Ready for electric mini truck afternoon route.',
        createdAt: '2026-08-15T07:00:00.000Z',
        updatedAt: '2026-09-04T08:00:00.000Z'
      }
    ];

    for (const s of initialStaff) {
      await db.insert('staff', s);
    }
    staffCounter = 105;
  }

  static async create(data) {
    await this.seedSampleStaff();
    const now = new Date().toISOString();
    const staffId = this.generateStaffId();

    const record = {
      staffId,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone ? data.phone.trim() : '',
      employeeId: data.employeeId.trim().toUpperCase(),
      role: data.role,
      assignedVehicle: data.assignedVehicle || null,
      assignedArea: data.assignedArea || 'Central District',
      status: data.status || STAFF_STATUS.AVAILABLE,
      userId: data.userId || null,
      shiftNotes: data.shiftNotes || '',
      createdAt: now,
      updatedAt: now
    };

    return await db.insert('staff', record);
  }

  static async findAll(filters = {}) {
    await this.seedSampleStaff();
    let staff = await db.find('staff');

    if (filters.role) {
      staff = staff.filter(s => s.role === filters.role);
    }
    if (filters.status) {
      staff = staff.filter(s => s.status === filters.status);
    }
    if (filters.assignedArea) {
      staff = staff.filter(s => s.assignedArea && s.assignedArea.toLowerCase().includes(filters.assignedArea.toLowerCase()));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      staff = staff.filter(s =>
        (s.staffId && s.staffId.toLowerCase().includes(q)) ||
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.employeeId && s.employeeId.toLowerCase().includes(q)) ||
        (s.assignedArea && s.assignedArea.toLowerCase().includes(q)) ||
        (s.assignedVehicle && s.assignedVehicle.toLowerCase().includes(q))
      );
    }

    staff.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return staff;
  }

  static async findById(id) {
    await this.seedSampleStaff();
    const staff = await db.find('staff');
    return staff.find(s => s.id === id || s.staffId === id || s.employeeId === id) || null;
  }

  static async findByEmail(email) {
    await this.seedSampleStaff();
    const staff = await db.find('staff');
    return staff.find(s => s.email && s.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static async findByEmployeeId(employeeId) {
    await this.seedSampleStaff();
    const staff = await db.find('staff');
    return staff.find(s => s.employeeId && s.employeeId.toUpperCase() === employeeId.toUpperCase()) || null;
  }

  static async findByUserId(userId) {
    await this.seedSampleStaff();
    const staff = await db.find('staff');
    return staff.find(s => s.userId === userId) || null;
  }

  static async update(id, updates) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return await db.update('staff', existing.id, updatedData);
  }

  static async delete(id) {
    const existing = await this.findById(id);
    if (!existing) return false;
    return await db.delete('staff', existing.id);
  }
}

StaffModel.seedSampleStaff();

module.exports = StaffModel;
