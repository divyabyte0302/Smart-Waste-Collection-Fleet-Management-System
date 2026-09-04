/**
 * Schedule Service - Business Logic with Conflict Prevention
 */
const ScheduleModel = require('./schedule.model');
const { SCHEDULE_STATUS } = require('./schedule.types');

const parseToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const cleaned = timeStr.trim().toUpperCase();
  const match = cleaned.match(/^(\d{1,2}):(\d{2})(?:\s*([AP]M))?$/);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3];
  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const timesOverlap = (startA, endA, startB, endB) => {
  const minStartA = parseToMinutes(startA);
  const minEndA = parseToMinutes(endA);
  const minStartB = parseToMinutes(startB);
  const minEndB = parseToMinutes(endB);
  if (minStartA !== null && minEndA !== null && minStartB !== null && minEndB !== null) {
    return minStartA < minEndB && minEndA > minStartB;
  }
  return startA < endB && endA > startB;
};

class ScheduleService {
  /**
   * Validates if assigned vehicle or driver has overlapping schedules on same date
   */
  static async validateConflicts(data, excludeId = null) {
    if (!data.collectionDate) return;

    const existingSchedules = await ScheduleModel.findAll({ date: data.collectionDate });
    const targetVehicle = data.assignedVehicle || data.vehicleId || data.vehicleNumber;
    const targetDriver = data.assignedDriver || data.driverName || data.staffName || data.assignedStaffName;

    for (const item of existingSchedules) {
      if (excludeId && (item.id === excludeId || item.scheduleId === excludeId)) continue;
      if (item.status === SCHEDULE_STATUS.CANCELLED || item.status === SCHEDULE_STATUS.COMPLETED) continue;

      const overlap = timesOverlap(data.startTime, data.endTime, item.startTime, item.endTime);

      if (overlap) {
        const itemVehicle = item.assignedVehicle || item.vehicleId || item.vehicleNumber;
        if (targetVehicle && itemVehicle && targetVehicle.toLowerCase() === itemVehicle.toLowerCase()) {
          const err = new Error(`Scheduling Conflict: Vehicle "${targetVehicle}" is already booked on ${data.collectionDate} between ${item.startTime} and ${item.endTime} (Schedule #${item.scheduleId || item.id}).`);
          err.statusCode = 409;
          throw err;
        }

        const itemDriver = item.assignedDriver || item.driverName || item.staffName || item.assignedStaffName;
        if (targetDriver && itemDriver && targetDriver.toLowerCase() === itemDriver.toLowerCase()) {
          const err = new Error(`Scheduling Conflict: Driver "${targetDriver}" is already assigned to another route on ${data.collectionDate} between ${item.startTime} and ${item.endTime} (Schedule #${item.scheduleId || item.id}).`);
          err.statusCode = 409;
          throw err;
        }
      }
    }
  }

  static async createSchedule(data) {
    await this.validateConflicts(data);
    return await ScheduleModel.create(data);
  }

  static async getSchedules(filters = {}) {
    return await ScheduleModel.findAll(filters);
  }

  static async getScheduleById(id) {
    return await ScheduleModel.findById(id);
  }

  static async updateSchedule(id, updates) {
    const existing = await ScheduleModel.findById(id);
    if (!existing) {
      const err = new Error(`Schedule "${id}" not found.`);
      err.statusCode = 404;
      throw err;
    }

    const merged = { ...existing, ...updates };
    await this.validateConflicts(merged, id);

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
