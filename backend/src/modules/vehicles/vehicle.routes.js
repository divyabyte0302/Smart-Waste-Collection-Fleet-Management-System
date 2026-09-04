/**
 * Vehicle Routes - Express Router
 */
const express = require('express');
const router = express.Router();
const VehicleController = require('./vehicle.controller');
const vehicleValidation = require('./vehicle.validation');
const authenticateToken = require('../../middleware/authMiddleware');
const requireRole = require('../../middleware/rbacMiddleware');
const { ROLES } = require('../../config/constants');

// All endpoints require authentication
router.use(authenticateToken);

// Read-only access for staff and admins
router.get('/', requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF), VehicleController.getAll);
router.get('/:id', requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF), VehicleController.getById);

// Status update accessible to collection staff (when starting route) and admin
router.put('/:id/status', requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF), vehicleValidation.validateStatusUpdate, VehicleController.updateStatus);

// Fleet management exclusively for administrators
router.post('/', requireRole(ROLES.ADMINISTRATOR), vehicleValidation.validateCreate, VehicleController.create);
router.put('/:id', requireRole(ROLES.ADMINISTRATOR), VehicleController.update);
router.delete('/:id', requireRole(ROLES.ADMINISTRATOR), VehicleController.delete);

module.exports = router;
