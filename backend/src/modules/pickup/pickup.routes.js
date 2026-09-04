/**
 * Pickup Request Routes - Protected by JWT Authentication and RBAC
 */
const express = require('express');
const router = express.Router();
const PickupController = require('./pickup.controller');
const { validateCreate, validateStatusUpdate } = require('./pickup.validation');
const authenticateJWT = require('../../middleware/authMiddleware');
const requireRole = require('../../middleware/rbacMiddleware');
const { ROLES } = require('../../config/constants');

router.use(authenticateJWT);

// Citizen submits a pickup request
router.post('/', validateCreate, PickupController.createPickup);

// View pickup requests (Citizen gets their own, Admin/Staff get all)
router.get('/', PickupController.getPickups);

// Get single pickup details
router.get('/:id', PickupController.getPickupById);

// Administrator updates details / assigns vehicle and staff
router.put('/:id', requireRole(ROLES.ADMINISTRATOR), PickupController.updatePickup);

// Update status (Admin can approve/schedule/complete, Citizen can cancel)
router.put('/:id/status', validateStatusUpdate, PickupController.updateStatus);
router.patch('/:id/status', validateStatusUpdate, PickupController.updateStatus);

// Cancel / delete pickup
router.delete('/:id', PickupController.deletePickup);

module.exports = router;
