/**
 * Smart Waste Collection Management System - Vehicle Routes
 */
const express = require('express');
const router = express.Router();
const VehicleController = require('../controllers/vehicleController');

router.get('/', VehicleController.getAll);
router.get('/:id', VehicleController.getOne);
router.post('/', VehicleController.create);
router.put('/:id', VehicleController.update);
router.put('/:id/assign-driver', VehicleController.assignDriver);
router.put('/:id/telemetry', VehicleController.updateTelemetry);
router.delete('/:id', VehicleController.delete);

module.exports = router;
