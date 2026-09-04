/**
 * Staff Service - Business Logic Layer
 */
const StaffModel = require('./staff.model');
const { STAFF_ROLES, STAFF_STATUS } = require('./staff.types');

class StaffService {
  static async createStaff(data) {
    const existingEmail = await StaffModel.findByEmail(data.email);
    if (existingEmail) {
      throw new Error(`A staff member with email "${data.email}" already exists.`);
    }

    const existingEmp = await StaffModel.findByEmployeeId(data.employeeId);
    if (existingEmp) {
      throw new Error(`A staff member with employee ID "${data.employeeId}" already exists.`);
    }

    return await StaffModel.create(data);
  }

  static async getStaff(filters = {}) {
    const staff = await StaffModel.findAll(filters);

    const stats = {
      total: staff.length,
      drivers: staff.filter(s => s.role === STAFF_ROLES.DRIVER).length,
      collectors: staff.filter(s => s.role === STAFF_ROLES.WASTE_COLLECTOR).length,
      supervisors: staff.filter(s => s.role === STAFF_ROLES.SUPERVISOR).length,
      available: staff.filter(s => s.status === STAFF_STATUS.AVAILABLE).length,
      assigned: staff.filter(s => s.status === STAFF_STATUS.ASSIGNED).length,
      onDuty: staff.filter(s => s.status === STAFF_STATUS.ON_DUTY).length,
      inactive: staff.filter(s => s.status === STAFF_STATUS.INACTIVE).length
    };

    return { staff, stats };
  }

  static async getStaffById(id) {
    const member = await StaffModel.findById(id);
    if (!member) {
      throw new Error(`Staff member "${id}" not found.`);
    }
    return member;
  }

  static async getStaffByUserId(userId) {
    let member = await StaffModel.findByUserId(userId);
    if (!member) {
      // Fallback: check by email from user store
      const db = require('../../config/database');
      const user = await db.findById('users', userId);
      if (user && user.email) {
        member = await StaffModel.findByEmail(user.email);
      }
    }
    return member;
  }

  static async updateStaff(id, updates) {
    const member = await StaffModel.findById(id);
    if (!member) {
      throw new Error(`Staff member "${id}" not found.`);
    }

    if (updates.email && updates.email.toLowerCase() !== member.email.toLowerCase()) {
      const duplicate = await StaffModel.findByEmail(updates.email);
      if (duplicate && duplicate.id !== member.id) {
        throw new Error(`Email "${updates.email}" is already assigned to another staff member.`);
      }
    }

    if (updates.employeeId && updates.employeeId.toUpperCase() !== member.employeeId.toUpperCase()) {
      const duplicateEmp = await StaffModel.findByEmployeeId(updates.employeeId);
      if (duplicateEmp && duplicateEmp.id !== member.id) {
        throw new Error(`Employee ID "${updates.employeeId}" is already assigned.`);
      }
    }

    return await StaffModel.update(id, updates);
  }

  static async deleteStaff(id) {
    const member = await StaffModel.findById(id);
    if (!member) {
      throw new Error(`Staff member "${id}" not found.`);
    }

    if (member.status === STAFF_STATUS.ON_DUTY) {
      throw new Error(`Cannot remove staff member "${member.name}" while they are currently on duty.`);
    }

    return await StaffModel.delete(id);
  }
}

module.exports = StaffService;
