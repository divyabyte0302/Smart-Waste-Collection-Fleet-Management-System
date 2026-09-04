/**
 * Auth Controller - Handles incoming HTTP requests for Auth Domain
 */
const AuthService = require('./auth.service');
const { successResponse, errorResponse } = require('../../utils/response');

const AuthController = {
  // POST /api/auth/register
  register: async (req, res, next) => {
    try {
      const result = await AuthService.registerCitizen(req.body);
      return successResponse(res, result, 'Citizen registered successfully.', 201);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/login
  login: async (req, res, next) => {
    try {
      const result = await AuthService.login(req.body);
      return successResponse(res, result, `Welcome back, ${result.user.name}!`);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/logout
  logout: async (req, res) => {
    return successResponse(res, null, 'Logged out successfully.');
  },

  // GET /api/auth/profile
  getProfile: async (req, res, next) => {
    try {
      const profile = await AuthService.getProfile(req.user.id);
      return successResponse(res, profile, 'User profile retrieved.');
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/auth/profile
  updateProfile: async (req, res, next) => {
    try {
      const updated = await AuthService.updateProfile(req.user.id, req.body);
      return successResponse(res, updated, 'Profile updated successfully.');
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/auth/change-password
  changePassword: async (req, res, next) => {
    try {
      await AuthService.changePassword(req.user.id, req.body);
      return successResponse(res, null, 'Password changed successfully.');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = AuthController;
