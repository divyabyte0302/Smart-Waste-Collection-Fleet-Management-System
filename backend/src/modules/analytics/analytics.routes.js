/**
 * Analytics Routes - Express Router
 */
const express = require('express');
const router = express.Router();
const AnalyticsController = require('./analytics.controller');
const authenticateToken = require('../../middleware/authMiddleware');
const requireRole = require('../../middleware/rbacMiddleware');
const { ROLES } = require('../../config/constants');

// All analytics endpoints require authentication
router.use(authenticateToken);

// Accessible by Administrator and Staff
router.get('/dashboard', requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF), AnalyticsController.getDashboard);
router.get('/kpis', requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF), AnalyticsController.getDashboard);
router.get('/charts', requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF), AnalyticsController.getComplaintsAnalytics);
router.get('/complaints', requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF), AnalyticsController.getComplaintsAnalytics);
router.get('/pickups', requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF), AnalyticsController.getPickupsAnalytics);
router.get('/vehicles', requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF), AnalyticsController.getVehiclesAnalytics);
router.get('/staff', requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF), AnalyticsController.getStaffAnalytics);

module.exports = router;
