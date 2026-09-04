/**
 * User Controller - Handles Admin User Operations
 */
const UserService = require('./user.service');
const { successResponse } = require('../../utils/response');

const UserController = {
  // GET /api/users
  getAllUsers: async (req, res, next) => {
    try {
      const { role, status, search } = req.query;
      const users = await UserService.getAllUsers({ role, status, search });
      return successResponse(res, users, 'Users retrieved successfully.');
    } catch (err) {
      next(err);
    }
  },

  // GET /api/users/:id
  getUserById: async (req, res, next) => {
    try {
      const user = await UserService.getUserById(req.params.id);
      return successResponse(res, user, 'User retrieved.');
    } catch (err) {
      next(err);
    }
  },

  // POST /api/users
  createUser: async (req, res, next) => {
    try {
      const newUser = await UserService.createUserByAdmin(req.body);
      return successResponse(res, newUser, 'User created successfully by admin.', 201);
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/users/:id/status
  updateStatus: async (req, res, next) => {
    try {
      const updated = await UserService.updateUserStatus(req.params.id, req.body.status);
      return successResponse(res, updated, `User status updated to ${req.body.status}.`);
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/users/:id
  deleteUser: async (req, res, next) => {
    try {
      await UserService.deleteUser(req.params.id);
      return successResponse(res, null, 'User deleted successfully.');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = UserController;
