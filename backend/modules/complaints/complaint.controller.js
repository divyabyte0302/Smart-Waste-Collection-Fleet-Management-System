/**
 * Complaint Controller - Handles HTTP requests
 */
const ComplaintService = require('./complaint.service');
const { successResponse, errorResponse } = require('../../utils/response');

class ComplaintController {
  /**
   * POST /api/complaints
   */
  static async createComplaint(req, res, next) {
    try {
      const complaint = await ComplaintService.createComplaint(req.user, req.body);
      return successResponse(res, complaint, 'Complaint filed successfully and registered in municipal dispatch.', 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/complaints
   */
  static async getComplaints(req, res, next) {
    try {
      const { category, status, priority, search, page, limit, assignedStaffId } = req.query;
      const data = await ComplaintService.getComplaints({
        category,
        status,
        priority,
        search,
        page,
        limit,
        assignedStaffId
      });
      return successResponse(res, data, 'Complaints retrieved successfully.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/complaints/my-complaints
   */
  static async getMyComplaints(req, res, next) {
    try {
      const { category, status, priority, search, page, limit } = req.query;
      const data = await ComplaintService.getComplaints({
        citizenId: req.user.id,
        category,
        status,
        priority,
        search,
        page,
        limit
      });
      return successResponse(res, data, 'Your complaints retrieved successfully.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/complaints/:id
   */
  static async getComplaintById(req, res, next) {
    try {
      const { id } = req.params;
      const complaint = await ComplaintService.getComplaintById(id, req.user);
      if (!complaint) {
        return errorResponse(res, `Complaint '${id}' not found.`, 404);
      }
      return successResponse(res, complaint, 'Complaint details retrieved.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/complaints/:id
   */
  static async updateComplaint(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await ComplaintService.updateComplaint(id, req.body, req.user);
      if (!updated) {
        return errorResponse(res, `Complaint '${id}' not found.`, 404);
      }
      return successResponse(res, updated, 'Complaint updated successfully.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/complaints/:id/status
   */
  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, note } = req.body;
      const updated = await ComplaintService.updateComplaintStatus(id, status, note, req.user);
      if (!updated) {
        return errorResponse(res, `Complaint '${id}' not found.`, 404);
      }
      return successResponse(res, updated, `Complaint status updated to ${status}.`);
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /api/complaints/:id
   */
  static async deleteComplaint(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await ComplaintService.deleteComplaint(id, req.user);
      if (!deleted) {
        return errorResponse(res, `Complaint '${id}' could not be deleted.`, 400);
      }
      return successResponse(res, { id }, 'Complaint deleted successfully.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/complaints/:id/comments
   */
  static async addComment(req, res, next) {
    try {
      const { id } = req.params;
      const { comment } = req.body;
      const updated = await ComplaintService.addComment(id, comment, req.user);
      if (!updated) {
        return errorResponse(res, `Complaint '${id}' not found.`, 404);
      }
      return successResponse(res, updated, 'Comment posted successfully.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/complaints/stats/overview
   */
  static async getOverviewMetrics(req, res, next) {
    try {
      const stats = await ComplaintService.getOverviewMetrics();
      return successResponse(res, stats, 'Complaint metrics retrieved.');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ComplaintController;
