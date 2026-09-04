/**
 * Notification Routes - Express Router
 */
const express = require('express');
const router = express.Router();
const NotificationController = require('./notification.controller');
const { validateBroadcast } = require('./notification.validation');
const authenticateToken = require('../../middleware/authMiddleware');
const requireRole = require('../../middleware/rbacMiddleware');
const { ROLES } = require('../../config/constants');

// GET /api/notifications/recent (Inspect recent dispatches)
router.get('/recent', NotificationController.getRecent);

// POST /api/notifications/broadcast (Admin broadcast advisory)
router.post(
  '/broadcast',
  authenticateToken,
  requireRole(ROLES.ADMINISTRATOR),
  validateBroadcast,
  NotificationController.broadcast
);

module.exports = router;
