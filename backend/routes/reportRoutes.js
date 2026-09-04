/**
 * Smart Waste Collection Management System - Report Routes
 */
const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');

router.get('/summary', ReportController.getSummary);
router.get('/export/:type', ReportController.exportCsv);
router.get('/logs', ReportController.getServiceLogs);
router.post('/logs', ReportController.createServiceLog);

module.exports = router;
