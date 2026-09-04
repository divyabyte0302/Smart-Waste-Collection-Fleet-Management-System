/**
 * Smart Waste Collection Management System - Pickup Routes
 */
const express = require('express');
const router = express.Router();
const PickupController = require('../controllers/pickupController');
const upload = require('../middleware/uploadMiddleware');

router.get('/', PickupController.getAll);
router.get('/:idOrNumber', PickupController.getOne);
router.post('/', upload.single('photo'), PickupController.create);
router.put('/:id/status', PickupController.updateStatus);
router.put('/:id/schedule', PickupController.schedulePickup);
router.delete('/:id', PickupController.delete);

module.exports = router;
