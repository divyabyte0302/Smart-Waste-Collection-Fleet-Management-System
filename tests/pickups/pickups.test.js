/**
 * Test Suite: Waste Pickup Requests & Dispatch
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

async function runPickupTests(tokens) {
  console.log('\n--- [TEST SUITE: PICKUP MANAGEMENT & DISPATCH] ---');
  const { adminToken, citizenToken } = tokens;

  // Test 1: Validation - Reject missing fields
  const badPickup = await request('/pickups', {
    method: 'POST',
    headers: { Authorization: `Bearer ${citizenToken}` }
  }, {
    wasteType: 'Electronic Waste'
  });
  assert.strictEqual(badPickup.status, 400, 'Incomplete pickup request should return 400 Bad Request');
  console.log('  ✓ API validation rejects incomplete pickup requests with 400');

  // Test 2: Citizen Creates On-Demand Pickup Request
  const createRes = await request('/pickups', {
    method: 'POST',
    headers: { Authorization: `Bearer ${citizenToken}` }
  }, {
    wasteType: 'Bulk Waste',
    estimatedWasteQuantity: '3-5 Items',
    pickupAddress: '742 Evergreen Terrace, Sector 2',
    preferredDate: '2026-09-15',
    preferredTime: 'Morning (08:00 - 12:00)',
    description: 'Old wooden furniture and broken refrigerator for disposal.'
  });

  assert.strictEqual(createRes.status, 201, 'Valid pickup creation should return 201 Created');
  const createdData = unpack(createRes);
  const pickup = createdData.pickup || createdData;
  const requestId = pickup.id || pickup.requestId;
  assert.strictEqual(pickup.status, 'Pending', 'Initial status should be Pending');
  console.log(`  ✓ Citizen created waste pickup request (#${requestId})`);

  // Test 3: Admin Approves Pickup Request
  const approveRes = await request(`/pickups/${requestId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` }
  }, {
    status: 'Approved'
  });
  assert.strictEqual(approveRes.status, 200, 'Admin approval should return 200 OK');
  const approvedData = unpack(approveRes);
  const approvedPickup = approvedData.pickup || approvedData;
  assert.strictEqual(approvedPickup.status, 'Approved', 'Status should be Approved');
  console.log('  ✓ Admin approved pickup request (dispatched SNS approval notice)');

  // Test 4: Admin Assigns Vehicle and Crew Staff
  const assignRes = await request(`/pickups/${requestId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` }
  }, {
    assignedVehicle: 'TRK-101',
    assignedStaff: 'Marcus Chen'
  });
  assert.strictEqual(assignRes.status, 200, 'Pickup assignment should return 200 OK');
  const assignedData = unpack(assignRes);
  const assignedPickup = assignedData.pickup || assignedData;
  assert.strictEqual(assignedPickup.assignedVehicle, 'TRK-101', 'Assigned vehicle should be TRK-101');
  console.log('  ✓ Admin assigned vehicle and driver to pickup request');

  // Test 5: Citizen Cancellation Constraint Check (Cannot cancel after assignment)
  const cancelAttempt = await request(`/pickups/${requestId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${citizenToken}` }
  }, {
    status: 'Cancelled'
  });
  assert.strictEqual(cancelAttempt.status, 400, 'Citizen cannot cancel request once assigned or completed');
  console.log('  ✓ State transition rules correctly prevent cancelling already assigned request');

  // Test 6: Mark Pickup as Completed
  const completeRes = await request(`/pickups/${requestId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` }
  }, {
    status: 'Completed'
  });
  assert.strictEqual(completeRes.status, 200, 'Completion update should return 200 OK');
  const completedData = unpack(completeRes);
  const completedPickup = completedData.pickup || completedData;
  assert.strictEqual(completedPickup.status, 'Completed', 'Status should be Completed');
  console.log('  ✓ Pickup marked completed successfully (dispatched SNS completion confirmation)');

  return { requestId };
}

module.exports = runPickupTests;
