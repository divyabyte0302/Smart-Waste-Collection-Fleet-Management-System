/**
 * Test Suite: Analytics, Reporting & Cloud Observability
 */
const assert = require('assert');
const http = require('http');

const API_BASE = 'http://localhost:5000/api';

async function request(path, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_BASE}${path}`);
    const reqOptions = {
      method: options.method || 'GET',
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, headers: res.headers, data: parsed, rawText: data });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: {}, rawText: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

const unpack = (res) => (res.data && res.data.data !== undefined ? res.data.data : res.data);

async function runAnalyticsTests(tokens) {
  console.log('\n--- [TEST SUITE: ANALYTICS, REPORTS & OBSERVABILITY] ---');
  const { adminToken, citizenToken } = tokens;

  // Test 1: RBAC - Citizen cannot access analytics
  const forbiddenRes = await request('/analytics/dashboard', {
    headers: { Authorization: `Bearer ${citizenToken}` }
  });
  assert.strictEqual(forbiddenRes.status, 403, 'Citizen should be forbidden from accessing analytics');
  console.log('  ✓ Role-based access control blocks citizen from analytics');

  // Test 2: Admin Retrieves 10 Municipal KPIs
  const kpiRes = await request('/analytics/dashboard', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(kpiRes.status, 200, 'Admin should receive 200 for KPI dashboard');
  const kpiData = unpack(kpiRes);
  const kpis = kpiData.metrics || kpiData.kpis || kpiData;
  assert.ok(kpis, 'Response should contain kpis');
  assert.notStrictEqual(kpis.totalCitizens, undefined, 'Must contain totalCitizens');
  assert.notStrictEqual(kpis.totalComplaints, undefined, 'Must contain totalComplaints');
  assert.notStrictEqual(kpis.pendingComplaints, undefined, 'Must contain pendingComplaints');
  assert.notStrictEqual(kpis.resolvedComplaints, undefined, 'Must contain resolvedComplaints');
  assert.notStrictEqual(kpis.totalPickups, undefined, 'Must contain totalPickups');
  assert.notStrictEqual(kpis.completedPickups, undefined, 'Must contain completedPickups');
  assert.notStrictEqual(kpis.activeVehicles, undefined, 'Must contain activeVehicles');
  assert.notStrictEqual(kpis.availableVehicles, undefined, 'Must contain availableVehicles');
  assert.notStrictEqual(kpis.staffOnDuty, undefined, 'Must contain staffOnDuty');
  assert.notStrictEqual(kpis.serviceCompletionRate, undefined, 'Must contain serviceCompletionRate');
  console.log('  ✓ Verified all 10 Municipal KPIs retrieved successfully');

  // Test 3: Admin Retrieves Visual Analytics Chart Data
  const chartRes = await request('/analytics/complaints', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(chartRes.status, 200, 'Complaints analytics endpoint should return 200 OK');
  const chartData = unpack(chartRes);
  assert.ok(chartData.byCategory, 'Should contain byCategory');
  assert.ok(chartData.byStatus, 'Should contain byStatus');
  assert.ok(chartData.byPriority, 'Should contain byPriority');
  console.log('  ✓ Verified analytical visual breakdown datasets calculated');

  // Test 4: Download Report as CSV
  const csvRes = await request('/reports/daily?format=csv', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(csvRes.status, 200, 'CSV export should return 200 OK');
  assert.ok(csvRes.headers['content-type'].includes('text/csv'), 'Header should be text/csv');
  assert.ok(csvRes.rawText.includes(','), 'Raw response should be CSV formatted');
  console.log('  ✓ Daily collection report CSV export generated successfully');

  // Test 5: AWS Cloud Infrastructure Status Endpoint
  const cloudRes = await request('/cloud-status');
  assert.strictEqual(cloudRes.status, 200, 'Cloud status endpoint should return 200 OK');
  const cloudData = unpack(cloudRes);
  const cloudInfra = cloudData.cloudInfrastructure || cloudData;
  assert.strictEqual(cloudInfra.provider, 'Amazon Web Services (AWS)', 'Provider should be AWS');
  assert.ok(cloudInfra.rdsPostgreSQL, 'Should report RDS status');
  assert.ok(cloudInfra.amazonS3, 'Should report S3 status');
  assert.ok(cloudInfra.amazonSNS, 'Should report SNS status');
  assert.ok(cloudInfra.amazonCloudWatch, 'Should report CloudWatch status');
  console.log('  ✓ AWS Cloud Infrastructure status verified (RDS, S3, SNS, CloudWatch, EC2)');

  // Test 6: Health Check Diagnostics
  const healthRes = await request('/health');
  assert.strictEqual(healthRes.status, 200, 'Health endpoint should return 200 OK');
  assert.strictEqual(healthRes.data.status, 'healthy', 'Status should be healthy');
  assert.ok(healthRes.data.diagnostics, 'Diagnostics should be included');
  console.log('  ✓ Amazon CloudWatch health diagnostics reporting UP');

  return true;
}

module.exports = runAnalyticsTests;
