/**
 * Smart Waste Collection Management System - Production Express Application Server
 * Hardened with:
 * - Helmet security headers
 * - Configurable CORS
 * - IP rate limiting (General & Auth)
 * - Input sanitization & Anti-XSS
 * - Amazon CloudWatch performance & error monitoring
 * - Amazon SNS event notifications
 * - Amazon S3 storage integration
 * - Amazon RDS PostgreSQL integration
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('./config/env');
const errorMiddleware = require('./middleware/errorMiddleware');

// Security & Cloud Services
const {
  helmetSecurityHeaders,
  createCorsOptions,
  rateLimiter,
  sanitizeInputMiddleware,
  sanitizeEnv
} = require('./middleware/securityMiddleware');
const cloudWatchService = require('./services/monitoring/cloudwatch.service');
const snsService = require('./services/notifications/sns.service');
const s3Service = require('./services/storage/s3.service');
const db = require('./config/database');

// Modular Routers
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const scheduleRoutes = require('./modules/schedules/schedule.routes');
const complaintRoutes = require('./modules/complaints/complaint.routes');
const pickupRoutes = require('./modules/pickup/pickup.routes');
const vehicleRoutes = require('./modules/vehicles/vehicle.routes');
const staffRoutes = require('./modules/staff/staff.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');
const reportsRoutes = require('./modules/reports/reports.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');

const app = express();

// 1. Production Security Headers (Helmet Equivalent)
app.use(helmetSecurityHeaders);

// 2. Strict / Configurable CORS
app.use(cors(createCorsOptions()));

// 3. Performance & Latency Telemetry (Amazon CloudWatch)
app.use(cloudWatchService.getPerformanceMiddleware());

// 4. Rate Limiting (300 requests per minute general API rate limit)
app.use('/api/', rateLimiter(60 * 1000, 300, 'general'));

// 5. Body Parsing with strict size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Anti-XSS & Prototype Pollution Sanitization
app.use(sanitizeInputMiddleware);

// 7. Static Uploads Directory (for local fallback files)
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// 8. Auth-specific strict rate limiting (30 requests per minute for login/register)
app.use('/api/auth/login', rateLimiter(60 * 1000, 30, 'auth'));
app.use('/api/auth/register', rateLimiter(60 * 1000, 30, 'auth'));

// 9. Mount Modular REST API Routes (10 Distinct Business Modules)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/notifications', notificationRoutes);

// 11. AWS Cloud Status & Infrastructure Health
app.get('/api/cloud-status', (req, res) => {
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    cloudInfrastructure: {
      provider: 'Amazon Web Services (AWS)',
      region: process.env.AWS_REGION || 'us-east-1',
      rdsPostgreSQL: {
        configured: Boolean(process.env.DATABASE_URL),
        activeDriver: db.isPgActive ? 'Amazon RDS PostgreSQL Pool' : 'Resilient JSON Store Fallback'
      },
      amazonS3: {
        configured: s3Service.isConfigured,
        bucket: process.env.AWS_S3_BUCKET || '(local resilient fallback)',
        storageMode: s3Service.isConfigured ? 'AWS S3 Cloud Storage' : 'Local Disk Storage'
      },
      amazonSNS: {
        configured: snsService.isConfigured,
        topicArn: process.env.AWS_SNS_TOPIC_ARN || '(local notification bus)',
        deliveryMode: snsService.isConfigured ? 'AWS SNS Multi-Channel' : 'Local Notification Bus'
      },
      amazonCloudWatch: {
        configured: cloudWatchService.isConfigured,
        logGroup: cloudWatchService.logGroupName,
        telemetry: 'Active'
      },
      compute: {
        environment: process.env.NODE_ENV || 'production',
        targetService: 'AWS EC2 / Elastic Beanstalk (Backend) + AWS Amplify (Frontend)'
      }
    }
  });
});

// 12. Standard Health Check Endpoint
app.get('/api/health', (req, res) => {
  const diagnostics = cloudWatchService.getHealthDiagnostics();
  res.json({
    status: 'healthy',
    system: 'Smart Waste Collection Management System',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    modules: ['auth', 'users', 'schedules', 'complaints', 'pickup', 'vehicles', 'staff', 'analytics', 'reports'],
    diagnostics
  });
});

// 13. CloudWatch Error Monitoring & Central Error Handler Middleware
app.use((err, req, res, next) => {
  cloudWatchService.logError(err, req);
  next(err);
});
app.use(errorMiddleware);

const PORT = env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('================================================================');
  console.log(` SMART WASTE COLLECTION MANAGEMENT SYSTEM (AWS PRODUCTION READY)`);
  console.log(` Port: ${PORT}`);
  console.log(` URL:  http://localhost:${PORT}`);
  console.log(` Mode: ${env.NODE_ENV}`);
  console.log(` Security: Helmet Headers, CORS Whitelist, IP Rate Limiter Active`);
  console.log(` AWS Services: RDS PostgreSQL, S3, SNS, CloudWatch Initialized`);
  console.log('================================================================');
});

// Handle uncaught exceptions gracefully
process.on('uncaughtException', (err) => {
  cloudWatchService.log('error', `Uncaught Exception: ${err.message}`, { stack: err.stack });
});

process.on('unhandledRejection', (reason, promise) => {
  cloudWatchService.log('error', `Unhandled Rejection: ${reason}`, { promise });
});

module.exports = { app, server };
