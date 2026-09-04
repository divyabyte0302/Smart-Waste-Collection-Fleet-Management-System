/**
 * Smart Waste Collection Management System - Schedule Routes
 */
const express = require('express');
const router = express.Router();
const ScheduleController = require('../controllers/scheduleController');

router.get('/', ScheduleController.getAll);
router.get('/:id', ScheduleController.getOne);
router.post('/', ScheduleController.create);
router.put('/:id', ScheduleController.update);
router.put('/:id/checkpoint', ScheduleController.updateCheckpoint);
router.delete('/:id', ScheduleController.delete);

module.exports = router;
