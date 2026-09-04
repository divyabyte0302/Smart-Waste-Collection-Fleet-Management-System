/**
 * Auth Routes - Maps endpoints to validation and controllers
 */
const express = require('express');
const router = express.Router();
const AuthController = require('./auth.controller');
const {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange
} = require('./auth.validation');
const authenticateJWT = require('../../middleware/authMiddleware');

// Public Endpoints
router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.post('/logout', AuthController.logout);

// Protected Endpoints
router.get('/profile', authenticateJWT, AuthController.getProfile);
router.get('/me', authenticateJWT, AuthController.getProfile);
router.put('/profile', authenticateJWT, validateProfileUpdate, AuthController.updateProfile);
router.put('/change-password', authenticateJWT, validatePasswordChange, AuthController.changePassword);

module.exports = router;
