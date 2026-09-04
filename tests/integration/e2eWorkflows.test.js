/**
 * Master End-to-End Integration Tests
 * Validates the 3 Complete Multi-Stakeholder Workflows:
 * Test Case 1: Full Complaint Lifecycle (Citizen -> Admin -> Staff -> Resolved)
 * Test Case 2: Full Pickup Lifecycle (Citizen -> Admin -> Schedule -> Collection)
 * Test Case 3: Admin Operations (Fleet -> Staff -> Scheduling Conflict Check -> Analytics -> CSV)
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

async function runE2EWorkflows() {
  console.log('\n--- [TEST SUITE: END-TO-END INTEGRATION WORKFLOWS] ---');

  // ============================================================================
  // TEST CASE 1: Full Complaint Lifecycle
  // Citizen Register -> Login -> Submit Complaint -> Track Complaint -> Admin Review -> Assign Staff -> Staff Resolves -> Citizen Verified
  // ============================================================================
  console.log('  ▶ Executing Test Case 1: Complete Complaint Lifecycle...');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const citizenEmail = `citizen.test.${randomSuffix}@smartwaste.gov`;

  // 1. Citizen Register
  const regRes = await request('/auth/register', { method: 'POST' }, {
    name: `Test Citizen ${randomSuffix}`,
    email: citizenEmail,
    password: 'password123',
    phone: '555-0199',
    address: '100 Green Street, Sector 3',
    city: 'EcoCity'
  });
  assert.strictEqual(regRes.status, 201, 'Citizen registration should return 201');
  const citizenToken = unpack(regRes).token;
  assert.ok(citizenToken, 'Registration should issue token');

  // 2. Citizen Files Complaint with Photo
  const complaintRes = await request('/complaints', {
    method: 'POST',
    headers: { Authorization: `Bearer ${citizenToken}` }
  }, {
    category: 'Illegal Dumping',
    title: 'Construction Debris at Alley 9',
    description: 'Drywall and brick rubble left overnight.',
    location: 'Alley 9, Sector 3',
    latitude: 40.715,
    longitude: -74.008,
    priority: 'High',
    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  });
  assert.strictEqual(complaintRes.status, 201, 'Complaint filing should return 201');
  const complaintData = unpack(complaintRes);
  const complaintId = complaintData.complaint ? (complaintData.complaint.id || complaintData.complaint.complaintId) : complaintData.id;

  // 3. Citizen Tracks Complaint (Initial Status: Submitted)
  const trackRes = await request(`/complaints/${complaintId}`, {
    headers: { Authorization: `Bearer ${citizenToken}` }
  });
  assert.strictEqual(trackRes.status, 200, 'Citizen can track complaint');
  const trackData = unpack(trackRes);
  assert.strictEqual((trackData.complaint || trackData).status, 'Submitted');

  // 4. Admin Login
  const adminLogin = await request('/auth/login', { method: 'POST' }, {
    email: 'admin@smartwaste.gov',
    password: 'password123'
  });
  const adminToken = unpack(adminLogin).token;

  // 5. Admin Reviews and Assigns to Staff Member
  const assignRes = await request(`/complaints/${complaintId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` }
  }, {
    assignedStaffId: 'stf_001',
    assignedStaffName: 'Marcus Chen'
  });
  assert.strictEqual(assignRes.status, 200, 'Admin assigning staff returns 200');

  // 6. Staff Login
  const staffLogin = await request('/auth/login', { method: 'POST' }, {
    email: 'staff@smartwaste.gov',
    password: 'password123'
  });
  const staffToken = unpack(staffLogin).token;

  // 7. Staff Completes Work & Updates Status to Resolved
  const resolveRes = await request(`/complaints/${complaintId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${staffToken}` }
  }, {
    status: 'Resolved',
    note: 'Debris hauled away to sorting facility by crew.'
  });
  assert.strictEqual(resolveRes.status, 200, 'Staff status update returns 200');

  // 8. Citizen Sees Resolved Status
  const finalCheck = await request(`/complaints/${complaintId}`, {
    headers: { Authorization: `Bearer ${citizenToken}` }
  });
  const finalData = unpack(finalCheck);
  assert.strictEqual((finalData.complaint || finalData).status, 'Resolved');
  console.log('  ✓ Test Case 1 passed: Full complaint lifecycle completed and verified');

  // ============================================================================
  // TEST CASE 2: Full Pickup Lifecycle
  // Citizen Request -> Admin Approval -> Route Schedule -> Driver Assignment -> Collection Completion
  // ============================================================================
  console.log('  ▶ Executing Test Case 2: Complete Pickup & Scheduling Lifecycle...');

  // 1. Citizen Requests Special Pickup
  const pickupRes = await request('/pickups', {
    method: 'POST',
    headers: { Authorization: `Bearer ${citizenToken}` }
  }, {
    wasteType: 'Electronic Waste',
    estimatedWasteQuantity: '2 Monitors & 1 Printer',
    pickupAddress: '100 Green Street, Apt 4B',
    preferredDate: '2026-09-28',
    preferredTime: 'Morning (09:00 - 12:00)',
    description: 'Disused office electronics for recycling'
  });
  assert.strictEqual(pickupRes.status, 201, 'Pickup request creation returns 201');
  const pickupId = (unpack(pickupRes).pickup || unpack(pickupRes)).id;

  // 2. Admin Approves Request
  const approveRes = await request(`/pickups/${pickupId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` }
  }, {
    status: 'Approved'
  });
  assert.strictEqual(approveRes.status, 200, 'Admin pickup approval returns 200');

  // 3. Admin Assigns Vehicle & Staff to Pickup
  const assignPickupRes = await request(`/pickups/${pickupId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` }
  }, {
    assignedVehicle: 'TRK-101',
    assignedStaff: 'Marcus Chen'
  });
  assert.strictEqual(assignPickupRes.status, 200, 'Pickup crew allocation returns 200');

  // 4. Staff Completes Collection
  const completePickupRes = await request(`/pickups/${pickupId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${staffToken}` }
  }, {
    status: 'Completed'
  });
  assert.strictEqual(completePickupRes.status, 200, 'Pickup completion returns 200');

  // 5. Citizen Checks Completed Status
  const citizenPickupCheck = await request(`/pickups/${pickupId}`, {
    headers: { Authorization: `Bearer ${citizenToken}` }
  });
  const citizenPickupData = unpack(citizenPickupCheck);
  assert.strictEqual((citizenPickupData.pickup || citizenPickupData).status, 'Completed');
  console.log('  ✓ Test Case 2 passed: Pickup workflow verified from request to completion');

  // ============================================================================
  // TEST CASE 3: Admin Operations & Conflict Avoidance
  // Add Vehicle -> Add Staff -> Create Schedule -> Overlap Conflict Check -> Analytics KPI Check -> Export Report
  // ============================================================================
  console.log('  ▶ Executing Test Case 3: Fleet Dispatch, Conflict Prevention & Reporting...');

  // 1. Admin Adds Vehicle
  const plate = `E2E-${Math.floor(1000 + Math.random() * 9000)}`;
  const vRes = await request('/vehicles', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` }
  }, {
    vehicleNumber: plate,
    vehicleType: 'Mini Truck',
    capacity: '3.5 Tons',
    currentArea: 'Civic Zone 1',
    status: 'Available'
  });
  assert.strictEqual(vRes.status, 201, 'Vehicle addition returns 201');
  const vId = (unpack(vRes).vehicle || unpack(vRes)).id;

  // 2. Admin Creates Initial Schedule
  const schedRes = await request('/schedules', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` }
  }, {
    area: 'Civic Zone 1',
    collectionDate: '2026-10-05',
    startTime: '08:00',
    endTime: '11:00',
    wasteType: 'Recyclable Waste',
    assignedVehicle: plate,
    assignedDriver: 'Marcus Chen'
  });
  assert.strictEqual(schedRes.status, 201, 'Schedule creation returns 201');

  // 3. Conflict Prevention Test: Attempt to book the same vehicle at overlapping time on same date
  const conflictRes = await request('/schedules', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` }
  }, {
    area: 'Civic Zone 2',
    collectionDate: '2026-10-05',
    startTime: '09:00', // Overlaps with 08:00-11:00
    endTime: '12:00',
    wasteType: 'Household Waste',
    assignedVehicle: plate,
    assignedDriver: 'Alex Vance'
  });
  assert.strictEqual(conflictRes.status, 409, 'Double-booking conflict should return 409 Conflict');
  console.log('  ✓ Conflict detection successfully prevented vehicle double-booking');

  // 4. Admin Checks Analytics Dashboard KPIs
  const kpiRes = await request('/analytics/dashboard', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(kpiRes.status, 200, 'Analytics dashboard returns 200');
  const kpis = (unpack(kpiRes).metrics || unpack(kpiRes));
  assert.ok(kpis.totalCitizens > 0, 'Total citizens counted');
  assert.ok(kpis.totalComplaints > 0, 'Total complaints counted');

  // 5. Admin Generates CSV Report Export
  const csvRes = await request('/reports/daily?format=csv', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(csvRes.status, 200, 'CSV export returns 200');
  assert.ok(csvRes.headers['content-type'].includes('text/csv'), 'Content-type is CSV');
  console.log('  ✓ Test Case 3 passed: Administration, conflict detection, and reporting verified');

  return true;
}

module.exports = runE2EWorkflows;

if (require.main === module) {
  runE2EWorkflows()
    .then(() => console.log('E2E workflows passed!'))
    .catch(err => {
      console.error('E2E workflows failed:', err);
      process.exit(1);
    });
}
