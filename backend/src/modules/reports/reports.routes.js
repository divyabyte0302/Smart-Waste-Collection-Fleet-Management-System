/**
 * Reports Routes - Express Router
 */
const express = require('express');
const router = express.Router();
const ReportsController = require('./reports.controller');
const authenticateToken = require('../../middleware/authMiddleware');
const requireRole = require('../../middleware/rbacMiddleware');
const { ROLES } = require('../../config/constants');

// All report endpoints require authentication
router.use(authenticateToken);

// Accessible by Administrator and Staff
router.get('/daily', requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF), ReportsController.getDailyReport);
router.get('/weekly', requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF), ReportsController.getWeeklyReport);
router.get('/monthly', requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF), ReportsController.getMonthlyReport);

module.exports = router;
