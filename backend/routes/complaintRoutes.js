/**
 * Smart Waste Collection Management System - Complaint Routes
 */
const express = require('express');
const router = express.Router();
const ComplaintController = require('../controllers/complaintController');
const upload = require('../middleware/uploadMiddleware');

router.get('/', ComplaintController.getAll);
router.get('/:idOrTicket', ComplaintController.getOne);
router.post('/', upload.single('photo'), ComplaintController.create);
router.put('/:id/status', upload.single('resolution_photo'), ComplaintController.updateStatus);
router.put('/:id/assign', ComplaintController.assignVehicle);
router.delete('/:id', ComplaintController.delete);

module.exports = router;
