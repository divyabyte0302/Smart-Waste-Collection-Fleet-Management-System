/**
 * Master Automated Test Runner for Smart Waste Collection Management System
 * Executes all 6 modular test suites against the active REST API.
 */
const runAuthTests = require('./auth/auth.test');
const runComplaintTests = require('./complaints/complaints.test');
const runPickupTests = require('./pickups/pickups.test');
const runScheduleTests = require('./schedules/schedules.test');
const runVehicleTests = require('./vehicles/vehicles.test');
const runAnalyticsTests = require('./analytics/analytics.test');
const runE2EWorkflows = require('./integration/e2eWorkflows.test');

async function main() {
  const startTime = Date.now();
  console.log('================================================================');
  console.log(' SMART WASTE MANAGEMENT SYSTEM - AUTOMATED INTEGRATION TESTS');
  console.log(' Target Endpoint: http://localhost:5000/api');
  console.log(` Timestamp: ${new Date().toISOString()}`);
  console.log('================================================================');

  const suiteResults = [];

  try {
    // 1. Authentication & Role-Based Access Control
    const tokens = await runAuthTests();
    suiteResults.push({ suite: 'Authentication & RBAC', status: 'PASSED' });

    // 2. Complaints Management (Creation, Validation, Lifecycle, S3)
    await runComplaintTests(tokens);
    suiteResults.push({ suite: 'Complaints Management', status: 'PASSED' });

    // 3. Pickups Management (Requests, Approval, Assignment, Completion, SNS)
    await runPickupTests(tokens);
    suiteResults.push({ suite: 'Waste Pickups & Dispatch', status: 'PASSED' });

    // 4. Collection Schedules (Creation, Assignment, Route Tracking)
    await runScheduleTests(tokens);
    suiteResults.push({ suite: 'Route Schedules', status: 'PASSED' });

    // 5. Vehicles & Collection Staff
    await runVehicleTests(tokens);
    suiteResults.push({ suite: 'Fleet & Staff Dispatch', status: 'PASSED' });

    // 6. Analytics, Reports & Cloud Observability
    await runAnalyticsTests(tokens);
    suiteResults.push({ suite: 'Analytics & Cloud Status', status: 'PASSED' });

    // 7. End-to-End Multi-Stakeholder Workflows (Test Cases 1, 2, 3)
    await runE2EWorkflows();
    suiteResults.push({ suite: 'E2E Multi-Stakeholder Workflows', status: 'PASSED' });

    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n================================================================');
    console.log(' TEST SUITE EXECUTION SUMMARY');
    console.log('================================================================');
    suiteResults.forEach((res, i) => {
      console.log(` [${i + 1}/7] ${res.suite.padEnd(34)} -> \x1b[32m${res.status}\x1b[0m`);
    });
    console.log('----------------------------------------------------------------');
    console.log(` Total Suites: 7 Passed | 0 Failed | Duration: ${totalDuration}s`);
    console.log(' ALL INTEGRATION TESTS COMPLETED SUCCESSFULLY! ✓✓✓');
    console.log('================================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('\n❌ TEST RUNNER FAILED:');
    console.error(err);
    process.exit(1);
  }
}

main();
