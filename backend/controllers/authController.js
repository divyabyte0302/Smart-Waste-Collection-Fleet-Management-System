/**
 * Smart Waste Collection Management System - Auth & User Controller
 */
const UserModel = require('../models/userModel');
const ZoneModel = require('../models/zoneModel');
const VehicleModel = require('../models/vehicleModel');

const AuthController = {
  // POST /api/auth/login
  login: (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide both email and password.'
        });
      }

      const user = UserModel.authenticate(email.trim(), password.trim());

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password. Please verify your credentials.'
        });
      }

      // Generate session token
      const token = `token_${user.id}_${Date.now()}`;

      // Determine vehicle details if user is a driver
      let assignedVehicle = null;
      if (user.role === 'DRIVER') {
        const vehicles = VehicleModel.findAll();
        assignedVehicle = vehicles.find(v => v.driver_id === user.id || (v.driver_name && v.driver_name.toLowerCase().includes(user.name.toLowerCase())));
      }

      // Role-based target redirect module
      let redirectModule = 'CITIZEN';
      if (user.role === 'ADMIN') redirectModule = 'ADMIN';
      else if (user.role === 'DRIVER') redirectModule = 'DRIVER';

      res.json({
        success: true,
        message: `Welcome back, ${user.name}! Redirecting to ${redirectModule} portal.`,
        data: {
          token,
          user: {
            ...user,
            assigned_vehicle: assignedVehicle
          },
          redirect_to: redirectModule
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/register (Citizen Registration)
  register: (req, res, next) => {
    try {
      const { name, email, password, phone, address } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required.'
        });
      }

      const newUser = UserModel.createCitizen({
        name,
        email,
        password,
        phone,
        address
      });

      const token = `token_${newUser.id}_${Date.now()}`;

      res.status(201).json({
        success: true,
        message: 'Account created successfully! Redirecting to Citizen Portal.',
        data: {
          token,
          user: newUser,
          redirect_to: 'CITIZEN'
        }
      });
    } catch (err) {
      if (err.message && err.message.includes('already exists')) {
        return res.status(409).json({ success: false, message: err.message });
      }
      next(err);
    }
  },

  // GET /api/auth/me
  getMe: (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '').trim();

      if (!token) {
        return res.status(401).json({ success: false, message: 'No active session token provided.' });
      }

      // Extract user id from token (e.g. token_usr_admin_1_123456)
      const parts = token.split('_');
      if (parts.length < 3) {
        return res.status(401).json({ success: false, message: 'Invalid session token format.' });
      }

      const userId = `${parts[1]}_${parts[2]}_${parts[3]}`.replace(/_\d+$/, '');
      let user = UserModel.findById(userId);

      // Fallback search by ID prefix
      if (!user) {
        const allUsers = UserModel.findAll();
        user = allUsers.find(u => token.includes(u.id));
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'Session expired or user not found.' });
      }

      let assignedVehicle = null;
      if (user.role === 'DRIVER') {
        const vehicles = VehicleModel.findAll();
        assignedVehicle = vehicles.find(v => v.driver_id === user.id || (v.driver_name && v.driver_name.toLowerCase().includes(user.name.toLowerCase())));
      }

      res.json({
        success: true,
        data: {
          user: {
            ...user,
            assigned_vehicle: assignedVehicle
          },
          redirect_to: user.role
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/auth/users
  getUsers: (req, res, next) => {
    try {
      const { role } = req.query;
      const users = UserModel.findAll(role);
      res.json({ success: true, count: users.length, data: users });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/auth/zones
  getZones: (req, res, next) => {
    try {
      const zones = ZoneModel.findAll();
      res.json({ success: true, count: zones.length, data: zones });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/auth/profile/:id
  getProfile: (req, res, next) => {
    try {
      const { id } = req.params;
      const user = UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = AuthController;
