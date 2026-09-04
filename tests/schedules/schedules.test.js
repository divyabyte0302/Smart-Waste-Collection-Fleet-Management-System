/**
 * Test Suite: Collection Schedules Management
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
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data });
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

async function runScheduleTests(tokens) {
  console.log('\n--- [TEST SUITE: SCHEDULES & ROUTE MANAGEMENT] ---');
  const { adminToken } = tokens;

  // Test 1: Validation - Schedule missing area, vehicle or driver
  const badSchedule = await request('/schedules', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` }
  }, {
    collectionDate: '2026-09-20'
  });
  assert.strictEqual(badSchedule.status, 400, 'Incomplete schedule should return 400 Bad Request');
  console.log('  ✓ API validation rejects incomplete route schedules with 400');

  // Test 2: Admin Creates Collection Schedule
  const dynamicSuffix = Math.floor(1000 + Math.random() * 9000);
  const testDate = `2026-11-${String(Math.floor(10 + Math.random() * 18))}`;
  const testVehicle = `TRK-${dynamicSuffix}`;

  const createRes = await request('/schedules', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` }
  }, {
    area: `Downtown Sector ${dynamicSuffix}`,
    collectionDate: testDate,
    startTime: '06:00',
    endTime: '10:00',
    wasteType: 'Household Waste',
    assignedVehicle: testVehicle,
    assignedDriver: `Driver ${dynamicSuffix}`,
    routeDescription: 'Commercial center dumpsters and recyclable containers'
  });

  assert.strictEqual(createRes.status, 201, 'Valid schedule should return 201 Created');
  const createdData = unpack(createRes);
  const schedule = createdData.schedule || createdData;
  const scheduleId = schedule.id || schedule.scheduleId;
  assert.strictEqual(schedule.status, 'Scheduled', 'Initial status should be Scheduled');
  console.log(`  ✓ Admin created collection route schedule (#${scheduleId})`);

  // Test 3: List Schedules
  const listRes = await request('/schedules', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(listRes.status, 200, 'Listing schedules should return 200 OK');
  const listData = unpack(listRes);
  const schedulesList = listData.schedules || listData;
  assert.ok(Array.isArray(schedulesList), 'Should return schedules array');
  console.log(`  ✓ Successfully listed ${schedulesList.length} schedule(s)`);

  // Test 4: Update Schedule Status
  const statusRes = await request(`/schedules/${scheduleId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` }
  }, {
    status: 'Active'
  });
  assert.strictEqual(statusRes.status, 200, 'Schedule status update should return 200 OK');
  const statusData = unpack(statusRes);
  const updatedSchedule = statusData.schedule || statusData;
  assert.strictEqual(updatedSchedule.status, 'Active', 'Status should be Active');
  console.log('  ✓ Schedule status updated to Active');

  return { scheduleId };
}

module.exports = runScheduleTests;
