/**
 * Smart Waste Collection Management System - Notification Routes
 */
const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');

router.get('/', NotificationController.getAll);
router.put('/:id/read', NotificationController.markAsRead);
router.post('/mark-all-read', NotificationController.markAllRead);

module.exports = router;
