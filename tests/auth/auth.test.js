/**
 * Test Suite: Authentication & Role-Based Authorization
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

async function runAuthTests() {
  console.log('\n--- [TEST SUITE: AUTH & AUTHORIZATION] ---');

  // Test 1: Successful Admin Login
  const adminRes = await request('/auth/login', { method: 'POST' }, {
    email: 'admin@smartwaste.gov',
    password: 'password123'
  });
  assert.strictEqual(adminRes.status, 200, 'Admin login should return HTTP 200');
  const adminData = unpack(adminRes);
  assert.ok(adminData.user.role.toLowerCase().includes('admin'), 'Admin user should have role Administrator');
  assert.ok(adminData.token, 'Admin login should return JWT token');
  console.log('  ✓ Admin login successful and issued valid JWT');

  const adminToken = adminData.token;

  // Test 2: Successful Citizen Login
  const citizenRes = await request('/auth/login', { method: 'POST' }, {
    email: 'citizen@smartwaste.gov',
    password: 'password123'
  });
  assert.strictEqual(citizenRes.status, 200, 'Citizen login should return HTTP 200');
  const citizenData = unpack(citizenRes);
  assert.ok(citizenData.user.role.toLowerCase().includes('citizen'), 'Citizen user should have role Citizen');
  assert.ok(citizenData.token, 'Citizen login should return JWT token');
  console.log('  ✓ Citizen login successful and verified role');

  const citizenToken = citizenData.token;

  // Test 3: Failed Login with Invalid Password
  const badLogin = await request('/auth/login', { method: 'POST' }, {
    email: 'admin@smartwaste.gov',
    password: 'wrongpassword'
  });
  assert.strictEqual(badLogin.status, 401, 'Invalid password should return HTTP 401');
  console.log('  ✓ Invalid credentials correctly rejected with 401 Unauthorized');

  // Test 4: Token Verification Endpoint (/api/auth/me)
  const meRes = await request('/auth/me', {
    headers: { Authorization: `Bearer ${citizenToken}` }
  });
  assert.strictEqual(meRes.status, 200, '/api/auth/me should return HTTP 200 for authenticated user');
  const meData = unpack(meRes);
  const meUser = meData.user || meData;
  assert.strictEqual(meUser.email, 'citizen@smartwaste.gov', 'Profile should match citizen email');
  console.log('  ✓ Token verification endpoint (/api/auth/me) verified');

  // Test 5: Role-Based Authorization Enforcement
  const forbiddenRes = await request('/users', {
    headers: { Authorization: `Bearer ${citizenToken}` }
  });
  assert.strictEqual(forbiddenRes.status, 403, 'Citizen accessing admin route should return HTTP 403 Forbidden');
  console.log('  ✓ Role-based access control enforces 403 Forbidden for unauthorized roles');

  // Test 6: Admin Access to Protected Users Route
  const adminUsersRes = await request('/users', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  assert.strictEqual(adminUsersRes.status, 200, 'Admin should have access to /api/users');
  const usersData = unpack(adminUsersRes);
  const usersList = usersData.users || usersData;
  assert.ok(Array.isArray(usersList), 'Admin should receive list of users');
  console.log('  ✓ Admin role properly authorized for administrative routes');

  return { adminToken, citizenToken };
}

module.exports = runAuthTests;

if (require.main === module) {
  runAuthTests()
    .then(() => console.log('Auth tests passed!'))
    .catch(err => {
      console.error('Auth tests failed:', err);
      process.exit(1);
    });
}
