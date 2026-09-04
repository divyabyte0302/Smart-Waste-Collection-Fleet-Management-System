/**
 * Schedule Routes - Protected by JWT Authentication and RBAC
 */
const express = require('express');
const router = express.Router();
const ScheduleController = require('./schedule.controller');
const { validateCreate, validateStatusUpdate } = require('./schedule.validation');
const authenticateJWT = require('../../middleware/authMiddleware');
const requireRole = require('../../middleware/rbacMiddleware');
const { ROLES } = require('../../config/constants');

router.use(authenticateJWT);

// Available to Citizen, Administrator, and Collection Staff
router.get('/', ScheduleController.getSchedules);
router.get('/:id', ScheduleController.getScheduleById);

// Create route schedule: Administrator only
router.post(
  '/',
  requireRole(ROLES.ADMINISTRATOR),
  validateCreate,
  ScheduleController.createSchedule
);

// Update schedule: Administrator and Staff (status update)
router.put(
  '/:id',
  requireRole(ROLES.ADMINISTRATOR),
  ScheduleController.updateSchedule
);

router.put(
  '/:id/status',
  requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF),
  validateStatusUpdate,
  ScheduleController.updateStatus
);

router.patch(
  '/:id/status',
  requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF),
  validateStatusUpdate,
  ScheduleController.updateStatus
);

// Delete / cancel schedule: Administrator only
router.delete(
  '/:id',
  requireRole(ROLES.ADMINISTRATOR),
  ScheduleController.deleteSchedule
);

module.exports = router;
