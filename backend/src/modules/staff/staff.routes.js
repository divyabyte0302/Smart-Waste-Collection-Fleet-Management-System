/**
 * Staff Routes - Express Router
 */
const express = require('express');
const router = express.Router();
const StaffController = require('./staff.controller');
const staffValidation = require('./staff.validation');
const authenticateToken = require('../../middleware/authMiddleware');
const requireRole = require('../../middleware/rbacMiddleware');
const { ROLES } = require('../../config/constants');

// All endpoints require authentication
router.use(authenticateToken);

// Read-only access for staff and admins
router.get('/', requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF), StaffController.getAll);
router.get('/:id', requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF), StaffController.getById);

// Staff updates: Staff can update their own status/shift, Admin can update all fields
router.put('/:id', requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF), staffValidation.validateUpdate, StaffController.update);

// Staff creation and deletion: Administrator only
router.post('/', requireRole(ROLES.ADMINISTRATOR), staffValidation.validateCreate, StaffController.create);
router.delete('/:id', requireRole(ROLES.ADMINISTRATOR), StaffController.delete);

module.exports = router;
