/**
 * Smart Waste Collection Management System - Main API Router
 * Aggregates all modular REST route handlers under /api
 */
const express = require('express');
const router = express.Router();

const complaintRoutes = require('./complaintRoutes');
const pickupRoutes = require('./pickupRoutes');
const vehicleRoutes = require('./vehicleRoutes');
const scheduleRoutes = require('./scheduleRoutes');
const reportRoutes = require('./reportRoutes');
const authRoutes = require('./authRoutes');
const notificationRoutes = require('./notificationRoutes');

// Mount individual domain modules
router.use('/complaints', complaintRoutes);
router.use('/pickups', pickupRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/reports', reportRoutes);
router.use('/auth', authRoutes);
router.use('/notifications', notificationRoutes);

// Root API health and system info
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Smart Waste Collection Management System',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    modules: [
      'complaints',
      'pickups',
      'vehicles',
      'schedules',
      'reports',
      'auth',
      'notifications'
    ]
  });
});

module.exports = router;
