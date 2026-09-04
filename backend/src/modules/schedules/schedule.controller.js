/**
 * Schedule Controller - Handles HTTP requests
 */
const ScheduleService = require('./schedule.service');
const { successResponse, errorResponse } = require('../../utils/response');

class ScheduleController {
  /**
   * POST /api/schedules
   */
  static async createSchedule(req, res, next) {
    try {
      const schedule = await ScheduleService.createSchedule(req.body);
      return successResponse(res, schedule, 'Collection schedule created successfully.', 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/schedules
   */
  static async getSchedules(req, res, next) {
    try {
      const { area, date, wasteType, status, staffId, search } = req.query;
      const schedules = await ScheduleService.getSchedules({
        area,
        date,
        wasteType,
        status,
        staffId,
        search
      });
      return successResponse(res, schedules, 'Collection schedules retrieved successfully.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/schedules/:id
   */
  static async getScheduleById(req, res, next) {
    try {
      const { id } = req.params;
      const schedule = await ScheduleService.getScheduleById(id);
      if (!schedule) {
        return errorResponse(res, `Schedule '${id}' not found.`, 404);
      }
      return successResponse(res, schedule, 'Schedule retrieved.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/schedules/:id
   */
  static async updateSchedule(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await ScheduleService.updateSchedule(id, req.body);
      if (!updated) {
        return errorResponse(res, `Schedule '${id}' not found.`, 404);
      }
      return successResponse(res, updated, 'Schedule updated successfully.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/schedules/:id/status
   */
  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await ScheduleService.updateStatus(id, status);
      if (!updated) {
        return errorResponse(res, `Schedule '${id}' not found.`, 404);
      }
      return successResponse(res, updated, `Schedule status set to ${status}.`);
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/schedules/:id
   */
  static async deleteSchedule(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await ScheduleService.deleteSchedule(id);
      if (!deleted) {
        return errorResponse(res, `Schedule '${id}' could not be removed.`, 400);
      }
      return successResponse(res, { id }, 'Schedule cancelled and removed successfully.');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ScheduleController;
