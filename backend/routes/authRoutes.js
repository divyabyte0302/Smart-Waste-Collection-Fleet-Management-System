/**
 * Smart Waste Collection Management System - Auth Routes
 */
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/me', AuthController.getMe);
router.get('/users', AuthController.getUsers);
router.get('/zones', AuthController.getZones);
router.get('/profile/:id', AuthController.getProfile);

module.exports = router;
