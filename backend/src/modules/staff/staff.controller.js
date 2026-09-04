/**
 * Staff Controller - Request Handling Layer
 */
const StaffService = require('./staff.service');
const { successResponse, errorResponse } = require('../../utils/response');

const StaffController = {
  create: async (req, res, next) => {
    try {
      const member = await StaffService.createStaff(req.body);
      return successResponse(res, member, 'Collection staff member registered successfully.', 201);
    } catch (err) {
      next(err);
    }
  },

  getAll: async (req, res, next) => {
    try {
      // If client requests ?me=true, resolve logged in staff profile
      if (req.query.me === 'true' && req.user) {
        const myProfile = await StaffService.getStaffByUserId(req.user.id);
        return successResponse(res, myProfile, 'Active staff profile retrieved.');
      }

      const { role, status, assignedArea, search } = req.query;
      const { staff, stats } = await StaffService.getStaff({
        role,
        status,
        assignedArea,
        search
      });

      return res.status(200).json({
        success: true,
        message: 'Staff members retrieved successfully.',
        data: staff,
        stats
      });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const member = await StaffService.getStaffById(req.params.id);
      return successResponse(res, member, 'Staff member details retrieved.');
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      // Data ownership check for collection staff
      if (req.user.role === 'Collection Staff') {
        const member = await StaffService.getStaffById(req.params.id);
        if (member && member.userId !== req.user.id && member.email !== req.user.email) {
          const err = new Error('Access denied: You can only update your own staff profile.');
          err.statusCode = 403;
          throw err;
        }
      }

      const updated = await StaffService.updateStaff(req.params.id, req.body);
      return successResponse(res, updated, 'Staff details updated successfully.');
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      await StaffService.deleteStaff(req.params.id);
      return successResponse(res, null, 'Staff member removed successfully.');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = StaffController;
