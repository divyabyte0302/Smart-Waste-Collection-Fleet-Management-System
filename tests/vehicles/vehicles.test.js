/**
 * Test Suite: Fleet & Collection Staff Management
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

async function runVehicleTests(tokens) {
  console.log('\n--- [TEST SUITE: VEHICLES & STAFF DISPATCH] ---');
  const { adminToken } = tokens;

  // Test 1: Add New Vehicle to Fleet
  const uniquePlate = `WST-${Math.floor(1000 + Math.random() * 9000)}`;
  const createVehicleRes = await request('/vehicles', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` }
  }, {
    vehicleNumber: uniquePlate,
    vehicleType: 'Garbage Truck',
    capacity: '8.5 Tons',
    currentArea: 'North Industrial Sector',
    status: 'Available'
  });

  assert.strictEqual(createVehicleRes.status, 201, 'Adding vehicle should return 201 Created');
  const vehicleData = unpack(createVehicleRes);
  const vehicle = vehicleData.vehicle || vehicleData;
  const vehicleId = vehicle.id || vehicle.vehicleId;
  console.log(`  ✓ Added municipal vehicle (#${vehicleId}, Plate: ${uniquePlate})`);

  // Test 2: List Vehicles
  const listVehiclesRes = await request('/vehicles', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(listVehiclesRes.status, 200, 'Listing vehicles should return 200 OK');
  const listVehiclesData = unpack(listVehiclesRes);
  const vehiclesList = listVehiclesData.vehicles || listVehiclesData;
  assert.ok(Array.isArray(vehiclesList), 'Should return vehicles array');
  console.log(`  ✓ Fleet inventory verified (${vehiclesList.length} vehicles active)`);

  // Test 3: Assign Driver to Vehicle
  const updateVehicleRes = await request(`/vehicles/${vehicleId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` }
  }, {
    driverId: 'staff-user-01',
    status: 'Assigned'
  });
  assert.strictEqual(updateVehicleRes.status, 200, 'Updating vehicle should return 200 OK');
  const updatedVData = unpack(updateVehicleRes);
  const updatedV = updatedVData.vehicle || updatedVData;
  assert.strictEqual(updatedV.status, 'Assigned', 'Status should be Assigned');
  console.log('  ✓ Assigned designated driver to vehicle');

  // Test 4: List Staff Members
  const staffListRes = await request('/staff', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(staffListRes.status, 200, 'Listing staff should return 200 OK');
  const staffListData = unpack(staffListRes);
  const staffList = staffListData.staff || staffListData;
  assert.ok(Array.isArray(staffList), 'Should return staff array');
  console.log(`  ✓ Retrieved ${staffList.length} collection staff profile(s)`);

  // Test 5: Assign Staff to Area and Vehicle
  if (staffList.length > 0) {
    const targetStaff = staffList[0];
    const staffId = targetStaff.id || targetStaff.staffId;
    const staffAssignRes = await request(`/staff/${staffId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` }
    }, {
      assignedVehicle: uniquePlate,
      assignedArea: 'North Industrial Sector',
      status: 'On Duty'
    });
    assert.strictEqual(staffAssignRes.status, 200, 'Updating staff assignment should return 200 OK');
    console.log(`  ✓ Staff assigned to vehicle ${uniquePlate} and set On Duty`);
  }

  return { vehicleId };
}

module.exports = runVehicleTests;
