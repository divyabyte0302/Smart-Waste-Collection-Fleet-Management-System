/**
 * Schedule Service - Business Logic
 */
const ScheduleModel = require('./schedule.model');

class ScheduleService {
  static async createSchedule(data) {
    return await ScheduleModel.create(data);
  }

  static async getSchedules(filters = {}) {
    return await ScheduleModel.findAll(filters);
  }

  static async getScheduleById(id) {
    return await ScheduleModel.findById(id);
  }

  static async updateSchedule(id, updates) {
    return await ScheduleModel.update(id, updates);
  }

  static async updateStatus(id, status) {
    return await ScheduleModel.update(id, { status });
  }

  static async deleteSchedule(id) {
    return await ScheduleModel.delete(id);
  }
}

module.exports = ScheduleService;
