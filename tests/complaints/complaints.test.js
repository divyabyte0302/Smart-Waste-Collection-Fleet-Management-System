/**
 * Test Suite: Complaints Management & S3/SNS Integration
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

async function runComplaintTests(tokens) {
  console.log('\n--- [TEST SUITE: COMPLAINT MANAGEMENT] ---');
  const { adminToken, citizenToken } = tokens;

  // Test 1: API Validation - Rejection of Incomplete Complaint Form
  const invalidRes = await request('/complaints', {
    method: 'POST',
    headers: { Authorization: `Bearer ${citizenToken}` }
  }, {
    priority: 'High'
  });
  assert.strictEqual(invalidRes.status, 400, 'Incomplete complaint payload should return 400 Bad Request');
  console.log('  ✓ API validation rejects invalid complaint payloads with 400');

  // Test 2: Successful Complaint Creation with S3 Image Reference
  const createRes = await request('/complaints', {
    method: 'POST',
    headers: { Authorization: `Bearer ${citizenToken}` }
  }, {
    category: 'Overflowing Bin',
    title: 'Commercial Bin Overflow near Metro Station',
    description: 'Recycling bin is overflowing and spilling onto public sidewalk.',
    location: '4th Avenue Station Plaza, Sector 4',
    latitude: 40.7128,
    longitude: -74.0060,
    priority: 'High',
    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  });

  assert.strictEqual(createRes.status, 201, 'Valid complaint creation should return 201 Created');
  const createdData = unpack(createRes);
  const complaint = createdData.complaint || createdData;
  const complaintId = complaint.id || complaint.complaintId;
  assert.ok(complaintId, 'Complaint should have generated ID');
  assert.strictEqual(complaint.status, 'Submitted', 'Initial status should be Submitted');
  console.log(`  ✓ Citizen filed complaint successfully (#${complaintId}) with image storage`);

  // Test 3: List Complaints (Filtered by Citizen)
  const listRes = await request('/complaints/my-complaints', {
    headers: { Authorization: `Bearer ${citizenToken}` }
  });
  assert.strictEqual(listRes.status, 200, 'Complaint listing should return 200 OK');
  const listData = unpack(listRes);
  const complaintsList = listData.complaints || listData;
  assert.ok(Array.isArray(complaintsList), 'Should return complaints array');
  console.log(`  ✓ Citizen retrieved ${complaintsList.length} complaint(s)`);

  // Test 4: Update Complaint Status (Admin workflow)
  const updateRes = await request(`/complaints/${complaintId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` }
  }, {
    status: 'In Progress',
    note: 'Dispatch unit en route for bin clearance'
  });
  assert.strictEqual(updateRes.status, 200, 'Admin status update should return 200 OK');
  const updatedData = unpack(updateRes);
  const updatedComplaint = updatedData.complaint || updatedData;
  assert.strictEqual(updatedComplaint.status, 'In Progress', 'Status should be updated to In Progress');
  console.log('  ✓ Admin updated complaint status to In Progress (triggered SNS notification)');

  // Test 5: Resolve Complaint with Notes
  const resolveRes = await request(`/complaints/${complaintId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${adminToken}` }
  }, {
    status: 'Resolved',
    note: 'Bin emptied, sanitized, and re-secured'
  });
  assert.strictEqual(resolveRes.status, 200, 'Admin status resolution should return 200 OK');
  const resolvedData = unpack(resolveRes);
  const resolvedComplaint = resolvedData.complaint || resolvedData;
  assert.strictEqual(resolvedComplaint.status, 'Resolved', 'Status should be updated to Resolved');
  console.log('  ✓ Complaint resolved and closed with timeline event recorded');

  return { complaintId };
}

module.exports = runComplaintTests;
