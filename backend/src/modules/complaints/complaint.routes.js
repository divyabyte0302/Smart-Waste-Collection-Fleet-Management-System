/**
 * Complaint Management Routes
 * Protected by JWT Authentication and Role-Based Access Control
 */
const express = require('express');
const router = express.Router();
const ComplaintController = require('./complaint.controller');
const { validateCreate, validateStatusUpdate, validateComment } = require('./complaint.validation');
const authenticateJWT = require('../../middleware/authMiddleware');
const requireRole = require('../../middleware/rbacMiddleware');
const { ROLES } = require('../../config/constants');

// Apply JWT authentication to all complaint routes
router.use(authenticateJWT);

// GET /api/complaints/stats/overview (Admin & Staff overview metrics)
router.get(
  '/stats/overview',
  requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF),
  ComplaintController.getOverviewMetrics
);

// GET /api/complaints/my-complaints (Citizen's own complaints)
router.get(
  '/my-complaints',
  ComplaintController.getMyComplaints
);

// GET /api/complaints (Admin & Staff view all complaints)
router.get(
  '/',
  requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF),
  ComplaintController.getComplaints
);

// POST /api/complaints (Citizen or Admin files a complaint)
router.post(
  '/',
  validateCreate,
  ComplaintController.createComplaint
);

// GET /api/complaints/:id (View single complaint details)
router.get(
  '/:id',
  ComplaintController.getComplaintById
);

// PUT /api/complaints/:id (Update details, priority, or assign staff)
router.put(
  '/:id',
  requireRole(ROLES.ADMINISTRATOR),
  ComplaintController.updateComplaint
);

// PUT/PATCH /api/complaints/:id/status (Update complaint status)
router.put(
  '/:id/status',
  requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF),
  validateStatusUpdate,
  ComplaintController.updateStatus
);
router.patch(
  '/:id/status',
  requireRole(ROLES.ADMINISTRATOR, ROLES.COLLECTION_STAFF),
  validateStatusUpdate,
  ComplaintController.updateStatus
);

// DELETE /api/complaints/:id (Delete complaint)
router.delete(
  '/:id',
  ComplaintController.deleteComplaint
);

// POST /api/complaints/:id/comments (Add interactive update/comment)
router.post(
  '/:id/comments',
  validateComment,
  ComplaintController.addComment
);

module.exports = router;
