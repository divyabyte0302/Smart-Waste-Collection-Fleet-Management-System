/**
 * User Management Routes - Protected for Administrator Role
 */
const express = require('express');
const router = express.Router();
const UserController = require('./user.controller');
const { validateStatusUpdate, validateCreateUser } = require('./user.validation');
const authenticateJWT = require('../../middleware/authMiddleware');
const requireRole = require('../../middleware/rbacMiddleware');
const { ROLES } = require('../../config/constants');

// All User management routes require JWT and Administrator role
router.use(authenticateJWT);
router.use(requireRole(ROLES.ADMINISTRATOR));

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/', validateCreateUser, UserController.createUser);
router.put('/:id/status', validateStatusUpdate, UserController.updateStatus);
router.delete('/:id', UserController.deleteUser);

module.exports = router;
